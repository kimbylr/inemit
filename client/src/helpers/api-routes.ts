import { BaseLearnItem, ListWithProgress, LearnItem } from '../models';

const API_URL = process.env.API_URL;

// TODO: make fns and use everywhere
export const routes = {
  lists: () => `${API_URL}/lists`,
  listById: (listId: string) => `${API_URL}/lists/${listId}`,
  listBySlug: (slug: string) => `${API_URL}/lists?slug=${slug}`,
  listItems: (listId: string) => `${API_URL}/lists/${listId}/items`,
  listItem: (listId: string, itemId: string) =>
    `${API_URL}/lists/${listId}/item/${itemId}`,
};

const getOptions = (method: 'PUT' | 'POST' | 'DELETE', body: any) => ({
  method,
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify(body),
});

const fetchAndUnpack = async <T>(
  url: RequestInfo,
  options: RequestInit,
): Promise<T> => {
  try {
    const res: Response = await fetch(url, options);
    if (res.status !== 200) {
      throw new Error(`Error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    throw new Error(error);
  }
};

interface EditListName {
  listId: string;
  name: string;
}
export const editListName = async ({ listId, name }: EditListName) => {
  const res = await fetchAndUnpack<ListWithProgress>(
    routes.listById(listId),
    getOptions('PUT', { name }),
  );
  return res.name;
};

interface AddItems {
  listId: string;
  items: BaseLearnItem[];
}
export const addItems = async ({ listId, items }: AddItems) =>
  fetchAndUnpack<LearnItem[]>(
    routes.listItems(listId),
    getOptions('POST', { items }),
  );
