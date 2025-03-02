import pymongo
from pymongo import MongoClient

cluster = MongoClient("mongodb+srv://Klam5:MJrInQHo6g2DNurH@back.w1mtm.mongodb.net/")
db = cluster["Tests"]
collection = db["Tests"]

