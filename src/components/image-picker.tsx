'use client';

import { Button } from '@/elements/button';
import { Spinner } from '@/elements/spinner';
import { TextField } from '@/elements/text-field';
import { isMobileAppleDevice } from '@/helpers/is-mobile-apple-device';
import { translate } from '@/helpers/translate';
import { searchUnsplash } from '@/helpers/unsplash';
import { useDebounce } from '@/hooks/use-debounce';
import { UnsplashImage } from '@/types/types';
import { FC, useEffect, useState } from 'react';
import { Modal } from './modal';

const IMGS_PER_PAGE = 10; // unsplash default

type Props = {
  searchTerm: string;
  onSetImage(img: UnsplashImage): void;
  onClose(): void;
};

export const ImagePicker: FC<Props> = ({ searchTerm: initialSearchTerm, onSetImage, onClose }) => {
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [lastSearched, setLastSearched] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const [imgs, setImgs] = useState<UnsplashImage[]>([]);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const search = async (overruleSearchTerm?: string) => {
    if (searching || (!overruleSearchTerm && debouncedSearchTerm === lastSearched)) {
      return;
    }

    const searchString = overruleSearchTerm || debouncedSearchTerm;
    if (!searchString) {
      return;
    }

    setLastSearched(searchString);
    setError('');
    setSearching(true);
    try {
      const translatedSearchString = await translate(searchString);
      const imgs = await searchUnsplash(translatedSearchString, 1);
      if (imgs.length === 0) {
        return setError('Keine Bilder gefunden');
      }
      setPage(1);
      setImgs(imgs);
    } catch {
      setError('Fehler beim Laden der Bilder');
    } finally {
      setSearching(false);
    }
  };
  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const loadMore = async () => {
    if (searching || !searchTerm) {
      return;
    }

    setLoadingMore(true);
    try {
      const translatedSearchTerm = await translate(searchTerm);
      const imgs = await searchUnsplash(translatedSearchTerm, page + 1);
      setPage((page) => page + 1);
      if (imgs.length === 0) {
        return setError('Keine weiteren Bilder');
      }
      setImgs((curImgs) => [...curImgs, ...imgs]);
    } catch {
      setError('Fehler beim Laden weiterer Bilder');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Modal
      title="Bild hinzufügen"
      onClose={onClose}
      width="lg"
      key="image-picker"
      header={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            search(searchTerm);
          }}
          className="flex justify-between items-start"
        >
          <TextField
            small
            autoCapitalize="none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="max-w-[250px] mb-1"
            autoFocus
          />
          <div className="flex ml-4 mt-1 text-right max-h-[30px]">
            {error}
            {searching && (
              <div className="relative -top-5 ml-2">
                <Spinner small />
              </div>
            )}
          </div>
        </form>
      }
    >
      {imgs.length > 0 && (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-4 flex-start">
            {imgs.map((img) => (
              <Image img={img} onSetImage={onSetImage} key={img.id} />
            ))}
          </ul>

          {Math.floor(imgs.length / page) === IMGS_PER_PAGE && (
            <Button onClick={loadMore} disabled={loadingMore}>
              Mehr laden…
            </Button>
          )}

          <p className="text-xs">
            Fotos von{' '}
            <a href="https://unsplash.com/?utm_source=inemit&utm_medium=referral">Unsplash</a>
          </p>
        </div>
      )}
    </Modal>
  );
};

const Image: FC<{ img: UnsplashImage; onSetImage: (img: UnsplashImage) => void }> = ({
  img,
  onSetImage,
}) => (
  <li
    key={img.id}
    role="button"
    className="relative cursor-pointer hover:opacity-75 group rounded overflow-hidden"
  >
    <img
      srcSet={`${img.urls.small} 400w, ${img.urls.regular} 1080w`}
      className="w-full aspect-square object-cover"
      onClick={() => onSetImage(img)}
    />
    <div
      className={`hidden ${
        isMobileAppleDevice() ? '' : 'group-hover:block'
      } absolute bottom-0 left-0 right-0 py-1 px-2 bg-[rgba(0,0,0,0.5)] text-xxs text-grey-10`}
    >
      <a
        href={`${img.user.link}?utm_source=inemit&utm_medium=referral`}
        onClick={(e) => e.stopPropagation()}
        target="_blank"
        rel="noopener noreferrer"
        className="!text-grey-85 hover:!text-grey-75"
      >
        {img.user.name}
      </a>
    </div>
  </li>
);
