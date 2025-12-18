# Physical AI Textbook Backend - Main Application
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings

# Import routers
from routers.auth import router as auth_router
from routers.chat import router as chat_router

# Initialize FastAPI app
app = FastAPI(
    title="Physical AI Textbook API",
    description="Backend API for the Physical AI & Humanoid Robotics textbook platform",
    version="1.0.0",
)

# Get settings
settings = get_settings()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring and deployment verification."""
    return {
        "status": "healthy",
        "service": "physical-ai-textbook-api",
        "version": "1.0.0",
    }


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Physical AI Textbook API",
        "docs": "/docs",
        "health": "/health",
    }


# Register routers
app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])
