Ok so what are my goals?

Let's see the old software how did it work?

Ok so we've got on the left some text side by side. I would like to have the ability to renderthe left side dynamically

> create one module and get hello world to show up via there. [done]

BOOK PANEL

> OK so we want our book panel to render the two books. It's going to be <p> tags inside of divs.
> Which means we need to get the paragarph in the form of a list.
> We need some kind of proccessing to take the pure text and turn it into a list of <p>s. We should have an original and a side by side and they better zip up otherwise we've got problems.

Ok I'm pissed off at the streamlit version - it's just no good. let's do this fucking backend.

> step 1: create json [done]

> get python to import json [done]

> get json to upload to supabase [done]

> Get rewrite done where we can pull from supabase [done]

> setup a backend using python [done]

> Let's get the paragraphs into the UI

> And then go back and do kant's full prologuea [done]

> OK so what are we looking for here?
> well we want to have paragraphs that are indentend somehow we have a list of paragraphs. And we want them to line up left to right. How to do that? In the other one we set the abstract height but that's nto really ideal. One option is to have a grid but I don't like that either because highlighting won't work. Really I want divs where the div height of each is capped at the corresponding div height. Hmmm

> Ok this is kind of a shitshow to do well. Turns out maybe my dumb implementation from v1 was the best one. Let's have the raw paragraphs be in divs normal, etc. and then we are going to have some JS come in and reset the div sizes for the rewritten text to be equal to the height of the corresponding divs on the raw side.

and maybe as a bonus feature just have on resize window we re-run the js.

> get the column set up [done]

> Style both panels in a way I like [done (ish)] [done]

> Get the paragraphs to line up [done]
