export const merge = (...classNames: (string | undefined | boolean)[]): string =>
  classNames.filter(Boolean).join(' ');
