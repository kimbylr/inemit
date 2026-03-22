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
};

const initialResult: SearchResult = { items: [], totalCount: 0 };

export const ListOverviewSeach: FC<{ list: List }> = ({ list }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [{ totalCount, items }, setSearchResult] = useState<SearchResult>(initialResult);
  const [searching, setSearching] = useState(false);

  const search = async () => {
    if (searching || debouncedSearchTerm.length < 2) {
      return;
    }

    setError(false);
    setSearching(true);
    try {
      const results = await getFilteredListItems(list.slug, searchTerm);
      results && setSearchResult(results);
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

  const hasItems = items.length > 0;
  const hasMore = totalCount > items.length;

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
        {error && 'Fehler'}
        {hasItems && (
          <span>
            {items.length}
            {hasMore && <span className="text-gray-75">/{totalCount}</span>} Treffer
          </span>
        )}
      </div>
      <AnimatePresence>
        {hasItems && (
          <motion.div
            key="list"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
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
