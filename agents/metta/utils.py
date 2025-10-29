from typing import Dict, Any, List


def classify_reasoning_type(query: str) -> str:
    q = query.lower()
    if any(k in q for k in ["risk", "risky", "safe", "security"]):
        return "risk"
    if any(k in q for k in ["compare", "vs", "versus", "better"]):
        return "comparison"
    return "strategy"


def extract_key_concepts(query: str) -> List[str]:
    q = query.lower()
    out: List[str] = []
    for tok in ["sol-usdc", "sol", "usdc", "usdt", "ray", "orca"]:
        if tok in q:
            out.append(tok.upper())
    return out or ["SOL-USDC"]


def generate_reasoning_chain(
    query: str,
    reasoning_type: str,
    concepts: List[str],
    rag: Any | None,
    context: Any | None,
) -> Dict[str, Any]:
    topic = concepts[0]
    routes = rag.query_routing(topic) if rag else []
    alloc = rag.query_alloc("MODERATE") if rag else [40, 30, 30]

    steps: List[Dict[str, Any]] = [
        {"step": 1, "concept": f"topic={topic}", "confidence": 0.9},
        {"step": 2, "concept": f"routes={routes}", "confidence": 0.8},
        {"step": 3, "concept": f"alloc={alloc}", "confidence": 0.8},
    ]
    return {
        "reasoning_type": reasoning_type,
        "reasoning_steps": steps,
        "confidence": 0.8 if routes else 0.6,
    }
