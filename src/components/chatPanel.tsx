import React, { useState } from 'react';

function ChatPanel({ highlightText }: { highlightText: string }) {
  return (
    <div className="chat-panel bg-blue-300 h-screen">
      <div>{highlightText}</div>
      <div className="chat-history bg-yellow-100">chat history</div>
      <div>user input</div>
    </div>
  );
}

export { ChatPanel };
