#!/bin/bash
# LuminYield Agents - Start Script
# This script starts all 3 agents in the background

echo "🚀 Starting LuminYield Agents..."

# Navigate to agents directory
cd /home/samuel/Code/hack/lumin-cypherpunk/agents

# Activate virtual environment
source venv/bin/activate

# Function to start agent in background
start_agent() {
    local agent_name=$1
    local script_name=$2
    local port=$3

    echo "Starting $agent_name on port $port..."
    nohup python $script_name > logs/${agent_name}.log 2>&1 &
    echo $! > logs/${agent_name}.pid
    echo "✅ $agent_name started (PID: $(cat logs/${agent_name}.pid))"
}

# Create logs directory
mkdir -p logs

# Start all agents
start_agent "Router" "luminyield_router_agent.py" "9000"
sleep 2

start_agent "Analyzer" "luminyield_analyzer_agent.py" "9001"
sleep 2

start_agent "Strategy" "luminyield_strategy_agent.py" "9002"
sleep 2

echo ""
echo "🎉 All LuminYield Agents started!"
echo ""
echo "📊 Agent Status:"
echo "• Router Agent:    http://localhost:9000"
echo "• Analyzer Agent:  http://localhost:9001"
echo "• Strategy Agent:  http://localhost:9002"
echo ""
echo "📋 Agent Addresses:"
echo "• Router:    agent1qtwtnak22nv2v4fary5yju4m0l3pny3xxqhldu3wfxu2umyghw6es2wsyfq"
echo "• Analyzer:  agent1qfkvecvpxw9vslza792mlwqrsl460d3n86dddvf9jpmqja6hs4xyqt9pzdp"
echo "• Strategy:  agent1q0qug02e3pg2gak5tlfw6xrslypqlhd4k5k8mqtedpfntd4zse9dj307ec3"
echo ""
echo "📝 Logs available in: logs/"
echo "🛑 To stop all agents: ./stop_agents.sh"
echo ""
echo "🔗 Frontend ready at: http://localhost:3000/chat"
