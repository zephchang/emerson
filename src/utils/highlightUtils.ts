import React, { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL ?? '';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY ?? '';
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}
const supabase = createClient(supabaseUrl, supabaseKey);

const locateHighlight = () => {
  try {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return; //is this neccesary?

    const startTextNode = selection.anchorNode;
    const endTextNode = selection.focusNode;

    const startDiv = Number(
      startTextNode?.parentElement?.parentElement?.getAttribute(
        'data-paragraph-index'
      )
    );
    const endDiv = Number(
      endTextNode?.parentElement?.parentElement?.getAttribute(
        'data-paragraph-index'
      )
    );
    const startOffset = selection.anchorOffset; //note this is a little brittle bc it's offset for the text node not the div. For us should be fine bc only one paragraph per div.
    const endOffset = selection.focusOffset;

    const contentType =
      startTextNode?.parentElement?.parentElement?.classList.contains(
        'raw-content'
      )
        ? 'raw_text'
        : 'rewritten_text';

    const anchors = {
      startDiv,
      startOffset,
      endDiv,
      endOffset,
      contentType,
    };

    return anchors;
  } catch (error) {
    console.error('Error finding highlight anchors:', error);
  }
};

export const initializeToDatastore = async () => {
  try {
    const anchors = locateHighlight();

    const { data, error } = await supabase.from('conversations').insert([
      {
        start_div: anchors?.startDiv,
        start_offset: anchors?.startOffset,
        end_div: anchors?.endDiv,
        end_offset: anchors?.endOffset,
        content_type: anchors?.contentType,
        //will need to add book id eventually
      },
    ]);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('ERROR:', error);
  }
};

// one option for doing this is hunting around inside of the dom but it seems more straightforward to go directly from the supabase

interface HighlightData {
  startDiv: number;
  startOffset: number;
  endDiv: number;
  endOffset: number;
  contentType: string;
  bookID: string;
}

const fetchHighlightData = async (conversationID: string) => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('start_div,start_offset,end_div,end_offset,content_type,book_id')
      .eq('id', conversationID);
    if (error) {
      throw error;
    }
    if (data) {
      const supabaseData = data[0];
      const highlightData: HighlightData = {
        startDiv: supabaseData.start_div,
        startOffset: supabaseData.start_offset,
        endDiv: supabaseData.end_div,
        endOffset: supabaseData.end_offset,
        contentType: supabaseData.content_type,
        bookID: supabaseData.book_id,
      };
      return highlightData;
    }
  } catch (error) {
    console.log(error);
  }
};

//Returns a list of paragraphs of raw or rewritten content
const fetchBookContent = async (bookID: string, contentType: string) => {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(contentType)
      .eq('uuid', bookID)
      .single();

    if (error) {
      throw error;
    }
    const contentData: Record<string, any> = data;
    return contentData[contentType];
  } catch (error) {
    console.error('Error fetching book content:', error);
    return null;
  }
};

export const rehydrateHighlight = async (conversationID: string) => {
  try {
    const highlight = await fetchHighlightData(conversationID);
    if (!highlight) {
      throw new Error('Failed to fetch highlight data');
    }
    const { bookID, contentType, startDiv, endDiv, startOffset, endOffset } =
      highlight;

    const contentParas = await fetchBookContent(bookID, contentType);
    if (!contentParas || !Array.isArray(contentParas)) {
      throw new Error(
        'Failed to fetch book content or content is not in array'
      );
    }
    const highlightParas = contentParas.slice(startDiv, endDiv + 1);
    highlightParas[highlightParas.length - 1] = highlightParas[
      highlightParas.length - 1
    ].slice(0, endOffset);
    highlightParas[0] = highlightParas[0].slice(startOffset); //order endOffset then startOffset is important for edge case of 1 para
    const highlightText = highlightParas.join('\n');
    return highlightText;
  } catch (error) {
    console.error('Error rehydrating highlight:', error);
    throw error;
  }
};

export const rehydrateContext = async (conversationID: string) => {
  try {
    const highlight = await fetchHighlightData(conversationID);
    if (!highlight) {
      throw new Error('Failed to fetch highlight data');
    }
    const { bookID, contentType, startDiv, endDiv, startOffset, endOffset } =
      highlight;

    const contentParas = await fetchBookContent(bookID, contentType);
    if (!contentParas || !Array.isArray(contentParas)) {
      throw new Error(
        'Failed to fetch book content or content is not in array'
      );
    }
    const context = contentParas
      .slice(
        Math.max(0, startDiv - 1),
        Math.min(contentParas.length + 1, endDiv + 2)
      )
      .join('\n');

    return context;
  } catch (error) {
    console.error('Error rehydrating highlight:', error);
    throw error;
  }
};
