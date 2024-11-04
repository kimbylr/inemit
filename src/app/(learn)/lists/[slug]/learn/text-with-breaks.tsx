import { FC } from 'react';

// Add line breaks for long text with commas (2+ separate meanings)
export const TextWithBreaks: FC<{ children: string }> = ({ children }) => {
  const parts = children.split(/(,;) /);

  if (parts.every((part) => part.length < 10)) {
    return children;
  }

  return (
    <span className="whitespace-pre">
      {children.replaceAll(', ', ',\n').replaceAll('; ', ';\n')}
    </span>
  );
};
