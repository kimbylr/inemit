import React, { FC, useState } from 'react';
import { EditStatus } from '../components/edit-status';
import { FlagButton } from '../components/flag-button';
import { ItemPopup } from '../compositions/item-popup';
import { Hint } from '../elements/hint';
import { Icon } from '../elements/icon';
import { TextField } from '../elements/text-field';
import { UnsplashImage, removeTrackSet } from '../helpers/unsplash';
import { useApi } from '../hooks/use-api';
import { BaseLearnItem, LearnItem, LearnItemForEditing } from '../models';
import { ImagePicker } from './image-picker';
import { Modal } from './modal';

interface Props {
  listId: string;
  index?: number;
  item: LearnItemForEditing;
  onDismissHint?: false | (() => void);
  onItemDeleted?(id: string): void;
  onItemSaved?(item: LearnItem): void;
  onNewItemEdited?(): void;
  onNewItemSaved?(item: LearnItem, tempId: string): void;
}

export const EditableItem: FC<Props> = ({
  listId,
  index,
  item,
  onDismissHint,
  onItemDeleted = () => {},
  onItemSaved = () => {},
  onNewItemEdited = () => {},
  onNewItemSaved = () => {},
}) => {
  const { addItems, editItem } = useApi();
  const [savedItem, setSavedItem] = useState<BaseLearnItem>({
    prompt: item.prompt,
    promptAddition: item.promptAddition,
    solution: item.solution,
    flagged: item.flagged,
    image: item.image,
  });
  const [currentItem, setCurrentItem] = useState<BaseLearnItem>({
    prompt: item.prompt,
    promptAddition: item.promptAddition,
    solution: item.solution,
    flagged: item.flagged,
    image: item.image,
  });
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

    if (!canSave || saving) {
      return;
    }

    setSaving(true);
    setError(null);

    if (item.isNew) {
      try {
        const [newItem] = await addItems({ listId, items: [currentItem] });
        onNewItemSaved && onNewItemSaved(newItem, item.id);
      } catch (error) {
        setSaving(false);
        setError('Fehler beim speichern. Klicken, um nochmals zu versuchen.');
      }
    } else {
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
        const { prompt, solution, image, flagged } = savedItem;
        setSavedItem({ prompt, solution, image, flagged });
        onItemSaved(savedItem); // TODO: propagate to store
      } catch (error) {
        setError('Fehler beim speichern. Klicken, um nochmals zu versuchen.');
      } finally {
        setSaving(false);
      }
    }
  };

  const onSetImage = async (img: UnsplashImage | null) => {
    if (!initiallyEdited || saving) {
      return;
    }

    setSaving(true);
    try {
      const { prompt, solution, image, flagged } = await editItem({
        listId,
        itemId: item.id,
        item: { image: removeTrackSet(img), flagged: false },
      });
      if (img !== null && !image) throw 'could not save image';
      setSavedItem({ prompt, solution, image, flagged });
      setCurrentItem({ prompt, solution, image, flagged });
      setShowImagePicker(false);
      img?.trackSet?.();
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
            <span className="text-xxs text-grey-75 flex justify-center">{index}</span>
          )}
          {!item.isNew && (
            <button
              className="text-grey-75 hover:text-grey-25 outline-none focus-visible:drop-shadow-[0_0_2px_#6cc17a]"
              onClick={() => setShowDetail(true)}
              type="button"
            >
              <Icon type={currentItem.promptAddition ? 'morePlus' : 'more'} />
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
                <div className="relative ml-2 h-10 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowImagePicker((active) => !active)}
                    className="text-grey-75 hover:text-grey-25 outline-none group"
                  >
                    {currentItem.image ? (
                      <div className="relative">
                        <img
                          src={currentItem.image.urls.thumb}
                          className="h-9 mb-0.5 rounded-sm w-auto group-focus-visible:shadow-blurry-focus opacity-50"
                        />
                        <span className="absolute top-2 text-grey-25 flex justify-center w-full">
                          <Icon
                            type="edit"
                            width="20px"
                            className="drop-shadow-[0_0_4px_white] hidden group-hover:block"
                          />
                        </span>
                      </div>
                    ) : (
                      <Icon
                        type="image"
                        width="32px"
                        className="group-focus-visible:drop-shadow-[0_0_4px_#6cc17a]"
                      />
                    )}
                  </button>
                  {currentItem.image && (
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => onSetImage(null)}
                      title="Bild entfernen"
                      className="absolute -top-2 -left-2 bg-grey-98 text-negative-50 rounded-full leading-none p-0.5 hover:text-negative-100"
                    >
                      <Icon type="deleteInCircle" width="16px" />
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
        <Modal title="Bild hinzufügen" onClose={() => setShowImagePicker(false)} width="lg">
          <ImagePicker searchTerm={currentItem.solution} onSetImage={onSetImage} />
        </Modal>
      )}

      {showDetail && (
        <ItemPopup
          item={{ ...item, ...currentItem }}
          listId={listId}
          onClose={(newItem?: BaseLearnItem) => {
            if (newItem) {
              setCurrentItem(newItem);
              setSavedItem(newItem);
              onItemSaved({ ...item, ...newItem } as LearnItem);
            }

            setShowDetail(false);
          }}
          onItemDeleted={() => onItemDeleted(item.id)}
        />
      )}
    </>
  );
};
