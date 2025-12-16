<!--
  SYNC IMPACT REPORT
  ==================
  Version Change: 1.0.0 → 1.1.0 (MINOR - new principle added)

  Modified Principles: None (all existing principles unchanged)

  Added Sections:
    - Principle VII: Operational Constraints (CRITICAL - book/ directory mandate)

  Removed Sections: None

  Templates Requiring Updates:
    ✅ plan-template.md - Constitution Check section compatible (no changes needed)
    ✅ spec-template.md - User story structure compatible (no changes needed)
    ✅ tasks-template.md - Phase structure compatible (no changes needed)

  Deferred Items: None
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### I. Embodied Intelligence First

All content MUST reinforce the concept of **Physical AI**: systems that function in reality
and comprehend physical laws. Every explanation bridges the "Digital Brain" (AI) with the
"Physical Body" (Robots). Code examples without physical context are prohibited—always
demonstrate how AI logic translates to real-world robotic behavior.

**Rationale**: Students must internalize that robotics is not abstract software engineering.
Sensors, actuators, physics, and latency constraints fundamentally shape system design.

### II. Curriculum Module Integrity

Content MUST adhere strictly to the defined curriculum modules:

- **Module 1 (ROS 2 - The Robotic Nervous System)**: Focus on ROS 2 Nodes, Topics, Services,
  Actions, and bridging Python agents (`rclpy`) to controllers. All examples use ROS 2
  Humble or Iron distributions.
- **Module 2 (Digital Twin - Physics Simulation)**: Focus on Gazebo for physics simulation
  (gravity, collisions, friction) and Unity for high-fidelity visual rendering. Simulation
  MUST precede hardware deployment.

**Rationale**: Module boundaries ensure coherent learning progression. ROS 2 provides the
communication backbone; simulation provides safe iteration before physical deployment.

### III. Concept First, Code Second

Every code example MUST be preceded by conceptual explanation. Explain *why* a robot needs
a specific node (e.g., for Proprioception, Balance, or Locomotion) before presenting
implementation. Use biological and physical analogies where applicable.

**Rationale**: Students who understand the "why" can adapt solutions to novel problems.
Rote code copying without comprehension produces brittle engineers.

### IV. Visual Architecture (Mermaid.js)

Complex architectures MUST be visualized using **Mermaid.js** diagrams:

- ROS 2 node graphs showing topic/service connections
- TF (Transform) trees for coordinate frame relationships
- State machines for robot behavior
- Data flow diagrams for sensor-to-actuator pipelines

Diagrams MUST be embedded directly in MDX files for Docusaurus rendering.

**Rationale**: Robotics involves spatial reasoning and concurrent processes. Visual
representations reduce cognitive load and expose architectural issues early.

### V. Hardware-Aware Content

All content MUST acknowledge target hardware constraints:

- **Simulation**: Assume NVIDIA RTX GPUs and Isaac Sim for physics-accurate simulation.
  Document GPU memory requirements and fallback options.
- **Edge Deployment**: Reference NVIDIA Jetson Orin as the target "Brain" for deployed
  robots. Discuss power, thermal, and compute constraints.
- **Sensors/Actuators**: Use industry-standard interfaces (CAN, EtherCAT, I2C, SPI) when
  discussing hardware integration.

**Rationale**: Students must understand that simulation fidelity and edge constraints
directly impact algorithm selection and system architecture.

### VI. Syllabus Boundary Enforcement

Content MUST NOT deviate from the "Hackathon I" syllabus. Prohibited topics include:

- Generic web development unrelated to robot interfaces
- AI/ML theories without robotics application
- Hardware platforms not specified in the syllabus
- Frameworks or tools outside the approved stack

When a topic approaches syllabus boundaries, explicitly state what is out of scope and why.

**Rationale**: Focused curriculum prevents scope creep and ensures students master
foundational Physical AI concepts before exploring tangential domains.

### VII. Operational Constraints (CRITICAL)

All development work MUST respect the following operational boundaries:

