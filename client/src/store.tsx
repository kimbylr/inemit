import React, { FC, ReactNode, useContext, useReducer } from 'react';
import { Hints, ListSummary, LoadingStates } from './models';

type DismissedHints = { [key in Hints]: boolean };
const dismissedHints: DismissedHints = {
  editingIntro: false,
  learningFalseNegative: false,
  learningFlag: false,
};

interface StoreData {
  lists: ListSummary[];
  settings: { dismissedHints: DismissedHints };
  state: LoadingStates;
}

interface DispatchToStore {
  dispatch: React.Dispatch<any>;
}

const INITIAL_DATA = {
  lists: [],
  settings: { dismissedHints },
  state: LoadingStates.initial,
};

const StoreContext = React.createContext<StoreData & DispatchToStore>({
  ...INITIAL_DATA,
  dispatch: () => {},
});

const reducer = (data: StoreData, changed: Partial<StoreData>) => ({
  ...data,
  ...changed,
});

export const useStore = () => useContext(StoreContext);

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [data, dispatch] = useReducer<
    (data: StoreData, changed: Partial<StoreData>) => StoreData
  >(reducer, INITIAL_DATA);

  return (
    <StoreContext.Provider value={{ ...data, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
