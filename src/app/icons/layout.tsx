import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = ({ children }) => (
  <main className="p-8 bg-gray-98 min-h-screen">{children}</main>
);

export default Layout;
