const API_BASE_URL = 'http://localhost:8000';

interface BookEntry {
  uuid: string;
  title: string;
  raw_text: string[];
  rewritten_text: string[];
}

export async function fetchEntry(book_uuid: string): Promise<BookEntry> {
  //so this function is called in the app, we take in string and textType and then we are going to call the python API
  const response = await fetch(`${API_BASE_URL}/api/books/${book_uuid}`); //We send off a URL that specifies our noun which is book_uuid and then our text_type to python. Python should return back list of strings
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
