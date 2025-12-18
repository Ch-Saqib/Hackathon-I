# Physical AI Textbook Backend - Chat Router (RAG Chatbot)
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from agents import Agent, Runner, ModelSettings, AsyncOpenAI

from app.config import get_settings
from utils.qdrant_client import get_qdrant
from utils.prompt_builder import build_system_prompt

# Router setup
router = APIRouter()
security = HTTPBearer(auto_error=False)
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


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[dict]:
    """Get current user if authenticated, None otherwise."""
    if not credentials:
        return None

    try:
        from routers.auth import decode_token, get_db_connection

        payload = decode_token(credentials.credentials)
        user_id = payload.get("sub")

        if not user_id:
            return None

        # Get user profile
        conn = await get_db_connection()
        try:
            user = await conn.fetchrow(
                """
                SELECT id, email, software_skills, hardware_inventory
                FROM users WHERE id = $1
                """,
                user_id,
            )
            return dict(user) if user else None
        finally:
            await conn.close()

    except Exception:
        return None


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: Optional[dict] = Depends(get_optional_user),
):
    """
    Send a message to the Professor chatbot.

    The chatbot retrieves relevant textbook content and generates
    an answer using RAG (Retrieval-Augmented Generation).

    - **message**: The user's question
    - **page_context**: Optional current page context for relevance filtering
    - **user_profile**: Optional user profile for personalized responses
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

        # Determine user profile for personalization
        user_profile = request.user_profile
        if current_user and not user_profile:
            user_profile = {
                "software_skills": current_user.get("software_skills", []),
                "hardware_inventory": current_user.get("hardware_inventory", []),
            }

        # Build system prompt with context and personalization
        system_prompt = build_system_prompt(
            retrieved_chunks=retrieved_chunks,
            user_profile=user_profile,
        )

        # Create OpenAI client configured for Gemini
        openai_client = AsyncOpenAI(
            api_key=settings.gemini_api_key,
            base_url=GEMINI_OPENAI_BASE_URL,
        )

        # Create agent with system instructions using OpenAI Agents SDK
        # Configure model settings to use Gemini via OpenAI-compatible endpoint
        agent = Agent(
            name="Professor",
            instructions=system_prompt,
            model=ModelSettings(
                client=openai_client,
                model=GEMINI_MODEL,
            ),
        )

        # Run the agent with the user's message
        result = Runner.run_sync(
            agent,
            request.message,
        )

        answer = result.final_output

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
        raise HTTPException(
            status_code=500,
            detail=f"Chat processing failed: {str(e)}",
        )


@router.get("/chat/history", response_model=ChatHistoryResponse)
async def get_chat_history(
    limit: int = 20,
    offset: int = 0,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Get chat history for the authenticated user.

    - **limit**: Maximum number of messages to return (default: 20)
    - **offset**: Number of messages to skip (default: 0)
    """
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Authentication required for chat history",
        )

    try:
        from routers.auth import decode_token

        payload = decode_token(credentials.credentials)
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

        # Get user's chat history (in-memory for now)
        user_history = chat_sessions.get(user_id, [])

        # Apply pagination
        total = len(user_history)
        paginated = user_history[offset : offset + limit]

        # Format response
        messages = [
            ChatHistoryItem(
                id=f"{user_id}-{i}",
                role=msg.get("role", "user"),
                content=msg.get("content", ""),
                created_at=msg.get("created_at", datetime.utcnow()),
            )
            for i, msg in enumerate(paginated, start=offset)
        ]

        return ChatHistoryResponse(
            messages=messages,
            total=total,
            offset=offset,
            limit=limit,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve chat history: {str(e)}",
        )


@router.get("/chat/collection-info")
async def get_collection_info():
    """Get information about the vector database collection."""
    qdrant = get_qdrant()
    return qdrant.get_collection_info()
