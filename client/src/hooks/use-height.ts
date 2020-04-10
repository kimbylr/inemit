import { useState, useLayoutEffect } from 'react';

export const useHeight = () => {
  const [height, setHeight] = useState(100);

  useLayoutEffect(() => {
    const updateSize = () => setHeight(window.innerHeight);
    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  });

  return height;
};
