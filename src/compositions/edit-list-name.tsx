'use client';

import { renameList } from '@/db/actions';
import { FC, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '../elements/button';
import { TextField } from '../elements/text-field';

interface Props {
  currentName: string;
  listId: string;
}

export const EditListName: FC<Props> = ({ currentName, listId }) => {
  const [name, setName] = useState<string>(currentName);
  const { pending } = useFormStatus();

  const submit = async () => {
    if (!name || name === currentName) {
      return;
    }

    try {
      await renameList(listId, name);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className="flex items-start"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <TextField
        id="listName"
        disabled={pending}
        value={name}
        placeholder={currentName}
        onChange={(e) => setName(e.target.value)}
        className="mr-5"
      />
      <Button type="submit" disabled={pending}>
        ändern
      </Button>
    </form>
  );
};
