import React, { FC } from 'react';

const icons = {
  chevronDown: (width?: string) => (
    <svg
      viewBox="0 8 32 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2px"
      width={width || '100%'}
    >
      <line x1="16" x2="7" y1="20.5" y2="11.5" />
      <line x1="25" x2="16" y1="11.5" y2="20.5" />
    </svg>
  ),
  ok: (width?: string) => (
    <svg viewBox="28 28 20 20" width={width || '100%'}>
      <circle fill="currentColor" cx="38" cy="38" r="10" />
      <polygon
        fill="#fff"
        points="42.5,33.3 36.8,39 34.1,36.3 32,38.5 36.8,43.3 44.6,35.5"
      />
    </svg>
  ),
  attention: (width?: string) => (
    <svg viewBox="6 6 36 36" width={width || '100%'}>
      <circle fill="currentColor" cx="24" cy="24" r="18" />
      <line stroke="#fff" strokeWidth="5px" x1="24" y1="13" x2="24" y2="27" />
      <circle fill="#fff" cx="24" cy="33" r="3" />
    </svg>
  ),
  sync: (width?: string) => (
    <svg viewBox="6 7 36 36" width={width || '100%'}>
      <circle fill="currentColor" cx="24" cy="25" r="18" />
      <polygon fill="#fff" points="24,23.5 24,12.5 30.6,18" />
      <path
        fill="#fff"
        d="M28.9,24.4c0,0.2,0.1,0.4,0.1,0.6c0,2.8-2.2,5-5,5s-5-2.2-5-5s2.2-5,5-5c0.7,0,1.4,0.2,2,0.4v-4.2 c-0.6-0.1-1.3-0.2-2-0.2c-5,0-9,4-9,9s4,9,9,9s9-4,9-9c0-1.2-0.2-2.4-0.7-3.4L28.9,24.4z"
      />
    </svg>
  ),
  new: (width?: string) => (
    <svg viewBox="0 0 20 20" width={width || '100%'}>
      <circle fill="currentColor" cx="10" cy="10" r="10" />
      <circle fill="#fff" cx="10" cy="10" r="3" />
    </svg>
  ),
  deleteInCircle: (width?: string) => (
    <svg viewBox="28 28 20 20" width={width || '100%'}>
      <circle fill="currentColor" cx="38" cy="38" r="10" />
      <rect
        fill="#fff"
        x="36.5"
        y="32"
        transform="matrix(-.707 .707 -.707 -.707 91.74 38)"
        width="3"
        height="12"
      />
      <rect
        fill="#fff"
        x="36.5"
        y="32"
        transform="matrix(-.707 -.707 .707 -.707 38 91.74)"
        width="3"
        height="12"
      />
    </svg>
  ),
  edit: (width?: string) => (
    <svg
      viewBox="0 0 319933 333333"
      fill="currentColor"
      width={width || '100%'}
    >
      <path d="M259661 5207c-3818-3545-8181-5455-13091-5181-4909 0-9272 1909-12817 5727l-28909 30000 80999 78272 29181-30546c3545-3546 4909-8182 4909-13090 0-4909-1910-9546-5455-12818L259660 5208zM108027 298657c-10637 3545-21544 6818-32181 10364-10636 3545-21272 7089-32181 10636-25364 8181-39272 12818-42273 13636-3000 819-1091-10909 5182-35454l20181-77181 1656-1721 79667 79667-52 54zM57863 188324L182936 58478l80999 77998-126432 131488-79640-79640z" />
    </svg>
  ),
  done: (width?: string) => (
    <svg viewBox="32 31.5 12.5 12.5" width={width || '100%'}>
      <polygon
        fill="currentColor"
        points="42.5,33.3 36.8,39 34.1,36.3 32,38.5 36.8,43.3 44.6,35.5"
      />
    </svg>
  ),
  delete: (width?: string) => (
    <svg viewBox="32 32 12 12" fill="currentColor" width={width || '100%'}>
      <rect
        x="36.5"
        y="32"
        transform="matrix(-.707 .707 -.707 -.707 91.74 38)"
        width="3"
        height="12"
      />
      <rect
        x="36.5"
        y="32"
        transform="matrix(-.707 -.707 .707 -.707 38 91.74)"
        width="3"
        height="12"
      />
    </svg>
  ),
  addList: (width?: string) => (
    <svg viewBox="0 0 3294 3781" width={width || '100%'}>
      <path
        fill="currentColor"
        d="M970 2675c-54 0-97-44-97-98s44-98 97-98h631c54 0 97 44 97 98s-44 98-97 98H970zm0-1375c-54 0-97-43-97-97s43-97 97-97h1280c54 0 97 43 97 97s-43 97-97 97H970zm779 2286c54 0 97 43 97 97s-43 97-97 97H225c-62 0-119-25-159-66-41-41-66-97-66-159V226c0-62 25-119 66-159 41-41 97-66 159-66h2770c62 0 119 25 159 66 41 41 66 97 66 159v2008c0 54-43 97-97 97s-97-43-97-97V226c0-9-4-17-9-22-6-6-14-9-22-9H225c-9 0-17 4-22 9-6 6-9 14-9 22v3329c0 9 4 17 9 22 6 6 14 9 22 9h1524zm815-1011c0-53 43-97 97-97 53 0 97 43 97 97l-1 442 441 1c53 0 97 43 97 97 0 53-43 97-97 97l-442-1-1 441c0 53-43 97-97 97-53 0-97-43-97-97l1-442-441-1c-53 0-97-43-97-97 0-53 43-97 97-97l442 1 1-441zM970 1987c-54 0-97-43-97-97s43-97 97-97h1280c54 0 97 43 97 97s-43 97-97 97H970z"
      />
    </svg>
  ),
  logo: (width?: string) => (
    <svg viewBox="0 0 390 298" fill="currentColor" height={width || '100%'}>
      <path d="M243.509 297.785 C175.777 297.785 118.822 250.817 102.343 187.125 L206.433 187.125 206.433 247.916 331.669 148.584 206.433 49.252 206.433 110.043 102.644 110.043 C119.508 46.938 176.186 0.537 243.509 0.537 324.128 0.537 389.483 67.078 389.483 149.16 389.483 231.243 324.128 297.785 243.509 297.785 Z M102.644 110.043 C99.313 122.507 97.534 135.622 97.534 149.16 97.534 162.282 99.207 175.006 102.343 187.125 L0.106 187.125 0.106 110.043 102.644 110.043 Z" />
    </svg>
  ),
  next: (width?: string) => (
    <svg viewBox="3 9 48 27" fill="currentColor" height={width || '100%'}>
      <polygon points="44,24 30,35.7 30,12.3" />
      <rect x="12" y="20" width="20" height="8" />
    </svg>
  ),
};

interface Props {
  type: keyof typeof icons;
  width?: string;
}

export const Icon: FC<Props> = ({ type, width }) => {
  return icons[type](width);
};
