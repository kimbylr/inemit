import { ImagePicker } from '@/components/image-picker';
import { Modal } from '@/components/modal';
import { deleteItem, editItem } from '@/db/actions';
import { Button } from '@/elements/button';
import { IconCrossCircle } from '@/elements/icons/cross-circle';
import { IconDone } from '@/elements/icons/done';
import { IconEdit } from '@/elements/icons/edit';
import { IconImagePortrait } from '@/elements/icons/image-portrait';
import { TextField } from '@/elements/text-field';
import { getLearnItemEditFields } from '@/helpers/learn-item';
import { onChooseImg } from '@/helpers/unsplash';
import { LearnItem, LearnItemEditFields, UnsplashImage } from '@/types/types';
import React, { FC, useState } from 'react';

type Props = {
  item: LearnItemEditFields & { id: string };
  listId: string;
  onClose: (item?: LearnItemEditFields) => void;
  onItemDeleted: () => void;
};

export const LearnItemDetailPopup: FC<Props> = ({ item, listId, onClose, onItemDeleted }) => {
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [currentItem, setCurrentItem] = useState(getLearnItemEditFields(item));
  const [saving, setSaving] = useState(false);

  const onSetImage = async (image: UnsplashImage | null) => {
    try {
      const result = await editItem({
        listId,
        itemId: item.id,
        item: { image, flagged: false },
      });
      if (!result) return;
      if (image !== null && !result.image) throw 'could not save image';
      setCurrentItem((item) => ({ ...item, image: result.image }));
      setShowImagePicker(false);
      image && onChooseImg(image.onChooseImgUrl);
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
      <ImagePicker
        searchTerm={currentItem.solution}
        onSetImage={onSetImage}
        onClose={() => setShowImagePicker(false)}
      />
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
              className="text-gray-75 hover:text-gray-50 focus-visible:text-gray-60 flex items-start ml-2 dotted-focus"
            >
              <IconImagePortrait className="w-16" />
              <span className="sr-only">Bild hinzufügen</span>
            </button>
          )}
        </div>

        <div className="mt-8 flex gap-4 justify-between items-center">
          <button
            type="button"
            onClick={onDelete}
            disabled={saving}
            className="text-negative-50 hover:text-negative-100 focus:text-negative-100 font-bold uppercase text-xxs flex items-center gap-2 relative button-focus button-focus-caution after:!-bottom-1.5"
          >
            <IconCrossCircle className="w-5" /> Löschen
          </button>
          <Button primary type="submit" onClick={onSave}>
            <IconDone className="w-5" /> Speichern
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const Image: FC<{
  image: LearnItem['image'];
  disabled: boolean;
  onClick(): void;
  onDelete(): void;
}> = ({ image, disabled, onClick, onDelete }) => (
  <div className="relative ml-2 flex items-center">
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="text-gray-75 hover:text-gray-25 dotted-focus"
    >
      <div className="relative">
        <img src={image?.urls.thumb} className="h-[77px] mb-0.5 rounded-sm w-auto opacity-50" />
        <span className="absolute text-gray-25 flex justify-center inset-0">
          <IconEdit className="drop-shadow-[0_0_4px_white] hidden group-hover:block w-5" />
        </span>
      </div>
    </button>

    <button
      type="button"
      onClick={onDelete}
      disabled={disabled}
      title="Bild entfernen"
      className="!absolute -top-2 -left-2 bg-gray-98 text-negative-50 rounded-full leading-none p-0.5 hover:text-negative-100 focus:text-negative-100 dotted-focus dotted-focus-rounded button-focus-caution"
    >
      <IconCrossCircle className="w-4" />
    </button>
  </div>
);
