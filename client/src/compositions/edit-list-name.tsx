import React, { FC, useState } from 'react';
import { Button } from '../elements/button';
import { TextField } from '../elements/text-field';
import { useApi } from '../hooks/use-api';

interface Props {
  currentName: string;
  listId: string;
  onNameChanged(name: string): void;
}

export const EditListName: FC<Props> = ({ currentName, listId, onNameChanged }) => {
  const { editListSettings } = useApi();
  const [name, setName] = useState<string>(currentName);
  const [disabled, setDisabled] = useState(false);

  const submit = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!name || name === currentName) {
      return;
    }

    setDisabled(true);

    try {
      const { name: newName } = await editListSettings({ listId, name });
      onNameChanged(newName);
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <form className="flex items-start">
      <TextField
        id="listName"
        disabled={disabled}
        value={name}
        placeholder={currentName}
        onChange={(e) => setName(e.target.value)}
        className="mr-5"
      />
      <Button type="submit" disabled={disabled} onClick={submit}>
        ändern
      </Button>
    </form>
  );
};
