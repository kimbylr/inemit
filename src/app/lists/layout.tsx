import { Header } from '@/components/header';
import { getListsSummary } from '@/db';
import { sortByLastLearnt } from '@/db/helpers';
import { List } from '@/types/types';
import { FC, ReactNode } from 'react';

const getLists = async () => {
  try {
    return sortByLastLearnt(await getListsSummary()) as unknown as List[];
  } catch {
    return [];
  }
};

const Layout: FC<{ children: ReactNode }> = async ({ children }) => {
  const lists = await getLists();

  return (
    <div className="bg-gray-95 content-div">
      <Header lists={lists} />
      <main className="py-8 px-6 mx-auto max-w-3xl">{children}</main>
    </div>
  );
};

export default Layout;
