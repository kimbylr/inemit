import { getList } from '@/db/actions';
import { AppRouterPageRoute } from '@auth0/nextjs-auth0';
import { notFound } from 'next/navigation';
import { ListSettings } from './list-settings';

const EditListPage: AppRouterPageRoute = async ({ params }) => {
  const list = typeof params?.slug === 'string' && (await getList(params?.slug));

  if (!list) {
    notFound();
  }

  return <ListSettings list={list} />;
};

export default EditListPage;
