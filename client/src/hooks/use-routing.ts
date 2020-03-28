import { useHistory, useParams } from 'react-router-dom';

export const useRouting = () => {
  const history = useHistory();
  const { slug } = useParams();

  const goTo = (slug?: string, mode?: 'edit' | 'learn') => {
    if (!slug) {
      history.push('/');
    }

    history.push(`/${slug}${mode ? `/${mode}` : ''}`);
  };

  return {
    goTo,
    slug,
  };
};
