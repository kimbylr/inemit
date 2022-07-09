import { FC, useEffect, useState } from 'react';
import { EditableItem } from '../components/editable-item';
import { EditableItemsList } from '../compositions/editable-items-list';
import { ListSettings } from '../compositions/list-settings';
import { Button } from '../elements/button';
import { Checkbox } from '../elements/checkbox';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import { TextField } from '../elements/text-field';
import { markDoublets } from '../helpers/mark-doublets';
import { useApi } from '../hooks/use-api';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { MenuLayout } from '../layout/menu-layout';
import { LearnItem, LoadingStates } from '../models';

export const EditList: FC = () => {
  const { getItems } = useApi();
  const [items, setItems] = useState<LearnItem[]>([]);
  const [state, setState] = useState<LoadingStates>(LoadingStates.initial);
  const { slug, goToList } = useRouting();
  const { lists, state: listsState, updateList } = useLists();
  const list = lists.find((list) => list.slug === slug);

  const [search, setSearch] = useState('');
  const [showDoublets, setShowDoublets] = useState(false);

  const fetchItems = async () => {
    if (!list) {
      return;
    }

    setState(LoadingStates.loading);

    try {
      const items = await getItems(list.id);
      setItems(markDoublets(items));
      setState(LoadingStates.loaded);
    } catch (error) {
      console.error(error);
      setState(LoadingStates.error);
    }
  };

  useEffect(() => {
    if (slug && listsState === 'loaded') {
      fetchItems();
    }
  }, [slug, listsState]);

  useEffect(() => {
    if (state === 'loaded' && list) {
      // TODO: list could be stale. including it leads to circular updating.
      //–> better state handling needed (e.g. with proper redux actions)
      updateList({ ...list, itemsCount: items.length });
    }
  }, [items.length]);

  if (state === 'loading' || state === 'initial') {
    return (
      <MenuLayout pageWidth="wide">
        <Spinner />
      </MenuLayout>
    );
  }

  if (state === 'error' || !list) {
    return (
      <MenuLayout pageWidth="wide">
        <h2 className="mb-4">¯\_(ツ)_/¯</h2>
        <p>Leider ist etwas schief gelaufen.</p>
      </MenuLayout>
    );
  }

  const onListNameChanged = (name: string) => {
    updateList({ ...list, name });
  };

  const onItemsAdded = (newItems: LearnItem[]) => {
    setItems((items) => markDoublets([...items, ...newItems]));
  };

  const onItemSaved = (editedItem: LearnItem) => {
    setItems((items) =>
      markDoublets(items.map((item) => (editedItem.id === item.id ? editedItem : item))),
    );
  };

  const onItemDeleted = (id: string) => {
    setItems((items) => markDoublets(items.filter((item) => item.id !== id)));
  };

  const flaggedItems = items.filter(({ flagged }) => flagged);

  const filteredItems =
    search || showDoublets
      ? items
          .map((item, i) => ({ ...item, index: i + 1 }))
          .filter(showDoublets ? (item) => typeof item.doubletOf === 'number' : Boolean)
          .filter(
            search
              ? (item) =>
                  item.prompt.toLowerCase().includes(search) ||
                  item.solution.toLowerCase().includes(search)
              : Boolean,
          )
      : items;

  return (
    <MenuLayout pageWidth="wide">
      <div className="flex items-start justify-between gap-4">
        <button className="text-xs mt-0 mb-6 text-grey-50" onClick={() => goToList(slug)}>
          ← Zurück zur Übersicht
        </button>
        <ListSettings
          list={list}
          onListNameChanged={onListNameChanged}
          onItemsAdded={onItemsAdded}
        />
      </div>
      <h2>{list.name}</h2>
      <p className="spaced">
        In dieser Liste {items.length === 1 ? 'befindet' : 'befinden'} sich{' '}
        <strong>
          {items.length} {items.length === 1 ? 'Vokabel' : 'Vokabeln'}
        </strong>
        .{' '}
        <Button
          small
          onClick={() => Array.from(document.querySelectorAll('input')).at(-2)?.focus()}
        >
          <Icon type="add" width="17px" /> Hinzufügen …
        </Button>
      </p>
      <Explainer />
      {flaggedItems.length > 0 && (
        <>
          <h4 className="flex items-center gap-2 mb-2">
            Markiert <Icon type="flag" width="16px" />
          </h4>
          <ul>
            {flaggedItems.map((item, index) => (
              <li
                key={item.id}
                className="border-t-4 border-dotted border-grey-85 pt-4 pb-1 last:border-b-4"
              >
                <EditableItem
                  item={item}
                  index={index + 1}
                  listId={list.id}
                  onItemDeleted={onItemDeleted}
                />
              </li>
            ))}
          </ul>
          <h4 className="relative top-8">Alle</h4>
        </>
      )}

      <div
        className="flex gap-6 justify-between items-start sticky top-0 mt-8 p-2 pb-4 -mx-2 z-20 bg-grey-98"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)' }}
      >
        <div className="flex gap-4 flex-wrap items-center">
          <TextField
            small
            value={search}
            placeholder="Suchen…"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            className={`${search ? 'w-[200px]' : 'w-[100px] sm:w-[200px]'} max-w-full`}
          />
          <Checkbox checked={showDoublets} onCheck={() => setShowDoublets((s) => !s)}>
            Doppelte <span className="hidden xs:inline">zeigen</span>
          </Checkbox>
        </div>

        <Button primary small onClick={() => goToList(slug)}>
          <Icon type="done" width="14px" /> fertig
        </Button>
      </div>
      <EditableItemsList
        items={filteredItems}
        listId={list.id}
        onItemsAdded={onItemsAdded}
        onItemDeleted={onItemDeleted}
        onItemSaved={onItemSaved}
      />
    </MenuLayout>
  );
};

const Explainer = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <p className="mb-4">
        <strong>Denk dran:</strong> Vokabelpaare selbst erfassen ist sinnvoll investierte
        Zeit!{' '}
        {expanded ? (
          'Das Ausdenken einer Aufgabe verankert das Wort ein erstes Mal. Und es verhindert, dass du Lernzeit mit Wörtern vergeudest, die du schon beherrschst.'
        ) : (
          <Button small onClick={() => setExpanded(true)} className="relative -top-1">
            Wieso?
          </Button>
        )}
      </p>
      {expanded && (
        <>
          <p>Einige Tipps für grösseren Lerneffekt:</p>
          <ul className="actual-list mb-8">
            <li>
              <strong>Kontext</strong>: Am besten funktionieren Aufgaben, die das
              Lernmaterial in einen Kontext stellen, also z.B. in einem Satz oder Ausdruck
              verwenden.
            </li>
            <li>
              <strong>Bilder</strong> unterstützen den immersiven Effekt.
            </li>
            <li>
              <strong>Synonyme</strong> haben den Vorteil, dass die Verknüpfungen{' '}
              <em>innerhalb</em> der Lernsprache verstärkt werden (und nicht zur
              Muttersprache).
            </li>
          </ul>
        </>
      )}
    </>
  );
};
