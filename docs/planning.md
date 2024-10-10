NEXT STEPS

Currently: chat can hydrate a hardcoded highlight. [done]

next:

GET HIGHLIGHT TO UPDATE CHAT AUTOMATICALLY:

1. user clicks button and we
   user clicks a button, and we generate a UUID on the supabase side. Supabase returns the UUID on select call. [done]

2. let's get the UI to look kind apretty at least. [done]

todo: get supabase to return UUID on the db call. [done]

NEXT UP: Render the chat from supabase (hardcode a convo)

Think: we will be using openai format [{"role":"user", "content": "something"},{"assistant":}]

that should go to some kind of local or global context to then update the chat render.

hm hm hm hm on receipt we change mode to chat and then

in general rough plan is we are going to use supabase's realtime thing.
