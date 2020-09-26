import { useHistory, useLocation, useParams } from 'react-router-dom';

export const useRouting = () => {
  const history = useHistory();
  const { slug } = useParams<{ slug: string }>();
  const { pathname: path } = useLocation();

  const goTo = (slug?: string, mode?: 'edit' | 'learn') => {
    if (!slug) {
      return history.push('/');
    }

    history.push(`/${slug}${mode ? `/${mode}` : ''}`);
  };

  return {
    goTo,
    slug,
    path,
  };
};
