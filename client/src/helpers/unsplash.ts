export interface UnsplashImage {
  id: string;
  urls: { thumb: string; small: string; regular: string };
  user: { name: string; link: string };
  trackSet?(): void;
}

type In = UnsplashImage & {
  user: { links: { html: string } };
} & {
  links: { download_location: string };
};

export const mapUnsplashImage = ({
  id,
  urls: { thumb, small, regular },
  user: { name, links },
  links: { download_location },
}: In): UnsplashImage => ({
  id,
  urls: { thumb, small, regular },
  user: { name, link: links.html },
  trackSet: getTrackSetFn(download_location),
});

const headers = {
  Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_CLIENT_ID}`,
  'Accept-Version': 'v1',
};

export const searchUnsplash = (searchString: string, page: number) =>
  fetch(`https://api.unsplash.com/search/photos?query=${searchString}&page=${page}`, {
    headers,
  });

export const getTrackSetFn = (download_location: string) => () =>
  fetch(download_location, { headers });
