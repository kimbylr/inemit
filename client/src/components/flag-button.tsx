import { FC, useEffect, useRef, useState } from 'react';
import { Hint } from '../elements/hint';
import { Icon } from '../elements/icon';
import { useApi } from '../hooks/use-api';

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
  const { editItem } = useApi();
  const [flagged, setFlagged] = useState(initial);
  const [loading, setLoading] = useState(false);
  const id = useRef<string>('');

  useEffect(() => {
    setFlagged(initial);
    id.current = itemId;
  }, [listId, itemId, initial]);

  const toggleFlagged = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const item = await editItem({ listId, itemId, item: { flagged: !flagged } });
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
        className={`leading-none outline-none ${
          loading ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${
          flagged ? 'text-primary-100 hover:text-primary-50' : 'text-grey-75 hover:text-grey-50'
        }`}
      >
        {loading ? (
          <div
            title="speichern..."
            className={`animate-spin relative w-6 h-6 leading-none ${
              flagged ? 'text-grey-75' : 'text-primary-100'
            }`}
          >
            <Icon type="sync" width="24px" />
          </div>
        ) : (
          <Icon type="flag" width="20px" />
        )}
      </button>
    </div>
  );
};
