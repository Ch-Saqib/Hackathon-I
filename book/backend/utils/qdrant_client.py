from typing import Optional

from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, Filter, FieldCondition, MatchValue, PointStruct, VectorParams

from app.config import get_settings


settings = get_settings()


# Collection configuration
COLLECTION_NAME = "textbook_chunks"
EMBEDDING_MODEL = "text-embedding-004"  # Google Gemini embedding model via OpenAI-compatible API
EMBEDDING_DIMENSION = 768  # Gemini embedding dimension (768 for text-embedding-004)

# Google Gemini OpenAI-compatible endpoint
GEMINI_OPENAI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"


class QdrantWrapper:
    """Wrapper for Qdrant vector database operations."""

    def __init__(self) -> None:
        """Initialize Qdrant client connection."""
        self.client = QdrantClient(
            url=settings.qdrant_url,
            api_key=settings.qdrant_api_key,
        )
        # Initialize OpenAI client with Gemini OpenAI-compatible endpoint
        self.openai_client = OpenAI(
            api_key=settings.gemini_api_key,
            base_url=GEMINI_OPENAI_BASE_URL,
        )

    def init_collection(self) -> bool:
        """
        Ensure the textbook chunks collection exists and has the correct vector size,
        and that we have a payload index on the `module` field used for filtering.

        Returns:
            bool: True if collection was created or recreated, False if it already existed
                  with the correct configuration.
        """
        collections = self.client.get_collections().collections
        collection_names = [c.name for c in collections]

        # If collection doesn't exist, create it with the current embedding dimension
        if COLLECTION_NAME not in collection_names:
            self.client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=EMBEDDING_DIMENSION,
                    distance=Distance.COSINE,
                ),
            )

            # Ensure an index on the `module` payload field so that filtered searches
            # don't fail with "Index required but not found for \"module\"" errors.
            try:
                self.client.create_payload_index(
                    collection_name=COLLECTION_NAME,
                    field_name="module",
                    field_schema="keyword",
                )
            except Exception:
                # If index already exists or Qdrant version behaves differently, ignore.
                pass

            return True

        # If collection exists but has the wrong vector size (e.g., 1536 from old OpenAI embeddings),
        # recreate it so it matches the 768-dimension Gemini embeddings.
        info = self.client.get_collection(collection_name=COLLECTION_NAME)
        try:
            current_size = info.config.params.vectors.size  # type: ignore[attr-defined]
        except AttributeError:
            # Fallback for older qdrant-client versions
            current_size = (
                getattr(getattr(info, "config", None), "params", {})
                .get("vectors", {})
                .get("size")  # type: ignore[union-attr]
            )

        if current_size != EMBEDDING_DIMENSION:
            # This will drop existing points, which is expected when switching embedding models.
            self.client.recreate_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=EMBEDDING_DIMENSION,
                    distance=Distance.COSINE,
                ),
            )

            # Recreate the payload index on `module` after recreation.
            try:
                self.client.create_payload_index(
                    collection_name=COLLECTION_NAME,
                    field_name="module",
                    field_schema="keyword",
                )
            except Exception:
                pass

            return True

        # Collection exists with correct config; ensure payload index exists.
        try:
            self.client.create_payload_index(
                collection_name=COLLECTION_NAME,
                field_name="module",
                field_schema="keyword",
            )
        except Exception:
            # Ignore if index already exists or Qdrant version does not require this.
            pass

        return False

    def _get_embedding(self, text: str) -> list[float]:
        """
        Generate embedding for text using Google Gemini via OpenAI-compatible API.

        Args:
            text: The text to embed.

        Returns:
            List of floats representing the embedding vector.
        """
        response = self.openai_client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=text,
        )
        return response.data[0].embedding

    def search_similar(
        self,
        query: str,
        limit: int = 5,
        module_filter: Optional[str] = None,
    ) -> list[dict]:
        """
        Search for chunks similar to the query.

        Args:
            query: The search query text.
            limit: Maximum number of results to return.
            module_filter: Optional module name to filter results (e.g., "module-01-ros2").

        Returns:
            List of dictionaries containing chunk data and scores.
        """
        # Generate query embedding
        query_embedding = self._get_embedding(query)

        # Build filter if module specified
        search_filter = None
        if module_filter:
            search_filter = Filter(
                must=[
                    FieldCondition(
                        key="module",
                        match=MatchValue(value=module_filter),
                    )
                ]
            )

        # Search for similar chunks
        results = self.client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            limit=limit,
            query_filter=search_filter,
            with_payload=True,
        )

        # Format results
        chunks: list[dict] = []
        for result in results:
            chunks.append(
                {
                    "id": result.id,
                    "score": result.score,
                    "content": result.payload.get("content", ""),
                    "source": result.payload.get("source", ""),
                    "module": result.payload.get("module", ""),
                    "title": result.payload.get("title", ""),
                }
            )

        return chunks

    def upsert_chunk(
        self,
        chunk_id: str,
        content: str,
        source: str,
        module: str,
        title: str,
    ) -> None:
        """
        Insert or update a chunk in the collection.

        Args:
            chunk_id: Unique identifier for the chunk.
            content: The text content of the chunk.
            source: The source file path.
            module: The module name (e.g., "module-01-ros2").
            title: The document title.
        """
        embedding = self._get_embedding(content)

        self.client.upsert(
            collection_name=COLLECTION_NAME,
            points=[
                PointStruct(
                    id=chunk_id,
                    vector=embedding,
                    payload={
                        "content": content,
                        "source": source,
                        "module": module,
                        "title": title,
                    },
                )
            ],
        )

    def delete_all_chunks(self) -> None:
        """Delete all chunks from the collection (useful for re-indexing)."""
        self.client.delete_collection(collection_name=COLLECTION_NAME)
        self.init_collection()

    def get_collection_info(self) -> dict:
        """Get information about the collection."""
        try:
            info = self.client.get_collection(collection_name=COLLECTION_NAME)
            return {
                "name": COLLECTION_NAME,
                "vectors_count": info.vectors_count,
                "points_count": info.points_count,
                "status": info.status.value,
            }
        except Exception:
            return {
                "name": COLLECTION_NAME,
                "vectors_count": 0,
                "points_count": 0,
                "status": "not_found",
            }


# Singleton instance
_qdrant_wrapper: Optional[QdrantWrapper] = None


def get_qdrant() -> QdrantWrapper:
    """Get the singleton Qdrant wrapper instance."""
    global _qdrant_wrapper
    if _qdrant_wrapper is None:
        _qdrant_wrapper = QdrantWrapper()
    return _qdrant_wrapper


