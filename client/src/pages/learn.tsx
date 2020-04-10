import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { Paragraph } from '../elements/typography';
import { useHeight } from '../hooks/use-height';
import { useRouting } from '../hooks/use-routing';
import { Link } from 'react-router-dom';

export const Learn: FC = () => {
  const height = useHeight();
  const { slug } = useRouting();

  return (
    <Container height={height}>
      <Header>
        <StyledLink to={`/${slug}`}>
          <Icon type="logo" width="30px" />
        </StyledLink>
      </Header>
      <Paragraph>aufgabe 50%</Paragraph>
      <Paragraph>
        lösung 50%
        <Button />
      </Paragraph>
    </Container>
  );
};

const Container = styled.div<{ height: number }>`
  height: ${({ height }) => height}px;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  position: static;
  top: 0;
  right: 0;
  padding: 0.5rem;
`;

const StyledLink = styled(Link)`
  color: ${({ theme: { colors } }) => colors.primary[100]};

  :hover {
    color: ${({ theme: { colors } }) => colors.primary[150]};
  }
`;
