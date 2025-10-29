# LuminYield Agents Documentation

## Overview

LuminYield Agents is a 3-agent system for Solana DeFi yield optimization, built using the Fetch.ai uAgents framework and ASI Alliance stack. The system provides intelligent yield analysis, comparison, and strategy recommendations through autonomous AI agents.

**Key Innovation:** Agents focus purely on AI reasoning and yield analysis — all user interactions happen through the Chat Protocol for ASI:One compatibility.

---

## 🤖 Agent Architecture

### 1️⃣ **LuminYield Router Agent** (Coordinator)

**Role:** Intent classification and intelligent routing for yield queries
**Address:** `TBD` (will be populated after deployment)
**Communication:** Direct with frontend via uagent-client

#### **Functionality:**

The Router Agent serves as the central coordinator for all yield optimization queries. It receives user queries directly from the frontend using the `ChatMessage` structure from the Chat Protocol. Upon receiving a message, it classifies the query into categories:

-   `yield_analysis` → Route to Yield Analyzer Agent
-   `yield_comparison` → Route to Yield Analyzer Agent
-   `strategy_recommendation` → Route to Strategy Agent
-   `risk_assessment` → Route to Strategy Agent
-   `out_of_scope` → Reply with capabilities (hackathon scope)

After classification, it forwards the query to appropriate specialized agents and coordinates the multi-agent workflow.

---

### 2️⃣ **LuminYield Yield Analyzer Agent** (Data Gatherer)

**Role:** Discover and compare Solana yield opportunities
**Address:** `TBD` (will be populated after deployment)
**Tech:** Jupiter API + Orca API + Solana RPC

#### **Functionality:**

The Yield Analyzer Agent gathers comprehensive yield data from multiple Solana DeFi protocols:

**Data Sources:**

-   **Orca**: SOL-USDC pools, stablecoin pairs
-   **Raydium**: High-yield farming opportunities
-   **Jupiter**: Aggregated yield data
-   **Kamino**: Lending protocol yields
-   **Marginfi**: Margin trading yields
-   **Solend**: Traditional lending yields

**Analysis Capabilities:**

-   Fetch real-time APYs from multiple protocols
-   Normalize and rank yields by net APY (fees considered)
-   Include TVL/liquidity and risk assessments
-   Generate comparison tables for Strategy Agent

---

### 3️⃣ **LuminYield Strategy Agent** (MeTTa Reasoning)

**Role:** Recommend optimal yield strategies with risk assessment
**Address:** `TBD` (will be populated after deployment)
**Tech:** MeTTa reasoning + ASI:One API for financial trade-offs

#### **Functionality:**

The Strategy Agent provides intelligent strategy recommendations using MeTTa knowledge representation:

**Strategy Types:**

-   **Conservative**: Low-risk, stable yields (Orca, Raydium)
-   **Moderate**: Balanced risk/reward (Kamino, Marginfi)
-   **Aggressive**: High-yield strategies (exotic pairs, leverage)

**MeTTa Reasoning Process:**

1. Analyze user constraints (amount, risk tolerance, preferences)
2. Generate MeTTa knowledge graph for trade-offs
3. Apply constraint optimization algorithms
4. Output actionable allocation recommendations
5. Include risk assessment and mitigation strategies

---

## 🔗 Agent Communication Flow

```
User Query (Frontend)
    ↓ (uagent-client)
[LuminYield Router Agent]
    ↓ (agent-to-agent)
[Yield Analyzer Agent] → Fetches Solana yield data
    ↓
[Strategy Agent] → MeTTa reasoning + recommendations
    ↓ (uagent-client response)
Frontend → Display yield analysis and strategies
```

---

## 📦 Data Flow Summary

| Stage       | Agent    | Input                    | Output                           | Storage?                  |
| ----------- | -------- | ------------------------ | -------------------------------- | ------------------------- |
| 1. Routing  | Router   | User query               | Route decision                   | ❌ No                     |
| 2. Analysis | Analyzer | Query                    | Yield data + comparison          | ❌ No (fetches live data) |
| 3. Strategy | Strategy | Yield data + constraints | MeTTa reasoning + recommendation | ❌ No                     |
| 4. Response | Router   | Strategy result          | Formatted response               | ❌ No                     |

**Key Design:** Agents are pure AI reasoning — no persistent storage, all real-time data.

---

## 🚀 Running the Agents

### **Prerequisites:**

-   Python 3.10+
-   uAgents framework (`pip install uagents>=0.22.9`)
-   ASI:One API key (optional - agents work without it)

### **Installation:**

```bash
cd agents
pip install uagents requests python-dotenv
```

### **Configuration:**

