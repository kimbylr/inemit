import { FC, useEffect, useRef, useState } from 'react';
import { EditableItem } from '../components/editable-item';
import { ExpandableArea } from '../components/expandable-area';
import { ProgressBar } from '../components/progress-bar';
import { ProgressPie } from '../components/progress-pie';
import { EditableItemsList } from '../compositions/editable-items-list';
import { LearnSettings } from '../compositions/learn-settings';
import { Button } from '../elements/button';
import { DueDaysSummary } from '../elements/due-days-summary';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import { useApi } from '../hooks/use-api';
import { useRouting } from '../hooks/use-routing';
import { MenuLayout } from '../layout/menu-layout';
import { LearnItem, ListWithProgress, LoadingStates } from '../models';

export const List: FC = () => {
  const [list, setList] = useState<ListWithProgress | null>(null);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);
  const { slug, goToList } = useRouting();
  const { getListBySlug } = useApi();
  const [items, setItems] = useState<LearnItem[]>([]);
  const learnButtonRef = useRef<HTMLButtonElement>(null);

  // Manage focus (tab when noting in focus => learn)
  useEffect(() => {
    if (!learnButtonRef.current) {
      return;
    }

    const onTabListener = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return;
      }

      if (document.activeElement === null || document.activeElement.nodeName === 'BODY') {
        // wait a tick (so that browser handles tab first)
        requestAnimationFrame(() => learnButtonRef.current?.focus());
      }
    };

    document.addEventListener('keydown', onTabListener);
    return () => document.removeEventListener('keydown', onTabListener);
  }, [list?.id]);

  const fetchList = async () => {
    if (!slug) {
      return;
    }

    setState(LoadingStates.loading);
    try {
      const list = await getListBySlug(slug);
      setList(list);
      setState(LoadingStates.loaded);
    } catch (error) {
      console.error(error);
      setList(null);
      setState(LoadingStates.error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchList();
    }
  }, [slug]);

  if (state === 'loading' || state === 'initial') {
    return (
      <MenuLayout pageWidth="tight">
        <Spinner />
      </MenuLayout>
    );
  }

  if (state === 'error' || !list) {
    return (
      <MenuLayout pageWidth="tight">
        <h2 className="mb-4">¯\_(ツ)_/¯</h2>
        <p>
          <strong>Liste nicht gefunden.</strong> Entweder gibt es sie wirklich nicht, oder
          du bist nicht mehr eingeloggt. Dann hilft neu laden.
        </p>
      </MenuLayout>
    );
  }

  const onItemsAdded = (newItems: LearnItem[]) => {
    setItems((items) => [...items, ...newItems]);
    setList((list) =>
      list ? { ...list, itemsCount: list.itemsCount + newItems.length } : null,
    );
  };

  const onItemSaved = (editedItem: LearnItem) => {
    setItems((items) =>
      items.map((item) => (editedItem.id === item.id ? editedItem : item)),
    );
  };

  const onItemDeleted = (id: string) => {
    setItems((items) => items.filter((item) => item.id !== id));
    setList((list) => (list ? { ...list, itemsCount: list.itemsCount - 1 } : null));
  };

  const onFlaggedItemDeleted = (id: string) => {
    setList((list) =>
      list
        ? {
            ...list,
            itemsCount: list.itemsCount - 1,
            flaggedItems: list.flaggedItems.filter((item) => item.id !== id),
          }
        : null,
    );
  };

  const { dueToday, dueTomorrow } = list.progress;
  const editList = () => goToList(list.slug, 'edit');
  const startLearning = () => goToList(list.slug, 'learn');

  return (
    <MenuLayout pageWidth="tight">
      <div className="flex items-center justify-between gap-4">
        <h2>{list.name}</h2>
        <LearnSettings list={list} />
      </div>

      {list.itemsCount > 0 && (
        <>
          <div className="mt-8 hidden xs:block">
            <ProgressBar stages={list.progress!.stages} showCountOnClick />
          </div>

          <div className="mt-4 xs:hidden">
            <ExpandableArea
              teaser={<ProgressPie stages={list.progress!.stages} />}
              showChevronButton={false}
            >
              <div className="pt-2">
                <ProgressBar stages={list.progress!.stages} showCountPerStage />
              </div>
            </ExpandableArea>
          </div>
        </>
      )}

      <p className="spaced">
        In dieser Liste {list.itemsCount === 1 ? 'befindet' : 'befinden'} sich{' '}
        <strong>
          {list.itemsCount} {list.itemsCount === 1 ? 'Vokabel' : 'Vokabeln'}
        </strong>
        . <DueDaysSummary dueToday={dueToday} dueTomorrow={dueTomorrow} />
      </p>

      <div className="flex gap-3 flex-col items-stretch xxs:flex-row">
        {dueToday > 0 && (
          <Button primary onClick={startLearning} ref={learnButtonRef}>
            <Icon type="logo" width="18px" />
            Jetzt lernen!
          </Button>
        )}
        <Button onClick={editList}>
          <Icon type="edit" width="14px" /> bearbeiten
        </Button>
      </div>

      {list.flaggedItems.length > 0 && (
        <div className="mt-12">
          <h3 className="flex gap-3 items-center">
            Markiert <Icon type="flag" width="16px" />
          </h3>
          <ul>
            {list.flaggedItems.map((item, index) => (
              <li
                key={item.id}
                className="border-t-4 border-dotted border-grey-85 pt-4 m-0 last:border-b-4"
              >
                <EditableItem
                  item={item}
                  index={index + 1}
                  listId={list.id}
                  onItemDeleted={onFlaggedItemDeleted}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12">
        <h3>Hinzufügen</h3>
        <EditableItemsList
          items={items}
          listId={list.id}
          onItemsAdded={onItemsAdded}
          onItemDeleted={onItemDeleted}
          onItemSaved={onItemSaved}
        />
      </div>
    </MenuLayout>
  );
};
