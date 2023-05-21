import { useEffect } from 'react';

export const useAsyncEffect = (cb: () => Promise<any>, deps?: React.DependencyList) => {
  useEffect(() => {
    cb();
  }, deps);
};
