#!/bin/bash
# LuminYield Agents - Stop Script
# This script stops all running agents

echo "🛑 Stopping LuminYield Agents..."

# Navigate to agents directory
cd /home/samuel/Code/hack/lumin-cypherpunk/agents

# Function to stop agent
stop_agent() {
    local agent_name=$1
    local pid_file="logs/${agent_name}.pid"

    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping $agent_name (PID: $pid)..."
            kill $pid
            rm "$pid_file"
            echo "✅ $agent_name stopped"
        else
            echo "⚠️  $agent_name not running"
            rm "$pid_file"
        fi
    else
        echo "⚠️  No PID file found for $agent_name"
    fi
}

# Stop all agents
stop_agent "Router"
stop_agent "Analyzer"
stop_agent "Strategy"

echo ""
echo "🎉 All LuminYield Agents stopped!"
echo ""
echo "📝 Logs preserved in: logs/"
