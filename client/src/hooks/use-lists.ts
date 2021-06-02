import { useEffect } from 'react';
import { useAuth } from '../helpers/auth';
import { useRouting } from '../hooks/use-routing';
import { ListSummary } from '../models';
import { useStore } from '../store';
import { useApi } from './use-api';

export const useLists = () => {
  const { lists, state, dispatch } = useStore();
  const { getLists, getSettings } = useApi();
  const { user } = useAuth();
  const { goToPage, goToList, path } = useRouting();

  const goToLastLearnt = (lists: ListSummary[], force?: boolean) => {
    if (!force && path !== '/') {
      return;
    }

    if (lists.length === 0) {
      goToPage('start');
      return;
    }

    const lastLearntLists = lists.sort(
      ({ lastLearnt: a }, { lastLearnt: b }) =>
        new Date(b).getTime() - new Date(a).getTime(),
    );
    goToList(lastLearntLists[0].slug);
  };

  const fetchLists = async () => {
    dispatch({ state: 'loading' });
    try {
      const lists = await getLists();
      const settings = await getSettings();
      dispatch({ state: 'loaded', lists, settings });
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
    const filteredLists = lists.filter(({ id }) => id !== listId);
    dispatch({ lists: filteredLists });
    goToLastLearnt(filteredLists, true);
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
