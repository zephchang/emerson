import React, { useState, useEffect } from 'react';
import './App.css'; // Add this line to import the CSS
import { BookPanel } from './components/BookPanel';
import { ChatPanel } from './components/ChatPanel';
import { MinisPanel } from './components/MinisPanel';
import { AppContextProvider, useAppContext } from './context/AppContext';

function AppContent() {
  //note we need to do this nested structure because useAppContext needs to be able to find the Provider somewhere in the tree.
  const { mode, setMode } = useAppContext();

  //highlight state for lifted up for usage/consumption by chatPanel.tsx and highlight.tsx
  const [highlightText, setHighlightText] = useState<string>('');

  console.log(mode);
  return (
    <div className={`app flex flex-row`}>
      <BookPanel setHighlightText={setHighlightText} />
      <div className="right-panel w-1/3">
        {mode === 'chat' ? (
          <ChatPanel highlightText={highlightText} />
        ) : (
          <MinisPanel />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
