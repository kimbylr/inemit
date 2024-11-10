import { FC, Fragment } from 'react';

// Add line breaks for long text with semicolons/commas (2+ meanings)
export const TextWithBreaks: FC<{ children: string; splitBy?: string[] }> = ({
  children,
  splitBy = ['; ', ', '],
}) => {
  const parts = children.split(splitBy[0]);

  if (parts.length <= 1) {
    if (splitBy[1]) {
      return <TextWithBreaks splitBy={splitBy.slice(1)}>{children}</TextWithBreaks>;
    }

    return children;
  }

  if (parts.every((part) => part.length < 12 || part.includes('(') || part.includes('.'))) {
    return children;
  }

  return parts.flatMap((part, i) => (
    <Fragment key={i}>
      {i !== 0 && (
        <>
          {splitBy[0].trim()}
          <br />
        </>
      )}
      {part}
    </Fragment>
  ));
};
