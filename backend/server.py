import uvicorn
from fastapi import FastAPI, Request, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from pydantic import BaseModel
import speechGroq
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
        #Return text file features 
        return {
            "user_id": user_id,
            "filename": file.filename,
            "transcription": transcription_text
        }
    #Use the text and Kyle's function (Turn text into a structured data, put that in Database)

if __name__ == "__main__":
    # Enable hot reload
    uvicorn.run(
        "server:app", host="127.0.0.1", port=5000, reload=True, reload_dirs=["./"]
    )