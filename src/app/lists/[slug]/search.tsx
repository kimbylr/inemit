import { EditableItemsList } from '@/compositions/editable-items-list';
import { getFilteredListItems } from '@/db/actions';
import { Spinner } from '@/elements/spinner';
import { TextField } from '@/elements/text-field';
import { useDebounce } from '@/hooks/use-debounce';
import { LearnItem, List } from '@/types/types';
import { AnimatePresence, motion } from 'motion/react';
import { FC, useEffect, useRef, useState } from 'react';

type SearchResult = {
  items: LearnItem[];
  totalCount: number;
  isResult: boolean;
};

const initialResult: SearchResult = {
  items: [],
  totalCount: 0,
  isResult: false,
};

export const ListOverviewSeach: FC<{ list: List }> = ({ list }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [{ totalCount, items, isResult }, setSearchResult] = useState<SearchResult>(initialResult);
  const [searching, setSearching] = useState(false);

  const search = async () => {
    if (searching || debouncedSearchTerm.length < 2) {
      return;
    }

    setError(false);
    setSearching(true);
    try {
      const result = await getFilteredListItems(list.slug, searchTerm);
      result && setSearchResult({ ...result, isResult: true });
      setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    } catch {
      setError(true);
    } finally {
      setSearching(false);
    }
  };
  useEffect(() => {
    search();
  }, [debouncedSearchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    searchTerm === '' && setSearchResult(initialResult);
  }, [searchTerm]);

  const hasMore = totalCount > items.length;
  const debouncedHint = useDebounce(searchTerm, 1000);
  const showHint = !searching && debouncedSearchTerm.length === 1 && debouncedHint.length === 1;

  return (
    <>
      <div
        className="flex justify-between py-4 items-center gap-2 border-t-4 border-dotted border-gray-85"
        ref={ref}
      >
        <TextField
          small
          value={searchTerm}
          placeholder="Vokabel"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="!max-w-48 max-xs:!max-w-36"
          type="search"
          clearable
          onClear={() => setSearchTerm('')}
        />
        <span className="grow" />
        {searching && <Spinner size="xs" padding={false} />}
        {error && !showHint && 'Fehler'}
        {showHint && 'mind. 2 Buchstaben'}
        {isResult && !showHint && (
          <span>
            {items.length}
            {hasMore && <span className="text-gray-75">/{totalCount}</span>} Treffer
          </span>
        )}
      </div>
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            key="list"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{ duration: Math.min(0.1 * items.length, 0.5) }}
            exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <EditableItemsList listId={list.id} items={items} canAdd={false} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
