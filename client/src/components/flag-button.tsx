import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '../elements/icon';
import { useApi } from '../hooks/use-api';

interface Props {
  flagged?: boolean;
  listId: string;
  itemId: string;
}

export const FlagButton: FC<Props> = ({ flagged: initial, listId, itemId }) => {
  const { editItem } = useApi();
  const [flagged, setFlagged] = useState(initial);

  useEffect(() => {
    setFlagged(initial);
  }, [listId, itemId, initial]);

  const toggleFlagged = async () => {
    const item = { flagged: !flagged };
    try {
      setFlagged((await editItem({ listId, itemId, item })).flagged);
    } catch (error) {
      console.log('Fehler beim Markieren');
    }
  };

  return (
    <Button
      type="button"
      flagged={flagged}
      onClick={toggleFlagged}
      title="markieren"
    >
      <Icon type="flag" width="20px" />
    </Button>
  );
};

const Button = styled.button<{ flagged?: boolean }>`
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  color: ${({ flagged, theme: { colors } }) =>
    flagged ? colors.primary[100] : colors.grey[75]};

  :hover {
    color: ${({ flagged, theme: { colors } }) =>
      flagged ? colors.primary[50] : colors.grey[50]};
  }
`;
