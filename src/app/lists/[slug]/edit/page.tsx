import { getListToEdit } from '@/db/actions';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { EditList } from './edit-list';

type Props = {
  params?: Promise<{ slug?: string }>;
};

const EditListPage: FC<Props> = async ({ params }) => {
  const slug = await params;
  const list = typeof slug === 'string' && (await getListToEdit(slug));

  if (!list) {
    notFound();
  }

  return <EditList list={list} />;
};

export default EditListPage;
