import { useStore } from '../store';
import { useEffect } from 'react';
import { ListSummary } from '../models';

const API_URL = process.env.API_URL;

export const useFetchLists = () => {
  const { dispatch } = useStore();

  const fetchLists = async () => {
    dispatch({ state: 'loading' });
    try {
      const res = await fetch(`${API_URL}/lists`);
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
