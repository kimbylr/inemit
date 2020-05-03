import { useAuth } from '../helpers/auth';
import {
  BaseLearnItem,
  ListSummary,
  ListWithProgress,
  LearnItem,
  LearnItemForLearning,
} from '../models';

const API_URL = process.env.API_URL;

const routes = {
  lists: () => `${API_URL}/lists`,
  listById: (listId: string) => `${API_URL}/lists/${listId}`,
  listBySlug: (slug: string) => `${API_URL}/lists?slug=${slug}`,

  items: (listId: string) => `${API_URL}/lists/${listId}/items`,
  item: (listId: string, itemId: string) =>
    `${API_URL}/lists/${listId}/items/${itemId}`,

  learn: (listId: string) => `${API_URL}/lists/${listId}/items/learn`,
  progress: (listId: string, itemId: string) =>
    `${API_URL}/lists/${listId}/items/${itemId}/progress`,
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
interface ReportProgress {
  listId: string;
  itemId: string;
  answerQuality: 0 | 1 | 2 | 3 | 4 | 5;
}

interface FetchAndUnpack {
  url: string;
  getToken: () => Promise<string>;
  method?: 'PUT' | 'POST' | 'DELETE' | 'GET';
  body?: any;
  emptyResponse?: boolean;
}

const fetchAndUnpack = async <T>({
  url,
  getToken,
  method = 'GET',
  body,
  emptyResponse,
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

  if (emptyResponse) {
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
      emptyResponse: true,
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
      url: routes.items(listId),
    });

  const addItems = async ({ listId, items }: AddItems) =>
    fetchAndUnpack<LearnItem[]>({
      getToken,
      url: routes.items(listId),
      method: 'POST',
      body: { items },
    });

  const editItem = async ({ listId, itemId, item }: EditItem) =>
    fetchAndUnpack<LearnItem>({
      getToken,
      url: routes.item(listId, itemId),
      method: 'PUT',
      body: item,
    });

  const deleteItem = async ({ listId, itemId }: DeleteItem) => {
    await fetchAndUnpack<void>({
      getToken,
      url: routes.item(listId, itemId),
      method: 'DELETE',
      emptyResponse: true,
    });
  };

  const getLearnItems = async (listId: string) =>
    fetchAndUnpack<LearnItemForLearning[]>({
      getToken,
      url: routes.learn(listId),
    });

  const reportProgress = async ({
    listId,
    itemId,
    answerQuality,
  }: ReportProgress) =>
    fetchAndUnpack<void>({
      getToken,
      url: routes.progress(listId, itemId),
      method: 'PUT',
      body: { answerQuality },
      emptyResponse: true,
    });

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
    getLearnItems,
    reportProgress,
  };
};