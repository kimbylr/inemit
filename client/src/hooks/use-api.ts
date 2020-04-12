import { useAuth } from '../helpers/auth';
import {
  BaseLearnItem,
  ListSummary,
  ListWithProgress,
  LearnItem,
} from '../models';

const API_URL = process.env.API_URL;

const routes = {
  lists: () => `${API_URL}/lists`,
  listById: (listId: string) => `${API_URL}/lists/${listId}`,
  listBySlug: (slug: string) => `${API_URL}/lists?slug=${slug}`,
  listItems: (listId: string) => `${API_URL}/lists/${listId}/items`,
  listItem: (listId: string, itemId: string) =>
    `${API_URL}/lists/${listId}/items/${itemId}`,
};

interface EditListName {
  listId: string;
  name: string;
}
interface AddItems {
  listId: string;
  items: BaseLearnItem[];
}
interface EditItem {
  listId: string;
  itemId: string;
  item: BaseLearnItem;
}
interface DeleteItem {
  listId: string;
  itemId: string;
}

interface FetchAndUnpack {
  url: string;
  getToken: () => Promise<string>;
  method?: 'PUT' | 'POST' | 'DELETE' | 'GET';
  body?: any;
}

const fetchAndUnpack = async <T>({
  url,
  getToken,
  method = 'GET',
  body,
}: FetchAndUnpack): Promise<T> => {
  const token = await getToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-type': 'application/json',
  };
  const fetchOptions = {
    method,
    headers,
    body: JSON.stringify(body),
  };

  const res: Response = await fetch(url, fetchOptions);
  if (res.status !== 200) {
    throw new Error(`Error: ${res.status}`);
  }

  if (method === 'DELETE') {
    return new Promise(resolve => resolve());
  }

  return await res.json();
};

export const useApi = () => {
  const { getToken } = useAuth();

  const getLists = async () =>
    fetchAndUnpack<ListSummary[]>({
      getToken,
      url: routes.lists(),
    });

  const getListBySlug = async (slug: string) =>
    fetchAndUnpack<ListWithProgress>({
      getToken,
      url: routes.listBySlug(slug),
    });

  const addList = async (name: string) =>
    fetchAndUnpack<ListSummary>({
      getToken,
      url: routes.lists(),
      method: 'POST',
      body: { name },
    });

  const deleteList = async (listId: string) => {
    await fetchAndUnpack<void>({
      getToken,
      url: routes.listById(listId),
      method: 'DELETE',
    });
  };

  const editListName = async ({ listId, name }: EditListName) => {
    const res = await fetchAndUnpack<ListWithProgress>({
      getToken,
      url: routes.listById(listId),
      method: 'PUT',
      body: { name },
    });

    return res.name;
  };

  const getItems = async (listId: string) =>
    fetchAndUnpack<LearnItem[]>({
      getToken,
      url: routes.listItems(listId),
    });

  const addItems = async ({ listId, items }: AddItems) =>
    fetchAndUnpack<LearnItem[]>({
      getToken,
      url: routes.listItems(listId),
      method: 'POST',
      body: { items },
    });

  const editItem = async ({ listId, itemId, item }: EditItem) =>
    fetchAndUnpack<LearnItem>({
      getToken,
      url: routes.listItem(listId, itemId),
      method: 'PUT',
      body: item,
    });

  const deleteItem = async ({ listId, itemId }: DeleteItem) => {
    await fetchAndUnpack<void>({
      getToken,
      url: routes.listItem(listId, itemId),
      method: 'DELETE',
    });
  };

  return {
    getLists,
    getListBySlug,
    addList,
    deleteList,
    editListName,
    getItems,
    addItems,
    editItem,
    deleteItem,
  };
};
