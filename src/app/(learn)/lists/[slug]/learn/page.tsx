import ListNotFound from '@/app/lists/[slug]/not-found';
import { getListToLearn } from '@/db/actions';
import { Learn } from './learn';
import { FC } from 'react';

type Props = {
  params?: Promise<{ slug?: string }>;
};

const LearnPage: FC<Props> = async ({ params }) => {
  const slug = (await params)?.slug;
  const list = typeof slug === 'string' && (await getListToLearn(slug));

  if (!list) {
    return <ListNotFound />;
  }

  return <Learn list={list} />;
};

export default LearnPage;
