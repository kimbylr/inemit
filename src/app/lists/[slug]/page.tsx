import { getList } from '@/db/actions';
import { notFound } from 'next/navigation';
import { FC } from 'react';
import { ListOverview } from './list-overview';

type Props = {
  params?: Promise<{ slug?: string }>;
};

const ListPage: FC<Props> = async ({ params }) => {
  const slug = await params;
  const list = typeof slug === 'string' && (await getList(slug));

  if (!list) {
    notFound();
  }

  return <ListOverview list={list} />;
};

export default ListPage;
