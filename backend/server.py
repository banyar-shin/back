import uvicorn
import groqAI
import json
from fastapi import FastAPI, Request, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from pydantic import BaseModel
import speechGroq
from groqAI import genJSON, generate_reply
from jsonDB import jsonToDB, dbToJSON
import json
import os
import asyncio
from bson import ObjectId
from mongo import client

load_dotenv()
app = FastAPI()

# Enable CORS for all routes and origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
async def root():
    return "Hello World"
    

@app.post("/transcript/")
async def transcript(user_id: str = Form(...), file: UploadFile = File(...)):
    #Taking the file, turn speechGroq into a function, call the function to get the text
    #Save the audio file
    filed = f"temp_{file.filename}"
    with open(filed, "wb") as buffer:
        buffer.write(await file.read())

    #Call transcribe_audio function from speechGroq
    transcription_text = speechGroq.transcribe_audio(filed)
    #Delete temporary file
    os.remove(filed)

    # teststring = genJSON(transcription_text)
    file2 = f"json_{file.filename}"
    with open(file2, "wb") as buffer:
        for i in genJSON(transcription_text):
            buffer.write(i.encode('utf-8'))

    #Return text file features 
    return {
        "user_id": user_id,
        "filename": file.filename,
        "transcription": transcription_text
    }
    

@app.post("/audio/")
async def fromAudioToText(user_id:str = Form(...), file: UploadFile = File(...)):
    #Save the audio file
    delFiled = f"temp_{file.filename}"
    with open(delFiled, "wb") as buffer:
        buffer.write(await file.read())
    #Transcribe the audio to text
    transcription_text = speechGroq.transcribe_audio(delFiled)
    #Delete temp file 
    os.remove(delFiled)
    #Generate json from transcription_text
    jsonData = genJSON(transcription_text)
    #Store transcription_text and JSON data into MongoDB
    jsonToDB(jsonData, user_id)
    #Generates response based on json_data
    response_stream = generate_reply(json.dumps(jsonData))
    return StreamingResponse(response_stream, media_type="text/plain")

@app.post("/chat/")
async def chat(user_id:str = Form(...), user_input: str = Form(...)):
    jsonData = genJSON(user_input)
    jsonToDB(jsonData, user_id)

    response_stream = generate_reply(json.dumps(jsonData))
    return StreamingResponse(response_stream, media_type="text/plain")
    #return StreamingResponse(groqAI.genJSON("I have a project due next Friday (today is Saturday) where I need to create a chatbot that can help me plan out my schedule and keep me accountable for my work as I continue through the week."))

@app.post("/tasks/complete/")
async def mark_task_complete(user_id: str = Form(...), task_id: str = Form(...)):
    try:
        # Connect to MongoDB
        db = client.get_database("UserData")  # Replace with your actual database name
        collection = db[user_id]  # Replace with your actual collection name
        
        # Convert string ID to MongoDB ObjectId
        object_id = ObjectId(task_id)
        
        # Update the task status directly in MongoDB
        result = collection.update_one(
            {"_id": object_id},
            {"$set": {"status": "Complete"}}
        )
        
        if result.modified_count > 0:
            return {"success": True, "message": "Task marked as complete"}
        else:
            return {"success": False, "message": "Task not found or already marked as complete"}
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}

@app.get("/tasks/")
async def tasks(user_id: str):
    jsonDict = dbToJSON(user_id)
    jsonData = json.dumps(jsonDict)

    return jsonData

@app.get("/test/")
async def test():
    jsonData = genJSON("I have a project due next Friday (today is Saturday) where I need to create a chatbot that can help me plan out my schedule and keep me accountable for my work as I continue through the week.")
    return StreamingResponse(generate_reply(json.dumps(jsonData)), media_type="text/plain")
    # return StreamingResponse(generate_reply("""{
#   "tasks": [
#     {
#       "timestamp": "2025-03-02 14:35",
#       "description": "CS-122 Homework `",
#       "priority": "High",
#       "category": "School",
#       "due_date": "2025-03-03 14:35",
#       "status": "Incomplete"
#     },
#     {
#       "timestamp": "2025-03-02 14:35",
#       "description": "CS-122 Homework 1",
#       "priority": "High",
#       "category": "School",
#       "due_date": "2025-03-04 14:35",
#       "status": "Incomplete"
#     },
#     {
#       "timestamp": "2025-03-02 14:35",
#       "description": "CS-122 Homework 2",
#       "priority": "High",
#       "category": "School",
#       "due_date": "2025-03-05 14:35",
#       "status": "Incomplete"
#     }
#   ]
# }"""))

if __name__ == "__main__":
    # Check if running in development or production
    is_dev = os.environ.get('ENVIRONMENT', 'development') == 'development'
    
    # Get port from environment variable for production (Render sets this)
    port = int(os.environ.get('PORT', 5000))
    
    # Run with appropriate settings based on environment
    uvicorn.run(
        "server:app", 
        host="0.0.0.0",
        port=port,
        reload=is_dev,  # Only use hot reload in development
        reload_dirs=["./"] if is_dev else None
    )