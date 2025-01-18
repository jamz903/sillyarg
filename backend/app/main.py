import os
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
from bson import ObjectId
import motor.motor_asyncio
from io import StringIO
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from bson import json_util


load_dotenv()
GEMINI_API_KEY = os.getenv("API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_schema": content.Schema(
    type = content.Type.OBJECT,
    enum = [],
    required = ["response"],
    properties = {
      "response": content.Schema(
        type = content.Type.ARRAY,
        items = content.Schema(
          type = content.Type.STRING,
        ),
      ),
    },
  ),
  "response_mime_type": "application/json",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
)

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/prompt")
async def get_prompt(name: str, scents: str, notes: str):
    # Assuming you have a function `prompt_model` that takes a scent and returns a response
    response = prompt_model(name, scents, notes)
    return {"message": response}

def prompt_model(name, scents, notes):
    chat_session = model.start_chat()
    prompt = "given these scents " + scents + " give me a list of top 5 most popular perfumes with the same " + notes + " notes, excluding " + name + ". return it to me in JSON format, with name, description, top notes, middle notes, base notes."
    response = chat_session.send_message(prompt)
    return response.to_dict()


# Load environment variables
load_dotenv()

# MongoDB connection
client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.get_database("fragrances")  # or whatever your database name is
collection = db.get_collection("products")  # collection for your products

@app.get("/all")
async def get_all_products():
    # Find all documents and convert to list
    cursor = collection.find({}, {'_id': 0})  # The {'_id': 0} excludes the _id field
    products = await cursor.to_list(length=None)
    return products