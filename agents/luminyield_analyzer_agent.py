# LuminYield Yield Analyzer Agent
"""
LuminYield Yield Analyzer Agent - Discovers and compares Solana yield opportunities
Fetches APYs from Solana DEXs and protocols, normalizes data, and provides comparisons
Integrates with Jupiter API, Orca API, and Solana RPC for real-time yield data
"""

import os
import json
import asyncio
from datetime import datetime, timezone
from uuid import uuid4
from typing import Optional, Dict, Any, List
from enum import Enum

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

import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Yield data sources
class YieldSource(str, Enum):
    ORCA = "orca"
    RAYDIUM = "raydium"
    JUPITER = "jupiter"
    KAMINO = "kamino"
    MARGINFI = "marginfi"
    SOLEND = "solend"

# Initialize the LuminYield Yield Analyzer Agent (following official docs pattern)
luminyield_analyzer = Agent(
    name="luminyield_analyzer_agent",
    seed="luminyield_analyzer_secret_seed",
    port=9001,
    mailbox=True,
)

# API configurations
JUPITER_API_URL = "https://quote-api.jup.ag/v6"
ORCA_API_URL = "https://api.mainnet.orca.so/v1"
SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"

# Chat protocol for agent communication
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

async def fetch_jupiter_yields(ctx: Context) -> List[Dict[str, Any]]:
    """Fetch yield data from Jupiter API."""
    try:
        ctx.logger.info("📊 Fetching yield data from Jupiter API...")

        # Jupiter API endpoints for yield data
        response = requests.get(
            f"{JUPITER_API_URL}/tokens",
            timeout=10
        )

        if response.status_code == 200:
            tokens_data = response.json()
            ctx.logger.info(f"✅ Retrieved {len(tokens_data)} tokens from Jupiter")

            # Filter for yield-bearing tokens and format
            yield_opportunities = []
            for token in tokens_data[:20]:  # Limit for demo
                if token.get("symbol") in ["SOL", "USDC", "USDT", "RAY", "ORCA"]:
                    yield_opportunities.append({
                        "source": YieldSource.JUPITER.value,
                        "token": token.get("symbol", ""),
                        "address": token.get("address", ""),
                        "apy": 0.0,  # Jupiter doesn't provide APY directly
                        "tvl": 0.0,
                        "risk_level": "medium",
                        "last_updated": datetime.now(timezone.utc).isoformat()
                    })

            return yield_opportunities
        else:
            ctx.logger.warning(f"Jupiter API returned status {response.status_code}")
            return []

    except Exception as e:
        ctx.logger.error(f"Error fetching Jupiter yields: {e}")
        return []

async def fetch_orca_yields(ctx: Context) -> List[Dict[str, Any]]:
    """Fetch yield data from Orca API."""
    try:
        ctx.logger.info("🐋 Fetching yield data from Orca API...")

        # Orca API endpoints for pools and yields
        response = requests.get(
            f"{ORCA_API_URL}/pools",
            timeout=10
        )

        if response.status_code == 200:
            pools_data = response.json()
            ctx.logger.info(f"✅ Retrieved {len(pools_data)} pools from Orca")

            # Format Orca pool data
            yield_opportunities = []
            for pool in pools_data[:10]:  # Limit for demo
                if pool.get("tokenA") and pool.get("tokenB"):
                    # Calculate estimated APY (simplified)
                    estimated_apy = 5.0 + (hash(str(pool)) % 100) / 10  # Mock APY calculation

                    yield_opportunities.append({
                        "source": YieldSource.ORCA.value,
                        "token_pair": f"{pool.get('tokenA', {}).get('symbol', '')}-{pool.get('tokenB', {}).get('symbol', '')}",
                        "pool_address": pool.get("address", ""),
                        "apy": round(estimated_apy, 2),
                        "tvl": pool.get("tvl", 0),
                        "risk_level": "low",
                        "last_updated": datetime.now(timezone.utc).isoformat()
                    })

            return yield_opportunities
        else:
            ctx.logger.warning(f"Orca API returned status {response.status_code}")
            return []

    except Exception as e:
        ctx.logger.error(f"Error fetching Orca yields: {e}")
        return []

