import React, { useState, useEffect } from 'react';
import { fetchEntry } from '../api';

function BookPanel() {
  const [leftBookContent, setLeftBookContent] = useState<any>(null);
  const [rightBookContent, setRightBookContent] = useState<any>(null);

  useEffect(() => {
    //because loading from a DB is impure, it's proper to have that seperated out from the main body of the component so that we render first before executing the useEffect function
    const loadContents = async () => {
      try {
        const book_obj = await fetchEntry(
          '07e2b64d-de41-41d5-b1bd-6c609851c37d'
        );
        setLeftBookContent(book_obj.raw_text);
      } catch (error) {
        console.error('Error fetching left book content:', error);
        setLeftBookContent('Error Loading content');
      }

      try {
        const book_obj = await fetchEntry(
          '07e2b64d-de41-41d5-b1bd-6c609851c37d'
        );
        setRightBookContent(book_obj.rewritten_text);
      } catch (error) {
        console.error('Error fetching left book content:', error);
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
