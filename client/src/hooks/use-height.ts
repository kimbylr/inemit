import { useState, useLayoutEffect } from 'react';

const hasVisualViewport = !!(window as any).visualViewport;

export const useHeight = () => {
  const [height, setHeight] = useState(
    (window as any).visualViewport?.height || window.innerHeight,
  );

  useLayoutEffect(() => {
    const update = () =>
      setHeight((window as any).visualViewport?.height || window.innerHeight);

    hasVisualViewport
      ? (window as any).visualViewport.addEventListener('resize', update)
      : window.addEventListener('resize', update);

    return () => {
      hasVisualViewport
        ? (window as any).visualViewport.removeEventListener('resize', update)
        : window.removeEventListener('resize', update);
    };
  }, []);

  return height;
};