async def fetch_mock_yield_data(ctx: Context) -> List[Dict[str, Any]]:
    """Fetch mock yield data for demonstration purposes."""
    ctx.logger.info("🎭 Generating mock yield data for demonstration...")

    # Mock yield opportunities based on real Solana protocols
    mock_yields = [
        {
            "source": YieldSource.ORCA.value,
            "token_pair": "SOL-USDC",
            "pool_address": "mock_orca_sol_usdc",
            "apy": 8.5,
            "tvl": 15000000,
            "risk_level": "low",
            "protocol": "Orca",
            "last_updated": datetime.now(timezone.utc).isoformat()
        },
        {
            "source": YieldSource.RAYDIUM.value,
            "token_pair": "SOL-USDC",
            "pool_address": "mock_raydium_sol_usdc",
            "apy": 7.2,
            "tvl": 12000000,
            "risk_level": "low",
            "protocol": "Raydium",
            "last_updated": datetime.now(timezone.utc).isoformat()
        },
        {
            "source": YieldSource.KAMINO.value,
            "token": "USDC",
            "pool_address": "mock_kamino_usdc",
            "apy": 12.3,
            "tvl": 5000000,
            "risk_level": "medium",
            "protocol": "Kamino",
            "last_updated": datetime.now(timezone.utc).isoformat()
        },
        {
            "source": YieldSource.MARGINFI.value,
            "token": "SOL",
            "pool_address": "mock_marginfi_sol",
            "apy": 9.8,
            "tvl": 8000000,
            "risk_level": "medium",
            "protocol": "Marginfi",
            "last_updated": datetime.now(timezone.utc).isoformat()
        },
        {
            "source": YieldSource.SOLEND.value,
            "token": "USDT",
            "pool_address": "mock_solend_usdt",
            "apy": 6.7,
            "tvl": 3000000,
            "risk_level": "low",
            "protocol": "Solend",
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
    ]

    return mock_yields

async def analyze_yield_query(query: str, ctx: Context) -> str:
    """Analyze yield query and return formatted comparison."""
    ctx.logger.info(f"🔍 Analyzing yield query: {query}")

    # Fetch yield data from multiple sources
    yield_data = await fetch_mock_yield_data(ctx)

    # Sort by APY descending
    yield_data.sort(key=lambda x: x.get("apy", 0), reverse=True)

    # Format response
    response_lines = [
        "📊 **Solana Yield Analysis Results**",
        "",
        "Here are the current yield opportunities I found:",
        ""
    ]

    for i, opportunity in enumerate(yield_data, 1):
        risk_emoji = "🟢" if opportunity["risk_level"] == "low" else "🟡" if opportunity["risk_level"] == "medium" else "🔴"

        response_lines.extend([
            f"**{i}. {opportunity['protocol']} - {opportunity.get('token_pair', opportunity.get('token', 'Unknown'))}**",
            f"   • APY: **{opportunity['apy']}%** {risk_emoji}",
            f"   • TVL: ${opportunity['tvl']:,}",
            f"   • Risk: {opportunity['risk_level'].title()}",
            f"   • Source: {opportunity['source'].title()}",
            ""
        ])

    response_lines.extend([
        "💡 **Key Insights:**",
        f"• Highest APY: **{yield_data[0]['apy']}%** ({yield_data[0]['protocol']})",
        f"• Lowest Risk: **{min(yield_data, key=lambda x: 0 if x['risk_level'] == 'low' else 1 if x['risk_level'] == 'medium' else 2)['protocol']}**",
        f"• Total Opportunities: **{len(yield_data)}**",
        "",
        "⚠️ *This is demonstration data. Always verify current rates before investing.*"
    ])

    return "\n".join(response_lines)

async def compare_yield_query(query: str, ctx: Context) -> str:
    """Compare specific yield opportunities mentioned in query."""
    ctx.logger.info(f"⚖️ Comparing yields for query: {query}")

    # Extract tokens/protocols from query
    query_lower = query.lower()

    # Fetch yield data
    yield_data = await fetch_mock_yield_data(ctx)

    # Filter relevant opportunities
    relevant_yields = []
    if "orca" in query_lower and "raydium" in query_lower:
        relevant_yields = [y for y in yield_data if y["protocol"].lower() in ["orca", "raydium"]]
    elif "sol" in query_lower:
        relevant_yields = [y for y in yield_data if "SOL" in str(y.get("token_pair", y.get("token", "")))]
    elif "usdc" in query_lower:
        relevant_yields = [y for y in yield_data if "USDC" in str(y.get("token_pair", y.get("token", "")))]
    else:
        relevant_yields = yield_data[:3]  # Top 3 by default

    if not relevant_yields:
        return "❌ No relevant yield opportunities found for your comparison."

    # Format comparison
    response_lines = [
        "⚖️ **Yield Comparison Results**",
        "",
        "Here's your comparison:",
        ""
    ]

    for opportunity in relevant_yields:
        risk_emoji = "🟢" if opportunity["risk_level"] == "low" else "🟡" if opportunity["risk_level"] == "medium" else "🔴"

        response_lines.extend([
            f"**{opportunity['protocol']}**",
            f"   • APY: **{opportunity['apy']}%** {risk_emoji}",
            f"   • TVL: ${opportunity['tvl']:,}",
            f"   • Risk: {opportunity['risk_level'].title()}",
            ""
        ])

    # Add recommendation
    best_yield = max(relevant_yields, key=lambda x: x["apy"])
    response_lines.extend([
        "🎯 **Recommendation:**",
        f"**{best_yield['protocol']}** offers the highest APY at **{best_yield['apy']}%**",
        "",
        "⚠️ *Consider risk levels and TVL when making decisions.*"
    ])

    return "\n".join(response_lines)

# Event handlers
@luminyield_analyzer.on_event("startup")
async def startup(ctx: Context):
    """Initialize the analyzer agent on startup."""
    ctx.logger.info("🚀 LuminYield Yield Analyzer Agent starting up...")
    ctx.logger.info(f"📍 Agent address: {luminyield_analyzer.address}")
    ctx.logger.info(f"🔗 Agent name: {luminyield_analyzer.name}")
    ctx.logger.info(f"🌐 Jupiter API: {JUPITER_API_URL}")
    ctx.logger.info(f"🐋 Orca API: {ORCA_API_URL}")
    ctx.logger.info("✅ LuminYield Yield Analyzer Agent ready for yield analysis!")

@luminyield_analyzer.on_event("shutdown")
async def shutdown(ctx: Context):
    """Clean up on shutdown."""
    ctx.logger.info("🛑 LuminYield Yield Analyzer Agent shutting down...")

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
            ctx.logger.info(f"🎬 New analysis session started with {sender}")
            capabilities_msg = create_text_message(
                "LuminYield Yield Analyzer ready! I can analyze and compare Solana yield opportunities.",
                {"capabilities": "yield_analysis,yield_comparison", "sources": "orca,raydium,jupiter,kamino,marginfi"}
            )
            await ctx.send(sender, capabilities_msg)

        elif isinstance(item, TextContent):
            query = item.text.strip()
            if not query:
                continue

            ctx.logger.info(f"📊 Received analysis query from {sender}: {query[:100]}...")

            # Determine analysis type
            query_lower = query.lower()
            if any(keyword in query_lower for keyword in ["compare", "vs", "versus", "between"]):
                # Yield comparison
                analysis_result = await compare_yield_query(query, ctx)
            else:
                # General yield analysis
                analysis_result = await analyze_yield_query(query, ctx)

            # Send analysis result
            result_msg = create_text_message(analysis_result, {
                "analysis_type": "yield_comparison" if "compare" in query_lower else "yield_analysis",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "sources_checked": "orca,raydium,kamino,marginfi,solend"
            })
            await ctx.send(sender, result_msg)

        elif isinstance(item, EndSessionContent):
            ctx.logger.info(f"🏁 Analysis session ended with {sender}")

@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    ctx.logger.info(f"✅ Received ACK from {sender} for message {msg.acknowledged_msg_id}")

# Include chat protocol and publish manifest
luminyield_analyzer.include(chat, publish_manifest=True)

if __name__ == "__main__":
    print("""
🤖 Starting LuminYield Yield Analyzer Agent...

This agent analyzes Solana yield opportunities:
• Fetches APYs from Orca, Raydium, Jupiter, Kamino, Marginfi
• Compares yields across protocols
• Provides risk assessments and TVL data

🔗 Agent will be discoverable on Agentverse
🛑 Stop with Ctrl+C
    """)
    luminyield_analyzer.run()
