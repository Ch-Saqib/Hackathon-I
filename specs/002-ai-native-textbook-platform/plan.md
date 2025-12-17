# Implementation Plan: AI-Native Textbook Platform

**Branch**: `002-ai-native-textbook-platform` | **Date**: 2025-12-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-ai-native-textbook-platform/spec.md`

## Summary

Transform the Physical AI textbook into an AI-Native learning platform with:
1. **Educational Content**: Module 1 (ROS 2) and Module 2 (Digital Twin) following "Concept First, Code Second"
2. **RAG Chatbot**: "Professor" agent that answers questions from textbook content only
3. **User Authentication**: Better-Auth with software/hardware background profiling
4. **Personalization**: Tailored responses based on user's experience level and equipment

**Architecture**: Hybrid static (GitHub Pages) + dynamic (Render) deployment with CORS-enabled API communication.

## Technical Context

**Language/Version**: Python 3.10+ (backend), JavaScript/React (frontend)
**Primary Dependencies**: FastAPI, Docusaurus, Better-Auth, OpenAI Agents SDK, Qdrant Client
**Storage**: Neon (Postgres) for users/sessions, Qdrant Cloud for vector embeddings
**Testing**: pytest (backend), Jest (frontend)
**Target Platform**: Web (desktop + mobile responsive)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: <5s chatbot response (95th percentile), <2s page load
**Constraints**: Render free tier limits, GitHub Pages static-only
**Scale/Scope**: 100 concurrent users, ~150 content chunks indexed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Verification |
|-----------|--------|--------------|
| I. Embodied Intelligence First | ✅ PASS | Content modules bridge AI concepts to physical robotics |
| II. Curriculum Module Integrity | ✅ PASS | Module 1 (ROS 2) + Module 2 (Digital Twin) per syllabus |
| III. Concept First, Code Second | ✅ PASS | Content structure enforced in pedagogical standards |
| IV. Visual Architecture (Mermaid.js) | ✅ PASS | @docusaurus/theme-mermaid enabled |
| V. Hardware-Aware Content | ✅ PASS | Jetson/Arduino personalization built-in |
| VI. Syllabus Boundary Enforcement | ✅ PASS | Only ROS 2, Gazebo, Unity, Isaac Sim, OpenAI Agents, Better-Auth |
| VII. Operational Constraints | ✅ PASS | All code in `book/`, backend in `book/backend/` |
| VIII. AI-Native Interactivity | ✅ PASS | RAG Chatbot + User background personalization |

**Technical Stack Compliance**:
- ✅ Frontend: Docusaurus (React/MDX)
- ✅ Authentication: Better-Auth
- ✅ Backend API: FastAPI (Python)
- ✅ Agent Logic: OpenAI Agents SDK
- ✅ Vector DB: Qdrant Cloud
- ✅ Database: Neon (Postgres)
- ✅ Deployment: GitHub Pages (frontend) + Render (backend)

## Project Structure

### Documentation (this feature)

```text
specs/002-ai-native-textbook-platform/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Technical decisions and rationale
├── data-model.md        # Entity schemas and relationships
├── quickstart.md        # Developer setup guide
├── contracts/
│   └── api.yaml         # OpenAPI specification
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Implementation tasks (created by /sp.tasks)
```

### Source Code (repository root)

```text
book/
├── docs/                          # Textbook content (MDX)
│   ├── module-01-ros2/
│   │   ├── _category_.json
│   │   ├── 01-introduction.mdx
│   │   ├── 02-nodes.mdx
│   │   ├── 03-topics.mdx
│   │   ├── 04-services.mdx
│   │   ├── 05-python-agents.mdx
│   │   └── 06-urdf.mdx
│   └── module-02-digital-twin/
│       ├── _category_.json
│       ├── 01-introduction.mdx
│       ├── 02-gazebo.mdx
│       ├── 03-unity.mdx
│       └── 04-sensors.mdx
├── src/
│   ├── pages/
│   │   ├── signup.js              # Registration with background profiling
│   │   └── login.js               # Authentication page
│   ├── theme/
│   │   ├── ChatWidget.js          # Floating chat component
│   │   ├── ChatWidget.module.css  # Chat widget styles
│   │   └── Root.js                # Swizzled root to inject ChatWidget
│   ├── components/
│   │   └── PersonalizeButton.js   # "Personalize this Chapter" button
│   └── config.js                  # API_BASE_URL and auth config
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── config.py              # Settings from env vars
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py                # /api/auth/* endpoints
│   │   └── chat.py                # /api/chat/* endpoints
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── prompt_builder.py      # Personalized system prompt
│   │   └── qdrant_client.py       # Vector search wrapper
│   ├── main.py                    # FastAPI app entry point
│   ├── ingest.py                  # Content ingestion script
│   └── requirements.txt           # Python dependencies
├── .env.example                   # Environment template
├── docusaurus.config.js           # Docusaurus configuration
├── package.json                   # Node dependencies
└── render.yaml                    # Render deployment config
```

**Structure Decision**: Web application pattern with `book/` as frontend root and `book/backend/` as API server, per Constitution Principle VII.

## Implementation Phases

### Phase 1: Infrastructure & Dependencies

**Goal**: Establish project foundation with all dependencies and configuration.

| Step | Task | Files |
|------|------|-------|
| 1.1 | Create backend directory structure | `book/backend/app/`, `routers/`, `utils/` |
| 1.2 | Create `requirements.txt` | `book/backend/requirements.txt` |
| 1.3 | Add frontend dependencies | `book/package.json` (better-auth, axios) |
| 1.4 | Create environment template | `book/.env.example` |
| 1.5 | Configure Docusaurus for Mermaid | `book/docusaurus.config.js` |

### Phase 2: Backend API (FastAPI)

**Goal**: Implement the "Intelligent" backend with auth and chat endpoints.

| Step | Task | Files |
|------|------|-------|
| 2.1 | Create FastAPI app with CORS | `book/backend/main.py` |
| 2.2 | Implement config from env vars | `book/backend/app/config.py` |
| 2.3 | Implement auth router (signup/login/logout) | `book/backend/routers/auth.py` |
| 2.4 | Create Qdrant client wrapper | `book/backend/utils/qdrant_client.py` |
| 2.5 | Implement prompt builder with personalization | `book/backend/utils/prompt_builder.py` |
| 2.6 | Implement chat router (RAG agent) | `book/backend/routers/chat.py` |
| 2.7 | Create content ingestion script | `book/backend/ingest.py` |

### Phase 3: Frontend (Docusaurus)

**Goal**: Build the interactive frontend with auth pages and chat widget.

| Step | Task | Files |
|------|------|-------|
| 3.1 | Create frontend config module | `book/src/config.js` |
| 3.2 | Create signup page with background fields | `book/src/pages/signup.js` |
| 3.3 | Create login page | `book/src/pages/login.js` |
| 3.4 | Create ChatWidget component | `book/src/theme/ChatWidget.js` |
| 3.5 | Style ChatWidget | `book/src/theme/ChatWidget.module.css` |
| 3.6 | Swizzle Root to inject ChatWidget globally | `book/src/theme/Root.js` |
| 3.7 | Create PersonalizeButton component | `book/src/components/PersonalizeButton.js` |

### Phase 4: Content & Knowledge Ingestion

**Goal**: Write educational content and index it for RAG retrieval.

| Step | Task | Files |
|------|------|-------|
| 4.1 | Create Module 1 structure | `book/docs/module-01-ros2/_category_.json` |
| 4.2 | Write Module 1 chapters (Nodes, Topics, Services, URDF) | `book/docs/module-01-ros2/*.mdx` |
| 4.3 | Create Module 2 structure | `book/docs/module-02-digital-twin/_category_.json` |
| 4.4 | Write Module 2 chapters (Gazebo, Unity, Sensors) | `book/docs/module-02-digital-twin/*.mdx` |
| 4.5 | Run ingestion script to index content | Execute `python ingest.py` |

### Phase 5: Deployment Configuration

**Goal**: Configure CI/CD for both frontend and backend deployment.

| Step | Task | Files |
|------|------|-------|
| 5.1 | Create GitHub Pages workflow | `.github/workflows/deploy.yml` |
| 5.2 | Create Render deployment config | `book/render.yaml` |
| 5.3 | Update frontend config for production API URL | `book/src/config.js` |
| 5.4 | Verify end-to-end deployment | Manual testing |

## Key Architectural Decisions

### 1. Hybrid Deployment (Static + Dynamic)

**Decision**: GitHub Pages (frontend) + Render (backend)

**Rationale**: GitHub Pages is free and fast for static content but cannot run Python. Render provides free Python hosting with auto-deploy from GitHub.

**CORS Strategy**:
```python
origins = ["http://localhost:3000", "https://<user>.github.io"]
```

### 2. RAG Ingestion Pipeline

**Decision**: Local seed script (`ingest.py`) run manually

**Rationale**: Developer control over re-indexing, iterative refinement, simpler than CI automation for MVP.

**Chunking**: Unified (code + context together), 1000 tokens, 200 overlap.

### 3. Personalization via System Prompt

**Decision**: Inject user profile into OpenAI agent's system prompt

**Rationale**: Simpler than tool parameters, always-on personalization, no extra latency.

**Data Flow**:
1. Frontend fetches `/api/user/profile` on login
2. Frontend sends `user_profile` with each chat request
3. Backend builds personalized system prompt
4. OpenAI generates tailored response

## Complexity Tracking

> **No violations detected** - All design decisions comply with Constitution principles.

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Render cold starts | Keep backend warm with health check pings |
| Qdrant free tier limits | Monitor vector count, optimize chunk size |
| OpenAI API costs | Implement rate limiting, cache frequent queries |
| Content hallucination | Strict system prompt, source attribution |

## Next Steps

1. Run `/sp.tasks` to generate detailed implementation tasks
2. Begin Phase 1 implementation (Infrastructure)
3. Set up external services (Qdrant Cloud, Neon, OpenAI API)
