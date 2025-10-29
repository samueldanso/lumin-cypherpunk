# LuminYield Agents - Setup Guide

## 🚀 Quick Start

### 1. **Prerequisites**

-   Python 3.8+ (as per [official documentation](https://innovationlab.fetch.ai/resources/docs/agent-creation/uagent-creation))
-   Virtual environment (recommended)

### 2. **Installation**

```bash
# Navigate to agents directory
cd /home/samuel/Code/hack/lumin-cypherpunk/agents

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install uagents python-dotenv requests
```

### 3. **Environment Setup**

The `.env` file is already configured with:

-   Agent names, ports, and seeds
-   Agent addresses (populated from test)
-   API URLs for Solana protocols
-   Optional ASI:One API key (leave empty for now)

### 4. **Running the Agents**

**Start all 3 agents in separate terminals:**

```bash
# Terminal 1: Router Agent
cd /home/samuel/Code/hack/lumin-cypherpunk/agents
source venv/bin/activate
python luminyield_router_agent.py

# Terminal 2: Analyzer Agent
python luminyield_analyzer_agent.py

# Terminal 3: Strategy Agent
python luminyield_strategy_agent.py
```

### 5. **Agent Addresses**

-   **Router Agent**: `agent1qtwtnak22nv2v4fary5yju4m0l3pny3xxqhldu3wfxu2umyghw6es2wsyfq`
-   **Analyzer Agent**: `agent1qfkvecvpxw9vslza792mlwqrsl460d3n86dddvf9jpmqja6hs4xyqt9pzdp`
-   **Strategy Agent**: `agent1q0qug02e3pg2gak5tlfw6xrslypqlhd4k5k8mqtedpfntd4zse9dj307ec3`

## 🔧 Configuration

### **Required API Keys (Optional)**

The agents work without API keys, but for enhanced functionality:

1. **ASI:One API Key** (for enhanced reasoning):

    - Get from: https://agentverse.ai/
    - Add to `.env`: `ASI_ONE_API_KEY=your_key_here`

2. **Solana RPC** (for real data):
    - Default: `https://api.mainnet-beta.solana.com` (free)
    - Or use: Alchemy, QuickNode, etc.

### **Agent Communication**

Based on the [official uAgent communication docs](https://innovationlab.fetch.ai/resources/docs/agent-communication/uagent-uagent-communication), agents communicate using:

-   `ctx.send()` for one-way messages
-   `ctx.send_and_receive()` for request-response patterns
-   Chat Protocol for ASI:One compatibility

## 🧪 Testing

### **Test Agent Imports**

```bash
cd /home/samuel/Code/hack/lumin-cypherpunk/agents
source venv/bin/activate
python test_agents.py
```

### **Test Individual Agents**

```bash
# Test Router Agent (10 seconds)
timeout 10s python luminyield_router_agent.py

# Test Analyzer Agent (10 seconds)
timeout 10s python luminyield_analyzer_agent.py

# Test Strategy Agent (10 seconds)
timeout 10s python luminyield_strategy_agent.py
```

## 🔗 Agentverse Integration

### **Mailbox Setup**

1. Start the Router Agent
2. Open the Inspector URL from the logs:
    ```
    https://agentverse.ai/inspect/?uri=http%3A//127.0.0.1%3A9000&address=agent1qtwtnak22nv2v4fary5yju4m0l3pny3xxqhldu3wfxu2umyghw6es2wsyfq
    ```
3. Click "Connect" → "Mailbox"
4. Follow the setup wizard

### **Agent Discovery**

Once connected via mailbox, agents will be discoverable on Agentverse and can communicate with other agents in the ecosystem.

## 🎯 Supported Queries

### **Yield Analysis**

-   "What's the best yield for SOL?"
-   "Show me current APYs on Solana"
-   "What yields are available for USDC?"

### **Yield Comparison**

-   "Compare Orca vs Raydium APYs"
-   "Which protocol has better SOL yields?"
-   "Orca vs Kamino for USDC lending"

### **Strategy Recommendations**

-   "Best strategy for $1000 USDC"
-   "Conservative yield strategy for SOL"
-   "Optimal allocation for $5000"

### **Risk Assessment**

-   "What are the risks of staking SOL?"
-   "Is Orca safe for yield farming?"
-   "Risk assessment for Kamino lending"

## 🚨 Troubleshooting

### **Common Issues**

1. **"Agent mailbox not found"**

    - Normal warning - create mailbox via Inspector URL
    - Agents still work for local testing

2. **"Insufficient funds"**

    - Normal for testnet - agents work without Almanac registration
    - Registration is optional for local development

3. **Import errors**

    - Ensure virtual environment is activated
    - Run `pip install uagents python-dotenv requests`

4. **Agent communication issues**
    - Verify agent addresses are correct in Router Agent
    - Check that all agents are running
    - Ensure ports don't conflict (9000, 9001, 9002)

### **Debug Mode**

Add debug logging by setting environment variable:

```bash
export UAGENTS_DEBUG=1
python luminyield_router_agent.py
```

## 📚 References

-   [Official uAgent Creation Guide](https://innovationlab.fetch.ai/resources/docs/agent-creation/uagent-creation)
-   [uAgent Communication Patterns](https://innovationlab.fetch.ai/resources/docs/agent-communication/uagent-uagent-communication)
-   [ASI:One Compatible uAgents](https://innovationlab.fetch.ai/resources/docs/examples/chat-protocol/asi-compatible-uagents)

## 🎉 Success Indicators

When everything is working correctly, you should see:

-   ✅ All agents start without errors
-   ✅ Agent addresses logged correctly
-   ✅ Mailbox connection established
-   ✅ Chat Protocol manifest published
-   ✅ Frontend can communicate with Router Agent

The LuminYield system is now ready for the ASI Alliance hackathon! 🚀
