
import os 
from groq import Groq
from dotenv import load_dotenv

#Load environment variables from the .env file
load_dotenv()
#Initialize Groq Client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
)
#Specify the path to the audio file
filename = os.path.join(os.path.dirname(__file__),"..", "Cal State East Bay.m4a") 
#Opens the audio file that we have
with open(filename, "rb") as file:
    #Creates a transcription of the audio file 
    transcription = client.audio.transcriptions.create(
        #required audio file 
        file=(filename, file.read()),
        #required model to use for transcription
        model="distil-whisper-large-v3-en",
        #Provides context to improve transcription
        prompt="Specify context or spelling",
        response_format="json"
    )
    print(transcription.text)