'use client';

import { useLayoutEffect, useState } from 'react';

export const useHeight = () => {
  const [height, setHeight] = useState(window.visualViewport?.height ?? window.innerHeight);

  useLayoutEffect(() => {
    const update = () => setHeight(window.visualViewport?.height ?? window.innerHeight);
    update();

    const viewport = window.visualViewport ?? window;
    viewport.addEventListener('resize', update);
    return () => viewport.removeEventListener('resize', update);
  }, []);

  return height;
};
