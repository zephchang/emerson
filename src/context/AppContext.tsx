import React, { createContext, useState, useContext } from 'react';

type InteractionMode = 'chat' | 'minis';

interface AppContextType {
  mode: InteractionMode;
  setMode: (mode: InteractionMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined); //createContext creates a Context object. That object looks something like { Provider: ReactComponent, Consumer: ReactComponent, displayName: etc.}. Actually these days we don't use Consumer, we just really use provider and send a little monkey (useContext) to search the tree for the provider.

//Note: undfeined is the fallback value (default value) in case we can't find the provider. Little monkey sends back undefined if can't find provider in the tree.

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  //this is a wrapper that gets exported to wrap around a function. It's a provider at top level, kind of like a beacon. We create some state and then put it in a beacon which holds the local state. The useContext are little monkeys that run up the tree to grab the local state (value and setter) and then that way anycomponent can access a value or set a value.
  children,
}) => {
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>('minis');

  return (
    <AppContext.Provider
      value={{ mode: interactionMode, setMode: setInteractionMode }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  //useContext is a function which takes in an argument, the argument is a Context obejct. useContext runs up the tree looking for  the provider for that context object, fetches the value of that provider and then brings it back and that's the return value. Note this is pre-loaded with AppContext so it knows to find the provider
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used with an AppContextProivder');
  }
  return context;
};

//Ok so fundamentally what we did is we created three things. We have a beacon which holds the useState value and setter.

//Then we have a context-object which corresponds to that provider - such that when you call useContext on that context-obj useContext will go climb the tree looking for the corresponding provider

//we preload the context-object into useContext and bundle that all into a function useAppContext

//So how we're going to use this is we wrap the whole app in the Provider so everything gets a beacon. Then in any module we want, we can use useAppContext() - note call it empty since it always grabs useContext(AppContext). and it will return the value that's on the provider (which is the value and setter)

//the idiomatic way to do it is to do {mode, setMode} = useAppContext() // remember this is saying that {mode: mode, setMode:setMode} = {mode: interactionMode, setMode: setInteractionMode}
