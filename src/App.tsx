import React, { useState } from 'react';
import './App.css'; // Add this line to import the CSS
import { BookPanel } from './components/bookPanel';
import { ChatPanel } from './components/chatPanel';
import { MinisPanel } from './components/minisPanel';
import { AppContextProvider, useAppContext } from './context/AppContext';

function AppContent() {
  //note we need to do this nested structure because useAppContext needs to be able to find the Provider somewhere in the tree.
  const { mode, setMode } = useAppContext();

  //highlight state for lifted up for usage/consumption by chatPanel.tsx and highlight.tsx
  const [highlightText, setHighlightText] = useState<string>('');

  console.log(mode);
  return (
    <div className={`app flex flex-row`}>
      <div
        className={
          mode === 'chat'
            ? 'chat-book flex flex-row w-2/3 h-screen overflow-y-auto items-start'
            : 'minis-book flex flex-row w-2/3 '
        }
      >
        <BookPanel setHighlightText={setHighlightText} />
      </div>
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
