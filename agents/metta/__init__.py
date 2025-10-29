"""LuminYield MeTTa (Hyperon) integration for Solana DeFi yield reasoning.

Optional: Works when Hyperon is installed; otherwise callers should fallback.
"""

from .graph import initialize_yield_knowledge  # noqa: F401
from .rag import GeneralRAG  # noqa: F401
from .utils import (  # noqa: F401
    classify_reasoning_type,
    extract_key_concepts,
    generate_reasoning_chain,
)
