import React, { FC, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
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
    <Container>
      {onDismissHint && (
        <Hint onDismiss={onDismissHint} position="bottom">
          Die Flagge? Klick sie an, wenn du an einer Vokabel oder Abfrage etwas ändern
          möchtest. So merkst du sie zum Bearbeiten vor.
        </Hint>
      )}
      <Button
        type="button"
        flagged={flagged}
        onClick={toggleFlagged}
        title="markieren"
        tabIndex={tabIndex}
      >
        {loading ? (
          <Saving title="speichern..." flagged={flagged}>
            <Icon type="sync" width="24px" />
          </Saving>
        ) : (
          <Icon type="flag" width="20px" />
        )}
      </Button>
    </Container>
  );
};

const Container = styled.div`
  padding: 0;
  margin: 0;
  width: 240px;
  height: 24px;
  position: relative;
`;

const Button = styled.button<{ flagged?: boolean; loading?: boolean }>`
  padding: 0;
  margin: 0;
  width: 24px;
  height: 24px;
  line-height: 1;
  background: none;
  border: none;
  cursor: ${({ loading }) => (loading ? 'not-allowed' : 'pointer')};
  color: ${({ flagged, theme: { colors } }) =>
    flagged ? colors.primary[100] : colors.grey[75]};

  :hover {
    color: ${({ flagged, theme: { colors } }) =>
      flagged ? colors.primary[50] : colors.grey[50]};
  }
`;

const rotate = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;

const Saving = styled.div<{ flagged?: boolean }>`
  position: relative;
  top: -2px;
  left: -2px;
  width: 24px;
  height: 24px;
  line-height: 1;
  animation: ${rotate} 2s infinite linear;
  color: ${({ flagged, theme: { colors } }) =>
    flagged ? colors.grey[75] : colors.primary[100]};
`;
