from mongo import client

# Selecting Database
db = client["Tasks"]

# Selecting collection
collection = db["Tasks"]

# Deleting one piece of data
collection.delete_one({"_id":1})
