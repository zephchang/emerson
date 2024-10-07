import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchEntry } from '../api';
import { useHighlight } from '../hooks/useHighlight';

function BookPanel({
  setHighlightText,
}: {
  setHighlightText: React.Dispatch<React.SetStateAction<string>>;
}) {
  //Load book related state and effects
  const [leftBookContent, setLeftBookContent] = useState<any>(null);
  const [rightBookContent, setRightBookContent] = useState<any>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);

  const { handleHighButton: handleHighButton } = useHighlight(setHighlightText); //Note: this hook also initiates a keypress listening for cmd-Lf

  //HighlightButton related state and effects
  const [buttonVisible, setButtonVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [lastHighlight, setLastHighlight] = useState<string>('');
  /**
   * Fetches and loads the book content from the API
   * Loads into the rewrittent text (left) and raw text (right)
   */
  useEffect(() => {
    //because loading from a DB is impure, it's proper to have that seperated out from the main body of the component so that we render first before executing the useEffect function
    const paraStyle = 'pb-4';

    const loadContents = async () => {
      try {
        const book_obj = await fetchEntry(
          '1394e51a-93c1-46fd-85a6-47f1eea9af1e'
        );
        const left_paras = book_obj.rewritten_text.map(
          (paragraph: string, index: number) => (
            <div
              key={`paragraph-${index}`}
              className={`book-paragraph ${paraStyle}`}
            >
              <p>{paragraph}</p>
            </div>
          )
        );
        const right_paras = book_obj.raw_text.map(
          (paragraph: string, index: number) => (
            <div
              key={`paragraph-${index}`}
              className={`book-paragraph ${paraStyle}`}
            >
              <p>{paragraph}</p>
            </div>
          )
        );
        setLeftBookContent(left_paras);
        setRightBookContent(right_paras);
      } catch (error) {
        console.error('Error loading content:', error);
        setLeftBookContent('Error Loading content');
        setRightBookContent('Error Loading content');
      }
    };
    loadContents();
  }, []);

  /**
   * Resets all of the paragraph divs so they match heights (so that rewrite and original line up. )
   */
  useEffect(() => {
    const leftParas = leftColumnRef.current?.querySelectorAll(
      '.book-paragraph'
    ) as NodeListOf<HTMLElement> | undefined; //Note this nodeList isn't actually a list it's some kind of object so we have to do Array.from to use it as a list
    const rightParas = rightColumnRef.current?.querySelectorAll(
      '.book-paragraph'
    ) as NodeListOf<HTMLElement> | undefined;

    if (leftParas && rightParas) {
      leftParas.forEach((leftPara, index) => {
        const rightPara = rightParas[index];
        const maxHeight = Math.max(
          leftPara.offsetHeight,
          rightPara.offsetHeight
        );
        leftPara.style.height = `${maxHeight}px`;
        rightPara.style.height = `${maxHeight}px`;
      });
    }
  }, [leftBookContent, rightBookContent]);

  /**
   * Highlight button functionality below: render highlight button, handle text selection, and add eventlistener
   */
  const renderHighlightButton = () => {
    if (!buttonVisible) return null;
    return (
      <div
        className="button-container flex z-50 bg-neutral-100 rounded-md border-[.025px] border-neutral-300 shadow-md"
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
            handleHighButton();
            setButtonVisible(false);
          }}
        >
          <span className="text-black">Chat </span>
          <span className="text-neutral-600">⌘L</span>
        </button>
      </div>
    );
  };

  const handleTextSelection = useCallback(() => {
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
    document.addEventListener('mouseup', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, [handleTextSelection]); //note handleTextSelection is not a function but actually a memoization of a function, so it's pre-calculated and if the dependencies change then we return a new memo

  const colStyle = 'pt-10 pl-10 pr-10 text-[17px] bg-white font-serif';
  return (
    <>
      <div
        ref={leftColumnRef}
        className={`left-book w-1/2 border-r border-r-black ${colStyle}`}
      >
        {leftBookContent}
      </div>
      <div ref={rightColumnRef} className={`right-book w-1/2 ${colStyle}`}>
        {rightBookContent}
      </div>
      {renderHighlightButton()}
    </>
  );
}

export { BookPanel };
