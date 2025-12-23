import { getList } from '@/db/actions';
import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';
import { ListActions } from './list-actions';

type Props = {
  children: ReactNode;
  params?: Promise<{ slug?: string }>;
};

const Layout: FC<Props> = async ({ children, params }) => {
  const slug = (await params)?.slug;
  const list = typeof slug === 'string' && (await getList(slug));

  if (!list) {
    notFound();
  }

  return (
    <>
      <ListActions slug={slug} />

      <h1 className="relative xs:-mb-8 xs:-top-11 truncate max-w-full xs:max-w-[calc(100%-192px)]">
        {list.name}
      </h1>

      {children}

      <div className="max-xs:h-16" />
    </>
  );
};

export default Layout;
