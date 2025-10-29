#!/usr/bin/env python3
"""
Test script to verify LuminYield agents can start up
This script tests agent initialization without running them
"""

import sys
import os

# Add agents directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_agent_imports():
    """Test that all agents can be imported successfully."""
    print("🧪 Testing LuminYield Agent Imports...")

    try:
        import luminyield_router_agent
        print("✅ Router Agent imports successfully")
    except Exception as e:
        print(f"❌ Router Agent import failed: {e}")
        return False

    try:
        import luminyield_analyzer_agent
        print("✅ Analyzer Agent imports successfully")
    except Exception as e:
        print(f"❌ Analyzer Agent import failed: {e}")
        return False

    try:
        import luminyield_strategy_agent
        print("✅ Strategy Agent imports successfully")
    except Exception as e:
        print(f"❌ Strategy Agent import failed: {e}")
        return False

    return True

def test_agent_initialization():
    """Test that agents can be initialized."""
    print("\n🔧 Testing Agent Initialization...")

    try:
        import luminyield_router_agent
        router = luminyield_router_agent.luminyield_router
        print(f"✅ Router Agent initialized: {router.name}")
        print(f"   Address: {router.address}")
    except Exception as e:
        print(f"❌ Router Agent initialization failed: {e}")
        return False

    try:
        import luminyield_analyzer_agent
        analyzer = luminyield_analyzer_agent.luminyield_analyzer
        print(f"✅ Analyzer Agent initialized: {analyzer.name}")
        print(f"   Address: {analyzer.address}")
    except Exception as e:
        print(f"❌ Analyzer Agent initialization failed: {e}")
        return False

    try:
        import luminyield_strategy_agent
        strategy = luminyield_strategy_agent.luminyield_strategy
        print(f"✅ Strategy Agent initialized: {strategy.name}")
        print(f"   Address: {strategy.address}")
    except Exception as e:
        print(f"❌ Strategy Agent initialization failed: {e}")
        return False

    return True

def main():
    """Run all tests."""
    print("🤖 LuminYield Agents Test Suite")
    print("=" * 50)

    # Test imports
    if not test_agent_imports():
        print("\n❌ Import tests failed!")
        return 1

    # Test initialization
    if not test_agent_initialization():
        print("\n❌ Initialization tests failed!")
        return 1

    print("\n🎉 All tests passed! Agents are ready to run.")
    print("\n📋 Next steps:")
    print("1. Start agents in separate terminals:")
    print("   Terminal 1: python luminyield_router_agent.py")
    print("   Terminal 2: python luminyield_analyzer_agent.py")
    print("   Terminal 3: python luminyield_strategy_agent.py")
    print("2. Note the agent addresses from startup logs")
    print("3. Update agent addresses in Router Agent configuration")
    print("4. Test agent communication")

    return 0

if __name__ == "__main__":
    sys.exit(main())
