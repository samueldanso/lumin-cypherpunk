# LuminYield Strategy Agent
"""
LuminYield Strategy Agent - Recommends optimal yield strategies with risk assessment
Uses MeTTa reasoning for financial trade-offs and constraint optimization
Provides actionable strategies based on user preferences and risk tolerance
"""

import os
import json
from datetime import datetime, timezone
from uuid import uuid4
from typing import Optional, Dict, Any, List
from enum import Enum

# Optional MeTTa (hyperon) runtime; fall back if unavailable
try:
    from hyperon import MeTTa  # type: ignore
    HYPERON_AVAILABLE = True
except Exception:
    HYPERON_AVAILABLE = False

# No external MeTTa modules are imported for this project. We keep an inline
# optional Hyperon usage and otherwise fall back to ASI1/heuristics.

from uagents import Agent, Context, Protocol
from uagents_core.contrib.protocols.chat import (
    chat_protocol_spec,
    ChatMessage,
    ChatAcknowledgement,
    TextContent,
    MetadataContent,
    StartSessionContent,
    EndSessionContent,
)

import httpx
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ASI:One API configuration (supports multiple env var names)
ASI_ONE_API_KEY = (
    os.getenv("ASI1_API_KEY")
    or os.getenv("ASI_ONE_API_KEY")
    or os.getenv("ASI_ONE_KEY")
)
ASI_ONE_API_URL = os.getenv("ASI_ONE_API_URL", "https://api.asi1.ai/v1")

# Risk tolerance levels
class RiskTolerance(str, Enum):
    CONSERVATIVE = "conservative"  # Low risk, stable yields
    MODERATE = "moderate"         # Balanced risk/reward
    AGGRESSIVE = "aggressive"     # High risk, high reward

# Strategy types
class StrategyType(str, Enum):
    SINGLE_ASSET = "single_asset"      # Focus on one token
    DIVERSIFIED = "diversified"        # Spread across multiple protocols
    LADDERED = "laddered"             # Staggered investments
    DYNAMIC = "dynamic"               # Active rebalancing

# Initialize the LuminYield Strategy Agent (following official docs pattern)
luminyield_strategy = Agent(
    name="luminyield_strategy_agent",
    seed="luminyield_strategy_secret_seed",
    port=9002,
    mailbox=True,
)

