import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../elements/button';
import { Input } from '../elements/input';
import { Label } from '../elements/label';
import { editListName } from '../helpers/api';

interface Props {
  currentName: string;
  listId: string;
  onNameChanged(name: string): void;
}

export const EditListName: FC<Props> = ({
  currentName,
  listId,
  onNameChanged,
}) => {
  const [name, setName] = useState<string>(currentName);
  const [disabled, setDisabled] = useState(false);

  const submit = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!name || name === currentName) {
      return;
    }

    setDisabled(true);

    try {
      const newName = await editListName({ listId, name });
      onNameChanged(newName);
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Container>
      <InputSection>
        <Label htmlFor="listName">Name</Label>
        <Input
          id="listName"
          disabled={disabled}
          value={name}
          placeholder={currentName}
          onChange={e => setName(e.target.value)}
        />
      </InputSection>
      <Button type="submit" disabled={disabled} onClick={submit}>
        ändern
      </Button>
    </Container>
  );
};

const InputSection = styled.div`
  margin-right: 20px;
`;

const Container = styled.form`
  display: flex;
  align-items: flex-end;
`;
