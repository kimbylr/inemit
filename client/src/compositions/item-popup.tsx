import React, { FC, useState } from 'react';
import { ImagePicker } from '../components/image-picker';
import { Modal } from '../components/modal';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { TextField } from '../elements/text-field';
import { UnsplashImage, removeTrackSet } from '../helpers/unsplash';
import { useApi } from '../hooks/use-api';
import { BaseLearnItem, LearnItemForEditing } from '../models';

type Props = {
  item: LearnItemForEditing;
  listId: string;
  onClose: (item?: BaseLearnItem) => void;
  onItemDeleted: () => void;
};

export const ItemPopup: FC<Props> = ({ item, listId, onClose, onItemDeleted }) => {
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [currentItem, setCurrentItem] = useState<BaseLearnItem>({
    prompt: item.prompt,
    promptAddition: item.promptAddition,
    solution: item.solution,
    flagged: item.flagged,
    image: item.image,
  });

  const { deleteItem, editItem } = useApi();
  const [saving, setSaving] = useState(false);

  const onSetImage = async (img: UnsplashImage | null) => {
    try {
      const { image } = await editItem({
        listId,
        itemId: item.id,
        item: { image: removeTrackSet(img), flagged: false },
      });
      if (img !== null && !image) throw 'could not save image';
      setCurrentItem((item) => ({ ...item, image }));
      setShowImagePicker(false);
      img?.trackSet?.();
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async () => {
    if (!confirm('Diesen Eintrag löschen?')) {
      return;
    }

    setSaving(true);
    try {
      await deleteItem({ listId, itemId: item.id });
      onClose();
      onItemDeleted();
    } catch (error) {
      setSaving(false);
      alert('Löschen hat nicht geklappt. Bitte nochmals versuchen.');
    }
  };

  const onSave = async (event: React.MouseEvent | React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const newItem = await editItem({
        listId,
        itemId: item.id,
        item: {
          prompt: currentItem.prompt,
          promptAddition: currentItem.promptAddition,
          solution: currentItem.solution,
          flagged: false,
        },
      });
      onClose(newItem);
    } catch (error) {
      alert('Fehler beim Speichern.');
    } finally {
      setSaving(false);
    }
  };

  if (showImagePicker) {
    return (
      <Modal
        title="Bild hinzufügen"
        onClose={() => setShowImagePicker(false)}
        width="lg"
        key="img-picker" // identify as different modal so that eventListeners are unmounted
      >
        <ImagePicker searchTerm={currentItem.solution} onSetImage={onSetImage} />
      </Modal>
    );
  }

  return (
    <Modal
      title="Bearbeiten"
      onClose={() => onClose({ ...item, image: currentItem.image })} // only image changed, rest not saved
      width="lg"
      key="item-edit-detail"
    >
      <form className="flex flex-col gap-4">
        <h3>Vokabel</h3>

        <TextField
          autoCapitalize="none"
          value={currentItem.solution}
          placeholder={item.solution}
          onChange={({ target }) => setCurrentItem((item) => ({ ...item, solution: target.value }))}
          autoComplete="off"
          disabled={saving}
        />
        <p className="text-xs">
          👯 Mehrere Lösungen mit Kommas trennen
          <br />
          👾 Optionale Bestandteile in Klammern setzen
        </p>

        <h3 className="mt-4">Abfrage</h3>
        <div className="flex gap-2 h-20">
          <div className="flex flex-col gap-2 grow">
            <TextField
              autoCapitalize="none"
              value={currentItem.prompt}
              placeholder={item.prompt}
              onChange={({ target }) =>
                setCurrentItem((item) => ({ ...item, prompt: target.value }))
              }
              disabled={saving}
            />
            <TextField
              small
              autoCapitalize="none"
              value={currentItem.promptAddition || ''}
              placeholder={item.promptAddition || 'Zusatz'}
              onChange={({ target }) =>
                setCurrentItem((item) => ({ ...item, promptAddition: target.value }))
              }
              disabled={saving}
            />
          </div>

          {currentItem.image ? (
            <Image
              image={currentItem.image}
              onClick={() => setShowImagePicker(true)}
              onDelete={() => onSetImage(null)}
              disabled={saving}
            />
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => setShowImagePicker(true)}
              className="text-grey-75 hover:text-grey-50 outline-none focus-visible:text-grey-60 focus-visible:drop-shadow-[0_0_10px_#6cc17a] flex items-start ml-2"
            >
              <Icon type="imagePortrait" width="62px" />
              <span className="sr-only">Bild hinzufügen</span>
            </button>
          )}
        </div>

        <div className="mt-8 flex gap-4 justify-between items-center">
          <button
            type="button"
            onClick={onDelete}
            disabled={saving}
            className="text-negative-50 hover:text-negative-100 focus:text-negative-100 font-bold uppercase text-xxs flex items-center gap-2 outline-none relative button-focus button-focus-caution"
          >
            <Icon type="deleteInCircle" width="20px" /> Löschen
          </button>
          <Button primary type="submit" onClick={onSave}>
            <Icon type="done" width="20px" /> Speichern
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const Image: FC<{
  image: BaseLearnItem['image'];
  disabled: boolean;
  onClick(): void;
  onDelete(): void;
}> = ({ image, disabled, onClick, onDelete }) => (
  <div className="relative ml-2 flex items-center">
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-grey-75 hover:text-grey-25 outline-none group"
    >
      <div className="relative">
        <img
          src={image?.urls.thumb}
          className="h-[77px] mb-0.5 rounded-sm w-auto group-focus-visible:shadow-blurry-focus opacity-50"
        />
        <span className="absolute text-grey-25 flex justify-center inset-0">
          <Icon
            type="edit"
            width="20px"
            className="drop-shadow-[0_0_4px_white] hidden group-hover:block"
          />
        </span>
      </div>
    </button>

    <button
      type="button"
      tabIndex={-1}
      onClick={onDelete}
      disabled={disabled}
      title="Bild entfernen"
      className="absolute -top-2 -left-2 bg-grey-98 text-negative-50 rounded-full leading-none p-0.5 hover:text-negative-100"
    >
      <Icon type="deleteInCircle" width="16px" />
    </button>
  </div>
);
