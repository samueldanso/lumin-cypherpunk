from typing import List

try:
    from hyperon import MeTTa  # type: ignore
    METTA_AVAILABLE = True
except Exception:
    MeTTa = object  # type: ignore
    METTA_AVAILABLE = False


class GeneralRAG:
    """Minimal helper to query MeTTa atoms for routes and allocation templates."""

    def __init__(self, metta: "MeTTa") -> None:
        self.metta = metta

    def query_supported_protocols(self, topic: str) -> List[str]:
        if not METTA_AVAILABLE:
            return []
        q = f"!(match &self (supports_pair $p {topic}) $p)"
        res = self.metta.run(q)
        return [str(r) for r in (res or [])]

    def query_routing(self, topic: str) -> List[str]:
        if not METTA_AVAILABLE:
            return []
        q = f"!(match &self (route {topic} $p) $p)"
        res = self.metta.run(q)
        return [str(r) for r in (res or [])]

    def query_alloc(self, risk: str) -> List[int]:
        if not METTA_AVAILABLE:
            return []
        q = f"!(match &self (== (alloc {risk}) (list $a $b $c)) ($a $b $c))"
        res = self.metta.run(q)
        if not res:
            return []
        parts = str(res[0]).replace("(", " ").replace(")", " ").split()
        out: List[int] = []
        for p in parts:
            try:
                out.append(int(p))
            except Exception:
                pass
        return out[:3]
