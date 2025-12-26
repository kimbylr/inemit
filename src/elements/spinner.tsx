import { classNames } from '@/helpers/class-names';
import { FC } from 'react';

type Props = {
  white?: boolean;
  size: 'xs' | 'sm' | 'md';
  padding?: boolean;
};

export const Spinner: FC<Props> = ({ white, size = 'md', padding = true }) => (
  <span
    className={classNames(
      'relative mx-auto opacity-0 animate-fade-in block',
      size === 'xs' && 'size-5 min-w-[20px]',
      size === 'sm' && 'size-8 min-w-[32px]',
      size === 'md' && 'size-12 min-w-[32px]',
      padding && 'my-4',
    )}
  >
    <span
      className={classNames(
        'animate-bounce w-full h-full rounded-full opacity-60 absolute top-0 left-0 block',
        white ? 'bg-gray-98' : 'bg-primary-100',
      )}
    />
    <span
      className={classNames(
        'animate-bounce w-full h-full rounded-full opacity-60 absolute top-0 left-0 block',
        white ? 'bg-gray-98' : 'bg-primary-100',
      )}
      style={{ animationDelay: '-1s' }}
    />
  </span>
);
