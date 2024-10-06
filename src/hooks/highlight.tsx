import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export const useHighlight = () => {
  //initializes a highlight value to access, initiates a keydown listener to set highlight, gives you a button handler to set highlight,
  const [highlight, setHighlight] = useState('');
  const { mode, setMode } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 'l') {
        event.preventDefault();
        const selectedText = window.getSelection()?.toString() || '';
        setHighlight(selectedText);
        setMode('chat');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode]);

  const handleHighButton = () => {
    const selectedText = window.getSelection()?.toString() || '';
    setHighlight(selectedText);
    setMode('chat');
  };

  return { highlight, handleHighButton };
};
