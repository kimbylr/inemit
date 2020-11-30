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
  Authorization: `Client-ID ${process.env.UNSPLASH_CLIENT_ID}`,
  'Accept-Version': 'v1',
};

export const getUnsplashSearch = (searchString: string) =>
  fetch(`https://api.unsplash.com/search/photos?query=${searchString}`, {
    headers,
  });

export const getTrackSetFn = (download_location: string) => () =>
  fetch(download_location, { headers });
