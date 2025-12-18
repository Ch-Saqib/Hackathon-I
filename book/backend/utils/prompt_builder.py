# Physical AI Textbook Backend - Prompt Builder for RAG
from typing import Optional

# Professor persona system prompt
PROFESSOR_PERSONA = """You are "The Professor", an expert AI teaching assistant for the Physical AI & Humanoid Robotics textbook.

Your role:
- Answer questions ONLY using information from the textbook content provided in the context
- Explain concepts clearly using analogies and examples from the textbook
- Reference specific topics, modules, and sections when relevant
- Acknowledge when a question is outside the scope of the textbook content

Guidelines:
- Be encouraging and supportive of learners at all levels
- Use technical terminology correctly but explain it when first introduced
- Provide code examples when they would help clarify concepts
- Suggest related topics from the textbook for further reading

IMPORTANT: If the question cannot be answered from the provided context, respond with:
"I can only answer questions about the Physical AI & Humanoid Robotics textbook content. This question appears to be outside my knowledge scope. Try asking about ROS 2, digital twins, physics simulation, or other topics covered in the textbook."
"""


def build_system_prompt(
    retrieved_chunks: list[dict],
    user_profile: Optional[dict] = None,
) -> str:
    """
    Build the system prompt for the RAG chatbot.

    Args:
        retrieved_chunks: List of relevant chunks from the vector database.
        user_profile: Optional user profile with software_skills and hardware_inventory.

    Returns:
        Complete system prompt string.
    """
    prompt_parts = [PROFESSOR_PERSONA]

    # Add personalization context if user profile provided
    if user_profile:
        personalization = build_personalization_context(user_profile)
        if personalization:
            prompt_parts.append(f"\n{personalization}")

    # Add retrieved context
    if retrieved_chunks:
        context = build_context_section(retrieved_chunks)
        prompt_parts.append(f"\n{context}")
    else:
        prompt_parts.append(
            "\n<context>\nNo relevant textbook content found for this query.\n</context>"
        )

    return "\n".join(prompt_parts)


def build_personalization_context(user_profile: dict) -> str:
    """
    Build personalization instructions based on user profile.

    Args:
        user_profile: Dictionary with software_skills and hardware_inventory.

    Returns:
        Personalization instruction string.
    """
    parts = []

    software_skills = user_profile.get("software_skills", [])
    hardware_inventory = user_profile.get("hardware_inventory", [])

    if software_skills or hardware_inventory:
        parts.append("<personalization>")
        parts.append("Adapt your explanations for this user's background:")

        if software_skills:
            skills_str = ", ".join(software_skills)
            parts.append(f"- Software experience: {skills_str}")

            # Add skill-specific guidance
            if "Python" in software_skills:
                parts.append("  - They know Python, so use Python examples without over-explaining basics")
            if "C++" in software_skills:
                parts.append("  - They know C++, so mention C++ alternatives when relevant")
            if "ROS2" in software_skills:
                parts.append("  - They have ROS 2 experience, so use proper ROS terminology")
            if "JavaScript" in software_skills:
                parts.append("  - They know JavaScript, so relate concepts to web development when helpful")

        if hardware_inventory:
            hardware_str = ", ".join(hardware_inventory)
            parts.append(f"- Hardware access: {hardware_str}")

            # Add hardware-specific guidance
            if "Jetson" in hardware_inventory:
                parts.append("  - Provide NVIDIA Jetson-specific commands and configurations when relevant")
                parts.append("  - Reference Jetson's GPU capabilities for AI inference")
            if "Arduino" in hardware_inventory:
                parts.append("  - Mention Arduino integration points with ROS 2 when applicable")
            if "RaspberryPi" in hardware_inventory:
                parts.append("  - Include Raspberry Pi setup instructions when relevant")
            if "RTX" in hardware_inventory:
                parts.append("  - Reference NVIDIA RTX capabilities for simulation and training")

        parts.append("</personalization>")

    return "\n".join(parts)


def build_context_section(chunks: list[dict]) -> str:
    """
    Build the context section from retrieved chunks.

    Args:
        chunks: List of chunk dictionaries with content, source, and title.

    Returns:
        Formatted context section string.
    """
    parts = ["<context>"]
    parts.append("Use the following textbook content to answer the user's question:\n")

    for i, chunk in enumerate(chunks, 1):
        source = chunk.get("source", "Unknown")
        title = chunk.get("title", "")
        content = chunk.get("content", "")
        module = chunk.get("module", "")

        parts.append(f"--- Source {i}: {title} ({module}) ---")
        parts.append(f"File: {source}")
        parts.append(content)
        parts.append("")

    parts.append("</context>")

    return "\n".join(parts)


def build_chat_messages(
    user_message: str,
    system_prompt: str,
    chat_history: Optional[list[dict]] = None,
) -> list[dict]:
    """
    Build the messages array for chat completion (currently used for reference).

    Args:
        user_message: The current user message.
        system_prompt: The system prompt with context.
        chat_history: Optional list of previous messages.

    Returns:
        List of message dictionaries (for future chat history support).
    """
    messages = [{"role": "system", "content": system_prompt}]

    # Add chat history if provided (last 10 messages to keep context manageable)
    if chat_history:
        for msg in chat_history[-10:]:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", ""),
            })

    # Add current user message
    messages.append({"role": "user", "content": user_message})

    return messages
