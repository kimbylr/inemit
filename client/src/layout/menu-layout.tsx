import { FC } from 'react';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Menu } from '../components/menu';
import { PageLayout } from './page-layout';

export const MenuLayout: FC<{ pageWidth: 'tight' | 'wide' }> = ({
  children,
  pageWidth,
}) => (
  <>
    <Header />
    <Menu />
    <Main>
      <PageLayout width={pageWidth}>{children}</PageLayout>
    </Main>
  </>
);
