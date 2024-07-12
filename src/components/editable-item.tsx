'use client';

import { EditStatus } from '@/components/edit-status';
import { FlagButton } from '@/components/flag-button';
import { ImagePicker } from '@/components/image-picker';
import { LearnItemDetailPopup } from '@/compositions/learn-item-detail-popup';
import { addItem, editItem } from '@/db/actions';
import { Hint } from '@/elements/hint';
import { IconCrossCircle } from '@/elements/icons/cross-circle';
import { IconEdit } from '@/elements/icons/edit';
import { IconImage } from '@/elements/icons/image';
import { IconMore } from '@/elements/icons/more';
import { IconMoreActive } from '@/elements/icons/more-plus';
import { TextField } from '@/elements/text-field';
import { getLearnItemEditFields } from '@/helpers/learn-item';
import { onChooseImg } from '@/helpers/unsplash';
import { LearnItem, LearnItemEditFields, UnsplashImage } from '@/types/types';
import React, { FC, useRef, useState } from 'react';

interface Props {
  listId: string;
  index?: number;
  item: Omit<LearnItem, 'created' | 'updated'>;
  onDismissHint?: false | (() => void);
  onItemDeleted?(id: string): void;
  onNewItemEdited?(): void; // triggers adding a new empty item
  onNewItemSaved?(item: LearnItem, tempId: string): void;
}

