import { Header } from '@/components/header';
import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Layout: FC<Props> = ({ children }) => (
  <div className="bg-grey-95 content-div">
    <Header />
    <main className="py-8 px-6 mx-auto max-w-3xl">{children}</main>
  </div>
);

export default Layout;
