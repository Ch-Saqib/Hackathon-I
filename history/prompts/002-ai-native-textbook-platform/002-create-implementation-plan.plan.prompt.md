---
id: 002
title: Create Implementation Plan for AI-Native Platform
stage: plan
date: 2025-12-17
surface: agent
model: claude-opus-4-5-20251101
feature: 002-ai-native-textbook-platform
branch: 002-ai-native-textbook-platform
user: system
command: /sp.plan
labels: ["plan", "full-stack", "fastapi", "docusaurus", "rag", "better-auth", "qdrant"]
links:
  spec: specs/002-ai-native-textbook-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-ai-native-textbook-platform/plan.md
  - specs/002-ai-native-textbook-platform/research.md
  - specs/002-ai-native-textbook-platform/data-model.md
  - specs/002-ai-native-textbook-platform/quickstart.md
  - specs/002-ai-native-textbook-platform/contracts/api.yaml
  - CLAUDE.md
tests:
  - null
---

## Prompt

**Objective:** Create a cohesive "Full-Stack" implementation plan to transform the `book/` project into an AI-Native Platform.

**Context:**
* **Root:** `book/` (Docusaurus Frontend).
* **New Subdirectory:** `book/backend/` (FastAPI Backend).
* **Goal:** Implement Syllabus Modules 1 & 2 AND the "Bonus Points" features (Chatbot, Personalization, Auth).

**Required Plan Phases:**

**Phase 1: Infrastructure & Dependencies (The Foundation)**
* Step 1: Create `book/backend/` directory structure (`app/`, `routers/`, `utils/`).
* Step 2: Create `book/backend/requirements.txt` (Must include: `fastapi`, `uvicorn`, `better-auth`, `openai-agents-sdk`, `qdrant-client`, `python-dotenv`).
* Step 3: Install Frontend dependencies in `book/` (Must include: `better-auth`, `axios`, `@docusaurus/theme-mermaid`).
* Step 4: Create a global `.env.example` in `book/` defining all required API keys (OpenAI, Neon, Qdrant, Better-Auth Secret).

**Phase 2: The "Intelligent" Backend (FastAPI)**
* Step 5: Implement `book/backend/main.py` to serve the API and handle CORS (Allow `localhost:3000` and the generic GitHub Pages URL).
* Step 6: Implement **Authentication** logic using Better-Auth in `book/backend/routers/auth.py`. Define the User Schema to include `software_skills` and `hardware_inventory`.
* Step 7: Implement the **RAG Agent** in `book/backend/routers/chat.py`.
    * Use **OpenAI Agents SDK**.
    * Create a function to query Qdrant based on user input.
    * Create a "System Prompt" builder that injects the user's `hardware_inventory` for personalized answers.

**Phase 3: The "Interactive" Frontend (Docusaurus)**
* Step 8: Create the **Auth Pages**:
    * `book/src/pages/signup.js` (Form with "Hardware Background" dropdowns).
    * `book/src/pages/login.js`.
* Step 9: Create the **Chat Widget**:
    * `book/src/theme/ChatWidget.js`: A floating React component that maintains chat state and calls the Backend API.
* Step 10: Register the Chat Widget in `book/src/theme/Layout.js` (or use Docusaurus "Swizzling" to wrap the Root) so it appears on every page.

**Phase 4: Content & Knowledge Ingestion**
* Step 11: Write **Module 1 (ROS 2)** and **Module 2 (Digital Twin)** content in `book/docs/` if not already present (Strictly following the Syllabus).
* Step 12: Create the **Ingestion Script** (`book/backend/ingest.py`).
    * Logic: Recursively read all `.mdx` files in `book/docs/`.
    * Action: Chunk text and upload embeddings to Qdrant.
    * Purpose: This script will be run manually to "teach" the chatbot the book's content.

**Phase 5: Deployment Configuration**
* Step 13: Configure Frontend Deployment: Create `.github/workflows/deploy.yml` for GitHub Pages.
* Step 14: Configure Backend Deployment: Create `book/vercel.json` (or `render.yaml`) to define how the Python backend should be built and served in the cloud.

## Response snapshot

Created comprehensive implementation plan with 5 phases and 6 design artifacts:

**Artifacts Generated:**
1. `plan.md` - Full implementation plan with 5 phases, 21 steps
2. `research.md` - Technical decisions resolving 3 critical unknowns:
   - Backend hosting: Render (free tier)
   - RAG ingestion: Local `ingest.py` with unified chunking
   - Personalization: System prompt injection
3. `data-model.md` - 4 entities (User, UserSession, ChatMessage, ContentChunk) with ER diagram
4. `contracts/api.yaml` - OpenAPI 3.1 specification with 8 endpoints
5. `quickstart.md` - Developer setup guide with prerequisites and verification steps
6. Updated `CLAUDE.md` - Added new technologies to agent context

**Key Architectural Decisions:**
- Hybrid deployment: GitHub Pages (static) + Render (dynamic Python)
- CORS strategy: Allow GitHub Pages origin + localhost
- RAG chunking: Unified (code + context), 1000 tokens, 200 overlap
- Personalization: Injected into OpenAI agent system prompt

**Constitution Check:** All 8 principles PASS, full technical stack compliance verified.

## Outcome

- ✅ Impact: Complete implementation roadmap for AI-Native textbook platform
- 🧪 Tests: N/A (planning phase)
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, contracts/api.yaml
- 🔁 Next prompts: /sp.tasks to generate implementation task list
- 🧠 Reflection: Plan addresses all 3 critical hybrid architecture concerns raised in clarify

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution Check - 8/8 PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
