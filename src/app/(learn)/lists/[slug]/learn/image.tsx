import { UnsplashImage } from '@/types/types';
import { FC } from 'react';
import { Blurhash } from 'react-blurhash';

export const LearnImage: FC<{ image: UnsplashImage }> = ({ image }) => (
  <div className="leading-[0] group relative w-full aspect-square">
    {image.blurHash && (
      <div className="absolute inset-0">
        <Blurhash hash={image.blurHash} height="100%" width="100%" />
      </div>
    )}
    <img
      srcSet={`${image.urls.small} 400w, ${image.urls.regular} 1080w`}
      sizes="512px"
      className="absolute inset-0 aspect-square object-cover h-full"
    />
    <div className="absolute bottom-0 left-0 leading-none p-1 rounded-tr bg-opacity-50 bg-black text-xxs text-black hidden group-hover:block">
      <a
        href={`${image.user.link}?utm_source=inemit&utm_medium=referral`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-85 hover:text-primary-100 "
      >
        {image.user.name}
      </a>
    </div>
  </div>
);