```bash
# Copy environment template
cp .env.example .env

# Update with your values (optional)
# ASI_ONE_API_KEY=your-asi-api-key
```

### **Start Agents (Separate Terminals):**

```bash
# Terminal 1: Router Agent
cd agents
python luminyield_router_agent.py

# Terminal 2: Yield Analyzer Agent
python luminyield_analyzer_agent.py

# Terminal 3: Strategy Agent
python luminyield_strategy_agent.py
```

Each agent will log its address and status on startup. Update the agent addresses in the Router Agent configuration.

---

## 🔧 Agent Configuration

Agents use environment variables for configuration:

```bash
# Agent ports and seeds
ROUTER_PORT=9000
ANALYZER_PORT=9001
STRATEGY_PORT=9002

# Agent addresses for inter-agent communication
ANALYZER_AGENT_ADDRESS=agent1q...
STRATEGY_AGENT_ADDRESS=agent1q...

# Optional: ASI:One API for enhanced reasoning
ASI_ONE_API_KEY=your-key-here
```

---

## 🎯 Supported Query Types

### **Yield Analysis Queries:**

-   "What's the best yield for SOL?"
-   "Show me current APYs on Solana"
-   "What yields are available for USDC?"

### **Yield Comparison Queries:**

-   "Compare Orca vs Raydium APYs"
-   "Which protocol has better SOL yields?"
-   "Orca vs Kamino for USDC lending"

### **Strategy Recommendation Queries:**

-   "Best strategy for $1000 USDC"
-   "Conservative yield strategy for SOL"
-   "Optimal allocation for $5000"

### **Risk Assessment Queries:**

-   "What are the risks of staking SOL?"
-   "Is Orca safe for yield farming?"
-   "Risk assessment for Kamino lending"

---

## 🛡️ Risk Management

### **Built-in Risk Assessment:**

-   **Protocol Risk**: Audited vs unaudited protocols
-   **Liquidity Risk**: TVL and exit difficulty
-   **Market Risk**: Token volatility and correlation
-   **Smart Contract Risk**: Code quality and history

### **Risk Mitigation Strategies:**

-   Diversification across multiple protocols
-   Gradual position sizing
-   Regular monitoring recommendations
-   Emergency exit strategies

---

## 🔗 ASI Alliance Integration

### **Required Components:**

-   ✅ **uAgents Framework**: All agents built with uAgents
-   ✅ **Chat Protocol**: ASI:One compatible communication
-   ✅ **Agentverse Registration**: Agents discoverable via mailbox
-   ✅ **MeTTa Integration**: Strategy reasoning with knowledge graphs

### **ASI:One Compatibility:**

-   Agents respond to ChatMessage format
-   Support StartSessionContent/EndSessionContent
-   Provide MetadataContent with capabilities
-   Follow ACK → Response → ACK pattern

---

## 📊 Demo Queries

Try these queries with the LuminYield system:

1. **"What's the best yield for SOL?"**

    - Router → Analyzer → Yield comparison

2. **"Compare Orca vs Raydium APYs"**

    - Router → Analyzer → Detailed comparison

3. **"Best strategy for $1000 USDC"**

    - Router → Strategy → Allocation recommendation

4. **"What are the risks of staking SOL?"**
    - Router → Strategy → Risk assessment

---

## 🏆 Hackathon Submission

### **Required Badges:**

```markdown
![tag:innovationlab](https://img.shields.io/badge/innovationlab-3D8BD3)
![tag:hackathon](https://img.shields.io/badge/hackathon-5F43F1)
```

### **Key Features Demonstrated:**

-   ✅ Multi-agent coordination with uAgents
-   ✅ Chat Protocol for ASI:One compatibility
-   ✅ MeTTa reasoning for financial optimization
-   ✅ Real-time Solana DeFi data integration
-   ✅ Autonomous yield strategy recommendations

---

## 🚨 Important Notes

### **Demo Data:**

-   Current implementation uses mock yield data for demonstration
-   Real API integration requires production API keys
-   All disclaimers about financial advice apply

### **Production Considerations:**

-   Implement proper error handling for API failures
-   Add rate limiting for external API calls
-   Include comprehensive logging and monitoring
-   Add security measures for production deployment

---

## 📝 Next Steps

1. **Deploy Agents**: Start all 3 agents and note their addresses
2. **Update Configuration**: Update agent addresses in Router Agent
3. **Test Communication**: Verify agent-to-agent communication
4. **Frontend Integration**: Update frontend with Router Agent address
5. **Demo Preparation**: Test complete user flows

---

_"From Knowledge Capsules to Yield Capsules - Autonomous DeFi reasoning on Solana"_
