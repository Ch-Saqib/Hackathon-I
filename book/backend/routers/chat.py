# Physical AI Textbook Backend - Chat Router (RAG Chatbot)
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents import Agent, Runner, OpenAIChatCompletionsModel
from openai import AsyncOpenAI
from openai.types.responses import ResponseTextDeltaEvent

from app.config import get_settings
from utils.qdrant_client import get_qdrant
from utils.prompt_builder import build_system_prompt

# Router setup
router = APIRouter()
settings = get_settings()

# Google Gemini OpenAI-compatible endpoint
GEMINI_OPENAI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
GEMINI_MODEL = "gemini-2.5-flash"  # Using Gemini 2.0 Flash model


# Pydantic Models
class ChatRequest(BaseModel):
    """Chat request with message and optional context."""

    message: str
    page_context: Optional[str] = None  # Current page URL or module
    user_profile: Optional[dict] = None  # Optional user profile for personalization


class ChatSource(BaseModel):
    """Source reference for a chat response."""

    title: str
    module: str
    source: str
    relevance: float


class ChatResponse(BaseModel):
    """Chat response with answer and sources."""

    answer: str
    sources: list[ChatSource]
    model: str = "gemini-2.5-flash"


class ChatHistoryItem(BaseModel):
    """Single chat history item."""

    id: str
    role: str
    content: str
    created_at: datetime


class ChatHistoryResponse(BaseModel):
    """Chat history response."""

    messages: list[ChatHistoryItem]
    total: int
    offset: int
    limit: int


# In-memory chat history (replace with database in production)
chat_sessions: dict[str, list[dict]] = {}


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a message to the Professor chatbot.

    The chatbot retrieves relevant textbook content and generates
    an answer using RAG (Retrieval-Augmented Generation).

    - **message**: The user's question
    - **page_context**: Optional current page context for relevance filtering
    - **user_profile**: Optional user profile for personalized responses
      (passed from frontend with softwareSkills and hardwareInventory)
    """
    try:
        # Get Qdrant client
        qdrant = get_qdrant()

        # Determine module filter from page context
        module_filter = None
        if request.page_context:
            # Extract module from URL like "/docs/module-01-ros2/..."
            if "module-01" in request.page_context:
                module_filter = "module-01-ros2"
            elif "module-02" in request.page_context:
                module_filter = "module-02-digital-twin"

        # Search for relevant chunks
        retrieved_chunks = qdrant.search_similar(
            query=request.message,
            limit=5,
            module_filter=module_filter,
        )

        # Use user profile from request for personalization
        # Frontend should pass user context from Better Auth session
        user_profile = request.user_profile

        # Build system prompt with context and personalization
        system_prompt = build_system_prompt(
            retrieved_chunks=retrieved_chunks,
            user_profile=user_profile,
        )

        # Configure OpenAI client for Gemini and set as default
        openai_client = AsyncOpenAI(
            api_key=settings.gemini_api_key,
            base_url=GEMINI_OPENAI_BASE_URL,
        )

        model = OpenAIChatCompletionsModel(
            model=GEMINI_MODEL, openai_client=openai_client
        )
        # Create agent with system instructions using OpenAI Agents SDK
        agent = Agent(
            name="Professor",
            instructions=system_prompt,
            model=model,  # Pass model name as string
        )

        # Run the agent with the user's message using async streaming
        answer = ""
        result = Runner.run_streamed(agent, input=request.message)
        async for event in result.stream_events():
            if event.type == "raw_response_event" and isinstance(
                event.data, ResponseTextDeltaEvent
            ):
                answer += event.data.delta

        # Format sources
        sources = [
            ChatSource(
                title=chunk.get("title", "Unknown"),
                module=chunk.get("module", ""),
                source=chunk.get("source", ""),
                relevance=chunk.get("score", 0.0),
            )
            for chunk in retrieved_chunks
        ]

        return ChatResponse(
            answer=answer,
            sources=sources,
        )

    except Exception as e:
        import traceback

        traceback.print_exc()  # Print full traceback to console
        raise HTTPException(
            status_code=500,
            detail=f"Chat processing failed: {str(e)}",
        )


@router.get("/chat/collection-info")
async def get_collection_info():
    """Get information about the vector database collection."""
    qdrant = get_qdrant()
    return qdrant.get_collection_info()
