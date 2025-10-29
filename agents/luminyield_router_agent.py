# LuminYield Router Agent
"""
LuminYield Router Agent - Central coordinator for yield optimization queries
Classifies yield-related queries and routes to appropriate specialized agents
Coordinates multi-agent workflow for Solana DeFi yield optimization
"""

import os
import json
from datetime import datetime, timezone
from uuid import uuid4, UUID
from typing import Optional, Dict, Any
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

# Yield query classification categories
class YieldQueryType(str, Enum):
    YIELD_ANALYSIS = "yield_analysis"  # "What's the best yield for SOL?"
    YIELD_COMPARISON = "yield_comparison"  # "Compare Orca vs Raydium APYs"
    STRATEGY_RECOMMENDATION = "strategy_recommendation"  # "Best strategy for $1000 USDC"
    RISK_ASSESSMENT = "risk_assessment"  # "What are the risks of staking SOL?"
    OUT_OF_SCOPE = "out_of_scope"  # Non-yield related queries

# Initialize the LuminYield Router Agent (following official docs pattern)
luminyield_router = Agent(
    name="luminyield_router_agent",
    seed="luminyield_router_secret_seed",
    port=9000,
    mailbox=True,
)

# Specialized agent addresses
ANALYZER_AGENT_ADDRESS = "agent1qfkvecvpxw9vslza792mlwqrsl460d3n86dddvf9jpmqja6hs4xyqt9pzdp"
STRATEGY_AGENT_ADDRESS = "agent1q0qug02e3pg2gak5tlfw6xrslypqlhd4k5k8mqtedpfntd4zse9dj307ec3"

# Chat protocol for agent communication
chat = Protocol(spec=chat_protocol_spec)

# Session tracking for multi-agent workflows
active_sessions: Dict[str, Dict[str, Any]] = {}

# Track which user is waiting for response from which agent
# Format: {specialized_agent_address: user_address}
agent_to_user_mapping: Dict[str, str] = {}

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