# --- Helpers: ASI1 Mini chat completion (optional) ---
def _asi1_complete(ctx: Context, prompt: str) -> str:
    """Call ASI1 Mini chat completions when key is available; otherwise return empty string.

    This keeps reasoning explainability high without breaking if the key is missing.
    """
    try:
        if not ASI_ONE_API_KEY:
            return ""
        headers = {
            "Authorization": f"Bearer {ASI_ONE_API_KEY}",
            "Content-Type": "application/json",
        }
        body = {
            "model": "asi1-mini",
            "messages": [
                {"role": "system", "content": "You are a Solana DeFi strategist. Be concise and practical."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
        }
        resp = requests.post(f"{ASI_ONE_API_URL}/chat/completions", headers=headers, json=body, timeout=20)
        if resp.status_code == 200:
            data = resp.json()
            # OpenAI-compatible shape
            choice = (data.get("choices") or [{}])[0]
            msg = (choice.get("message") or {}).get("content")
            return msg or ""
        ctx.logger.warning(f"ASI1 response {resp.status_code}: {resp.text[:200]}")
        return ""
    except Exception as e:
        ctx.logger.error(f"ASI1 call failed: {e}")
        return ""

# No global MeTTa state required

# Standard Chat Protocol for ASI:One compatibility
chat = Protocol(spec=chat_protocol_spec)

# Helper functions
def create_text_message(text: str, metadata: Optional[Dict[str, str]] = None) -> ChatMessage:
    """Create a ChatMessage with TextContent."""
    content = [TextContent(type="text", text=text)]
    if metadata:
        content.append(MetadataContent(type="metadata", metadata=metadata))

    return ChatMessage(
        timestamp=datetime.now(timezone.utc),
        msg_id=uuid4(),
        content=content
    )

def extract_text_content(msg: ChatMessage) -> str:
    """Extract text from ChatMessage content."""
    for item in msg.content:
        if isinstance(item, TextContent):
            return item.text
    return ""


def _parse_amount_from_query(query: str) -> float:
    """Extract numeric amount (USD) from user query, best-effort."""
    try:
        import re
        m = re.search(r"\$?([0-9][0-9,]*)(?:\s*usd|\s*usdc|\s*dollars)?", query.lower())
        if not m:
            return 1000.0
        amt = m.group(1).replace(",", "")
        return float(amt)
    except Exception:
        return 1000.0


def _parse_risk_from_query(query: str) -> RiskTolerance:
    q = query.lower()
    if "conservative" in q or "low risk" in q:
        return RiskTolerance.CONSERVATIVE
    if "aggressive" in q or "high risk" in q:
        return RiskTolerance.AGGRESSIVE
    return RiskTolerance.MODERATE


def _allocate_by_risk(amount_usd: float, risk: RiskTolerance) -> List[Dict[str, Any]]:
    """Simple allocation heuristic across protocol buckets."""
    if risk == RiskTolerance.CONSERVATIVE:
        buckets = [
            ("Orca", 0.5),
            ("Raydium", 0.3),
            ("Solend", 0.2),
        ]
    elif risk == RiskTolerance.AGGRESSIVE:
        buckets = [
            ("Kamino", 0.4),
            ("Marginfi", 0.35),
            ("Orca", 0.25),
        ]
    else:
        buckets = [
            ("Orca", 0.4),
            ("Raydium", 0.3),
            ("Kamino", 0.3),
        ]
    plan = []
    for protocol, pct in buckets:
        plan.append({
            "protocol": protocol,
            "allocation_usd": round(amount_usd * pct, 2),
            "percentage": int(pct * 100),
        })
    return plan


def _format_strategy(plan: List[Dict[str, Any]], amount_usd: float, risk: RiskTolerance, rationale: str) -> str:
    lines = [
        "🎯 **Strategy Recommendation**",
        f"Amount: ${amount_usd:,.2f}",
        f"Risk: {risk.value.title()}",
        "",
        "Proposed allocation:",
    ]
    for p in plan:
        lines.append(f"• {p['protocol']}: ${p['allocation_usd']:,.2f} ({p['percentage']}%)")
    if rationale:
        lines.extend(["", "📝 Rationale (LLM):", rationale.strip()])
    lines.extend([
        "",
        "⚠️ Non-custodial, informational plan. Verify APYs and smart-contract risks.",
    ])
    return "\n".join(lines)

def extract_constraints(query: str) -> Dict[str, Any]:
    """Extract user constraints and preferences from query."""
    query_lower = query.lower()

    constraints = {
        "amount": None,
        "risk_tolerance": RiskTolerance.MODERATE,
        "time_horizon": "medium",
        "preferred_tokens": [],
        "min_apy": 0.0,
        "max_risk": "medium"
    }

    # Extract amount
    import re
    amount_patterns = [
        r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)',  # $1,000.00
        r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*dollars?',  # 1000 dollars
        r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*usdc?',  # 1000 USDC
    ]

    for pattern in amount_patterns:
        match = re.search(pattern, query_lower)
        if match:
            amount_str = match.group(1).replace(',', '')
            try:
                constraints["amount"] = float(amount_str)
                break
            except ValueError:
                continue

    # Extract risk tolerance
    if any(word in query_lower for word in ["conservative", "safe", "low risk", "stable"]):
        constraints["risk_tolerance"] = RiskTolerance.CONSERVATIVE
    elif any(word in query_lower for word in ["aggressive", "high risk", "risky", "maximum"]):
        constraints["risk_tolerance"] = RiskTolerance.AGGRESSIVE

    # Extract preferred tokens
    tokens = ["sol", "usdc", "usdt", "ray", "orca", "eth", "btc"]
    for token in tokens:
        if token in query_lower:
            constraints["preferred_tokens"].append(token.upper())

    # Extract minimum APY
    apy_pattern = r'(\d+(?:\.\d+)?)\s*%'
    apy_match = re.search(apy_pattern, query_lower)
    if apy_match:
        constraints["min_apy"] = float(apy_match.group(1))

    return constraints

async def generate_metta_reasoning(constraints: Dict[str, Any], ctx: Context) -> Dict[str, Any]:
    """Generate MeTTa reasoning for strategy optimization.

    Preference order:
    1) Hyperon MeTTa runtime if available (local, deterministic rules)
    2) ASI:One reasoning endpoint if API key present
    3) Heuristic fallback
    """
    try:
        amount = constraints.get("amount", "Not specified")
        risk = constraints['risk_tolerance'].value
        tokens = constraints['preferred_tokens']
        min_apy = constraints['min_apy']

        # 1) Local MeTTa runtime using our project MeTTa knowledge
        if HYPERON_AVAILABLE:
            try:
                from agents.metta.graph import initialize_yield_knowledge
                from agents.metta.rag import GeneralRAG
                from agents.metta.utils import (
                    classify_reasoning_type,
                    extract_key_concepts,
                    generate_reasoning_chain,
                )

                metta = MeTTa()
                initialize_yield_knowledge(metta)
                rag = GeneralRAG(metta)
                rtype = classify_reasoning_type(" ".join([str(amount), risk, *tokens]))
                concepts = extract_key_concepts(" ".join(tokens) or "SOL-USDC")
                chain = generate_reasoning_chain("", rtype, concepts, rag, None)
                return {
                    "reasoning_type": "metta",
                    "reasoning_chain": chain.get("reasoning_steps", []),
                    "confidence": chain.get("confidence", 0.8),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            except Exception as e:
                ctx.logger.warning(f"Project MeTTa reasoning failed: {e}")

        # 2) ASI:One reasoning endpoint
        if ASI_ONE_API_KEY:
            reasoning_prompt = f"""
Generate MeTTa knowledge graph reasoning for Solana DeFi yield optimization strategy.

Constraints:
- Amount: ${amount}
- Risk Tolerance: {risk}
- Preferred Tokens: {tokens}
- Minimum APY: {min_apy}%

Create a MeTTa-like reasoning chain: risk vs reward, diversification, protocol security, and constraints.
Return a compact JSON with steps.
"""

            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.post(
                    f"{ASI_ONE_API_URL}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {ASI_ONE_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "asi1-mini",
                        "messages": [
                            {"role": "system", "content": "Produce a compact JSON array of steps for MeTTa-like reasoning. No prose."},
                            {"role": "user", "content": reasoning_prompt},
                        ],
                        "temperature": 0.2,
                        "max_tokens": 400,
                    },
                )
            if response.status_code == 200:
                data = response.json()
                choice = (data.get("choices") or [{}])[0]
                content = ((choice.get("message") or {}).get("content") or "").strip()
                return {
                    "reasoning_type": "asi1",
                    "reasoning_chain": content,
                    "confidence": 0.8,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            ctx.logger.warning(f"ASI1 reasoning failed {response.status_code}")

        # 3) Heuristic fallback
        return generate_fallback_reasoning(constraints)

    except Exception as e:
        ctx.logger.error(f"Error generating MeTTa reasoning: {e}")
        return generate_fallback_reasoning(constraints)

def generate_fallback_reasoning(constraints: Dict[str, Any]) -> Dict[str, Any]:
    """Generate fallback reasoning when MeTTa is unavailable."""
    risk_level = constraints["risk_tolerance"]

    reasoning_steps = [
        {
            "step": 1,
            "concept": "Risk Assessment",
            "reasoning": f"User risk tolerance: {risk_level.value}",
            "confidence": 0.9
        },
        {
            "step": 2,
            "concept": "Asset Allocation",
            "reasoning": f"Recommended allocation based on {risk_level.value} risk profile",
            "confidence": 0.85
        },
        {
            "step": 3,
            "concept": "Protocol Selection",
            "reasoning": "Selecting protocols with appropriate risk/return profile",
            "confidence": 0.8
        }
    ]

    return {
        "reasoning_type": "fallback",
        "reasoning_chain": reasoning_steps,
        "confidence": 0.8,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

def generate_strategy_recommendation(constraints: Dict[str, Any], reasoning: Dict[str, Any]) -> str:
    """Generate strategy recommendation based on constraints and reasoning."""

    risk_level = constraints["risk_tolerance"]
    amount = constraints.get("amount", 1000)  # Default to $1000

    # Strategy templates based on risk tolerance
    strategies = {
        RiskTolerance.CONSERVATIVE: {
            "name": "Conservative Yield Strategy",
            "description": "Focus on stable, low-risk protocols",
            "allocations": [
                {"protocol": "Orca", "token": "SOL-USDC", "percentage": 40, "apy": 8.5, "risk": "low"},
                {"protocol": "Raydium", "token": "SOL-USDC", "percentage": 30, "apy": 7.2, "risk": "low"},
                {"protocol": "Solend", "token": "USDC", "percentage": 30, "apy": 6.7, "risk": "low"}
            ],
            "expected_apy": 7.5,
            "risk_score": "Low"
        },
        RiskTolerance.MODERATE: {
            "name": "Balanced Yield Strategy",
            "description": "Mix of stable and higher-yield protocols",
            "allocations": [
                {"protocol": "Kamino", "token": "USDC", "percentage": 40, "apy": 12.3, "risk": "medium"},
                {"protocol": "Orca", "token": "SOL-USDC", "percentage": 35, "apy": 8.5, "risk": "low"},
                {"protocol": "Marginfi", "token": "SOL", "percentage": 25, "apy": 9.8, "risk": "medium"}
            ],
            "expected_apy": 10.2,
            "risk_score": "Medium"
        },
        RiskTolerance.AGGRESSIVE: {
            "name": "High-Yield Strategy",
            "description": "Maximum yield with higher risk tolerance",
            "allocations": [
                {"protocol": "Kamino", "token": "USDC", "percentage": 50, "apy": 12.3, "risk": "medium"},
                {"protocol": "Marginfi", "token": "SOL", "percentage": 30, "apy": 9.8, "risk": "medium"},
                {"protocol": "Orca", "token": "RAY-USDC", "percentage": 20, "apy": 15.2, "risk": "high"}
            ],
            "expected_apy": 12.1,
            "risk_score": "High"
        }
    }

    strategy = strategies[risk_level]

    # Format recommendation
    response_lines = [
        f"🎯 **{strategy['name']}**",
        f"*{strategy['description']}*",
        "",
        f"💰 **Investment Amount:** ${amount:,.2f}",
        f"📈 **Expected APY:** {strategy['expected_apy']}%",
        f"⚠️ **Risk Level:** {strategy['risk_score']}",
        "",
        "**📊 Recommended Allocation:**",
        ""
    ]

    for allocation in strategy["allocations"]:
        allocation_amount = amount * (allocation["percentage"] / 100)
        risk_emoji = "🟢" if allocation["risk"] == "low" else "🟡" if allocation["risk"] == "medium" else "🔴"

        response_lines.extend([
            f"• **{allocation['protocol']}** ({allocation['percentage']}%)",
            f"  - Token: {allocation['token']}",
            f"  - Amount: ${allocation_amount:,.2f}",
            f"  - APY: {allocation['apy']}% {risk_emoji}",
            f"  - Risk: {allocation['risk'].title()}",
            ""
        ])

    # Add reasoning summary
    response_lines.extend([
        "🧠 **Strategy Reasoning:**",
        f"• Risk tolerance: {risk_level.value.title()}",
        f"• Diversification: {len(strategy['allocations'])} protocols",
        f"• Expected annual return: ${amount * (strategy['expected_apy'] / 100):,.2f}",
        "",
        "⚠️ **Important Disclaimers:**",
        "• Past performance doesn't guarantee future results",
        "• Always verify current APYs before investing",
        "• Consider impermanent loss in liquidity pools",
        "• Start with smaller amounts to test strategies"
    ])

    return "\n".join(response_lines)

async def analyze_strategy_query(query: str, ctx: Context) -> str:
    """Analyze strategy query and provide recommendation."""
    ctx.logger.info(f"🎯 Analyzing strategy query: {query}")

    # Extract constraints
    constraints = extract_constraints(query)
    ctx.logger.info(f"📋 Extracted constraints: {constraints}")

    # Generate MeTTa reasoning
    reasoning = await generate_metta_reasoning(constraints, ctx)
    ctx.logger.info(f"🧠 Generated reasoning: {reasoning['reasoning_type']}")

    # Generate strategy recommendation
    recommendation = generate_strategy_recommendation(constraints, reasoning)

    return recommendation

async def assess_risk_query(query: str, ctx: Context) -> str:
    """Assess risks for yield strategies."""
    ctx.logger.info(f"⚠️ Assessing risks for query: {query}")

    risk_assessment = """
⚠️ **Solana DeFi Risk Assessment**

**🔴 High Risk Factors:**
• **Smart Contract Risk**: Bugs or exploits in protocol code
• **Impermanent Loss**: Price divergence in liquidity pools
• **Liquidation Risk**: Position liquidation in lending protocols
• **Rug Pull Risk**: Malicious protocol operators

**🟡 Medium Risk Factors:**
• **Market Volatility**: Token price fluctuations
• **Liquidity Risk**: Difficulty exiting positions
• **Regulatory Risk**: Changing regulations
• **Technology Risk**: Solana network issues

**🟢 Low Risk Factors:**
• **Established Protocols**: Audited, battle-tested protocols
• **High TVL**: Large total value locked indicates trust
• **Stablecoin Pairs**: Less volatile than crypto pairs
• **Insurance**: Protocol insurance coverage

**🛡️ Risk Mitigation Strategies:**
• Diversify across multiple protocols
• Start with smaller amounts
• Use established protocols (Orca, Raydium)
• Monitor positions regularly
• Set stop-losses for volatile positions
• Keep emergency funds in stable assets

**📊 Risk Scoring:**
• **Low Risk**: 1-3 (Stablecoin lending, major DEX pools)
• **Medium Risk**: 4-6 (Mixed protocols, moderate leverage)
• **High Risk**: 7-10 (New protocols, high leverage, exotic tokens)

⚠️ *Always do your own research and never invest more than you can afford to lose.*
    """.strip()

    return risk_assessment

# Event handlers
@luminyield_strategy.on_event("startup")
async def startup(ctx: Context):
    """Initialize the strategy agent on startup."""
    ctx.logger.info("🚀 LuminYield Strategy Agent starting up...")
    ctx.logger.info(f"📍 Agent address: {luminyield_strategy.address}")
    ctx.logger.info(f"🔗 Agent name: {luminyield_strategy.name}")
    ctx.logger.info(f"🧠 MeTTa: {'available' if HYPERON_AVAILABLE else 'fallback'} | ASI1 key: {'present' if ASI_ONE_API_KEY else 'missing'}")
    ctx.logger.info("✅ LuminYield Strategy Agent ready for strategy recommendations!")

@luminyield_strategy.on_event("shutdown")
async def shutdown(ctx: Context):
    """Clean up on shutdown."""
    ctx.logger.info("🛑 LuminYield Strategy Agent shutting down...")

# Chat protocol handlers
@chat.on_message(ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages from Router Agent."""

    # Always send acknowledgment first
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.now(timezone.utc),
        acknowledged_msg_id=msg.msg_id
    ))

    # Process message content
    for item in msg.content:
        if isinstance(item, StartSessionContent):
            ctx.logger.info(f"🎬 New strategy session started with {sender}")
            capabilities_msg = create_text_message(
                "LuminYield Strategy Agent ready! I can recommend optimal yield strategies and assess risks.",
                {"capabilities": "strategy_recommendation,risk_assessment", "reasoning": "metta_fallback"}
            )
            await ctx.send(sender, capabilities_msg)

        elif isinstance(item, TextContent):
            query = item.text.strip()
            if not query:
                continue

            ctx.logger.info(f"🎯 Received strategy query from {sender}: {query[:100]}...")

            # Determine query type
            query_lower = query.lower()
            if any(keyword in query_lower for keyword in ["risk", "safe", "dangerous", "secure", "risky"]):
                # Risk assessment
                assessment_result = await assess_risk_query(query, ctx)
            else:
                # Strategy recommendation
                assessment_result = await analyze_strategy_query(query, ctx)

            # Send strategy result
            result_msg = create_text_message(assessment_result, {
                "analysis_type": "risk_assessment" if "risk" in query_lower else "strategy_recommendation",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "reasoning_method": "metta" if ASI_ONE_API_KEY else "fallback"
            })
            await ctx.send(sender, result_msg)

        elif isinstance(item, EndSessionContent):
            ctx.logger.info(f"🏁 Strategy session ended with {sender}")

@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    ctx.logger.info(f"✅ Received ACK from {sender} for message {msg.acknowledged_msg_id}")

# Include chat protocol and publish manifest
luminyield_strategy.include(chat, publish_manifest=True)

if __name__ == "__main__":
    print("""
🤖 Starting LuminYield Strategy Agent...

This agent recommends yield strategies:
• Analyzes user constraints and risk tolerance
• Uses MeTTa reasoning for optimization
• Provides actionable allocation recommendations
• Assesses risks and mitigation strategies

🔗 Agent will be discoverable on Agentverse
🛑 Stop with Ctrl+C
    """)
    luminyield_strategy.run()
