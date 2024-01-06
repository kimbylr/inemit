'use server';

import { UnsplashImage } from '@/types/types';

type Input = UnsplashImage & {
  user: { links: { html: string } };
  links: { download_location: string };
  blur_hash?: string;
};

const headers = {
  Authorization: `Client-ID ${process.env.UNSPLASH_CLIENT_ID}`,
  'Accept-Version': 'v1',
};

export const searchUnsplash = async (searchString: string, page: number) => {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${searchString}&page=${page}`,
    { headers },
  );
  const { results } = await res.json();
  console.log(results);
  return results.map(mapUnsplashImage);
};

const mapUnsplashImage = ({
  id,
  width,
  height,
  color,
  blur_hash,
  urls: { thumb, small, regular },
  user: { name, links },
  links: { download_location },
}: Input): UnsplashImage => ({
  id,
  width,
  height,
  color,
  blurHash: blur_hash,
  urls: { thumb, small, regular },
  user: { name, link: links.html },
  onChooseImgUrl: download_location,
});

export const onChooseImg = async (url?: string) => {
  if (!url?.startsWith('https://api.unsplash.com/photos/')) return;
  await fetch(url, { headers });
};
