# LuminYield MeTTa Integration

MeTTa (Hyperon) integration for structured reasoning in Solana DeFi yield optimization.

## Overview

This module provides MeTTa knowledge representation and query capabilities for LuminYield's Strategy Agent. It enables structured reasoning about protocol risks, supported pairs, TVL characteristics, and risk-based allocation strategies.

**Key Features:**

-   Protocol risk profiling (low/medium risk classification)
-   Pair-to-protocol routing knowledge
-   TVL bucket classification
-   Risk-based allocation templates (Conservative, Moderate, Aggressive)
-   MeTTa query interface for knowledge retrieval

---

## Installation

### **Optional Dependency**

MeTTa integration is **optional** - agents work without it using fallback logic. To enable full MeTTa reasoning:

```bash
pip install hyperon
```

### **Verify Installation**

```python
from metta import METTA_AVAILABLE
print(f"MeTTa available: {METTA_AVAILABLE}")
```

---

## Module Structure

### **`graph.py`** - Knowledge Graph Initialization

Seeds MeTTa with Solana DeFi yield knowledge specific to LuminYield.

**Knowledge Relations:**

-   `(protocol <name> <risk>)` - Protocol risk profile (low/medium/high)
-   `(supports_pair <name> <pair>)` - Protocol pair support
-   `(tvl_hint <name> <bucket>)` - TVL classification (low/mid/high)
-   `(== (alloc RISK_TYPE) (list pct1 pct2 pct3))` - Allocation templates
-   `(route <pair_or_token> <protocol>)` - Routing hints

**Example:**

```python
from hyperon import MeTTa
from metta.graph import initialize_yield_knowledge

metta = MeTTa()
initialize_yield_knowledge(metta)
```

---

### **`rag.py`** - MeTTa Query Interface

Provides a simple RAG (Retrieval Augmented Generation) interface to query MeTTa knowledge.

**Methods:**

```python
from metta import GeneralRAG

rag = GeneralRAG(metta)

# Query protocols supporting a specific pair
protocols = rag.query_supported_protocols("SOL-USDC")
# Returns: ['Orca', 'Raydium']

# Query routing suggestions for a pair/token
routes = rag.query_routing("SOL-USDC")
# Returns: ['Orca', 'Raydium']

# Get allocation percentages for a risk profile
alloc = rag.query_alloc("MODERATE")
# Returns: [40, 30, 30]
```

---

### **`utils.py`** - Reasoning Utilities

Helper functions for query classification and reasoning chain generation.

**Functions:**

```python
from metta import (
    classify_reasoning_type,
    extract_key_concepts,
    generate_reasoning_chain
)

# Classify the type of reasoning needed
reasoning_type = classify_reasoning_type("What are the risks?")
# Returns: "risk"

# Extract key concepts from query
concepts = extract_key_concepts("best yield for SOL-USDC")
# Returns: ['SOL-USDC']

# Generate a reasoning chain
chain = generate_reasoning_chain(
    query="best yield for SOL-USDC",
    reasoning_type="comparison",
    concepts=['SOL-USDC'],
    rag=rag,
    context=None
)
```

---

## Usage Example

### **Complete Strategy Reasoning Flow**

```python
from hyperon import MeTTa
from metta import (
    initialize_yield_knowledge,
    GeneralRAG,
    classify_reasoning_type,
    extract_key_concepts,
    generate_reasoning_chain
)

# Initialize MeTTa knowledge
metta = MeTTa()
initialize_yield_knowledge(metta)

# Create RAG interface
rag = GeneralRAG(metta)

# Process a user query
query = "Best strategy for $1000 USDC"

reasoning_type = classify_reasoning_type(query)  # "strategy"
concepts = extract_key_concepts(query)          # ['USDC']

# Get supported protocols
protocols = rag.query_supported_protocols("USDC")  # ['Kamino', 'Solend']

# Get allocation template
alloc = rag.query_alloc("MODERATE")  # [40, 30, 30]

# Generate reasoning chain
reasoning = generate_reasoning_chain(
    query=query,
    reasoning_type=reasoning_type,
    concepts=concepts,
    rag=rag,
    context=None
)

print(reasoning)
# {
#     "reasoning_type": "strategy",
#     "reasoning_steps": [
#         {"step": 1, "concept": "topic=USDC", "confidence": 0.9},
#         {"step": 2, "concept": "routes=['Kamino', 'Solend']", "confidence": 0.8},
#         {"step": 3, "concept": "alloc=[40, 30, 30]", "confidence": 0.8}
#     ],
#     "confidence": 0.8
# }
```

