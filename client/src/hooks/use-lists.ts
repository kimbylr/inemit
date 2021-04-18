import { useEffect } from 'react';
import { useAuth } from '../helpers/auth';
import { useRouting } from '../hooks/use-routing';
import { ListSummary } from '../models';
import { useStore } from '../store';
import { useApi } from './use-api';

export const useLists = () => {
  const { lists, state, dispatch } = useStore();
  const { getLists } = useApi();
  const { user } = useAuth();
  const { goTo, path } = useRouting();

  const goToLastLearnt = (lists: ListSummary[]) => {
    if (lists.length === 0 || path !== '/') {
      return;
    }

    const lastLearntList = lists.sort(
      ({ lastLearnt: a }, { lastLearnt: b }) =>
        new Date(b).getTime() - new Date(a).getTime(),
    );
    goTo(lastLearntList[0].slug);
  };

  const fetchLists = async () => {
    dispatch({ state: 'loading' });
    try {
      const lists = await getLists();
      dispatch({ state: 'loaded', lists });
      goToLastLearnt(lists);
    } catch (error) {
      console.error(error);
      dispatch({ state: 'error' });
    }
  };

  useEffect(() => {
    if (state === 'initial' && user) {
      fetchLists();
    }
  }, [user]);

  const storeList = (list: ListSummary) => {
    dispatch({ lists: [...lists, list] });
  };

  const updateList = (list: ListSummary) => {
    dispatch({
      lists: lists.map(storedList => (storedList.id === list.id ? list : storedList)),
    });
  };

  const removeList = (listId: string) => {
    dispatch({
      lists: lists.filter(({ id }) => id !== listId),
    });
  };

  return {
    lists,
    state,
    storeList,
    updateList,
    removeList,
    fetchLists,
  };
};
