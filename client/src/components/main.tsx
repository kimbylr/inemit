import { FC, ReactNode } from 'react';

export const Main: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <div className="w-full h-5 overflow-hidden absolute">
      {/* separate Shadow element because "overflow: hidden" prevents sticky elements inside children */}
      <div className="absolute pointer-events-none -inset-5 top-0 shadow-[inset_0_0_10px_#000]" />
    </div>
    <main className="p-4 pt-6 relative">{children}</main>
  </>
);
