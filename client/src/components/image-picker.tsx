import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../elements/button';
import { Input } from '../elements/input';
import { ExtLink } from '../elements/link';
import { Spinner } from '../elements/spinner';
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
      setPage(page => page + 1);
      if (results.length === 0) {
        return setError('Keine weiteren Bilder');
      }
      setImgs(imgs => [...imgs, ...results.map(mapUnsplashImage)]);
    } catch {
      setError('Fehler beim Laden weiterer Bilder');
    } finally {
      setLoadingMore(false);
    }
  };

  // scroll shadows
  const ref = useRef<HTMLUListElement | null>(null);
  const [imgsLoaded, setImgsLoaded] = useState(0);
  const increaseImgsLoaded = () => setImgsLoaded(n => n + 1);
  const [hasMoreLeft, setHasMoreLeft] = useState(false);
  const [hasMoreRight, setHasMoreRight] = useState(false);
  useEffect(() => {
    const checkScroll = () => {
      if (ref.current) {
        const { scrollLeft, clientWidth, scrollWidth } = ref.current;
        setHasMoreLeft(scrollLeft > 0);
        setHasMoreRight(scrollWidth - clientWidth > scrollLeft);
      }
    };
    checkScroll();
    ref.current?.addEventListener('scroll', checkScroll);
    return () => ref.current?.removeEventListener('scroll', checkScroll);
  }, [ref.current, imgsLoaded]);

  return (
    <Container>
      <SearchRow
        onSubmit={e => {
          e.preventDefault();
          search(searchTerm);
        }}
      >
        <SearchInput
          small
          autoFocus
          autoCapitalize="none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onFocus={e => e.target.select()}
        />
        <SearchState>
          {error}
          {searching && (
            <SpinnerContainer>
              <Spinner small />
            </SpinnerContainer>
          )}
        </SearchState>
      </SearchRow>

      {imgs.length > 0 && (
        <>
          <ImagesContainer>
            {hasMoreLeft && <ScrollShadow position="left" />}
            {hasMoreRight && <ScrollShadow position="right" />}
            <Images ref={ref}>
              {imgs.map(img => (
                <ImageContainer
                  key={img.id}
                  role="button"
                  onClick={() => onSetImage(img)}
                >
                  <Image src={img.urls.small} onLoad={increaseImgsLoaded} />
                  <ImageCredits>
                    <ExtLink
                      href={`${img.user.link}?utm_source=inemit&utm_medium=referral`}
                      onClick={e => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {img.user.name}
                    </ExtLink>
                  </ImageCredits>
                </ImageContainer>
              ))}
              {Math.floor(imgs.length / page) === IMGS_PER_PAGE && (
                <LoadMoreButton onClick={loadMore} disabled={loadingMore}>
                  Mehr…
                </LoadMoreButton>
              )}
            </Images>
          </ImagesContainer>
          <GeneralCredits>
            Fotos von{' '}
            <ExtLink href="https://unsplash.com/?utm_source=inemit&utm_medium=referral">
              Unsplash
            </ExtLink>
          </GeneralCredits>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const SearchRow = styled.form`
  height: 50px;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const SearchInput = styled(Input)`
  max-width: 250px;
  margin-bottom: 0.25rem;
`;

const SearchState = styled.div`
  display: flex;
  margin-left: 1rem;
  margin-top: 0.25rem;
  text-align: right;
`;
const SpinnerContainer = styled.div`
  position: relative;
  top: -1.25rem;
  margin-left: 0.5rem;
`;

const ImagesContainer = styled.div`
  position: relative;
`;

const Images = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  height: 200px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const ScrollShadow = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  content: '';
  top: 0;
  bottom: 0;
  ${({ position }) => `${position}: 0`};
  width: 1.5rem;
  background: linear-gradient(
    to ${({ position }) => (position === 'left' ? 'right' : 'left')},
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0)
  );
  z-index: 1;
`;

const ImageContainer = styled.li`
  position: relative;
  height: 100%;
  margin-right: 0.75rem;
  line-height: 1;
  cursor: pointer;

  :hover {
    opacity: 0.75;
  }
`;

const Image = styled.img`
  height: 100%;
  width: auto;
  border-radius: 4px;
`;

const ImageCredits = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.25rem;
  background: rgba(0, 0, 0, 0.5);
  font-size: ${({ theme: { font } }) => font.sizes.xxs};
  color: ${({ theme: { colors } }) => colors.grey[10]};
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;

  a {
    color: ${({ theme: { colors } }) => colors.grey[85]};
  }

  display: none;
  ${ImageContainer}:hover & {
    display: block;
  }
`;

const GeneralCredits = styled.div`
  margin: 0.5rem 0;
  font-size: ${({ theme: { font } }) => font.sizes.xxs};
  color: ${({ theme: { colors } }) => colors.grey[10]};
`;

const LoadMoreButton = styled(Button)`
  margin: 0;
  color: ${({ theme: { colors } }) => colors.grey[10]};
  background: ${({ theme: { colors } }) => colors.grey[85]};
  box-shadow: none;

  :active {
    top: 0;
  }
`;