---

## Knowledge Base

### **Protocol Risk Profiles**

| Protocol | Risk Level |
| -------- | ---------- |
| Orca     | Low        |
| Raydium  | Low        |
| Solend   | Low        |
| Marginfi | Medium     |
| Kamino   | Medium     |

### **TVL Classification**

| Protocol | TVL Bucket |
| -------- | ---------- |
| Orca     | High       |
| Raydium  | High       |
| Solend   | Mid        |
| Marginfi | Mid        |
| Kamino   | Mid        |

### **Supported Pairs**

-   **Orca**: SOL-USDC, RAY-USDC
-   **Raydium**: SOL-USDC
-   **Kamino**: USDC (lending)
-   **Marginfi**: SOL (lending)
-   **Solend**: USDC (lending)

### **Risk-Based Allocation Templates**

-   **CONSERVATIVE**: [50%, 30%, 20%] - Favor stable, low-risk protocols
-   **MODERATE**: [40%, 30%, 30%] - Balanced risk/reward
-   **AGGRESSIVE**: [25%, 35%, 40%] - Higher allocation to medium-risk, higher-yield protocols

---

## Fallback Behavior

When MeTTa is not installed (`METTA_AVAILABLE = False`):

-   `GeneralRAG` methods return empty lists `[]`
-   `query_alloc()` falls back to default `[40, 30, 30]`
-   `generate_reasoning_chain()` uses fallback logic with reduced confidence
-   Agents continue to function with basic reasoning

**Example:**

```python
# Without Hyperon installed
from metta import GeneralRAG, METTA_AVAILABLE

print(METTA_AVAILABLE)  # False

rag = GeneralRAG(None)
protocols = rag.query_supported_protocols("SOL-USDC")  # []
```

---

## Extension Guide

### **Adding New Protocols**

Edit `graph.py` to add new protocol knowledge:

```python
program = """
    ;; Add new protocol
    (protocol MyProtocol low)
    (tvl_hint MyProtocol high)
    (supports_pair MyProtocol SOL-USDC)
    (route SOL-USDC MyProtocol)
"""
```

### **Adding New Allocation Strategies**

```python
;; Add custom allocation template
(== (alloc CUSTOM) (list 60 25 15))
```

### **Custom Queries**

Extend `GeneralRAG` class with new query methods:

```python
def query_custom_logic(self, param: str) -> List[str]:
    q = f"!(match &self (custom_relation {param} $x) $x)"
    res = self.metta.run(q)
    return [str(r) for r in (res or [])]
```

---

## References

-   [Hyperon/MeTTa Documentation](https://github.com/trueagi-io/hyperon-experimental)
-   [MeTTa Knowledge Representation](https://github.com/trueagi-io/hyperon-experimental/tree/main/python/metta)
-   [ASI Alliance MeTTa Integration](https://innovationlab.fetch.ai/resources/docs/examples/asione/asi-defi-ai-agent)

---

## Notes

-   MeTTa integration is **optional** - agents work without it
-   Knowledge base is static (hardcoded in `graph.py`)
-   For dynamic knowledge updates, consider integrating with external knowledge sources
-   Production deployment should cache MeTTa instances to avoid re-initialization overhead
