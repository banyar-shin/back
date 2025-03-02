from mongo import client

# Selecting Database
db = client["Tasks"]

# Selecting collection
collection = db["Tasks"]

# Inserting test data
data = {"_id":0, "name": "Anthony", "age": 300, "city": "Union City"}
collection.insert_one(data)



data_list = [
    {"_id":1, "name": "Bob", "age": 30, "city": "San Francisco"},
    {"_id":2, "name": "Charlie", "age": 28, "city": "Los Angeles"}
]

collection.insert_many(data_list)

client.close()