import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from '../elements/icon';

const useIsUnapproved = () => {
  const params = new URLSearchParams(useLocation().search);

  return (
    params.get('error') === 'unauthorized' &&
    params.get('error_description')?.includes('approved')
  );
};

export const NotificationBar: FC = () => {
  const unapproved = useIsUnapproved();

  if (!unapproved) {
    return null;
  }

  return (
    <Container>
      Deine Registrierung muss von einem Administrator bestätigt werden. Du
      wirst per E-Mail benachrichtigt.
    </Container>
  );
};

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem;
  background: ${({ theme: { colors } }) => colors.negative[75]};
  text-align: center;
  user-select: none;
`;