async def classify_yield_query(query: str, ctx: Context) -> YieldQueryType:
    """
    Classify yield-related query using ASI:One API.

    Categories:
    - yield_analysis: Direct yield questions ("What's the best yield for SOL?")
    - yield_comparison: Compare yields ("Compare Orca vs Raydium APYs")
    - strategy_recommendation: Strategy questions ("Best strategy for $1000 USDC")
    - risk_assessment: Risk questions ("What are the risks of staking SOL?")
    - out_of_scope: Non-yield related queries
    """
    if not ASI_ONE_API_KEY:
        ctx.logger.warning("ASI:One API key not configured, using fallback classification")
        return fallback_yield_classification(query)

    try:
        classification_prompt = f"""
Classify the following query into ONE of these categories for Solana DeFi yield optimization:

1. yield_analysis - Direct questions about yields, APYs, or staking returns
2. yield_comparison - Comparing yields between different protocols or tokens
3. strategy_recommendation - Questions about optimal strategies or allocations
4. risk_assessment - Questions about risks, safety, or security of yield strategies
5. out_of_scope - Questions not related to yield optimization or Solana DeFi

Query: {query}

Respond with ONLY the category name (yield_analysis, yield_comparison, strategy_recommendation, risk_assessment, or out_of_scope).
"""

        response = requests.post(
            f"{ASI_ONE_API_URL}/classify",
            headers={
                "Authorization": f"Bearer {ASI_ONE_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "prompt": classification_prompt,
                "temperature": 0.1,
                "max_tokens": 50
            },
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            classification = result.get("classification", "").strip().lower()

            # Map to YieldQueryType enum
            if classification in ["yield_analysis", "yield analysis"]:
                return YieldQueryType.YIELD_ANALYSIS
            elif classification in ["yield_comparison", "yield comparison"]:
                return YieldQueryType.YIELD_COMPARISON
            elif classification in ["strategy_recommendation", "strategy recommendation"]:
                return YieldQueryType.STRATEGY_RECOMMENDATION
            elif classification in ["risk_assessment", "risk assessment"]:
                return YieldQueryType.RISK_ASSESSMENT
            elif classification in ["out_of_scope", "out of scope"]:
                return YieldQueryType.OUT_OF_SCOPE

        ctx.logger.warning(f"ASI:One classification failed with status {response.status_code}, using fallback")
        return fallback_yield_classification(query)

    except Exception as e:
        ctx.logger.error(f"Error classifying query with ASI:One: {e}")
        return fallback_yield_classification(query)

def fallback_yield_classification(query: str) -> YieldQueryType:
    """Simple rule-based fallback classification for yield queries."""
    query_lower = query.lower()

    # Yield analysis keywords
    yield_keywords = ["yield", "apy", "apr", "return", "earn", "staking", "lending", "farming"]
    if any(keyword in query_lower for keyword in yield_keywords):
        # Check for comparison keywords
        if any(keyword in query_lower for keyword in ["compare", "vs", "versus", "between", "better"]):
            return YieldQueryType.YIELD_COMPARISON

        # Check for strategy keywords
        if any(keyword in query_lower for keyword in ["strategy", "best", "optimal", "recommend", "should"]):
            return YieldQueryType.STRATEGY_RECOMMENDATION

        # Check for risk keywords
        if any(keyword in query_lower for keyword in ["risk", "safe", "dangerous", "secure", "risky"]):
            return YieldQueryType.RISK_ASSESSMENT

        return YieldQueryType.YIELD_ANALYSIS

    # Out of scope - not yield related
    return YieldQueryType.OUT_OF_SCOPE


# Event handlers
@luminyield_router.on_event("startup")
async def startup(ctx: Context):
    """Initialize the router agent on startup."""
    ctx.logger.info("🚀 LuminYield Router Agent starting up...")
    ctx.logger.info(f"📍 Agent address: {luminyield_router.address}")
    ctx.logger.info(f"🔗 Agent name: {luminyield_router.name}")

    # Log configured agent addresses
    ctx.logger.info("🤖 Configured specialized agents:")
    ctx.logger.info(f"   • Analyzer Agent: {ANALYZER_AGENT_ADDRESS}")
    ctx.logger.info(f"   • Strategy Agent: {STRATEGY_AGENT_ADDRESS}")

    ctx.logger.info("✅ LuminYield Router Agent ready for yield optimization queries!")

@luminyield_router.on_event("shutdown")
async def shutdown(ctx: Context):
    """Clean up on shutdown."""
    ctx.logger.info("🛑 LuminYield Router Agent shutting down...")
    ctx.logger.info(f"📊 Active sessions: {len(active_sessions)}")
    ctx.logger.info(f"🔗 Agent mappings: {len(agent_to_user_mapping)}")

# Chat protocol handlers
@chat.on_message(ChatMessage)
async def handle_chat_message(ctx: Context, sender: str, msg: ChatMessage):
    """Handle incoming chat messages from users or other agents."""

    # Always send acknowledgment first
    await ctx.send(sender, ChatAcknowledgement(
        timestamp=datetime.now(timezone.utc),
        acknowledged_msg_id=msg.msg_id
    ))

    # Process message content
    for item in msg.content:
        if isinstance(item, StartSessionContent):
            ctx.logger.info(f"🎬 New session started with {sender}")
            # Advertise capabilities
            capabilities_msg = create_text_message(
                "Welcome to LuminYield! I can help you optimize yields on Solana DeFi. Ask me about yields, strategies, or risk assessment!",
                {"capabilities": "yield_optimization", "supported_queries": "yield_analysis,yield_comparison,strategy_recommendation,risk_assessment"}
            )
            await ctx.send(sender, capabilities_msg)

        elif isinstance(item, TextContent):
            query = item.text.strip()
            if not query:
                continue

            ctx.logger.info(f"📨 Received query from {sender}: {query[:100]}...")

            # Generate session ID
            session_id = str(uuid4())

            # Classify the query
            query_type = await classify_yield_query(query, ctx)
            ctx.logger.info(f"🏷️ Query classified as: {query_type.value}")

        elif isinstance(item, TextContent):
            # Handle text queries - this is the main functionality
            query = item.text
            ctx.logger.info(f"🔍 Processing query: {query[:100]}...")

            # Generate session ID for tracking
            session_id = str(uuid4())

            # Classify the query
            query_type = await classify_yield_query(query, ctx)
            ctx.logger.info(f"📋 Query classified as: {query_type.value}")

            # Create routing metadata
            routing_metadata = {
                "session_id": session_id,
                "query_type": query_type.value,
                "routed_by": "luminyield_router_agent",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }

            # Handle out-of-scope queries
            if query_type == YieldQueryType.OUT_OF_SCOPE:
                response_text = """
🚫 **Query Out of Scope**

I'm specialized in **Solana DeFi yield optimization** only. I can help with:

✅ **Yield Analysis**: "What's the best yield for SOL?"
✅ **Yield Comparison**: "Compare Orca vs Raydium APYs"
✅ **Strategy Recommendations**: "Best strategy for $1000 USDC"
✅ **Risk Assessment**: "What are the risks of staking SOL?"

Please ask about Solana DeFi yields, and I'll route your query to the appropriate specialist agent!
                """.strip()

                response_msg = create_text_message(response_text, routing_metadata)
                await ctx.send(sender, response_msg)
                return

            if query_type in [YieldQueryType.YIELD_ANALYSIS, YieldQueryType.YIELD_COMPARISON]:
                # Route to Yield Analyzer Agent
                ctx.logger.info(f"📊 Routing yield query to Analyzer Agent: {ANALYZER_AGENT_ADDRESS}")

                # Track this routing for response forwarding
                agent_to_user_mapping[ANALYZER_AGENT_ADDRESS] = sender

                # Store session info
                active_sessions[session_id] = {
                    "query": query,
                    "query_type": query_type.value,
                    "current_agent": "analyzer",
                    "user_address": sender,
                    "start_time": datetime.now(timezone.utc).isoformat()
                }

                # Forward query to Analyzer Agent
                query_msg = create_text_message(query, routing_metadata)
                await ctx.send(ANALYZER_AGENT_ADDRESS, query_msg)

            elif query_type in [YieldQueryType.STRATEGY_RECOMMENDATION, YieldQueryType.RISK_ASSESSMENT]:
                # Route to Strategy Agent
                ctx.logger.info(f"🎯 Routing strategy query to Strategy Agent: {STRATEGY_AGENT_ADDRESS}")

                # Track this routing for response forwarding
                agent_to_user_mapping[STRATEGY_AGENT_ADDRESS] = sender

                # Store session info
                active_sessions[session_id] = {
                    "query": query,
                    "query_type": query_type.value,
                    "current_agent": "strategy",
                    "user_address": sender,
                    "start_time": datetime.now(timezone.utc).isoformat()
                }

                # Forward query to Strategy Agent
                query_msg = create_text_message(query, routing_metadata)
                await ctx.send(STRATEGY_AGENT_ADDRESS, query_msg)

        elif isinstance(item, EndSessionContent):
            ctx.logger.info(f"🏁 Session ended with {sender}")
            # Clean up session data
            if sender in agent_to_user_mapping.values():
                # Remove any mappings for this user
                agent_to_user_mapping = {k: v for k, v in agent_to_user_mapping.items() if v != sender}

@chat.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    """Handle acknowledgements from other agents."""
    ctx.logger.info(f"✅ Received ACK from {sender} for message {msg.acknowledged_msg_id}")

# Include chat protocol and publish manifest
luminyield_router.include(chat, publish_manifest=True)

if __name__ == "__main__":
    print("""
🤖 Starting LuminYield Router Agent...

This agent coordinates yield optimization queries on Solana DeFi:
• Routes yield analysis queries to Analyzer Agent
• Routes strategy questions to Strategy Agent
• Handles out-of-scope queries gracefully

🔗 Agent will be discoverable on Agentverse
🛑 Stop with Ctrl+C
    """)
    luminyield_router.run()
