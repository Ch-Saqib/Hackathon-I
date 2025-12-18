# Physical AI Textbook Backend - Authentication Router
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
import bcrypt
import asyncpg

from app.config import get_settings

# Router setup
router = APIRouter()
security = HTTPBearer()
settings = get_settings()

# JWT Configuration
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24


# Pydantic Models
class SignupRequest(BaseModel):
    """User registration request with background profiling."""
    email: EmailStr
    password: str
    software_skills: list[str] = []  # e.g., ["Python", "C++", "JavaScript"]
    hardware_inventory: list[str] = []  # e.g., ["Jetson", "Arduino", "Raspberry Pi"]


class LoginRequest(BaseModel):
    """User login request."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"


class UserProfile(BaseModel):
    """User profile response."""
    id: str
    email: str
    software_skills: list[str]
    hardware_inventory: list[str]
    created_at: datetime


class ProfileUpdateRequest(BaseModel):
    """Profile update request."""
    software_skills: Optional[list[str]] = None
    hardware_inventory: Optional[list[str]] = None


# Database connection helper
async def get_db_connection():
    """Get a database connection from the pool."""
    return await asyncpg.connect(settings.neon_database_url)


# Password hashing
def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(password.encode(), hashed.encode())


# JWT helpers
def create_access_token(user_id: str) -> str:
    """Create a JWT access token."""
    now = datetime.utcnow()
    expire = now + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {
        "sub": user_id,
        "exp": int(expire.timestamp()),
        "iat": int(now.timestamp()),
    }
    return jwt.encode(payload, settings.better_auth_secret, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(token, settings.better_auth_secret, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get the current authenticated user."""
    payload = decode_token(credentials.credentials)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    conn = await get_db_connection()
    try:
        user = await conn.fetchrow(
            """
            SELECT id, email, software_skills, hardware_inventory, created_at
            FROM users WHERE id = $1
            """,
            user_id,
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        return dict(user)
    finally:
        await conn.close()


# Endpoints

@router.post("/auth/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest):
    """
    Register a new user with email/password and background profiling.

    - **email**: User's email address (unique)
    - **password**: User's password (min 8 characters recommended)
    - **software_skills**: List of software technologies the user knows
    - **hardware_inventory**: List of hardware platforms the user has access to
    """
    conn = await get_db_connection()
    try:
        # Check if user already exists
        existing = await conn.fetchrow(
            "SELECT id FROM users WHERE email = $1", request.email
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        # Hash password
        password_hash = hash_password(request.password)

        # Insert new user
        user_id = await conn.fetchval(
            """
            INSERT INTO users (email, password_hash, software_skills, hardware_inventory)
            VALUES ($1, $2, $3, $4)
            RETURNING id
            """,
            request.email,
            password_hash,
            request.software_skills,
            request.hardware_inventory,
        )

        # Create access token
        access_token = create_access_token(str(user_id))

        return TokenResponse(access_token=access_token)

    finally:
        await conn.close()


@router.post("/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """
    Authenticate a user and return a JWT token.

    - **email**: User's email address
    - **password**: User's password
    """
    conn = await get_db_connection()
    try:
        user = await conn.fetchrow(
            "SELECT id, password_hash FROM users WHERE email = $1",
            request.email,
        )

        if not user or not verify_password(request.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        access_token = create_access_token(str(user["id"]))

        return TokenResponse(access_token=access_token)

    finally:
        await conn.close()


@router.post("/auth/logout", status_code=status.HTTP_200_OK)
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Logout the current user (invalidate token on client side).

    Note: JWT tokens are stateless. The client should discard the token.
    For enhanced security, implement a token blacklist in production.
    """
    # Validate the token is still valid
    decode_token(credentials.credentials)

    return {"message": "Logged out successfully"}


@router.get("/user/profile", response_model=UserProfile)
async def get_profile(current_user: dict = Depends(get_current_user)):
    """
    Get the current user's profile including background information.
    """
    return UserProfile(
        id=str(current_user["id"]),
        email=current_user["email"],
        software_skills=current_user["software_skills"] or [],
        hardware_inventory=current_user["hardware_inventory"] or [],
        created_at=current_user["created_at"],
    )


@router.patch("/user/profile", response_model=UserProfile)
async def update_profile(
    request: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Update the current user's software skills and hardware inventory.

    - **software_skills**: Updated list of software technologies
    - **hardware_inventory**: Updated list of hardware platforms
    """
    conn = await get_db_connection()
    try:
        # Build update query dynamically based on provided fields
        updates = []
        params = []
        param_count = 1

        if request.software_skills is not None:
            updates.append(f"software_skills = ${param_count}")
            params.append(request.software_skills)
            param_count += 1

        if request.hardware_inventory is not None:
            updates.append(f"hardware_inventory = ${param_count}")
            params.append(request.hardware_inventory)
            param_count += 1

        if not updates:
            # No updates requested, return current profile
            return UserProfile(
                id=str(current_user["id"]),
                email=current_user["email"],
                software_skills=current_user["software_skills"] or [],
                hardware_inventory=current_user["hardware_inventory"] or [],
                created_at=current_user["created_at"],
            )

        # Add user ID as final parameter
        params.append(current_user["id"])

        query = f"""
            UPDATE users
            SET {', '.join(updates)}
            WHERE id = ${param_count}
            RETURNING id, email, software_skills, hardware_inventory, created_at
        """

        updated_user = await conn.fetchrow(query, *params)

        return UserProfile(
            id=str(updated_user["id"]),
            email=updated_user["email"],
            software_skills=updated_user["software_skills"] or [],
            hardware_inventory=updated_user["hardware_inventory"] or [],
            created_at=updated_user["created_at"],
        )

    finally:
        await conn.close()
