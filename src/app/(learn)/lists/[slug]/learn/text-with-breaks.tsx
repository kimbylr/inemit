import { classNames } from '@/helpers/class-names';
import React, { Fragment, FC } from 'react';

// Add line breaks for long text with commas (2+ separate meanings)
export const TextWithBreaks: FC<{ children: string }> = ({ children }) => {
  const parts = children.split(', ');

  if (parts.every((part) => part.length < 12)) {
    return children;
  }

  return parts.flatMap((part, i) => (
    <Fragment key={i}>
      {i !== 0 && (
        <>
          ,<br />
        </>
      )}
      {part}
    </Fragment>
  ));
};
