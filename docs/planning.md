CHAT PANEL

create textInput for the chat

setup echo chat

- decide on how to store messages in supabase
- write fake convo in supabase
- render fake convo in chat

hmmm. initiating a chat needs to create a uuid for this user.

- set up the minis db in supabase. It will store
  - highlight_text
  - highlight_context
  - height? maybe we need to do MA's concept of highlight_text + 20 words and find that way? but I don't love that since we might have between div stuff. This gets hard fast. How about we just store which paragraph it's on no that really is not that good. what about percentage that's not perfect but quasi responsive
  -

STEP 1:

- on selection and button click,

  - capture highlight coordinates and send to the db, add an ID - we have created an entry
  - DB data object looks like:

    - id (unique identifier)
    - location {
      start: {div: number, offset: number }
      end: {div: number, offset: number }
      }
    - convo (mine as well store in openai format ya?)
      [{"role":"user", "content": "blah blah"}{"role":"assistant }]

- ok next steps are (1) render from the db (2) grab highlight and upload to the db

- let's start with grab highlight and upload to db. Hardest part is grabbing the highlight.
  - when does this happen? when the user clicks the button to start chat. then what. On highlight we run the highlightLocator and then it should return a formatted object with start stop end all that kind of stuff based on window selection.

> creat utility funciton to grab the highlight context. [done]

    - empty function first [done]
    - in that proccess may have to index the divs so we can count them up.

> change highlight button functionality to run a utility [done]

    - on click run utility [done]

> Find the selection anchor and send to db [done]

    - locate the selection anchors (may need to index the divs) [done]
    - put them into a format to send to DB (db will auto create ID, convo as list default) [done]

> New: render chat from the db

    - rehydrate the chat text from DB


    - rehydrate teh chat context from DB (maybe +1 paragraph each side if one para long?)
    - Then figure out how to set up live connection probably such that on click we send to db as soon as db update we re-rendere.

change mode to chat what do you think is the best way to use this keyboard what are we doing her ethis is really hard my left hand is overloaded that's just god's honest truth maybe ar wrist wrest would help

- chat automatically renders convo based on the db
  - rehydrate the highlight based on start stop
  - rehydtrate context based on start stop (background)
  - render convo from db
  - on message send update the DB (should re-render chat)
  - fire off async to get AI response ,as soon as AI responds, updates DB

question: do we want to have ani nbetween step what would that looklike? 1. send the highlight into the chat, store the

AT SOME POINT:

- learn how to use tests to protect myrefactoring what do you think of this setup. this isa ctually not that bad it its interesting
- need to refactor bookPanel
  - into load book utility funciton
  - also a button utility function probably?/event listener. Right now that's in highlight. maybe get it all in book.

-deal with backward selection bug. could have reverse highlighting.
