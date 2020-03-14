import React, { useReducer, FC, useContext } from 'react';
import { ListSummary, LoadingStates } from './models';

interface StoreData {
  lists: ListSummary[];
  state: LoadingStates;
}

interface DispatchToStore {
  dispatch: React.Dispatch<any>;
}

const INITIAL_DATA = {
  lists: [],
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

export const StoreProvider: FC = ({ children }) => {
  const [data, dispatch] = useReducer<
    (data: StoreData, changed: Partial<StoreData>) => StoreData
  >(reducer, INITIAL_DATA);

  return (
    <StoreContext.Provider value={{ ...data, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
