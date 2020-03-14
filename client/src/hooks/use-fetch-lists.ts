import { useEffect } from 'react';
import { routes } from '../helpers/api-routes';
import { ListSummary } from '../models';
import { useStore } from '../store';

export const useFetchLists = () => {
  const { dispatch } = useStore();

  const fetchLists = async () => {
    dispatch({ state: 'loading' });
    try {
      const res = await fetch(routes.lists());
      const lists: ListSummary[] = await res.json();
      dispatch({ state: 'loaded', lists });
    } catch (error) {
      console.error(error);
      dispatch({ state: 'error' });
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);
};
