try:
    from hyperon import MeTTa  # type: ignore
    METTA_AVAILABLE = True
except Exception:
    MeTTa = object  # type: ignore
    METTA_AVAILABLE = False


def initialize_yield_knowledge(metta: "MeTTa") -> None:
    """Seed MeTTa with Solana DeFi yield knowledge specific to LuminYield.

    Relations:
      (protocol <name> <risk>)
      (supports_pair <name> <pair>)
      (tvl_hint <name> <bucket>)  ; low|mid|high
      (== (alloc CONSERVATIVE|MODERATE|AGGRESSIVE) (list pct1 pct2 pct3))
      (route <pair_or_token> <protocol>)
    """
    if not METTA_AVAILABLE:
        return

    program = """
        ;; Protocol risk profiles
        (protocol Orca low)
        (protocol Raydium low)
        (protocol Solend low)
        (protocol Marginfi medium)
        (protocol Kamino medium)

        ;; TVL hints
        (tvl_hint Orca high)
        (tvl_hint Raydium high)
        (tvl_hint Solend mid)
        (tvl_hint Marginfi mid)
        (tvl_hint Kamino mid)

        ;; Supported pairs/tokens
        (supports_pair Orca SOL-USDC)
        (supports_pair Raydium SOL-USDC)
        (supports_pair Orca RAY-USDC)
        (supports_pair Kamino USDC)
        (supports_pair Marginfi SOL)
        (supports_pair Solend USDC)

        ;; Risk-based allocation templates
        (== (alloc CONSERVATIVE) (list 50 30 20))
        (== (alloc MODERATE)     (list 40 30 30))
        (== (alloc AGGRESSIVE)   (list 25 35 40))

        ;; Routing hints
        (route SOL-USDC Orca)
        (route SOL-USDC Raydium)
        (route RAY-USDC Orca)
        (route USDC Kamino)
        (route USDC Solend)
        (route SOL Marginfi)
    """
    metta.run(program)
