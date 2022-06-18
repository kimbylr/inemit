import React, { FC } from 'react';
import { Icon } from '../elements/icon';

interface Props {
  saved: boolean;
  saving: boolean;
  canSave: boolean;
  error: string | null;
  isNew?: boolean;
  submit: (event: React.MouseEvent) => Promise<void>;
}

export const EditStatus: FC<Props> = ({
  saving,
  saved,
  canSave,
  error,
  isNew,
  submit,
}) => {
  if (saving) {
    return (
      <div
        title="speichern..."
        className="h-6 w-6 flex-shrink-0 animate-spin text-primary-100"
      >
        <Icon type="syncInCircle" />
      </div>
    );
  }

  if (error) {
    return (
      <button
        type="submit"
        className="h-6 w-6 flex-shrink-0 outline-none disabled:text-grey-85 text-negative-100"
        onClick={submit}
        tabIndex={-1}
        title={error}
      >
        <Icon type="attention" />
      </button>
    );
  }

  if (saved) {
    return (
      <div title="gespeichert" className="h-6 w-6 flex-shrink-0 text-primary-25">
        <Icon type="ok" />
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
      className="h-6 w-6 flex-shrink-0 outline-none disabled:text-grey-85 text-primary-100"
    >
      <Icon type={isNew ? 'new' : 'ok'} />
    </button>
  );
};
