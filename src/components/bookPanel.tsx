import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchEntry } from '../api';
import { useAppContext } from '../context/AppContext';
import { initializeToDatastore } from '../utils/highlightUtils';

function BookPanel({
  setHighlightText,
}: {
  setHighlightText: React.Dispatch<React.SetStateAction<string>>;
}) {
  //Load book related state and effects
  const [rewrittenContent, setRewrittenContent] = useState<any>(null);
  const [rawContent, setRawContent] = useState<any>(null);
  const rewrittenRef = useRef<HTMLDivElement>(null);
  const rawRef = useRef<HTMLDivElement>(null);

  //HighlightButton related state and effects
  const [buttonVisible, setButtonVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [lastHighlight, setLastHighlight] = useState<string>('');

  const { mode, setMode } = useAppContext();
  /**
   * LOAD BOOK
   *
   * Fetches and loads the book content from the API
   * Loads into the rewrittent text (left) and raw text (right)
   */
  useEffect(() => {
    const paraStyle = 'pb-4';

    const loadContents = async () => {
      try {
        const book_obj = await fetchEntry(
          '1394e51a-93c1-46fd-85a6-47f1eea9af1e'
        );

        //TO DO: refactor
        const rewrittenParas = book_obj.rewritten_text.map(
          (paragraph: string, index: number) => (
            <div
              key={`paragraph-${index}`} //only React accessible, not DOM accessible
              data-paragraph-index={index} //DOM accessible
              className={`book-chunk rewritten-content ${paraStyle}`}
            >
              <p>{paragraph}</p>
            </div>
          )
        );
        const rawParas = book_obj.raw_text.map(
          (paragraph: string, index: number) => (
            <div
              key={`paragraph-${index}`}
              className={`book-chunk raw-content ${paraStyle}`}
              data-paragraph-index={index} //DOM accessible
            >
              <p>{paragraph}</p>
            </div>
          )
        );
        setRewrittenContent(rewrittenParas);
        setRawContent(rawParas);
      } catch (error) {
        console.error('Error loading content:', error);
        setRewrittenContent('Error Loading content');
        setRawContent('Error Loading content');
      }
    };
    loadContents();
  }, []);

  /**
   * SYNCH PARAGRAPH HEIGHTS
   *
   * Resets all of the paragraph divs so they match heights (so that rewrite and original line up. )
   */
  useEffect(() => {
    const rewrittenParas = rewrittenRef.current?.querySelectorAll(
      '.book-chunk'
    ) as NodeListOf<HTMLElement> | undefined; //Note this nodeList isn't actually a list it's some kind of object so we have to do Array.from to use it as a list
    const rawParas = rawRef.current?.querySelectorAll('.book-chunk') as
      | NodeListOf<HTMLElement>
      | undefined;

    if (rewrittenParas && rawParas) {
      rewrittenParas.forEach((rewrittenPara, index) => {
        const rawPara = rawParas[index];
        const maxHeight = Math.max(
          rewrittenPara.offsetHeight,
          rawPara.offsetHeight
        );
        rewrittenPara.style.height = `${maxHeight}px`;
        rawPara.style.height = `${maxHeight}px`;
      });
    }
  }, [rewrittenContent, rawContent]);

  //HIGHLIGHT BUTTON
  const renderHighlightButton = () => {
    if (!buttonVisible) return null;
    return (
      <div
        className="button-container flex bg-neutral-100 rounded-md border-[.025px] border-neutral-300 shadow-md min-w-max"
        style={{
          position: 'absolute',
          top: `${buttonPosition.top}px`,
          left: `${buttonPosition.left}px`,
        }}
      >
        <button className="voice-btn py-0.5 px-3 font-sans text-[15px] hover:bg-neutral-200">
          <span className="text-black">Voice </span>
          <span className="text-neutral-600">⌘K</span>
        </button>
        <button
          className="ask-ai-btn py-0.5 px-3 font-sans text-[15px] hover:bg-neutral-200"
          onClick={() => {
            initializeToDatastore();
            setMode('chat');
            setButtonVisible(false);
          }}
        >
          <span className="text-black">Chat </span>
          <span className="text-neutral-600">⌘L</span>
        </button>
      </div>
    );
  };

  //BUTTON VISBILITY
  const handleButtonAppear = useCallback(() => {
    const selection = window.getSelection();
    if (!selection) return;

    const highlightedText = selection.toString() || '';
    if (
      selection &&
      !selection.isCollapsed &&
      highlightedText != lastHighlight
    ) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX,
      });
      setButtonVisible(true);
      setLastHighlight(highlightedText);
    } else {
      setButtonVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleButtonAppear);
    return () => {
      document.removeEventListener('mouseup', handleButtonAppear);
    };
  }, []);

  const colStyle = 'pt-10 pl-10 pr-10 text-[17px] bg-white font-serif';
  return (
    <div
      className={`book-container relative 
      ${
        mode === 'chat'
          ? 'chat-book flex flex-row w-2/3 h-screen overflow-y-auto items-start'
          : 'minis-book flex flex-row w-2/3 '
      }`}
    >
      <div
        ref={rewrittenRef}
        className={`rewritten-book w-1/2 border-r border-r-black ${colStyle}`}
      >
        {rewrittenContent}
      </div>
      <div ref={rawRef} className={`raw-book w-1/2 ${colStyle}`}>
        {rawContent}
      </div>
      {renderHighlightButton()}
    </div>
  );
}

export { BookPanel };
