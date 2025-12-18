# Tasks: AI-Native Textbook Platform

**Input**: Design documents from `/specs/002-ai-native-textbook-platform/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/api.yaml, research.md, quickstart.md

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `book/` (Docusaurus root)
- **Backend**: `book/backend/` (FastAPI)
- All paths start with `book/` per Constitution Principle VII

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, directory structure, and dependency configuration

- [ ] T001 Verify `book/` directory exists and contains Docusaurus project
- [ ] T002 [P] Create backend directory structure: `book/backend/app/`, `book/backend/routers/`, `book/backend/utils/`
- [ ] T003 [P] Create `book/backend/app/__init__.py` (empty init file)
- [ ] T004 [P] Create `book/backend/routers/__init__.py` (empty init file)
- [ ] T005 [P] Create `book/backend/utils/__init__.py` (empty init file)
- [ ] T006 Create `book/backend/requirements.txt` with dependencies: fastapi, uvicorn, openai, qdrant-client, python-dotenv, asyncpg, pydantic, bcrypt, python-jose
- [ ] T007 Create `book/.env.example` with placeholders for OPENAI_API_KEY, NEON_DATABASE_URL, QDRANT_URL, QDRANT_API_KEY, BETTER_AUTH_SECRET, API_BASE_URL
- [ ] T008 Add frontend dependencies to `book/package.json`: axios, better-auth client

**Checkpoint**: Directory structure ready, all dependencies declared

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Create `book/backend/app/config.py` with Settings class loading env vars (OPENAI_API_KEY, NEON_DATABASE_URL, QDRANT_URL, QDRANT_API_KEY, BETTER_AUTH_SECRET)
- [ ] T010 Create `book/backend/main.py` with FastAPI app, CORS middleware (allow localhost:3000 and GitHub Pages origin), health check endpoint at /health
- [ ] T011 Create `book/src/config.js` with API_BASE_URL export (default: http://localhost:8000, env override for production)

**Checkpoint**: Backend server starts, CORS configured, frontend can connect to backend

---

## Phase 3: User Story 1 - Browse Educational Content (Priority: P1) 🎯 MVP

**Goal**: Students can browse Module 1 (ROS 2) and Module 2 (Digital Twin) content with Mermaid diagrams and syntax-highlighted code blocks

**Independent Test**: Navigate to any module page and verify content renders with diagrams, code blocks, and proper formatting

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create `book/docs/module-01-ros2/_category_.json` with label "Module 1: ROS 2" and position 1
- [ ] T013 [P] [US1] Create `book/docs/module-02-digital-twin/_category_.json` with label "Module 2: Digital Twin" and position 2
- [ ] T014 [US1] Create `book/docs/module-01-ros2/01-introduction.mdx` with learning objectives, ROS 2 overview, and Mermaid architecture diagram
- [ ] T015 [P] [US1] Create `book/docs/module-01-ros2/02-nodes.mdx` explaining ROS 2 Nodes with Python code examples and node graph diagram
- [ ] T016 [P] [US1] Create `book/docs/module-01-ros2/03-topics.mdx` explaining pub/sub with Mermaid flow diagram
- [ ] T017 [P] [US1] Create `book/docs/module-01-ros2/04-services.mdx` explaining request/response pattern with sequence diagram
- [ ] T018 [P] [US1] Create `book/docs/module-01-ros2/05-python-agents.mdx` bridging rclpy with AI agents
- [ ] T019 [P] [US1] Create `book/docs/module-01-ros2/06-urdf.mdx` explaining robot description format
- [ ] T020 [US1] Create `book/docs/module-02-digital-twin/01-introduction.mdx` with Digital Twin overview and simulation pipeline diagram
- [ ] T021 [P] [US1] Create `book/docs/module-02-digital-twin/02-gazebo.mdx` covering Gazebo physics simulation
- [ ] T022 [P] [US1] Create `book/docs/module-02-digital-twin/03-unity.mdx` covering Unity visual rendering
- [ ] T023 [P] [US1] Create `book/docs/module-02-digital-twin/04-sensors.mdx` covering simulated sensors

**Checkpoint**: All Module 1 and Module 2 content is browsable, Mermaid diagrams render, code blocks have syntax highlighting

---

## Phase 4: User Story 2 - User Registration with Background Profiling (Priority: P2)

**Goal**: Users can create accounts with email/password and select their software/hardware background for personalization

**Independent Test**: Complete signup flow, verify user profile is created with software_skills and hardware_inventory stored in database

### Implementation for User Story 2

- [ ] T024 [US2] Create `book/backend/routers/auth.py` with signup endpoint POST /api/auth/signup accepting email, password, software_skills[], hardware_inventory[]
- [ ] T025 [US2] Add login endpoint POST /api/auth/login to `book/backend/routers/auth.py` returning session token
- [ ] T026 [US2] Add logout endpoint POST /api/auth/logout to `book/backend/routers/auth.py` invalidating session
- [ ] T027 [US2] Add GET /api/user/profile endpoint to `book/backend/routers/auth.py` returning user profile with background fields
- [ ] T028 [US2] Add PATCH /api/user/profile endpoint to `book/backend/routers/auth.py` for updating software_skills and hardware_inventory
- [ ] T029 [US2] Register auth router in `book/backend/main.py` with prefix /api/auth and /api/user
- [ ] T030 [US2] Create `book/src/pages/signup.js` with form fields: email, password, Software Background multi-select (Python, C++, JavaScript, None), Hardware Background multi-select (Arduino, Jetson, Raspberry Pi, None)
- [ ] T031 [US2] Create `book/src/pages/login.js` with email/password form and redirect to previous page on success

**Checkpoint**: Users can signup with background profile, login, logout, and view/update their profile

---

## Phase 5: User Story 3 - Ask the Professor RAG Chatbot (Priority: P3)

**Goal**: Students can ask questions via floating chat widget and receive answers derived only from textbook content

**Independent Test**: Ask "What is a ROS 2 Node?" and verify response cites Module 1 content; ask off-topic question and verify "I can only answer questions about this textbook" response

### Implementation for User Story 3

- [ ] T032 [US3] Create `book/backend/utils/qdrant_client.py` with QdrantWrapper class: init_collection(), search_similar(query, limit=5) returning relevant chunks
- [ ] T033 [US3] Create `book/backend/utils/prompt_builder.py` with build_system_prompt(retrieved_chunks, user_profile=None) function that constructs Professor persona prompt
- [ ] T034 [US3] Create `book/backend/routers/chat.py` with POST /api/chat endpoint: accept message, page_context, optional user_profile; query Qdrant; build prompt; call OpenAI; return answer with sources
- [ ] T035 [US3] Add GET /api/chat/history endpoint to `book/backend/routers/chat.py` for authenticated users (limit, offset params)
- [ ] T036 [US3] Register chat router in `book/backend/main.py` with prefix /api/chat
- [ ] T037 [US3] Create `book/backend/ingest.py` script: parse all MDX files in book/docs/, chunk text (1000 tokens, 200 overlap), generate embeddings via OpenAI, upload to Qdrant collection "textbook_chunks"
- [ ] T038 [US3] Create `book/src/theme/ChatWidget.js` React component: floating button (bottom-right), expandable chat window, message input, message list, loading state, error handling
- [ ] T039 [US3] Create `book/src/theme/ChatWidget.module.css` with styles for chat button, window, messages, input
- [ ] T040 [US3] Create `book/src/theme/Root.js` (swizzled) to wrap all pages with ChatWidget component

**Checkpoint**: Chat widget appears on all pages, questions get RAG-based answers from textbook content, off-topic questions handled gracefully

---

## Phase 6: User Story 4 - Personalized Content Experience (Priority: P4)

**Goal**: Logged-in users with hardware/software background get personalized chatbot responses and can click "Personalize this Chapter"

**Independent Test**: Login with Jetson hardware profile, ask chatbot a question, verify response includes Jetson-specific guidance

### Implementation for User Story 4

- [ ] T041 [US4] Update `book/backend/utils/prompt_builder.py` to inject user's hardware_inventory and software_skills into system prompt when provided
- [ ] T042 [US4] Update `book/src/theme/ChatWidget.js` to fetch user profile on mount (if authenticated) and send with chat requests
- [ ] T043 [US4] Create `book/src/components/PersonalizeButton.js` React component: button that fetches user profile, shows login prompt if anonymous, triggers personalization state
- [ ] T044 [US4] Add PersonalizeButton to MDX layout or create wrapper component to inject it on content pages

**Checkpoint**: Authenticated users receive personalized responses, PersonalizeButton prompts anonymous users to login

---

## Phase 7: Deployment Configuration

**Purpose**: Configure CI/CD for GitHub Pages (frontend) and Render (backend)

- [ ] T045 [P] Create `.github/workflows/deploy.yml` for GitHub Pages deployment: build Docusaurus on push to main, deploy to gh-pages branch
- [ ] T046 [P] Create `book/render.yaml` with web service config: name, runtime python-3.10, build command pip install -r requirements.txt, start command uvicorn main:app --host 0.0.0.0 --port $PORT
- [ ] T047 Update `book/src/config.js` to use REACT_APP_API_URL env var for production API URL
- [ ] T048 Update `book/backend/main.py` CORS origins to include production GitHub Pages URL

**Checkpoint**: Frontend auto-deploys to GitHub Pages, backend deploys to Render, CORS allows cross-origin requests

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, validation, and cleanup

- [ ] T049 Run `python book/backend/ingest.py` to index all MDX content into Qdrant
- [ ] T050 Verify health check endpoint returns 200 at /health
- [ ] T051 Verify full user journey: browse content → signup → login → chat → personalized response
- [ ] T052 Update `book/.env.example` with all required variables documented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - Content is MVP
- **User Story 2 (Phase 4)**: Depends on Foundational - Auth enables personalization
- **User Story 3 (Phase 5)**: Depends on US1 (content to search) + Foundational
- **User Story 4 (Phase 6)**: Depends on US2 (user profiles) + US3 (chat infrastructure)
- **Deployment (Phase 7)**: Can start after Foundational, parallel to user stories
- **Polish (Phase 8)**: Depends on all user stories complete

### User Story Dependencies

```
US1 (Content) ─────────────────────┐
                                   ├──► US3 (Chatbot)
