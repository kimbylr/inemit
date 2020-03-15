import { useEffect } from 'react';
import { getLists } from '../helpers/api';
import { ListSummary } from '../models';
import { useStore } from '../store';

export const useLists = () => {
  const { lists, state, dispatch } = useStore();

  const fetchLists = async () => {
    dispatch({ state: 'loading' });
    try {
      const lists = await getLists();
      dispatch({ state: 'loaded', lists });
    } catch (error) {
      console.error(error);
      dispatch({ state: 'error' });
    }
  };

  useEffect(() => {
    if (state === 'initial') {
      fetchLists();
    }
  }, []);

  const storeList = (list: ListSummary) => {
    dispatch({ lists: [...lists, list] });
  };

  const updateList = (list: ListSummary) => {
    dispatch({
      lists: lists.map(storedList =>
        storedList.id === list.id ? list : storedList,
      ),
    });
  };

  return {
    lists,
    state,
    storeList,
    updateList,
  };
};
