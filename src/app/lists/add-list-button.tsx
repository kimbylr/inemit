'use client';

import { addList } from '@/db/actions';
import { IconPlusCircle } from '@/elements/icons/plus-circle';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

export const AddListButton: FC = () => {
  const router = useRouter();

  return (
    <button
      className="py-2 px-2 flex gap-2 items-center text-primary-150 grow hover:text-gray-25 rounded-lg"
      onClick={async () => {
        const name = prompt('Name der neuen Liste:');
        if (!name) return;

        const slug = await addList(name);
        slug && router.push(`/lists/${slug}`);
      }}
    >
      <IconPlusCircle className="h-8 w-8" />
      <span className="text-sm font-bold">Neue Liste</span>
    </button>
  );
};
