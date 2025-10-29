# LuminYield — Intelligent Yield Optimization on Solana

An autonomous multi-agent system that optimizes your DeFi yield strategies across Solana. Get AI-powered recommendations for maximizing returns across Orca, Raydium, and other Solana protocols – fully decentralized and self-custodial.

## 🔥 The Problem

DeFi yield optimization on Solana is complex:

-   Dozens of protocols (Orca, Raydium, Jupiter) with constantly changing APYs require constant monitoring
-   Manual tracking across multiple platforms wastes valuable time for DeFi users
-   Hidden fees, impermanent loss, and protocol risks make comprehensive risk assessment challenging
-   Users often miss optimal yields or take unnecessary risks due to lack of automated analysis

---

## 💡 The Solution

LuminYield introduces an **autonomous multi-agent system** that automatically discovers, compares, and recommends optimal yield strategies on Solana.

**Think:** Autonomous financial advisors that understand DeFi protocols, real-time APYs, and risk assessment – all powered by Fetch.ai's uAgents.

Built for DeFi users, yield farmers, and anyone looking to maximize returns on Solana without manual research.

### **How It Works:**

1. 🗣️ **User asks yield question** via chat interface ("Best yield for SOL?")
2. 🧭 **Router Agent classifies** query and routes to appropriate agents
3. 📊 **Analyzer Agent fetches** real-time APYs from Orca, Raydium, Jupiter APIs
4. 🤖 **Strategy Agent reasons** using MeTTa to recommend optimal allocation
5. ✅ **Risk assessment included** with TVL, fees, and protocol safety flags
6. 💰 **Actionable recommendation** returned with reasoning chain

**Key Innovation:** Autonomous AI agents analyze cross-protocol yield data and provide personalized strategies based on your constraints.

---

## 🌟 Key Features

-   🤖 **Multi-Agent System** – 3 specialized uAgents collaborate to route, analyze, and recommend yield strategies
-   📊 **Real-Time Data** – Live APY fetching from Orca, Raydium, Jupiter, and other Solana protocols
-   🧩 **MeTTa Reasoning** – Transparent decision-making with structured logic chains
-   ✅ **Risk-Aware** – Automatic TVL, fee, and protocol risk assessment
-   🔗 **Chat Protocol** – ASI:One compatible interface for natural language queries

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15)                     │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Chat UI       │  │ uagent-client   │                  │
│  │                 │  │                 │                  │
│  │ • Yield Query   │  │ • Direct Agent  │                  │
│  │ • Live Results  │  │   Communication │                  │
│  │ • Strategy View │  │ • Chat Protocol │                  │
│  └─────────────────┘  └─────────────────┘                  │
└────────────────┬────────────────────────────────────────────┘
                 │ Chat Protocol
┌────────────────▼────────────────────────────────────────────┐
│              AGENT ORCHESTRATION LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Router Agent  │→ │Analyzer Agent│→ │Strategy      │      │
│  │  (Intent)    │  │  (APY Fetch) │  │Agent (MeTTa) │      │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘      │
│                           │                 │               │
│                           ▼                 ▼               │
│                  ┌──────────────────────────────────┐      │
│                  │   Solana DEX APIs                │      │
│                  │ Orca | Raydium | Jupiter         │      │
│                  └──────────────────────────────────┘      │
│                                                             │
│  Powered by: Fetch.ai uAgents + Agentverse + Chat Protocol│
└────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Category                | Technology                                         |
| ----------------------- | -------------------------------------------------- |
| **Agent Framework**     | Fetch.ai uAgents                                   |
| **Agent Discovery**     | Agentverse                                         |
| **Agent Communication** | Chat Protocol + uagent-client                      |
| **Reasoning**           | SingularityNET's MeTTa                             |
| **DeFi Data**           | Orca API, Raydium, Jupiter API                     |
| **Blockchain**          | Solana (RPC)                                       |
| **Frontend**            | Next.js 15, TypeScript, React 19, Tailwind, Shadcn |
| **State Management**    | Zustand, React Query                               |

## Agents & Addresses

-   LuminYield Router Agent: `agent1qtwtnak22nv2v4fary5yju4m0l3pny3xxqhldu3wfxu2umyghw6es2wsyfq`
-   LuminYield Analyzer Agent: `agent1qfkvecvpxw9vslza792mlwqrsl460d3n86dddvf9jpmqja6hs4xyqt9pzdp`
-   LuminYield Strategy Agent: `agent1q0qug02e3pg2gak5tlfw6xrslypqlhd4k5k8mqtedpfntd4zse9dj307ec3`

## 🚀 Getting Started

### **Prerequisites**

-   Python 3.10+
-   Node.js 18+

### **Installation**

```bash
# 1. Clone repository
git clone https://github.com/samueldanso/lumin-cypherpunk.git
cd lumin-cypherpunk

# 2. Install backend dependencies
cd agents
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Install frontend dependencies
cd ../frontend
npm install

4. Environment setup
 Create .env file in agents/ directory
```

### **Running the System**

```bash
# 1. Backend agents (run in separate terminals)
# Terminal 1: Router Agent
cd agents
source venv/bin/activate
python luminyield_router_agent.py

# Terminal 2: Analyzer Agent
python luminyield_analyzer_agent.py

# Terminal 3: Strategy Agent
python luminyield_strategy_agent.py

# 2. Frontend (new terminal)
cd frontend
npm run dev
```

**Visit:** `http://localhost:3000/chat` 🎉

## 🔄 User Flow

### **Example Yield Optimization Query:**

```
USER: "What's the best yield strategy for SOL-USDC on Solana?"
    ↓
[1. LUMINYIELD ROUTER AGENT]
    → Classifies as "yield optimization query"
    → Routes to Analyzer Agent
    ↓
[2. LUMINYIELD ANALYZER AGENT]
    → Fetches APYs from Orca API
    → Fetches APYs from Raydium API
    → Fetches APYs from Jupiter API
    → Normalizes and compares yields
    → Returns: "Orca: 8.5% APY, TVL: $50M | Raydium: 7.2% APY, TVL: $80M"
    ↓
[3. LUMINYIELD STRATEGY AGENT]
    → Receives yield comparison
    → Applies MeTTa reasoning for trade-offs
    → Considers TVL, fees, risk factors
    → Output: "Recommendation: Allocate to Orca (8.5% APY, lower TVL risk)"
    ↓
USER RECEIVES:
    ✅ Optimal yield strategy recommendation
    📊 Detailed APY comparison across protocols
    💰 Actionable allocation advice
    ⚠️ Risk assessment included
```

## 📊 Data Sources

-   **Orca API**: https://dev.orca.so/API/
-   **Jupiter API**: https://dev.jup.ag/api-reference
-   **Raydium**: Solana RPC queries
-   **Solana RPC**: https://docs.solana.com/api/http

## 🏆 Built at Colosseum Cypherpunk Hackathon 2025

**ASI Alliance Track Submission**

## 📄 License

This project is licensed under the **MIT License** — see the LICENSE file for details.

**Use it. Fork it. Build something amazing on it.** 🚀
