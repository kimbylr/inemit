import { ListActions } from './list-actions';
import { getList } from '@/db/actions';
import { classNames } from '@/helpers/class-names';
import { notFound } from 'next/navigation';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params?: { slug?: string };
};

const Layout: FC<Props> = async ({ children, params }) => {
  const list = typeof params?.slug === 'string' && (await getList(params?.slug));

  if (!list) {
    notFound();
  }

  return (
    <>
      <div
        className={classNames(
          'z-40 pointer-events-none',
          'max-xs:w-screen max-xs:bottom-0 max-xs:fixed max-xs:-ml-6',
          'xs:sticky xs:top-1.5 xs:text-right',
        )}
      >
        <ListActions slug={params.slug!} />
      </div>

      <h1 className="relative xs:-mb-8 xs:-top-11 truncate max-w-full xs:max-w-[calc(100%-192px)]">
        {list.name}
      </h1>

      {children}
    </>
  );
};

export default Layout;