export const EditableItem: FC<Props> = ({
  listId,
  index,
  item,
  onDismissHint,
  onItemDeleted = () => {},
  onNewItemEdited = () => {},
  onNewItemSaved = () => {},
}) => {
  const imageButtonRef = useRef<HTMLButtonElement>(null);

  const [savedItem, setSavedItem] = useState<LearnItemEditFields>(getLearnItemEditFields(item));
  const [currentItem, setCurrentItem] = useState<LearnItemEditFields>(getLearnItemEditFields(item));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [initiallyEdited, setInitiallyEdited] = useState(!item.isNew);
  const hasEdited = () => {
    if (!initiallyEdited) {
      onNewItemEdited();
      setInitiallyEdited(true);
    }
  };

  const onChangePrompt = (value: string) => {
    setCurrentItem((item) => ({ ...item, prompt: value }));
    hasEdited();
  };
  const onChangeSolution = (value: string) => {
    setCurrentItem((item) => ({ ...item, solution: value }));
    hasEdited();
  };

  const saved =
    !item.isNew &&
    currentItem.prompt === savedItem.prompt &&
    currentItem.solution === savedItem.solution;
  const canSave = !!currentItem.prompt && !!currentItem.solution && !saved;

  const submit = async (event: React.MouseEvent | React.FocusEvent | React.FormEvent) => {
    event.preventDefault();
    if (!canSave || saving) return;

    setSaving(true);
    setError(null);

    // create item
    if (item.isNew) {
      try {
        const res = await addItem({ listId, item: currentItem });
        res && onNewItemSaved?.(res, item.id);
      } catch (error) {
        setError('Fehler beim speichern. Klicken, um nochmals zu versuchen.');
      } finally {
        setSaving(false);
      }
      return;
    }

    // edit item
    try {
      const savedItem = await editItem({
        listId,
        itemId: item.id,
        item: {
          prompt: currentItem.prompt,
          solution: currentItem.solution,
          flagged: false,
        },
      });
      if (!savedItem) throw new Error('Saving failed');
      const { prompt, solution, image, flagged } = savedItem;
      setSavedItem({ prompt, solution, image, flagged });
    } catch (error) {
      setError('Fehler beim speichern. Klicken, um nochmals zu versuchen.');
    } finally {
      setSaving(false);
    }
  };

  const onSetImage = async (img: UnsplashImage | null) => {
    if (!initiallyEdited || saving) {
      return;
    }

    setSaving(true);
    try {
      const savedItem = await editItem({
        listId,
        itemId: item.id,
        item: { image: img, flagged: false },
      });

      if (!savedItem) throw new Error('Saving failed');
      const { prompt, solution, image, flagged } = savedItem;
      if (img !== null && !image) throw new Error('could not save image');

      setSavedItem({ prompt, solution, image, flagged });
      setCurrentItem({ prompt, solution, image, flagged });
      setShowImagePicker(false);
      img === null && imageButtonRef.current?.focus(); // after deleting
      img && onChooseImg(img.onChooseImgUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const isDoublet = typeof item.doubletOf === 'number';
  const doubletTitle = isDoublet
    ? `Vokabel ist ein Duplikat von ${item.doubletOf! + 1}`
    : undefined;

  return (
    <>
      <form onSubmit={submit} className="flex items-start">
        <div className="w-5 self-stretch shrink-0 flex flex-col justify-between items-center mr-3 mb-4">
          {item.flagged ? (
            <FlagButton
              flagged={savedItem.flagged}
              listId={listId}
              itemId={item.id}
              onFlagged={(flagged) => setSavedItem((item) => ({ ...item, flagged }))}
            />
          ) : (
            <span className="text-xxs text-gray-75 flex justify-center">{index}</span>
          )}
          {!item.isNew && (
            <button
              className="text-gray-75 hover:text-gray-25 rounded-full"
              onClick={() => setShowDetail(true)}
              type="button"
            >
              {currentItem.promptAddition ? <IconMoreActive /> : <IconMore />}
            </button>
          )}
        </div>

        <div className="flex flex-grow flex-wrap">
          <div className="mr-5 mb-3 basis-[200px] flex-grow relative">
            {onDismissHint && (
              <Hint onDismiss={onDismissHint} triangle>
                <>
                  Hier schreibst du rein, was du lernen willst (z.B. <em>il gatto</em>).
                </>
                <>
                  Optionales in Klammern: <em>(il) gatto</em> akzeptiert <em>il gatto</em> oder{' '}
                  <em>gatto</em> als Lösung.
                </>
                <>
                  Mehrere mögliche Lösungen mit Komma abtrennen: <em>certo, sicuro</em> heisst,{' '}
                  <em>certo</em> und <em>sicuro</em> sind beide richtig.
                </>
              </Hint>
            )}

            <TextField
              className={isDoublet ? '!border-orange-100' : ''}
              title={doubletTitle}
              autoCapitalize="none"
              onBlur={submit}
              value={currentItem.solution}
              placeholder={savedItem.solution}
              onChange={(e) => onChangeSolution(e.target.value)}
              label="Vokabel"
              autoComplete="off"
            />
          </div>
          <div className="mr-5 mb-3 basis-[200px] flex-grow">
            <div className="flex items-start">
              <div className="flex-grow">
                <TextField
                  autoCapitalize="none"
                  onBlur={submit}
                  value={currentItem.prompt}
                  placeholder={savedItem.prompt}
                  onChange={(e) => onChangePrompt(e.target.value)}
                  label="Abfrage"
                />
              </div>
              {!item.isNew && (
                <div className="relative ml-2.5 h-10 flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowImagePicker((active) => !active)}
                    className="text-gray-75 hover:text-gray-25 rounded-sm"
                    ref={imageButtonRef}
                  >
                    {currentItem.image ? (
                      <div className="relative">
                        <img
                          src={currentItem.image.urls.thumb}
                          alt=""
                          className="h-[38px] w-[38px] rounded-sm hover:opacity-75 object-cover"
                        />
                        <span className="absolute top-2 text-gray-25 flex justify-center w-full">
                          <IconEdit className="w-5 drop-shadow-[0_0_4px_white] hidden group-hover:block" />
                        </span>
                      </div>
                    ) : (
                      <IconImage className="w-[38px]" />
                    )}
                  </button>
                  {currentItem.image && (
                    <button
                      type="button"
                      onClick={() => onSetImage(null)}
                      title="Bild entfernen"
                      className="!absolute -top-2 -left-2 bg-gray-95 text-negative-50 rounded-full leading-none p-0.5 hover:text-negative-100 focus:text-negative-100 focus-caution"
                    >
                      <IconCrossCircle className="w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center self-stretch mb-9">
          <EditStatus
            isNew={item.isNew}
            canSave={canSave}
            saving={saving}
            saved={saved}
            error={error}
            submit={submit}
          />
        </div>
      </form>

      {showImagePicker && (
        <ImagePicker
          searchTerm={currentItem.solution}
          onSetImage={onSetImage}
          onClose={() => setShowImagePicker(false)}
        />
      )}

      {showDetail && (
        <LearnItemDetailPopup
          item={{ ...item, ...currentItem }}
          listId={listId}
          onClose={(changedItem?: LearnItemEditFields) => {
            if (changedItem) {
              setCurrentItem(changedItem);
              setSavedItem(changedItem);
            }

            setShowDetail(false);
          }}
          onItemDeleted={() => onItemDeleted(item.id)}
        />
      )}
    </>
  );
};
