from mongo import client
from server import transcript
from groqAI import genJSON

# Initialize the database
db = client["Tasks"]
# Select the collection
collection = db["Tasks"]

# Set file path as a variable for the transcript function
file_path = "Cal State East Bay.m4a"

transcription = transcript("0", file_path)
print(transcript)

# jsonStr = genJSON(transcription)
# print(jsonStr)



# Call server.transcript function
# Set transcript to a variable
# Call groqAI.genJSON function
# Print the result
# Insert the result into the database
# Close the database