import React, { useReducer, FC, useContext } from 'react';
import { ListSummary } from './models';

enum LoadingStates {
  initial = 'initial',
  loading = 'loading',
  loaded = 'loaded',
  error = 'error',
}

interface StoreData {
  lists: ListSummary[];
  activeListId: string | null;
  state: LoadingStates;
}

interface DispatchToStore {
  dispatch: React.Dispatch<any>;
}

const INITIAL_DATA = {
  lists: [],
  activeListId: null,
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
