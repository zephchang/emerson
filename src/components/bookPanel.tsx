import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchEntry } from '../api';
import { useHighlight } from '../hooks/highlight';

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

  const { handleHighButton: highlightButtonHandler } =
    useHighlight(setHighlightText); //Note: this hook also initiates a keypress listening for cmd-Lf

  //HighlightButton related state and effects
  const [buttonVisible, setButtonVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
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

  const renderHighlightButton = () => {
    if (!buttonVisible) return null;
    return (
      <button
        ref={buttonRef}
        style={{
          position: 'absolute',
          zIndex: 1000,
          top: `${buttonPosition.top}px`,
          left: `${buttonPosition.left}px`,
        }}
        onClick={highlightButtonHandler}
      >
        Ask AI
      </button>
    );
  };

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
      setButtonVisible(true);
    } else {
      setButtonVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('selectionchange', handleTextSelection);
    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('selectionchange', handleTextSelection);
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
