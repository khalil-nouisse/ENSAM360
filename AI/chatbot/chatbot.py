import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage
from langchain.agents import create_agent  # <--- The modern import
from tools import tools_list

# Load environment variables
load_dotenv()

# Initialize the LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=1, # Added temperature
    # Set the key to be read from the environment variable GEMINI_API_KEY
    google_api_key=os.getenv("OPENAI_API_KEY") 
)
# --- SYSTEM PROMPT ---
# In LangGraph, we pass the system instructions simply as a string or modifier
SYSTEM_PROMPT = """You are a helpful location information assistant with access to a Neo4j database 
through backend APIs.

Your role is to help users find and learn about locations. You have access to these tools:
- **get_location_details**: Get detailed info about a specific location
- **find_nearby_locations**: Find locations near a reference location
- **search_locations_by_criteria**: Search by name or type (restaurants, parks, museums, etc.)
- **get_available_location_types**: See all location types in the database
- **get_principale_locations**: See all location types in the database   

Guidelines:
1. Use tools to fetch real data from the database - never make up location information
2. If a location name is ambiguous or not found, use search_locations_by_criteria to help clarify
3. Be conversational and friendly in your responses
4. Format lists and information clearly
5. If you get an error, explain it to the user and suggest alternatives
6. You can use multiple tools in sequence if needed (e.g., search then get details)
7.Try to format the result into clear text that the user will understand
Always base your responses on the actual data returned from the tools.

When presenting the result, use only plain text and do not apply any formatting such as bolding or italics."""

# --- CREATE AGENT (LangGraph) ---
# This replaces the old AgentExecutor and create_tool_calling_agent
agent_executor = create_agent(
    model=llm,
    tools=tools_list,
    system_prompt=SYSTEM_PROMPT # Inject system prompt here
)

def chat(user_input: str, history: list = None):
    """
    Main chat function using LangGraph with output refactoring for cleaner display.
    """
    if history is None:
        history = []
    
    try:
        # 1. Prepare the messages list
        messages = list(history)
        messages.append(HumanMessage(content=user_input))
        
        # 2. Invoke the graph
        response_state = agent_executor.invoke(
            {"messages": messages}
        )
        
        # 3. Extract the final response and clean it up
        final_message = response_state["messages"][-1]
        
        # Check if the content is a list of structured objects (common with Gemini)
        if isinstance(final_message.content, list):
            clean_text = ""
            for part in final_message.content:
                # We are only interested in parts where the type is 'text'
                if part.get('type') == 'text' and part.get('text'):
                    # Append the text, potentially adding a newline for separation
                    clean_text += part['text'] + "\n"
            
            # Use the cleaned text, stripping leading/trailing whitespace
            return clean_text.strip()

        # If the content is already a simple string (standard for some agent paths)
        return final_message.content
    
    except Exception as e:
        # Include the error details for better debugging if something fails
        return f"I encountered an error: {str(e)}. Please try rephrasing your question."


def main():
    """
    Interactive CLI for the chatbot
    """
    print("=" * 60)
    print("🗺️  Neo4j Location Chatbot (Powered by LangGraph)")
    print("=" * 60)
    print("Connected to your Neo4j database through backend API")
    print("Ask me about locations, find nearby places, or search by type!")
    print("\nType 'quit', 'exit', or 'bye' to end the conversation")
    print("=" * 60)
    print()
    
    conversation_history = []
    
    while True:
        try:
            # Get user input
            user_message = input("You: ").strip()
            
            if not user_message:
                continue
            
            # Check for exit commands
            if user_message.lower() in ['quit', 'exit', 'bye', 'q']:
                print("\n👋 Thanks for chatting! Goodbye!")
                break
            
            # Special commands
            if user_message.lower() in ['help', 'h']:
                print("\n📖 You can ask me things like:")
                print("  • What is [location name]?")
                print("  • What's near [location]?")
                print("  • Find restaurants")
                print("  • Search for parks")
                print("  • What types of locations are there?")
                print("  • Give me the principale locations")
                print()
                continue
            
            if user_message.lower() == 'clear':
                conversation_history = []
                print("\n🧹 Conversation history cleared!\n")
                continue
            
            # Get response from agent
            print()
            response = chat(user_message, conversation_history)
            
            # Display response
            print(f"\n🤖 Assistant:\n{response}\n")
            print("-" * 60)
            
            # Update conversation history
            conversation_history.append(HumanMessage(content=user_message))
            conversation_history.append(AIMessage(content=response))
            
            # Limit history to last 10 exchanges to manage context window
            if len(conversation_history) > 20:
                conversation_history = conversation_history[-20:]
        
        except KeyboardInterrupt:
            print("\n\n👋 Interrupted. Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {str(e)}\n")


if __name__ == "__main__":
    # Test API connection before starting
    print("Testing backend API connection...")
    # Note: Wrapping this in try/except to handle case where api_client might not exist in file structure yet
    try:
        from api_client import api_client
        test_result = api_client.get_all_locations()
        if "error" in test_result:
            print(f"⚠️  Warning: Could not connect to backend API")
            print(f"   Make sure your backend is running on {api_client.base_url}")
            print()
            response = input("Continue anyway? (y/n): ")
            if response.lower() != 'y':
                print("Exiting...")
                exit(1)
        else:
            print("✅ Backend API connected successfully!")
    except ImportError:
        print("⚠️  Warning: 'api_client' module not found. Skipping API test.")
    
    print()
    main()