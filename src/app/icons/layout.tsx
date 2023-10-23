import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = ({ children }) => <main className="p-8">{children}</main>;

export default Layout;
