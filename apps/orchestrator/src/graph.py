from langgraph.graph import StateGraph, START, END
from src.state import SovereignState
from src.nodes.telemetry import fetch_telemetry
from src.nodes.reasoning import synthesize_directive

def build_graph():
    # Initialize the core graph based on our TypedDict
    builder = StateGraph(SovereignState)
    
    # Register the nodes
    builder.add_node("fetch_telemetry", fetch_telemetry)
    builder.add_node("synthesize_directive", synthesize_directive)
    
    # Define the DAG architecture
    builder.add_edge(START, "fetch_telemetry")
    builder.add_edge("fetch_telemetry", "synthesize_directive")
    builder.add_edge("synthesize_directive", END)
    
    # Compile the graph into an executable format
    graph = builder.compile()
    
    return graph
