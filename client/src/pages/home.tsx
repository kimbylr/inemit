import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../elements/button';
import { Link } from '../elements/link';
import { Heading, Paragraph } from '../elements/typography';
import { useAuth } from '../helpers/auth';
import { PageLayout } from '../layout/page-layout';

export const Home: FC = () => {
  const { user, login } = useAuth();

  return (
    <PageLayout>
      <Heading>inemit statt Bullshit</Heading>
      <Paragraph>
        Lernen heisst Wiederholen. Wiederholen braucht Zeit. Zeit spart, wer
        effizient lernt.
      </Paragraph>
      <Paragraph>
        <strong>Effizient Lernen</strong> steht bei <Inemit>inemit</Inemit> im
        Zentrum. <Link to="/about">Mehr →</Link>
      </Paragraph>

      {!user && (
        <CenteredParagraph>
          <LoginButton primary onClick={login}>
            Login
          </LoginButton>
        </CenteredParagraph>
      )}
    </PageLayout>
  );
};

const CenteredParagraph = styled(Paragraph)`
  text-align: center;
  margin-top: 2.5rem;
`;

const LoginButton = styled(Button)`
  min-width: 200px;

  @media (max-width: 360px) {
    width: 100%;
  }
`;

const Inemit = styled.strong`
  font-weight: ${({ theme: { font } }) => font.weights.massive} !important;
  color: ${({ theme: { colors } }) => colors.primary[150]} !important;
`;
