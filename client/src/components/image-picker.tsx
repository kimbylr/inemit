import React, { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Input } from '../elements/input';
import { ExtLink } from '../elements/link';
import { Spinner } from '../elements/spinner';
import { getUnsplashSearch, mapUnsplashImage, UnsplashImage } from '../helpers/unsplash';
import { useDebounce } from '../hooks/use-debounce';

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
      const res = await getUnsplashSearch(searchString);
      const { results } = await res.json();
      if (results.length === 0) {
        return setError('Keine Bilder gefunden');
      }
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
          {searching && <Spinner small />}
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
                  <Image src={img.urls.thumb} onLoad={increaseImgsLoaded} />
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
  height: 2rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SearchInput = styled(Input)`
  max-width: 250px;
`;

const SearchState = styled.div`
  margin-left: 1rem;
  text-align: right;
`;

const ImagesContainer = styled.div`
  position: relative;
`;

const Images = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  overflow-x: auto;
  height: 6rem;
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
