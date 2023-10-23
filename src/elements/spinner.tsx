import { FC } from 'react';

export const Spinner: FC<{ white?: boolean; small?: boolean }> = ({ white, small }) => (
  <div
    className={`relative my-4 mx-auto opacity-0 animate-fade-in ${
      small ? 'w-8 h-8 min-w-[32px]' : 'w-12 h-12 min-w-[48px]'
    }  `}
  >
    <div
      className={`animate-bounce w-full h-full rounded-full ${
        white ? 'bg-grey-98' : 'bg-primary-100'
      } opacity-60 absolute top-0 left-0`}
    />
    <div
      className={`animate-bounce w-full h-full rounded-full ${
        white ? 'bg-grey-98' : 'bg-primary-100'
      } opacity-60 absolute top-0 left-0`}
      style={{ animationDelay: '-1s' }}
    />
  </div>
);
