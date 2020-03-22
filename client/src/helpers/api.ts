import {
  BaseLearnItem,
  ListWithProgress,
  LearnItem,
  ListSummary,
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

const getOptions = (method: 'PUT' | 'POST' | 'DELETE', body: any) => ({
  method,
  headers: { 'Content-type': 'application/json' },
  body: JSON.stringify(body),
});

const fetchAndUnpack = async <T>(
  url: RequestInfo,
  options?: RequestInit,
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

// ===

export const getLists = async () =>
  fetchAndUnpack<ListSummary[]>(routes.lists());

// ====

export const addList = async (name: string) =>
  fetchAndUnpack<ListSummary>(routes.lists(), getOptions('POST', { name }));

// ===

export const getListBySlug = async (slug: string) =>
  fetchAndUnpack<ListWithProgress>(routes.listBySlug(slug));

// ====

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

// ====

export const getItems = async (listId: string) =>
  fetchAndUnpack<LearnItem[]>(routes.listItems(listId));

// ====

interface AddItems {
  listId: string;
  items: BaseLearnItem[];
}
export const addItems = async ({ listId, items }: AddItems) =>
  fetchAndUnpack<LearnItem[]>(
    routes.listItems(listId),
    getOptions('POST', { items }),
  );

// ===

interface EditItem {
  listId: string;
  itemId: string;
  item: BaseLearnItem;
}
export const editItem = async ({ listId, itemId, item }: EditItem) =>
  fetchAndUnpack<LearnItem>(
    routes.listItem(listId, itemId),
    getOptions('PUT', item),
  );
