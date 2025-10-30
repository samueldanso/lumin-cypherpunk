# LuminYield Agents - Setup & Documentation

## Overview

LuminYield Agents is a 3-agent system for Solana DeFi yield optimization, built using the Fetch.ai uAgents framework and ASI Alliance stack.

**Key Innovation:** Agents focus purely on AI reasoning and yield analysis — all user interactions happen through the Chat Protocol for ASI:One compatibility.

---

## 🤖 Agent System

### **LuminYield Router Agent**

**Role:** Intent classification and intelligent routing for yield queries
**Address:** `agent1qtwtnak22nv2v4fary5yju4m0l3pny3xxqhldu3wfxu2umyghw6es2wsyfq`
**Tech:** uAgents + Chat Protocol

#### **Functionality:**

-   Classifies queries into: `yield_analysis`, `yield_comparison`, `strategy_recommendation`, `risk_assessment`
-   Routes to specialized agents based on intent
-   Coordinates multi-agent workflow
-   Returns formatted responses to the frontend

---

### **LuminYield Analyzer Agent**

**Role:** Discover and compare Solana yield opportunities
**Address:** `agent1qfkvecvpxw9vslza792mlwqrsl460d3n86dddvf9jpmqja6hs4xyqt9pzdp`
**Tech:** Jupiter API + Orca API + Solana RPC

#### **Functionality:**

-   Fetches APYs from Orca, Raydium, Jupiter, Kamino, Marginfi, Solend
-   Normalizes and ranks yields by net APY (fees considered)
-   Includes TVL/liquidity and risk assessments
-   Returns comparison data for the Strategy Agent

---

### **LuminYield Strategy Agent**

**Role:** Recommend optimal yield strategies with risk assessment
**Address:** `agent1q0qug02e3pg2gak5tlfw6xrslypqlhd4k5k8mqtedpfntd4zse9dj307ec3`
**Tech:** MeTTa reasoning + ASI:One API

#### **Functionality:**

-   Analyzes user constraints (amount, risk tolerance)
-   Generates MeTTa knowledge graphs for trade-offs
-   Provides strategy types: Conservative, Moderate, Aggressive
-   Outputs actionable recommendations with risk assessment

---

## 🔗 Agent Communication Flow

```
Frontend → Router Agent → Analyzer Agent → Strategy Agent → Response
```

**Data Flow:**

-   Stage 1 (Routing): Router classifies query → routes to appropriate agent
-   Stage 2 (Analysis): Analyzer fetches yield data from Solana protocols
-   Stage 3 (Strategy): Strategy generates MeTTa reasoning + recommendations
-   Stage 4 (Response): Router formats and returns result to the frontend

**Key Design:** Agents are pure AI reasoning — no persistent storage, all real-time data.

---

## 🚀 Quick Start

### **Prerequisites**

-   Python 3.10+
-   uAgents framework

### **Installation**

```bash
# Navigate to agents directory
cd agents

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### **Configuration**

Environment variables are configured in `.env`:

### **ASI API Key**

Set your ASI API Key in the `.env` file.

### **Running the Agents**

Start all 3 agents in **separate terminals**:

```bash
# Terminal 1: Router Agent
python luminyield_router_agent.py

# Terminal 2: Analyzer Agent
python luminyield_analyzer_agent.py

# Terminal 3: Strategy Agent
python luminyield_strategy_agent.py
```

Each agent will log its address and status on startup.

---

## 🔧 Configuration

### **Environment Variables**

```bash
# ASI API Key
ASI_ONE_API_KEY=your-key-here

# Agent Addresses (populated after deployment)
ROUTER_AGENT_ADDRESS=agent1qtwtnak22nv2v4fary5yju4m0l3pny3xxqhldu3wfxu2umyghw6es2wsyfq
ANALYZER_AGENT_ADDRESS=agent1qfkvecvpxw9vslza792mlwqrsl460d3n86dddvf9jpmqja6hs4xyqt9pzdp
STRATEGY_AGENT_ADDRESS=agent1q0qug02e3pg2gak5tlfw6xrslypqlhd4k5k8mqtedpfntd4zse9dj307ec3
```

---

## 🎯 Supported Queries

### **Yield Analysis**

-   "What's the best yield for SOL?"
-   "Show me current APYs on Solana"
-   "What yields are available for USDC?"

### **Yield Comparison**

-   "Compare Orca vs Raydium APYs"
-   "Which protocol has better SOL yields?"

### **Strategy Recommendation**

-   "Best strategy for $1000 USDC"
-   "Conservative yield strategy for SOL"
-   "Optimal allocation for $5000"

### **Risk Assessment**

-   "What are the risks of staking SOL?"
-   "Is Orca safe for yield farming?"

---

## 🔗 ASI Alliance Integration

### **Required Components**

-   ✅ **uAgents Framework**: All agents built with uAgents
-   ✅ **Chat Protocol**: ASI:One compatible communication
-   ✅ **Agentverse Registration**: Agents discoverable via mailbox
-   ✅ **MeTTa Integration**: Strategy reasoning with knowledge graphs

### **Chat Protocol Compliance**

-   Respond to `ChatMessage` format
-   Support `StartSessionContent` / `EndSessionContent`
-   Provide `MetadataContent` with capabilities
-   Follow ACK → Response → ACK pattern

---

## 📊 Demo Flow

### **Example Query: "Compare Orca vs Raydium APYs"**

```
USER → Router Agent (classifies as yield_comparison)
     → Analyzer Agent (fetches APY data from APIs)
     → Returns: "Orca: 8.5% APY, Raydium: 7.2% APY"
     → Router Agent (formats response)
     → USER (receives comparison)
```

### **Example Query: "Best strategy for $1000 USDC"**

```
USER → Router Agent (classifies as strategy_recommendation)
     → Analyzer Agent (gets yield data)
     → Strategy Agent (MeTTa reasoning + recommendation)
     → Returns: "Allocate 60% to Orca, 40% to Raydium with risk assessment"
     → Router Agent (formats response)
     → USER (receives strategy)
```

---

## 📝 Troubleshooting

### **Common Issues**

1. **"Agent mailbox not found"**

    - Normal warning — create mailbox via Inspector URL
    - Agents still work for local testing

2. **"Insufficient funds"**

    - Normal for testnet — agents work without Almanac registration
    - Registration is optional for local development

3. **Import errors**

    - Ensure virtual environment is activated
    - Run `pip install -r requirements.txt`

4. **Agent communication issues**
    - Verify agent addresses are correct
    - Check that all agents are running
    - Ensure ports don't conflict (9000, 9001, 9002)

---

## 📚 Agent Files

-   `luminyield_router_agent.py` - Router Agent implementation
-   `luminyield_analyzer_agent.py` - Analyzer Agent implementation
-   `luminyield_strategy_agent.py` - Strategy Agent implementation
-   `requirements.txt` - Python dependencies
-   `.env` - Environment configuration

## 🔗 References

-   [Official uAgent Creation Guide](https://innovationlab.fetch.ai/resources/docs/agent-creation/uagent-creation)
-   [uAgent Communication Patterns](https://innovationlab.fetch.ai/resources/docs/agent-communication/uagent-uagent-communication)
-   [ASI:One Compatible uAgents](https://innovationlab.fetch.ai/resources/docs/examples/chat-protocol/asi-compatible-uagents)
