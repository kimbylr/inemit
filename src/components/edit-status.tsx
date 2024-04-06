import { IconItemEditAttention } from '@/elements/icons/item-edit-attention';
import { IconItemEditSaved } from '@/elements/icons/item-edit-saved';
import { IconItemEditSync } from '@/elements/icons/item-edit-sync';
import { IconItemEditUnsaved } from '@/elements/icons/item-edit-unsaved';
import React, { FC } from 'react';

interface Props {
  saved: boolean;
  saving: boolean;
  canSave: boolean;
  error: string | null;
  isNew?: boolean;
  submit: (event: React.MouseEvent) => Promise<void>;
}

export const EditStatus: FC<Props> = ({ saving, saved, canSave, error, isNew, submit }) => {
  if (saving) {
    return (
      <div title="speichern..." className="h-6 w-6 flex-shrink-0 animate-spin text-primary-100">
        <IconItemEditSync />
      </div>
    );
  }

  if (error) {
    return (
      <button
        type="submit"
        className="h-6 w-6 flex-shrink-0 outline-none disabled:text-gray-85 text-negative-100"
        onClick={submit}
        tabIndex={-1}
        title={error}
      >
        <IconItemEditAttention />
      </button>
    );
  }

  if (saved) {
    return (
      <div title="gespeichert" className="h-6 w-6 flex-shrink-0 text-primary-25">
        <IconItemEditSaved />
      </div>
    );
  }

  return (
    <button
      type="submit"
      onClick={submit}
      tabIndex={-1}
      title="speichern"
      disabled={!canSave} // new items
      className="h-6 w-6 flex-shrink-0 outline-none disabled:text-gray-85 text-primary-100"
    >
      {isNew ? <IconItemEditUnsaved /> : <IconItemEditSaved />}
    </button>
  );
};