- **Working Directory**: All source code, documentation, and configuration files MUST be
  located within the `book/` directory.
- **Do Not Overwrite**: The `book/` folder already contains a Docusaurus project. Do NOT
  run `npx create-docusaurus`. Instead, verify the structure and add/update files within
  the existing structure.
- **File Paths**: Always reference file paths relative to the project root (e.g.,
  `book/docs/module-01...` or `book/src/pages...`).

**Rationale**: Ensures agents respect the existing repository structure and do not clutter
the root directory or delete existing work.

## Technical Stack Requirements

The following technical standards are NON-NEGOTIABLE for all content:

| Component | Requirement | Justification |
|-----------|-------------|---------------|
| **Framework** | Docusaurus (React/MDX) | Enables interactive content, code blocks, Mermaid diagrams |
| **Language** | Python 3.10+ | ROS 2 rclpy compatibility, type hints, pattern matching |
| **Middleware** | ROS 2 Humble/Iron | LTS support, modern DDS architecture, industry adoption |
| **Physics** | Gazebo (Ignition/Harmonic) | Open-source, ROS 2 native integration, GPU acceleration |
| **Visuals** | Unity + Robotics Hub | High-fidelity visuals, domain randomization support |
| **GPU Sim** | NVIDIA Isaac Sim | PhysX, RTX ray tracing, synthetic data generation |
| **Edge HW** | NVIDIA Jetson Orin | GPU-accelerated inference, ROS 2 support, low power |
| **Deployment** | GitHub Pages | Free hosting, CI/CD integration, version control |

Code examples MUST include:
- Python type annotations for all function signatures
- ROS 2 package structure (`package.xml`, `setup.py`, launch files)
- Docstrings following Google style guide

## Pedagogical Standards

### Content Structure

Each lesson MUST follow this structure:

1. **Learning Objectives**: 3-5 measurable outcomes
2. **Conceptual Foundation**: Physical/biological analogy explaining the "why"
3. **Architecture Diagram**: Mermaid.js visualization of system components
4. **Guided Implementation**: Step-by-step code with inline explanations
5. **Simulation Exercise**: Gazebo/Unity task demonstrating the concept
6. **Reflection Questions**: 2-3 questions connecting to Physical AI principles
7. **Further Reading**: Links to ROS 2 docs, research papers, or syllabus references

### Code Quality Gates

All code examples MUST pass:

- `ruff` linting with strict configuration
- `mypy` type checking in strict mode
- `ros2 run <package> <node>` execution without errors
- Simulation launch without crashes for 60+ seconds

### Accessibility

Content MUST be accessible:

- Alt text for all images
- Color-blind friendly diagrams
- Code blocks with syntax highlighting
- Mobile-responsive layouts

## Governance

### Amendment Process

1. Proposed amendments MUST include rationale and impact assessment
2. Amendments affecting Core Principles require documented approval
3. Technical stack changes require migration plan for existing content
4. All amendments MUST be recorded in version history

### Versioning Policy

- **MAJOR**: Core Principle changes, module restructuring, breaking stack changes
- **MINOR**: New sections, expanded guidance, additional constraints
- **PATCH**: Typo fixes, clarifications, non-semantic refinements

### Compliance Review

All content MUST be reviewed against this constitution before publication:

- [ ] Reinforces Embodied Intelligence concept
- [ ] Follows Concept First, Code Second pattern
- [ ] Includes required Mermaid.js diagrams for architectures
- [ ] Uses approved technical stack only
- [ ] Stays within syllabus boundaries
- [ ] Adheres to `book/` directory operational constraints
- [ ] Meets code quality gates

### Runtime Guidance

For day-to-day development guidance beyond this constitution, consult:
- `CLAUDE.md` for agent-specific instructions
- `.specify/templates/` for artifact templates
- `specs/<feature>/` for feature-specific decisions

**Version**: 1.1.0 | **Ratified**: 2025-12-16 | **Last Amended**: 2025-12-16
