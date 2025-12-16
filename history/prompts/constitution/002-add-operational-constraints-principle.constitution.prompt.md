---
id: 002
title: Add Operational Constraints Principle
stage: constitution
date: 2025-12-16
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: architect
command: /sp.constitution
labels: ["constitution", "operational-constraints", "book-directory", "governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (governance document, no code tests)
---

## Prompt

You are the **Lead Technical Curriculum Architect** for Panaversity. You are strictly bound by the following Constitution for the "Physical AI & Humanoid Robotics" textbook project.

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Embodied Intelligence First
All content MUST reinforce the concept of **Physical AI**: systems that function in reality and comprehend physical laws. Every explanation bridges the "Digital Brain" (AI) with the "Physical Body" (Robots). Code examples without physical context are prohibited—always demonstrate how AI logic translates to real-world robotic behavior.

**Rationale**: Students must internalize that robotics is not abstract software engineering. Sensors, actuators, physics, and latency constraints fundamentally shape system design.

### II. Curriculum Module Integrity
Content MUST adhere strictly to the defined curriculum modules:
- **Module 1 (ROS 2 - The Robotic Nervous System)**: Focus on ROS 2 Nodes, Topics, Services, Actions, and bridging Python agents (`rclpy`) to controllers. All examples use ROS 2 Humble or Iron distributions.
- **Module 2 (Digital Twin - Physics Simulation)**: Focus on Gazebo for physics simulation (gravity, collisions, friction) and Unity for high-fidelity visual rendering. Simulation MUST precede hardware deployment.

**Rationale**: Module boundaries ensure coherent learning progression. ROS 2 provides the communication backbone; simulation provides safe iteration before physical deployment.

### III. Concept First, Code Second
Every code example MUST be preceded by conceptual explanation. Explain *why* a robot needs a specific node (e.g., for Proprioception, Balance, or Locomotion) before presenting implementation. Use biological and physical analogies where applicable.

**Rationale**: Students who understand the "why" can adapt solutions to novel problems. Rote code copying without comprehension produces brittle engineers.

### IV. Visual Architecture (Mermaid.js)
Complex architectures MUST be visualized using **Mermaid.js** diagrams:
- ROS 2 node graphs showing topic/service connections
- TF (Transform) trees for coordinate frame relationships
- State machines for robot behavior
- Data flow diagrams for sensor-to-actuator pipelines

Diagrams MUST be embedded directly in MDX files for Docusaurus rendering.

**Rationale**: Robotics involves spatial reasoning and concurrent processes. Visual representations reduce cognitive load and expose architectural issues early.

### V. Hardware-Aware Content
All content MUST acknowledge target hardware constraints:
- **Simulation**: Assume NVIDIA RTX GPUs and Isaac Sim for physics-accurate simulation. Document GPU memory requirements and fallback options.
- **Edge Deployment**: Reference NVIDIA Jetson Orin as the target "Brain" for deployed robots. Discuss power, thermal, and compute constraints.
- **Sensors/Actuators**: Use industry-standard interfaces (CAN, EtherCAT, I2C, SPI) when discussing hardware integration.

**Rationale**: Students must understand that simulation fidelity and edge constraints directly impact algorithm selection and system architecture.

### VI. Syllabus Boundary Enforcement
Content MUST NOT deviate from the "Hackathon I" syllabus. Prohibited topics include:
- Generic web development unrelated to robot interfaces
- AI/ML theories without robotics application
- Hardware platforms not specified in the syllabus
- Frameworks or tools outside the approved stack

When a topic approaches syllabus boundaries, explicitly state what is out of scope and why.

**Rationale**: Focused curriculum prevents scope creep and ensures students master foundational Physical AI concepts before exploring tangential domains.

### VII. Operational Constraints (CRITICAL)
- **Working Directory**: All source code, documentation, and configuration files MUST be located within the `book/` directory.
- **Do Not Overwrite**: The `book/` folder already contains a Docusaurus project. Do NOT run `npx create-docusaurus`. Instead, verify the structure and add/update files within the existing structure.
- **File Paths**: Always reference file paths relative to the project root (e.g., `book/docs/module-01...` or `book/src/pages...`).

**Rationale**: Ensures agents respect the existing repository structure and do not clutter the root directory or delete existing work.

## Technical Stack Requirements

The following technical standards are NON-NEGOTIABLE for all content:

| Component | Requirement | Justification |
|-----------|-------------|---------------|
| **Framework** | Docusaurus (React/MDX) | Enables interactive content, code blocks, Mermaid diagrams |
| **Language** | Python 3.10+ | ROS 2 rclpy compatibility, type hints, pattern matching |
| **Middleware** | ROS 2 Humble/Iron | LTS support, modern DDS architecture, industry adoption |
| **Physics** | Gazebo (Ignition/Harmonic)| Open-source, ROS 2 native integration, GPU acceleration |
| **Visuals** | Unity + Robotics Hub | High-fidelity visuals, domain randomization support |
| **GPU Sim** | NVIDIA Isaac Sim | PhysX, RTX ray tracing, synthetic data generation |
| **Edge HW** | NVIDIA Jetson Orin | GPU-accelerated inference, ROS 2 support, low power |
| **Deployment**| GitHub Pages | Free hosting, CI/CD integration, version control |

Code examples MUST include:
- Python type annotations for all function signatures
- ROS 2 package structure (`package.xml`, `setup.py`, launch files)
- Docstrings following Google style guide

## Compliance Review
All content MUST be reviewed against this constitution before publication:
- [ ] Reinforces Embodied Intelligence concept
- [ ] Follows Concept First, Code Second pattern
- [ ] Includes required Mermaid.js diagrams for architectures
- [ ] Uses approved technical stack only
- [ ] Stays within syllabus boundaries
- [ ] Adheres to `book/` directory operational constraints

**Version**: 1.1.0 | **Last Amended**: 2025-12-16 update constitution

## Response snapshot

Updated constitution from v1.0.0 to v1.1.0 with the addition of Principle VII: Operational Constraints (CRITICAL). This new principle mandates that all project work must be located within the `book/` directory, prevents overwriting the existing Docusaurus project, and requires file paths to be relative to the project root.

Key changes:
- Added Principle VII with three operational rules (Working Directory, Do Not Overwrite, File Paths)
- Updated Compliance Review checklist to include `book/` directory constraint check
- Updated version from 1.0.0 to 1.1.0 (MINOR bump per semantic versioning policy)
- Updated Sync Impact Report with change documentation
- Verified all templates (plan, spec, tasks) remain compatible with the new principle

## Outcome

- ✅ Impact: Constitution updated with critical operational constraint for `book/` directory isolation
- 🧪 Tests: N/A (governance document)
- 📁 Files: `.specify/memory/constitution.md` updated
- 🔁 Next prompts: Continue with feature development respecting `book/` directory constraints
- 🧠 Reflection: The new principle prevents accidental project structure corruption and ensures all textbook content remains properly organized

## Evaluation notes (flywheel)

- Failure modes observed: None - clean constitution amendment
- Graders run and results (PASS/FAIL): N/A - governance update
- Prompt variant (if applicable): Standard constitution update workflow
- Next experiment (smallest change to try): Monitor agent compliance with `book/` directory constraint in future sessions
