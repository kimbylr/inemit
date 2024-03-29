import ListNotFound from '@/app/lists/[slug]/not-found';
import { getListToLearn } from '@/db/actions';
import { AppRouterPageRoute } from '@auth0/nextjs-auth0';
import { Learn } from './learn';

const ListPage: AppRouterPageRoute = async ({ params }) => {
  const list = typeof params?.slug === 'string' && (await getListToLearn(params?.slug));

  if (!list) {
    return <ListNotFound />;
  }

  return <Learn list={list} />;
};

export default ListPage;
