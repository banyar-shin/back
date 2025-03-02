import uvicorn
import groqAI
from fastapi import FastAPI, Request, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from pydantic import BaseModel
import speechGroq
from groqAI import genJSON, generate_reply
from jsonDB import jsonToDB, dbToJSON
import json 
load_dotenv()
app = FastAPI()
import os 


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
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
    

@app.get("/audio/")
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
    tempJSONObj: dict 
    with open(jsonData, "r") as file:
        tempJSONObj = json.load(file)
    #Store transcription_text and JSON data into MongoDB
    jsonToDB(tempJSONObj, user_id)
    #Generates response based on json_data
    response_stream = generate_reply(jsonData)
    return StreamingResponse(response_stream, media_type="text/plain")

@app.get("/chat/")
async def chat(user_id:str = Form(...), user_input: str = Form(...)):
    jsonData = genJSON(user_input)
    extractedJSON = dbToJSON(user_id)

    response_stream = generate_reply(jsonData)
    return StreamingResponse(response_stream, media_type="text/plain")
    #return StreamingResponse(groqAI.genJSON("I have a project due next Friday (today is Saturday) where I need to create a chatbot that can help me plan out my schedule and keep me accountable for my work as I continue through the week."))


@app.get("/test/")
async def test():
    return StreamingResponse(generate_reply("""{
  "tasks": [
    {
      "timestamp": "2025-03-02 14:35",
      "description": "CS-122 Homework `",
      "priority": "High",
      "category": "School",
      "due_date": "2025-03-03 14:35",
      "status": "Incomplete"
    },
    {
      "timestamp": "2025-03-02 14:35",
      "description": "CS-122 Homework 1",
      "priority": "High",
      "category": "School",
      "due_date": "2025-03-04 14:35",
      "status": "Incomplete"
    },
    {
      "timestamp": "2025-03-02 14:35",
      "description": "CS-122 Homework 2",
      "priority": "High",
      "category": "School",
      "due_date": "2025-03-05 14:35",
      "status": "Incomplete"
    }
  ]
}"""))

if __name__ == "__main__":
    # Enable hot reload
    uvicorn.run(
        "server:app", host="127.0.0.1", port=5000, reload=True, reload_dirs=["./"]
    )