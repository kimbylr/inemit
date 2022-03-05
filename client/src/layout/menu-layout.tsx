import { FC } from 'react';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Menu } from '../components/menu';
import { PageLayout } from './page-layout';

export const MenuLayout: FC<{ withPageLayout?: boolean }> = ({
  children,
  withPageLayout,
}) => (
  <>
    <Header />
    <Menu />
    <Main>{withPageLayout ? <PageLayout>{children}</PageLayout> : children}</Main>
  </>
);
