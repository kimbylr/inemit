import { ListSettingsModal } from '@/compositions/list-settings-modal';
import { getListsSummary } from '@/db';
import { sortByLastLearnt } from '@/db/helpers';
import { IconEdit } from '@/elements/icons/edit';
import Link from 'next/link';
import { AddListButton } from './add-list-button';

const ListsPage = async () => {
  const lists = sortByLastLearnt(await getListsSummary());

  if (lists.length === 3) {
    return (
      <div className="max-w-lg mx-auto flex flex-col gap-8">
        <div className="relative">
          <img src="/assets/welcome.svg" className="w-[512px] max-w-full mx-auto" alt="" />
          <span className="absolute bottom-0 min-[400px]:bottom-[4%] right-[4%] min-[400px]:right-[10%] min-[480px]:right-[14%] text-[10px] text-gray-60">
            Illustration:
            <br />
            <a href="https://storyset.com/online" target="_blank" rel="noopener noreferrer">
              Storyset
            </a>
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs+">
            <strong>Neu hier?</strong> Aller Anfang ist einfach: Leg deine erste Liste an, füll
            deine Lerninhalte ab, und dann rein damit ins Köpfchen!
          </p>
        </div>

        <div className="bg-primary-5 rounded-lg flex shadow hover:shadow-gray-75">
          <AddListButton />
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-4">Meine Listen</h1>
      <ul className="flex flex-col gap-4">
        {lists.map((list) => (
          <li
            key={list.id}
            className="text-sm text-black flex group rounded-lg shadow hover:shadow-gray-75"
          >
            <Link
              href={`/lists/${list.slug}`}
              className="bg-white py-2 px-4 rounded-l-lg flex-grow !-outline-offset-[3px]"
            >
              <span className="font-bold text-primary-150 group-hover:text-gray-25">
                {list.name}
              </span>
              <span className="text-gray-60 text-xs flex gap-1.5">
                <span className="font-bold text-gray-35">{list.progress?.dueToday}</span>
                <span className="hidden xs:block">jetzt lernen</span>
                <span>/</span>
                <span className="xs:font-bold">{list.itemsCount}</span>
                <span className="hidden xs:block">insgesamt</span>
              </span>
            </Link>

            <div className="rounded-r-lg border-l border-gray-95 overflow-hidden flex bg-white">
              <ListSettingsModal
                list={list}
                toggleIcon={
                  <div className="p-2 text-gray-75 hover:text-gray-35">
                    <IconEdit className="h-7 w-7 p-1 rounded" />
                  </div>
                }
              />
            </div>
          </li>
        ))}
        <li key="new-list" className="bg-primary-5 rounded-lg flex shadow hover:shadow-gray-75">
          <AddListButton />
        </li>
      </ul>
    </>
  );
};

export default ListsPage;
