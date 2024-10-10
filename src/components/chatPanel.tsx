import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { rehydrateHighlight, rehydrateContext } from '../utils/highlightUtils';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ?? '';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY ?? '';
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}
const supabase = createClient(supabaseUrl, supabaseKey);
//TODO: need to refactor supabase client into a hook maybe?

//TODO: remove all this highlightText lifted up variable stuff since we changed to SSOT db approach
function ChatPanel({ highlightText }: { highlightText: string }) {
  const { setMode, chatID } = useAppContext();
  const [rehydratedText, setRehydratedText] = useState<string>('');

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMode('minis');
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  useEffect(() => {
    //need to redo backend, so that this can be server-side state update instead of useEffect
    const loadHighlight = async () => {
      try {
        if (!chatID) return; //implicit error handling because mode will be chat and chatID will be null, let ChatPanel handle that error handling.
        setRehydratedText(await rehydrateHighlight(chatID));
        console.log(chatID);
      } catch (error) {
        console.log(error);
      }
    };
    loadHighlight();
  }, []);

  return (
    <div className="chat-panel h-screen flex flex-col p-4 bg-white">
      <div className="highlight bg-yellow-100 rounded-md p-4 text-sm max-h-[30vh] overflow-y-auto">
        {rehydratedText}
      </div>
      <div className="chat-history bg-white flex-grow overflow-y-auto text-sm p-4">
        {Array(50)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="chat-message">
              Test message {index + 1}
            </div>
          ))}
      </div>
      <div className="user-input flex flex-row bg-white p-3 border border-gray-200 rounded-md items-start">
        <textarea
          className="w-full border-0 rounded-md resize-none focus:outline-none text-sm"
          rows={4}
          placeholder="Send message..."
        />
        <button className="w-10 h-10 bg-neutral-300 text-white rounded-md">
          <strong>↑</strong>
        </button>
      </div>
    </div>
  );
}

export { ChatPanel };
