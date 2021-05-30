import { useHistory, useLocation, useParams } from 'react-router-dom';

export const useRouting = () => {
  const history = useHistory();
  const { slug } = useParams<{ slug: string }>();
  const { pathname: path } = useLocation();

  const goToPage = (page: 'start' | 'home') =>
    history.push(page === 'home' ? '/' : `/${page}`);

  const goToList = (slug?: string, mode?: 'edit' | 'learn') => {
    if (!slug) {
      return history.push('/');
    }

    history.push(`/lists/${slug}${mode ? `/${mode}` : ''}`);
  };

  const getListPath = (slug: string) => `/lists/${slug}`;

  return {
    goToPage,
    goToList,
    slug,
    getListPath,
    path,
  };
};
