from fastapi import FastAPI

app = FastAPI() 

#Every time we refresh. the array will become empty 
items = []

@app.get("/")
def root():
    return {"Hello": "World"}

#End point 
#Sed HHTP Post request to add new items
@app.post("/items")
def create_item(item: str):
    items.append(item)
    return items

#New End point
#View specific item in list 
@app.get("/items/{item_id}")
def get_item(item_id: it) -> str:
    #If item in list, return item 
    if item_id < len(items):
        return items[item_id]
    #If item is not in list, return error msg 
    else:
        raise HTTPException(status_code=404, detail=f"Item {item_id} not found")

#returns set number of items based on limit    
@app.get("/items")
def list_items(limit: int = 10):
    return items[0:limit]
    

