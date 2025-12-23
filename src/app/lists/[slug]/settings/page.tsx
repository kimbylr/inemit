import { getList } from '@/db/actions';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { ListSettings } from './list-settings';

type Props = {
  params?: Promise<{ slug?: string }>;
};

const EditListPage: FC<Props> = async ({ params }) => {
  const slug = await params;
  const list = typeof slug === 'string' && (await getList(slug));

  if (!list) {
    notFound();
  }

  return <ListSettings list={list} />;
};

export default EditListPage;
