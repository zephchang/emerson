import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * Custom hook for handling text highlighting functionality.
 *
 * This hook provides:
 * 1. A state for storing the highlighted text
 * 2. A keyboard event listener for highlighting (Cmd/Ctrl + L)
 * 3. A button handler for manual highlighting
 *
 * @returns {Object} An object containing the highlight state and button handler
 */

export const useHighlight = (
  setHighlightText: React.Dispatch<React.SetStateAction<string>>
) => {
  const { setMode } = useAppContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === 'l') {
        event.preventDefault();
        const selectedText = window.getSelection()?.toString() || '';
        setHighlightText(selectedText);
        setMode('chat');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setMode]);

  const handleHighButton = () => {
    const selectedText = window.getSelection()?.toString() || '';
    setHighlightText(selectedText);
    setMode('chat');
  };

  return { handleHighButton };
};
