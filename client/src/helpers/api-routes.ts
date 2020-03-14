const API_URL = process.env.API_URL;

export const routes = {
  lists: () => `${API_URL}/lists`,
  listById: (listId: string) => `${API_URL}/lists/${listId}`,
  listBySlug: (slug: string) => `${API_URL}/lists?slug=${slug}`,
  listItems: (listId: string) => `${API_URL}/lists/${listId}/items`,
  listItem: (listId: string, itemId: string) =>
    `${API_URL}/lists/${listId}/item/${itemId}`,
};
