'use client';

import { editItem } from '@/db/actions';
import { Hint } from '@/elements/hint';
import { IconFlag } from '@/elements/icons/flag';
import { IconSync } from '@/elements/icons/sync';
import { classNames } from '@/helpers/class-names';
import { FC, useEffect, useRef, useState } from 'react';

interface Props {
  flagged?: boolean;
  listId: string;
  itemId: string;
  tabIndex?: number;
  onDismissHint?: (() => {}) | false;
  onFlagged?: (flagged: boolean) => void;
}

export const FlagButton: FC<Props> = ({
  flagged: initial,
  listId,
  itemId,
  tabIndex,
  onDismissHint,
  onFlagged,
}) => {
  const [flagged, setFlagged] = useState(initial);
  const [loading, setLoading] = useState(false);
  const id = useRef<string>('');

  useEffect(() => {
    setFlagged(initial);
    id.current = itemId;
  }, [listId, itemId, initial]);

  const toggleFlagged = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const item = await editItem({ listId, itemId, item: { flagged: !flagged } });
      if (!item) return;

      // only change flagged state if still on screen (while learning)
      if (id.current === item.id) {
        onFlagged?.(!!item.flagged);
        setFlagged(item.flagged);
      }
    } catch (error) {
      console.log('Fehler beim Markieren');
    } finally {
      setLoading(false);
    }

    onDismissHint && onDismissHint();
  };

  return (
    <div className="w-6 h-6 relative flex justify-center">
      {onDismissHint && (
        <Hint onDismiss={onDismissHint} position="bottom">
          Die Flagge? Klick sie an, wenn du an einer Vokabel oder Abfrage etwas ändern möchtest. So
          merkst du sie zum Bearbeiten vor.
        </Hint>
      )}
      <button
        type="button"
        onClick={toggleFlagged}
        title="markieren"
        tabIndex={tabIndex}
        className={classNames(
          'leading-none aspect-square flex justify-center items-center rounded',
          loading ? 'cursor-not-allowed' : 'cursor-pointer',
          flagged ? 'text-primary-100 hover:text-primary-50' : 'text-gray-75 hover:text-gray-50',
        )}
      >
        {loading ? (
          <div
            title="speichern..."
            className={classNames(
              'animate-spin relative w-6 h-6 leading-none',
              flagged ? 'text-gray-75' : 'text-primary-100',
            )}
          >
            <IconSync className="w-6" />
          </div>
        ) : (
          <IconFlag className="h-5" />
        )}
      </button>
    </div>
  );
};
