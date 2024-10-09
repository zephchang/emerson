import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { rehydrateHighlight, rehydrateContext } from '../utils/highlightUtils';

//TODO: remove all this highlightText lifted up variable stuff since we changed to SSOT db approach
function ChatPanel({ highlightText }: { highlightText: string }) {
  const { setMode } = useAppContext();
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
        setRehydratedText(
          await rehydrateContext('5ae86581-ef06-4cc9-bc3b-5284bab1cac9')
        );
      } catch (error) {
        console.log(error);
      }
    };
    loadHighlight();
  }, []);

  return (
    <div className="chat-panel bg-blue-300 h-full">
      <div>{rehydratedText}</div>
      <div className="chat-history bg-yellow-100">chat history</div>
      <div>user input</div>
    </div>
  );
}

export { ChatPanel };
