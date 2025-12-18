# Quickstart: AI-Native Textbook Platform

**Feature**: `002-ai-native-textbook-platform`
**Date**: 2025-12-17

## Prerequisites

- Node.js 18+ (for Docusaurus frontend)
- Python 3.10+ (for FastAPI backend)
- Git
- Accounts required:
  - [Qdrant Cloud](https://cloud.qdrant.io/) (free tier)
  - [Neon](https://neon.tech/) (free tier Postgres)
  - [OpenAI API](https://platform.openai.com/) (API key required)
  - [Render](https://render.com/) (free tier for backend deployment)

## Local Development Setup

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd Hackathon-I
git checkout 002-ai-native-textbook-platform
```

### 2. Configure Environment Variables

```bash
# Copy example env file
cp book/.env.example book/.env

# Edit with your credentials
nano book/.env
```

Required variables:
```env
# OpenAI
OPENAI_API_KEY=sk-...

# Qdrant Cloud
QDRANT_URL=https://xxx.us-east4-0.gcp.cloud.qdrant.io:6333
QDRANT_API_KEY=...

# Neon Postgres
NEON_DATABASE_URL=postgres://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname

# Better-Auth
BETTER_AUTH_SECRET=<generate-random-32-char-string>

# Frontend (for local dev)
REACT_APP_API_URL=http://localhost:8000
```

### 3. Setup Backend

```bash
cd book/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations (if using alembic)
# alembic upgrade head

# Start the server
uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

### 4. Setup Frontend

```bash
cd book

# Install dependencies
pnpm install  # or npm install

# Start Docusaurus dev server
pnpm start  # or npm start
```

Frontend will be available at: `http://localhost:3000`

### 5. Ingest Textbook Content

Before the chatbot can answer questions, you need to index the content:

```bash
cd book/backend

# Activate virtual environment if not already
source venv/bin/activate

# Run ingestion script
python ingest.py
```

This will:
1. Parse all `.mdx` files in `book/docs/`
2. Chunk the content (1000 tokens, 200 overlap)
3. Generate embeddings via OpenAI
4. Upload to Qdrant Cloud

**Expected output**:
```
Found 24 MDX files
Processing module-01-ros2/nodes.mdx... 8 chunks
Processing module-01-ros2/topics.mdx... 12 chunks
...
Total: 156 chunks indexed
```

## Verify Setup

### Backend Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy", "timestamp": "..."}
```

### Test Chat API

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is a ROS 2 Node?"}'

# Expected: {"answer": "A ROS 2 Node is...", "sources": [...], "personalized": false}
```

### Test Auth Flow

```bash
# Signup
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "software_skills": ["Python"],
    "hardware_inventory": ["Jetson"]
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}'
```

## Project Structure

```
book/
├── docs/                      # Textbook content (MDX)
│   ├── module-01-ros2/
│   └── module-02-digital-twin/
├── src/
│   ├── pages/
│   │   ├── signup.js         # Registration with background profiling
│   │   └── login.js          # Login page
│   ├── theme/
│   │   └── ChatWidget.js     # Floating chat component
│   └── config.js             # API_BASE_URL configuration
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── routers/
│   │   ├── auth.py           # Authentication endpoints
│   │   └── chat.py           # Chat/RAG endpoints
│   ├── utils/
│   │   └── prompt_builder.py # Personalized prompt construction
│   ├── ingest.py             # Content ingestion script
│   └── requirements.txt      # Python dependencies
├── .env.example              # Environment template
├── docusaurus.config.js      # Docusaurus configuration
└── package.json              # Node dependencies
```

## Deployment

### Frontend (GitHub Pages)

The frontend auto-deploys via GitHub Actions on push to `main`:

```yaml
# .github/workflows/deploy.yml
# Builds Docusaurus and deploys to gh-pages branch
```

Production URL: `https://<username>.github.io/<repo>/`

### Backend (Render)

1. Connect your GitHub repo to Render
2. Create a new Web Service pointing to `book/backend`
3. Set environment variables in Render dashboard
4. Deploy automatically on push to `main`

Production URL: `https://physical-ai-api.onrender.com`

## Common Issues

### Chat returns "I can only answer questions about this textbook"

- Run `python ingest.py` to index content
- Verify Qdrant credentials in `.env`
- Check Qdrant dashboard for indexed vectors

### CORS errors in browser

- Verify `API_BASE_URL` matches your backend
- Check backend CORS origins include your frontend URL
- For local dev, ensure both servers are running

### Authentication not persisting

- Check `BETTER_AUTH_SECRET` is set
- Verify cookies are being set (check browser dev tools)
- Ensure frontend and backend are on same domain or CORS is configured

## Next Steps

After completing setup:

1. **Write content**: Add chapters to `book/docs/module-01-ros2/` and `book/docs/module-02-digital-twin/`
2. **Re-ingest**: Run `python ingest.py` after adding content
3. **Test chat**: Verify chatbot can answer questions about new content
4. **Deploy**: Push to main to trigger deployment
