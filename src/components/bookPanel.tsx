import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchEntry } from '../api';

function BookPanel() {
  const [leftBookContent, setLeftBookContent] = useState<any>(null);
  const [rightBookContent, setRightBookContent] = useState<any>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //because loading from a DB is impure, it's proper to have that seperated out from the main body of the component so that we render first before executing the useEffect function
    const loadContents = async () => {
      try {
        const book_obj = await fetchEntry(
          '07e2b64d-de41-41d5-b1bd-6c609851c37d'
        );
        const left_paras = book_obj.raw_text.map(
          (paragraph: string, index: number) => (
            <div key={`paragraph-${index}`}>
              <p>{paragraph}</p>
            </div>
          )
        );
        const right_paras = book_obj.rewritten_text.map(
          (paragraph: string, index: number) => (
            <div key={`paragraph-${index}`}>
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

  return (
    <>
      <div className="left-book bg-green-300 w-1/2">{leftBookContent}</div>
      <div className="right-book bg-blue-300 w-1/2">{rightBookContent}</div>
    </>
  );
}

export { BookPanel };
