---
id: 001
title: Physical AI Robotics Constitution Creation
stage: constitution
date: 2025-12-16
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: saqib-squad
command: /sp.constitution
labels: ["constitution", "physical-ai", "robotics", "panaversity", "docusaurus"]
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

[cite_start]You are the **Lead Technical Curriculum Architect** for Panaversity, tasked with authoring the official "Physical AI & Humanoid Robotics" textbook[cite: 1, 4].

**Your Prime Directives:**

1.  **The Mission (Embodied Intelligence):**
    * [cite_start]You are not just writing code; you are teaching students how to bridge the "Digital Brain" (AI) with the "Physical Body" (Robots)[cite: 49].
    * [cite_start]Every explanation must reinforce the concept of **Physical AI**: systems that function in reality and comprehend physical laws[cite: 53].

2.  **Curriculum Integrity (Modules 1 & 2):**
    * **Module 1 (ROS 2):** You must accurately teach the "Robotic Nervous System." [cite_start]Focus on ROS 2 Nodes, Topics, Services, and bridging Python agents (`rclpy`) to controllers[cite: 57, 59, 60].
    * **Module 2 (Digital Twin):** You must accurately teach "Physics Simulation." [cite_start]Focus on Gazebo for physics/gravity/collisions and Unity for high-fidelity rendering[cite: 62, 64, 66].

3.  **Technical Stack Enforcement:**
    * [cite_start]**Framework:** All content must be structured for **Docusaurus** (React/MDX).
    * [cite_start]**Language:** Use Python 3.10+ for agent logic and strict **ROS 2 (Humble/Iron)** conventions for robotics code[cite: 130].
    * [cite_start]**Deployability:** The final output must be compatible with GitHub Pages deployment.

4.  **Pedagogical Style:**
    * **Concept First, Code Second:** Explain *why* a robot needs a specific node (e.g., for Proprioception or Balance) before showing the code.
    * **Visual Thinking:** Where complex architectures (like ROS node graphs or TF trees) are discussed, use **Mermaid.js** diagrams to visualize them.

5.  **Hardware Awareness:**
    * Acknowledge the hardware constraints defined in the syllabus. [cite_start]When discussing simulation, mention the heavy reliance on **NVIDIA RTX GPUs** and **Isaac Sim**[cite: 117].
    * [cite_start]When discussing edge deployment, reference the **NVIDIA Jetson Orin** platform as the target "Brain"[cite: 138].

**Constraint:**
Do not deviate from the syllabus provided in the "Hackathon I" document. If a topic is not in the source text (like generic web dev or unconnected AI theories), do not include it. Focus strictly on the intersection of AI and Robotics.

## Response snapshot

Created the Physical AI & Humanoid Robotics Textbook Constitution v1.0.0 with:

**6 Core Principles:**
1. Embodied Intelligence First - Bridge Digital Brain with Physical Body
2. Curriculum Module Integrity - ROS 2 (Module 1) and Digital Twin (Module 2)
3. Concept First, Code Second - Explain "why" before implementation
4. Visual Architecture - Mermaid.js diagrams for ROS node graphs, TF trees
5. Hardware-Aware Content - NVIDIA RTX, Isaac Sim, Jetson Orin constraints
6. Syllabus Boundary Enforcement - Strict adherence to Hackathon I syllabus

**Technical Stack Table:** Docusaurus, Python 3.10+, ROS 2 Humble/Iron, Gazebo, Unity, Isaac Sim, Jetson Orin, GitHub Pages

**Pedagogical Standards:** 7-part lesson structure, code quality gates (ruff, mypy, ros2 run), accessibility requirements

**Governance:** Amendment process, semantic versioning policy, compliance checklist

## Outcome

- Impact: Established foundational governance document for entire textbook project
- Tests: N/A (constitution document)
- Files: .specify/memory/constitution.md (created/updated)
- Next prompts: Create feature specs for Module 1 (ROS 2) and Module 2 (Digital Twin)
- Reflection: Constitution successfully translates curriculum directives into enforceable principles

## Evaluation notes (flywheel)

- Failure modes observed: None - clear input directives enabled direct mapping to principles
- Graders run and results (PASS/FAIL): N/A (manual review required)
- Prompt variant (if applicable): N/A
- Next experiment: Test constitution compliance during first feature spec creation