US2 (Auth) ────────────────────────┤
                                   └──► US4 (Personalization)
```

- **US1**: Independent, can complete after Foundational
- **US2**: Independent, can complete after Foundational
- **US3**: Requires US1 content to exist for RAG retrieval
- **US4**: Requires US2 (profiles) + US3 (chat) infrastructure

### Within Each User Story

- Backend implementation before frontend
- Utility modules before routers
- Routers before main.py registration
- Backend complete before frontend components

### Parallel Opportunities

```text
# Phase 1 - All can run in parallel:
T002, T003, T004, T005 (directory structure)

# Phase 3 (US1) - MDX files can be written in parallel:
T015, T016, T017, T018, T019 (Module 1 chapters)
T021, T022, T023 (Module 2 chapters)

# Phase 7 - Deployment configs in parallel:
T045, T046 (GitHub Actions + Render config)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Content)
4. **STOP and VALIDATE**: Browse all content, verify Mermaid diagrams render
5. Deploy static site to GitHub Pages (partial Phase 7)

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Content) → Test independently → Deploy content-only site
3. Add US2 (Auth) → Test signup/login flow → Deploy with auth
4. Add US3 (Chatbot) → Test RAG responses → Deploy with chat
5. Add US4 (Personalization) → Test personalized responses → Full platform deployed
6. Each story adds value without breaking previous stories

### Recommended Execution Order

```text
T001 → T002-T008 (parallel) → T009-T011 (sequential)
→ T012-T023 (US1, many parallel)
→ T024-T031 (US2, sequential backend → frontend)
→ T032-T040 (US3, sequential backend → frontend)
→ T041-T044 (US4, updates to existing)
→ T045-T048 (Deployment)
→ T049-T052 (Polish)
```

---

## Summary

| Phase | Tasks | Story | Parallel Opportunities |
|-------|-------|-------|------------------------|
| Setup | T001-T008 | - | 6 tasks parallelizable |
| Foundational | T009-T011 | - | Sequential (dependencies) |
| US1: Content | T012-T023 | P1 | 10 MDX files parallelizable |
| US2: Auth | T024-T031 | P2 | Backend then frontend |
| US3: Chatbot | T032-T040 | P3 | Backend then frontend |
| US4: Personalization | T041-T044 | P4 | Updates to existing |
| Deployment | T045-T048 | - | 2 configs parallelizable |
| Polish | T049-T052 | - | Sequential validation |

**Total Tasks**: 52
**MVP Scope**: T001-T023 (23 tasks for browsable content)
**Full Platform**: All 52 tasks
