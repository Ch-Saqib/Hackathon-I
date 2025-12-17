---
id: 001
title: Create AI-Native Textbook Platform Spec
stage: spec
date: 2025-12-17
surface: agent
model: claude-opus-4-5-20251101
feature: 002-ai-native-textbook-platform
branch: 002-ai-native-textbook-platform
user: system
command: /sp.specify
labels: ["spec", "ai-native", "rag-chatbot", "authentication", "personalization", "textbook"]
links:
  spec: specs/002-ai-native-textbook-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-ai-native-textbook-platform/spec.md
  - specs/002-ai-native-textbook-platform/checklists/requirements.md
tests:
  - null
---

## Prompt

**Project Name:** Physical AI Textbook & Intelligent Agent Platform
**Goal:** Build an "AI-Native" textbook with RAG Chatbot and User Personalization.

**Scope of Work:**
Implement **Modules 1 & 2**, **Authentication**, and **RAG Chatbot** within the `book/` directory.

**1. System Architecture**
* **Root Directory:** `book/`
* **Frontend:** Docusaurus (React) serving content and UI components.
* **Backend:** FastAPI (Python) serving the Chat API and Auth routes. Location: `book/backend/`.
* **Database:** Neon (PostgreSQL) for user data; Qdrant for vector embeddings.

**2. Component Specifications**

**A. Frontend (Docusaurus) [`book/src/`]**
* **Auth Pages:**
    * `book/src/pages/signup.js`: Custom registration form using **Better-Auth** client. MUST capture user metadata: "Software Background" (Python/C++) and "Hardware Background" (Arduino/Jetson).
    * `book/src/pages/login.js`: Standard sign-in page.
* **Chat Interface:**
    * `book/src/theme/ChatWidget.js`: A floating chat button/window available on every page.
    * **Function:** Sends user queries + current page context to the backend API.
* **Content:**
    * **Module 1 (ROS 2):** `book/docs/module-01-ros2` (Nodes, Python Agents, URDF).
    * **Module 2 (Digital Twin):** `book/docs/module-02-digital-twin` (Gazebo, Unity, Sensors).
    * **Personalization UI:** Add a "Personalize this Chapter" button at the top of MDX pages.

**B. Backend (FastAPI + Agents) [`book/backend/`]**
* **Core Service:** `book/backend/main.py` (FastAPI app).
* **Authentication:**
    * **Tool:** **Better-Auth** integration.
    * **Schema:** User table must store `software_skills` and `hardware_inventory`.
* **The "Professor" Agent (RAG Chatbot):**
    * **SDK:** **OpenAI Agents SDK**.
    * **Knowledge Base:** **Qdrant Cloud** (Vector DB).
    * **Pipeline:**
        1. Receive user question + page context.
        2. Retrieve relevant textbook chunks from Qdrant.
        3. Generate answer using OpenAI model.
        4. If user is logged in, tailor answer to their "Hardware Background".

**3. Data & Environment**
* **Env Vars:** Define a `.env.example` in `book/` containing keys for `OPENAI_API_KEY`, `NEON_DATABASE_URL`, `QDRANT_URL`, and `BETTER_AUTH_SECRET`.
* **Hardware Constraints:** All backend code must be lightweight enough to run locally for development but deployable to Vercel/Render.

**4. Implementation Priorities**
1. Scaffold Docusaurus Content (Modules 1 & 2).
2. Set up FastAPI Backend skeleton.
3. Integrate Better-Auth (Signup/Login).
4. Implement Basic RAG (Ingest docs -> Qdrant -> Chat).

## Response snapshot

Created feature specification for AI-Native Textbook Platform with:

**Branch**: `002-ai-native-textbook-platform`

**User Stories (4 total)**:
1. P1: Browse Educational Content - Core textbook modules
2. P2: User Registration with Background Profiling - Auth with software/hardware background capture
3. P3: Ask the Professor (RAG Chatbot) - Question answering from textbook content
4. P4: Personalized Content Experience - Tailored content based on user profile

**Functional Requirements (22 total)**:
- Content & Navigation (FR-001 to FR-004)
- Authentication & User Profiles (FR-005 to FR-010)
- RAG Chatbot (FR-011 to FR-016)
- Personalization (FR-017 to FR-020)
- Environment & Configuration (FR-021 to FR-022)

**Key Entities**: User, ChatMessage, ContentChunk, UserSession

**Success Criteria (8 measurable outcomes)**: Page load times, registration completion, chatbot response times, hallucination prevention, personalization accuracy, concurrency support.

**Quality Checklist**: All 12 validation items PASSED.

## Outcome

- ✅ Impact: Created comprehensive feature specification for AI-Native textbook platform
- 🧪 Tests: N/A (specification document)
- 📁 Files: spec.md, checklists/requirements.md
- 🔁 Next prompts: /sp.clarify or /sp.plan to proceed with implementation planning
- 🧠 Reflection: Specification successfully captures all user requirements without implementation details

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Quality checklist - 12/12 PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
