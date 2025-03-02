from mongo import client
import json
import asyncio

# JSON to Data Base Async Function
async def jsonToDB(jsonObj: dict, userID: str):
    # Initialize the database
    db = client["UserData"]
    # Select the collection
    collection = db[userID]

    # Convert the structured plan into a list of dictionaries
    data_list = [
        {
            "timestamp": task["timestamp"],
            "description": task["description"],
            "priority": task["priority"],
            "category": task["category"],
            "due_date": task["due_date"],
            "status": task["status"]
        }
        # Loop through the tasks in the JSON object
        for index, task in enumerate(jsonObj["tasks"])
    ]

    # Print the result
    print(data_list)

    # Insert the data into the database
    collection.insert_many(data_list)
    print("Data inserted succesfully")


# Data Base to JSON Async Function
def dbToJSON(userID: str):
    # Initialize the database
    db = client["UserData"]
    # Select the collection
    collection = db[userID]

    # Get the data from the database
    data = collection.find()

    # Convert the data into a JSON object
    jsonObj = {
        "tasks": [
            {
                "timestamp": task["timestamp"],
                "description": task["description"],
                "priority": task["priority"],
                "category": task["category"],
                "due_date": task["due_date"],
                "status": task["status"]
            }
            # Loop through the tasks in the database
            for task in data
        ]
    }

    # Print the result
    print(jsonObj)

    print("Data extracted succesfully")

    # Return the JSON object
    return jsonObj

#====================================================================================================
# Taking user input
# decision = input("Do you want to perform JSON to Data Base (1) or Extract Data from Data Base (2): ")
# if decision == "1":
#     # Opening and loading file to be put into the database
#     with open("sample.json", "r") as file:
#         tempObj = json.load(file)
#     # Getting the userID
#     userIDString = input("Enter the userID to save data in: ")
#     # Running the jsonToDB function
#     asyncio.run(jsonToDB(tempObj, userIDString))
# elif decision == "2":
#     # Getting the userID
#     userIDString = input("Enter the userID to extract data from: ")
#     # Running the dbToJSON function
#     extractedJSON = asyncio.run(dbToJSON(userIDString))
#     # Writing the extracted JSON to a file
#     with open("extracted.json", "w") as file:
#         json.dump(extractedJSON, file, indent=4)
# else:
#     print("Invalid input")