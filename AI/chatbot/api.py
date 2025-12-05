# api.py
from fastapi import FastAPI
from pydantic import BaseModel
#import json
from langchain_core.messages import HumanMessage, AIMessage

# Import your existing chat function and tools_list
# Assuming the chat function and dependencies are available in the current environment
from chatbot import chat 
# from tools import tools_list

app = FastAPI()

# Define the structure of the incoming request body
class ChatRequest(BaseModel):
    user_input: str
    chat_history: list = [] # Expects a list of messages

@app.post("/chat")
def run_chat(request: ChatRequest):
    # Convert the received JSON history (list of dicts) back into LangChain message objects
    history_objects = []
    for msg in request.chat_history:
        # Assuming the history format is simplified {type: 'human/ai', content: 'text'}
        if msg.get('type') == 'human':
            history_objects.append(HumanMessage(content=msg['content']))
        elif msg.get('type') == 'ai':
            history_objects.append(AIMessage(content=msg['content']))

    # Call your core LangGraph chat function
    response_text = chat(request.user_input, history_objects)
    
    return {"response": response_text}

# To run this microservice:
# uvicorn api:app --host 127.0.0.1 --port 8000