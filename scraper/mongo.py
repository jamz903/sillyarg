
import json
import asyncio
import motor.motor_asyncio
import os
from dotenv import load_dotenv
import os


# Load environment variables from .env file
load_dotenv()

MONGODB_URL = os.getenv('MONGODB_URL')
DATABASE_NAME = 'fragrance_db'
COLLECTION_NAME ="products"

file_path ="product_data.json"

import json


# Connect to MongoDB
client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.get_database("fragrances")  # or whatever your database name is
collection = db.get_collection("products")  # collection for your products

# Load and insert the data
async def insert_json_data():
    with open("product_data.json", "r") as file:
        data = json.load(file)
    
    result = await collection.insert_many(data)
    print(f"Inserted {len(result.inserted_ids)} documents")

# Run the async function
import asyncio
asyncio.run(insert_json_data())