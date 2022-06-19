import { FC, useEffect, useState } from 'react';
import { Button } from '../elements/button';
import { ExtLink } from '../elements/link';
import { Spinner } from '../elements/spinner';
import { TextField } from '../elements/text-field';
import { translate } from '../helpers/translate';
import { mapUnsplashImage, searchUnsplash, UnsplashImage } from '../helpers/unsplash';
import { useDebounce } from '../hooks/use-debounce';

const IMGS_PER_PAGE = 10; // unsplash default

type Props = {
  searchTerm: string;
  onSetImage(img: UnsplashImage): void;
};
export const ImagePicker: FC<Props> = ({ searchTerm: initialSearchTerm, onSetImage }) => {
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
      const res = await searchUnsplash(translatedSearchString, 1);
      const { results } = await res.json();
      if (results.length === 0) {
        return setError('Keine Bilder gefunden');
      }
      setPage(1);
      setImgs(results.map(mapUnsplashImage));
    } catch {
      setError('Fehler beim Laden der Bilder');
    } finally {
      setSearching(false);
    }
  };
  useEffect(() => {
    search();
  }, [debouncedSearchTerm]);

  const loadMore = async () => {
    if (searching || !searchTerm) {
      return;
    }

    setLoadingMore(true);
    try {
      const translatedSearchTerm = await translate(searchTerm);
      const res = await searchUnsplash(translatedSearchTerm, page + 1);
      const { results } = await res.json();
      setPage((page) => page + 1);
      if (results.length === 0) {
        return setError('Keine weiteren Bilder');
      }
      setImgs((imgs) => [...imgs, ...results.map(mapUnsplashImage)]);
    } catch {
      setError('Fehler beim Laden weiterer Bilder');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex flex-col">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(searchTerm);
        }}
        className="h-12 mb-2 flex justify-between items-start"
      >
        <TextField
          small
          autoCapitalize="none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={(e) => e.target.select()}
          className="max-w-[250px] mb-1"
        />
        <div className="flex ml-4 mt-1 text-right">
          {error}
          {searching && (
            <div className="relative -top-5 ml-2">
              <Spinner small />
            </div>
          )}
        </div>
      </form>

      {imgs.length > 0 && (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col xs:flex-row gap-4">
            {/* >480px: two cols */}
            <div className="hidden xs:flex flex-col gap-4 flex-start">
              {imgs
                .filter((_, i) => i % 10 < 5)
                .map((img) => (
                  <Image img={img} onSetImage={onSetImage} />
                ))}
            </div>
            <div className="hidden xs:flex flex-col gap-4 flex-start">
              {imgs
                .filter((_, i) => i % 10 >= 5)
                .map((img) => (
                  <Image img={img} onSetImage={onSetImage} />
                ))}
            </div>

            {/* mobile */}
            <div className="flex flex-col gap-4 flex-start xs:hidden">
              {imgs.map((img) => (
                <Image img={img} onSetImage={onSetImage} />
              ))}
            </div>
          </ul>

          {Math.floor(imgs.length / page) === IMGS_PER_PAGE && (
            <Button onClick={loadMore} disabled={loadingMore}>
              Mehr laden…
            </Button>
          )}

          <p className="text-xs">
            Fotos von{' '}
            <ExtLink href="https://unsplash.com/?utm_source=inemit&utm_medium=referral">
              Unsplash
            </ExtLink>
          </p>
        </div>
      )}
    </div>
  );
};

const Image: FC<{ img: UnsplashImage; onSetImage: (img: UnsplashImage) => void }> = ({
  img,
  onSetImage,
}) => (
  <li
    key={img.id}
    role="button"
    onClick={() => onSetImage(img)}
    className="relative cursor-pointer hover:opacity-75 group rounded overflow-hidden"
  >
    <img src={img.urls.small} className="w-full" />
    <div className="hidden group-hover:block absolute bottom-0 left-0 right-0 py-1 px-2 bg-[rgba(0,0,0,0.5)] text-xxs text-grey-10">
      <ExtLink
        href={`${img.user.link}?utm_source=inemit&utm_medium=referral`}
        onClick={(e) => e.stopPropagation()}
        target="_blank"
        rel="noopener noreferrer"
        className="!text-grey-85 hover:!text-grey-75"
      >
        {img.user.name}
      </ExtLink>
    </div>
  </li>
);
