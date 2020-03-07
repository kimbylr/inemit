import { useStore, LearnList } from '../store';
import { useEffect } from 'react';

const API_URL = process.env.API_URL;

export const useFetchLists = () => {
  const { dispatch } = useStore();

  const fetchLists = async () => {
    dispatch({ state: 'loading' });
    try {
      const res = await fetch(`${API_URL}/lists/`);
      const lists: LearnList[] = await res.json();
      dispatch({
        state: 'loaded',
        lists: lists.map(list => ({
          id: ((list as unknown) as any)._id, // TODO
          name: list.name,
          slug: list.slug,
          itemsCount: list.itemsCount,
        })),
      });
    } catch (error) {
      console.error(error);
      dispatch({ state: 'error' });
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);
};
