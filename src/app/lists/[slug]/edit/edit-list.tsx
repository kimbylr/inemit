'use client';

import { EditableItem } from '@/components/editable-item';
import { EditableItemsList } from '@/compositions/editable-items-list';
import { ImportPopup } from '@/compositions/import-popup';
import { Button } from '@/elements/button';
import { Checkbox } from '@/elements/checkbox';
import { IconAdd } from '@/elements/icons/add';
import { IconFlag } from '@/elements/icons/flag';
import { IconImport } from '@/elements/icons/import';
import { TextField } from '@/elements/text-field';
import { classNames } from '@/helpers/class-names';
import { List } from '@/types/types';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

export const EditList: FC<{ list: List<'flaggedItems' | 'lastLearnt' | 'items'> }> = ({ list }) => {
  const { refresh } = useRouter();

  const [showImport, setShowImport] = useState(false);
  const [search, setSearch] = useState('');
  const [showDoublets, setShowDoublets] = useState(false);

  const flaggedItems = list.items.filter(({ flagged }) => flagged);

  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const el = document.getElementById('sticky-search-container');
    const onScroll = () => setIsSticky(!!el && el.getBoundingClientRect().top <= 0);

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <p className="spaced">
        In dieser Liste {list.items.length === 1 ? 'befindet' : 'befinden'} sich{' '}
        <strong>
          {list.items.length} {list.items.length === 1 ? 'Vokabel' : 'Vokabeln'}
        </strong>
        .
      </p>
      <div className="mb-8 flex gap-4">
        <Button
          primary
          onClick={() => Array.from(document.querySelectorAll('input')).at(-2)?.focus()}
        >
          <IconAdd className="h-4 w-4" />
          Erfassen
        </Button>
        <Button onClick={() => setShowImport(true)}>
          <IconImport className="h-4 w-4" /> Importieren…
        </Button>
        {showImport && (
          <ImportPopup
            listId={list.id}
            onClose={() => setShowImport(false)}
            onItemsAdded={() => {
              refresh();
              setShowImport(false);
            }}
          />
        )}
      </div>
      <Explainer />
      {flaggedItems.length > 0 && (
        <>
          <h2 className="flex items-center gap-2 mb-2">
            Markiert
            <IconFlag className="h-4" />
          </h2>
          <ul>
            {flaggedItems.map((item, index) => (
              <li
                key={item.id}
                className="border-t-4 border-dotted border-gray-85 pt-4 pb-1 last:border-b-4"
              >
                <EditableItem item={item} index={index + 1} listId={list.id} />
              </li>
            ))}
          </ul>
          <h2 className="relative top-8">Alle</h2>
        </>
      )}

      <div
        id="sticky-search-container"
        className={classNames(
          'sticky top-0 mt-8 px-2 py-3 -mx-2 z-30 bg-gray-95 h-14 transition-all',
          isSticky &&
            'max-xs:bg-white/60 max-xs:-mx-4 max-xs:rounded-full max-xs:px-4 max-xs:backdrop-blur-lg',
        )}
      >
        <div className="flex gap-4 flex-wrap items-center">
          <TextField
            small
            value={search}
            placeholder="Suchen…"
            onChange={(e) => setSearch(e.target.value)}
            className="!w-44"
            type="search"
          />
          <Checkbox checked={showDoublets} onCheck={() => setShowDoublets((s) => !s)}>
            Doppelte<span className="hidden sm:inline"> anzeigen</span>
          </Checkbox>
        </div>
      </div>
      <div className="sticky max-xs:hidden h-px w-full bg-gray-85 top-14 z-10" />
      <div className="relative h-px w-full -top-px z-20 bg-gray-95" />
      <EditableItemsList
        items={list.items}
        listId={list.id}
        filterBy={{ doublets: showDoublets, search }}
      />
    </>
  );
};

const Explainer = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <p className="mb-4 text-xs leading-relaxed">
        <strong>Denk dran:</strong> Vokabelpaare selbst erfassen ist sinnvoll investierte Zeit!{' '}
        {expanded ? (
          'Das Ausdenken einer Aufgabe verankert das Wort ein erstes Mal. Und es verhindert, dass du Lernzeit mit Wörtern vergeudest, die du schon beherrschst.'
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="underline text-gray-50 hover:text-primary-150 font-bold"
          >
            Wieso?
          </button>
        )}
      </p>
      {expanded && (
        <>
          <p className="text-xs">Einige Tipps für den grössten Lerneffekt:</p>
          <ul className="actual-list mb-8">
            <li>
              <strong>Kontext</strong>: Am besten funktionieren Aufgaben, die das Lernmaterial in
              einen Kontext stellen, also z.B. in einem Satz oder Ausdruck verwenden.
            </li>
            <li>
              <strong>Bilder</strong> unterstützen den immersiven Effekt.
            </li>
            <li>
              <strong>Synonyme</strong> haben den Vorteil, dass die Verknüpfungen <em>innerhalb</em>{' '}
              der Lernsprache verstärkt werden (und nicht zu deiner Muttersprache).
            </li>
          </ul>
        </>
      )}
    </>
  );
};
