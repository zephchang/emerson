import React from 'react';
import './App.css'; // Add this line to import the CSS
import { BookPanel } from './components/bookPanel';
import { ChatPanel } from './components/chatPanel';

function App() {
  return (
    <div className="app flex flex-row">
      <div className="book-content flex flex-row w-2/3">
        <BookPanel />
      </div>
      <div className="chat-panel w-1/3  bg-yellow-100">
        <ChatPanel />
      </div>
    </div>
  );
}

export default App;
