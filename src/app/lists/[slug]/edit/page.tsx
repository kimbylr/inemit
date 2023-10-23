import { getListToEdit } from '@/db/actions';
import { AppRouterPageRoute } from '@auth0/nextjs-auth0';
import { notFound } from 'next/navigation';
import { EditList } from './edit-list';

const EditListPage: AppRouterPageRoute = async ({ params }) => {
  const list = typeof params?.slug === 'string' && (await getListToEdit(params?.slug));

  if (!list) {
    notFound();
  }

  return <EditList list={list} />;
};

export default EditListPage;
