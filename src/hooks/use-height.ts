import { useLayoutEffect, useState } from 'react';

export const useHeight = () => {
  // initialising with window height makes Next.js hickup when looking for the window server-side
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const update = () => setHeight(window.visualViewport?.height ?? window.innerHeight);
    update();

    const viewport = window.visualViewport ?? window;
    viewport.addEventListener('resize', update);
    return () => viewport.removeEventListener('resize', update);
  }, []);

  return height;
};
