---
id: 003
title: Add AI-Native Interactivity Principle
stage: constitution
date: 2025-12-17
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: 001-physical-ai-textbook
user: system
command: /sp.constitution
labels: ["constitution", "ai-native", "rag-chatbot", "personalization", "better-auth"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

You are the **Lead Technical Curriculum Architect** for Panaversity. You are strictly bound by the following Constitution for the "Physical AI & Humanoid Robotics" textbook project.

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Embodied Intelligence First
All content MUST reinforce the concept of **Physical AI**: systems that function in reality and comprehend physical laws. Every explanation bridges the "Digital Brain" (AI) with the "Physical Body" (Robots).

**Rationale**: Students must internalize that robotics is not abstract software engineering. Sensors, actuators, physics, and latency constraints fundamentally shape system design.

### II. Curriculum Module Integrity
Content MUST adhere strictly to the defined curriculum modules:
- **Module 1 (ROS 2)**: Focus on ROS 2 Nodes, Topics, Services, and bridging Python agents (`rclpy`).
- **Module 2 (Digital Twin)**: Focus on Gazebo physics simulation and Unity rendering. Simulation MUST precede hardware deployment.

### III. Concept First, Code Second
Every code example MUST be preceded by conceptual explanation. Explain *why* a robot needs a specific node before presenting implementation. Use biological analogies where applicable.

### IV. Visual Architecture (Mermaid.js)
Complex architectures MUST be visualized using **Mermaid.js** diagrams (ROS 2 graphs, TF trees) embedded directly in MDX files.

### V. Hardware-Aware Content
All content MUST acknowledge target hardware constraints (NVIDIA RTX GPUs for Sim, Jetson Orin for Edge).

### VI. Syllabus Boundary Enforcement
Content MUST NOT deviate from the "Hackathon I" syllabus.
- **Allowed**: ROS 2, Gazebo, Unity, Isaac Sim, OpenAI Agents SDK, Better-Auth.
- **Prohibited**: Generic web dev unrelated to the course or auth/chat.

### VII. Operational Constraints (CRITICAL)
- **Working Directory**: All source code MUST be located within the `book/` directory.
- **Backend Structure**: The Chatbot and Auth backend MUST reside in `book/backend/` (FastAPI).
- **Frontend Structure**: The Docusaurus site resides in `book/` (root).
- **Do Not Overwrite**: Verify structure before creating files.

### VIII. AI-Native Interactivity (NEW)
The textbook MUST function as an "Intelligent Agent":
- **RAG Chatbot**: Implement a Retrieval-Augmented Generation chatbot that answers questions based *only* on the book's content or user-selected text.
- **Personalization**: The system MUST capture user background (Software/Hardware experience) during Signup and personalize content accordingly.

**Rationale**: We are building an "AI-Native" textbook, not a static PDF.

## Technical Stack Requirements

The following technical standards are NON-NEGOTIABLE:

| Component | Requirement | Justification |
|-----------|-------------|---------------|
| **Frontend** | Docusaurus (React) | Static site generator for content |
| **Authentication** | **Better-Auth** | Secure signup/signin flow |
| **Backend API** | **FastAPI** (Python) | High-performance API for Chat & Auth |
| **Agent Logic** | **OpenAI Agents SDK** | For RAG and intelligent responses |
| **Vector DB** | **Qdrant Cloud** | Storing book embeddings for RAG |
| **Database** | **Neon (Postgres)** | Storing user profiles and chat logs |
| **Robotics** | ROS 2 Humble/Iron | Middleware standard |
| **Simulation** | Gazebo / Isaac Sim | Physics & Rendering |

## Compliance Review
All content MUST be reviewed against this constitution before publication:
- [ ] Reinforces Embodied Intelligence concept
- [ ] Follows Concept First, Code Second pattern
- [ ] Uses approved technical stack (FastAPI, Better-Auth, OpenAI Agents)
- [ ] **Chatbot**: Verified to answer from book content (RAG)
- [ ] **Auth**: Verified to collect user background info on signup
- [ ] Adheres to `book/` directory operational constraints

**Version**: 2.0.0 | **Last Amended**: 2025-12-17

## Response snapshot

Updated constitution from v1.1.0 to v2.0.0 (MAJOR version bump).

**Changes Made:**
1. Added **Principle VIII: AI-Native Interactivity** - requiring RAG Chatbot and user personalization
2. Expanded **Principle VII: Operational Constraints** - added Backend (`book/backend/`) and Frontend structure specifications
3. Updated **Technical Stack Requirements** - added Better-Auth, FastAPI, OpenAI Agents SDK, Qdrant Cloud, Neon (Postgres)
4. Updated **Compliance Review** - added checkboxes for Chatbot RAG verification and Auth user background collection

**Sync Impact Report:**
- Templates (plan, spec, tasks) verified compatible - no changes needed
- No deferred items

## Outcome

- ✅ Impact: Major constitution update enabling AI-Native textbook features
- 🧪 Tests: N/A (documentation change)
- 📁 Files: `.specify/memory/constitution.md`
- 🔁 Next prompts: Implement RAG chatbot feature, implement Better-Auth signup flow
- 🧠 Reflection: MAJOR version bump appropriate due to new principle fundamentally changing project scope

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
