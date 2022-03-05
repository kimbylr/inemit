import { useNavigate, useLocation, useParams, useMatch } from 'react-router-dom';

export const useRouting = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { pathname: path } = useLocation();
  const isEditing = !!useMatch('/lists/:slug/edit');
  const isLearning = !!useMatch('/lists/:slug/learn');

  const goToPage = (page: 'start' | 'home') =>
    navigate(page === 'home' ? '/' : `/${page}`);

  const goToList = (slug?: string, mode?: 'edit' | 'learn') => {
    if (!slug) {
      return navigate('/');
    }

    navigate(`/lists/${slug}${mode ? `/${mode}` : ''}`);
  };

  const getListPath = (slug?: string) => `/lists/${slug}`;

  return {
    goToPage,
    goToList,
    slug,
    getListPath,
    path,
    isEditing,
    isLearning,
  };
};
