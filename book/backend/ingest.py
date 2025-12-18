#!/usr/bin/env python3
"""
Physical AI Textbook - Content Ingestion Script

This script parses all MDX files in the book/docs/ directory,
chunks the content, generates embeddings, and uploads to Qdrant.

Usage:
    python ingest.py [--clear]

Options:
    --clear     Clear existing collection before indexing
"""
import os
import re
import sys
import hashlib
from pathlib import Path
from typing import Generator

import tiktoken
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from utils.qdrant_client import get_qdrant, COLLECTION_NAME


# Configuration
DOCS_DIR = Path(__file__).parent.parent / "docs"
CHUNK_SIZE = 1000  # tokens
CHUNK_OVERLAP = 200  # tokens
ENCODING_NAME = "cl100k_base"  # GPT-4 tokenizer


def get_tokenizer():
    """Get tiktoken tokenizer."""
    return tiktoken.get_encoding(ENCODING_NAME)


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """
    Parse YAML frontmatter from MDX content.

    Returns:
        Tuple of (metadata dict, body content)
    """
    frontmatter = {}
    body = content

    # Check for frontmatter delimiter
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            # Parse frontmatter
            fm_content = parts[1].strip()
            for line in fm_content.split("\n"):
                if ":" in line:
                    key, value = line.split(":", 1)
                    frontmatter[key.strip()] = value.strip().strip('"\'')
            body = parts[2]

    return frontmatter, body


def clean_mdx_content(content: str) -> str:
    """
    Clean MDX content for better chunking.

    Removes:
    - JSX imports
    - React components (but keeps content)
    - Mermaid diagrams (keeps as reference)
    - Excessive whitespace
    """
    # Remove import statements
    content = re.sub(r'^import\s+.*$', '', content, flags=re.MULTILINE)

    # Remove export statements
    content = re.sub(r'^export\s+.*$', '', content, flags=re.MULTILINE)

    # Convert Mermaid blocks to text description
    def mermaid_to_text(match):
        return f"[Diagram: {match.group(1)[:100]}...]" if len(match.group(1)) > 100 else f"[Diagram: {match.group(1)}]"

    content = re.sub(r'```mermaid\n(.*?)```', mermaid_to_text, content, flags=re.DOTALL)

    # Remove JSX self-closing tags
    content = re.sub(r'<\w+\s*/>', '', content)

    # Remove admonition markers but keep content
    content = re.sub(r':::\w+', '', content)
    content = re.sub(r':::', '', content)

    # Clean up multiple blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    return content.strip()


def chunk_text(
    text: str,
    chunk_size: int = CHUNK_SIZE,
    chunk_overlap: int = CHUNK_OVERLAP,
) -> Generator[str, None, None]:
    """
    Split text into overlapping chunks based on token count.

    Uses sentence boundaries when possible to create coherent chunks.
    """
    tokenizer = get_tokenizer()

    # Split into sentences (rough approximation)
    sentences = re.split(r'(?<=[.!?])\s+', text)

    current_chunk = []
    current_tokens = 0

    for sentence in sentences:
        sentence_tokens = len(tokenizer.encode(sentence))

        if current_tokens + sentence_tokens > chunk_size and current_chunk:
            # Yield current chunk
            chunk_text = " ".join(current_chunk)
            yield chunk_text

            # Keep overlap sentences
            overlap_tokens = 0
            overlap_sentences = []

            for s in reversed(current_chunk):
                s_tokens = len(tokenizer.encode(s))
                if overlap_tokens + s_tokens <= chunk_overlap:
                    overlap_sentences.insert(0, s)
                    overlap_tokens += s_tokens
                else:
                    break

            current_chunk = overlap_sentences
            current_tokens = overlap_tokens

        current_chunk.append(sentence)
        current_tokens += sentence_tokens

    # Yield final chunk
    if current_chunk:
        yield " ".join(current_chunk)


def process_mdx_file(file_path: Path) -> list[dict]:
    """
    Process a single MDX file into chunks.

    Returns:
        List of chunk dictionaries with content, source, module, title.
    """
    content = file_path.read_text(encoding="utf-8")

    # Parse frontmatter
    metadata, body = parse_frontmatter(content)

    # Clean content
    cleaned = clean_mdx_content(body)

    if not cleaned.strip():
        return []

    # Determine module from path
    module = "unknown"
    rel_path = file_path.relative_to(DOCS_DIR)
    parts = rel_path.parts
    if parts and parts[0].startswith("module-"):
        module = parts[0]

    # Get title
    title = metadata.get("title", file_path.stem)

    # Generate chunks
    chunks = []
    for i, chunk_content in enumerate(chunk_text(cleaned)):
        # Generate deterministic ID
        chunk_id = hashlib.md5(
            f"{file_path}:{i}:{chunk_content[:50]}".encode()
        ).hexdigest()

        chunks.append({
            "id": chunk_id,
            "content": chunk_content,
            "source": str(rel_path),
            "module": module,
            "title": title,
        })

    return chunks


def discover_mdx_files(docs_dir: Path) -> list[Path]:
    """Discover all MDX files in the docs directory."""
    return list(docs_dir.rglob("*.mdx"))


def main():
    """Main ingestion function."""
    import argparse

    parser = argparse.ArgumentParser(description="Ingest textbook content into Qdrant")
    parser.add_argument("--clear", action="store_true", help="Clear existing collection")
    args = parser.parse_args()

    print("=" * 60)
    print("Physical AI Textbook - Content Ingestion")
    print("=" * 60)

    # Initialize Qdrant
    print("\n1. Initializing Qdrant connection...")
    qdrant = get_qdrant()

    if args.clear:
        print("   Clearing existing collection...")
        qdrant.delete_all_chunks()

    # Initialize collection
    created = qdrant.init_collection()
    if created:
        print(f"   Created collection: {COLLECTION_NAME}")
    else:
        print(f"   Using existing collection: {COLLECTION_NAME}")

    # Discover MDX files
    print(f"\n2. Discovering MDX files in {DOCS_DIR}...")
    mdx_files = discover_mdx_files(DOCS_DIR)
    print(f"   Found {len(mdx_files)} MDX files")

    # Process files
    print("\n3. Processing and chunking content...")
    total_chunks = 0
    errors = []

    for file_path in mdx_files:
        try:
            chunks = process_mdx_file(file_path)
            rel_path = file_path.relative_to(DOCS_DIR)

            for chunk in chunks:
                qdrant.upsert_chunk(
                    chunk_id=chunk["id"],
                    content=chunk["content"],
                    source=chunk["source"],
                    module=chunk["module"],
                    title=chunk["title"],
                )

            print(f"   ✓ {rel_path}: {len(chunks)} chunks")
            total_chunks += len(chunks)

        except Exception as e:
            errors.append((file_path, str(e)))
            print(f"   ✗ {file_path.name}: {e}")

    # Summary
    print("\n" + "=" * 60)
    print("Ingestion Summary")
    print("=" * 60)
    print(f"Files processed: {len(mdx_files)}")
    print(f"Total chunks created: {total_chunks}")
    print(f"Errors: {len(errors)}")

    if errors:
        print("\nErrors:")
        for path, error in errors:
            print(f"  - {path.name}: {error}")

    # Collection info
    info = qdrant.get_collection_info()
    print(f"\nCollection status:")
    print(f"  - Name: {info['name']}")
    print(f"  - Vectors: {info['vectors_count']}")
    print(f"  - Status: {info['status']}")

    print("\n✓ Ingestion complete!")


if __name__ == "__main__":
    main()
