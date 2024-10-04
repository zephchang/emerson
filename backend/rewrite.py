import json
from supabase import create_client, Client
import raw_text
from dotenv  import load_dotenv
import os
from pathlib import Path
from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

#At some point should add railway so that we can run this remotely

client = OpenAI()

env_path = Path(__file__).parents[1] / 'keys.env'
load_dotenv(dotenv_path=env_path)

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(url, key)


# LOAD BOOK
def load_book(title, context, raw_text):
    
    for_supa = {
        "title": title,
        "context": context,
        "raw_text": split_prep(raw_text)
    }

    response = supabase.table('books').insert(for_supa).execute()

    if response.data:
        print("yay book inserted")
    else: 
        print(" oh no book not inserted supabase sad")

def split_prep(text):
    p_list = [p.strip() for p in text.split("\n") if p.strip()]
    return p_list


# REWRITE BOOK

@retry(stop=stop_after_attempt(5), 
       wait=wait_exponential(multiplier=1, min=4, max=10),
       after=lambda retry_state: print("Exception raised: retrying...") if retry_state.outcome.failed else None)
def rewrite_p(paragraph):
    translation = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": f"Please rewrite the following passage to make the language easier to understand for a modern reader. Give your answer delimited by ***. Format your response as: 'Rewrite — ***[put your rewrite here]***'\n\n passage: {paragraph}"}],
            max_tokens=4000)
    translation_content = translation.choices[0].message.content
    parts = translation_content.split('***')
    if len(parts) > 1:
        return parts[1]  # This is the text between the first pair of '***'
    else:
        return "No text found between the delimiters" 

def rewrite_content(content_uuid):
    response = supabase.table('books').select('uuid, title, raw_text').eq('uuid', content_uuid).execute()

    if not response.data:
        print("BOOK NOT FOUND - SUPABASE ERROR ")

    supa_content = response.data[0]
    
    raw_text = supa_content['raw_text']

    rewritten_text = []
    k = 1
    for p in raw_text:
        print("PROGRESS:",k,"/",len(raw_text))
        simplified_p = rewrite_p(p)
        rewritten_text.append(simplified_p)
        k+=1

    update_response = supabase.table('books').update({'rewritten_text': rewritten_text}).eq('uuid', content_uuid).execute()

    if update_response.data:
        print(f"Book with ID {content_uuid} succesfully updated with rewritten text")
    else: 
        print(f"Failed to update book. Error: {update_response}")

rewrite_content("1394e51a-93c1-46fd-85a6-47f1eea9af1e")
