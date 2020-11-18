export interface UnsplashImage {
  id: string;
  urls: { thumb: string; small: string; regular: string };
  user: { name: string; link: string };
}

export const mapUnsplashImage = ({
  id,
  urls: { thumb, small, regular },
  user: { name, links },
}: UnsplashImage & { user: { links: { html: string } } }): UnsplashImage => ({
  id,
  urls: { thumb, small, regular },
  user: { name, link: links.html },
});

export const getUnsplashSearch = (searchString: string) =>
  fetch(`https://api.unsplash.com/search/photos?query=${searchString}`, {
    headers: {
      Authorization: `Client-ID ${process.env.UNSPLASH_CLIENT_ID}`,
      'Accept-Version': 'v1',
    },
  });
