import { getList } from '@/db/actions';
import { AppRouterPageRoute } from '@auth0/nextjs-auth0';
import { notFound } from 'next/navigation';
import { ListOverview } from './list-overview';

const ListPage: AppRouterPageRoute = async ({ params }) => {
  const list = typeof params?.slug === 'string' && (await getList(params?.slug));

  if (!list) {
    notFound();
  }

  return <ListOverview list={list} />;
};

export default ListPage;
