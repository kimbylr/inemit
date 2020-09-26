import React, { FC, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import { useApi } from '../hooks/use-api';

interface Props {
  flagged?: boolean;
  listId: string;
  itemId: string;
}

export const FlagButton: FC<Props> = ({ flagged: initial, listId, itemId }) => {
  const { editItem } = useApi();
  const [flagged, setFlagged] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFlagged(initial);
  }, [listId, itemId, initial]);

  const toggleFlagged = async () => {
    if (loading) {
      return;
    }

    const item = { flagged: !flagged };
    setLoading(true);

    try {
      setFlagged((await editItem({ listId, itemId, item })).flagged);
    } catch (error) {
      console.log('Fehler beim Markieren');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      flagged={flagged}
      onClick={toggleFlagged}
      title="markieren"
    >
      {loading ? (
        <Saving title="speichern..." flagged={flagged}>
          <Icon type="sync" width="24px" />
        </Saving>
      ) : (
        <Icon type="flag" width="20px" />
      )}
    </Button>
  );
};

const Button = styled.button<{ flagged?: boolean; loading?: boolean }>`
  padding: 0;
  margin: 0;
  width: 24px;
  height: 24px;
  line-height: 1;
  background: none;
  border: none;
  cursor: ${({ loading }) => (loading ? 'not-allowed' : 'pointer')};
  outline: none;
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
