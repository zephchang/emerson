import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

function ChatPanel({ highlightText }: { highlightText: string }) {
  const { setMode } = useAppContext();
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

  return (
    <div className="chat-panel bg-blue-300 h-full">
      <div>{highlightText}</div>
      <div className="chat-history bg-yellow-100">chat history</div>
      <div>user input</div>
    </div>
  );
}

export { ChatPanel };
