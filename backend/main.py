from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

current_dir = Path(__file__).resolve().parent
project_root = current_dir.parent
env_path = project_root / '.env'
load_dotenv(env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(supabase_url, supabase_key)

@app.get("/")
async def root():
    return {"message": "FastAPI is working wow this is pretty cool!"}


@app.get("/test_supabase")
async def test_supabase():
    try:
        # Attempt to fetch a single row from the 'books' table
        response = supabase.table("books").select("*").limit(1).execute()
        return {"message": "Supabase connection successful", "data": response.data}
    except Exception as e:
        return {"error": f"Supabase connection failed: {str(e)}"}

@app.get("/api/books/{book_uuid}")
async def fetch_entry(book_uuid: str): #So this is a RESTFUL API call. The expectation is that we are going to recieve a URL in this kind of hierarchical format where the different directories repersent some kind of request tree. And we can also have paramaters coming in as ? that are more like adjetives than nouns or categories. 
    response = supabase.table("books").select("*").eq("uuid",book_uuid).execute()

    if len(response.data) == 0:
        return {"error": "Entry not found"}

    return response.data[0]  #supabase returns the entire row for that book

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)