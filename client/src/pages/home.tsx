import React, { FC } from 'react';
import styled from 'styled-components';
import { Icon } from '../elements/icon';
import { Link } from '../elements/link';
import { Spinner } from '../elements/spinner';
import { useAuth } from '../helpers/auth';
import { useLists } from '../hooks/use-lists';

export const Home: FC = () => {
  const { login } = useAuth();
  const { state } = useLists(); // trigger initial fetching of lists + redirect to last learnt if logged in

  if (state === 'loading') {
    return (
      <AbsoluteCenter>
        <Spinner />
      </AbsoluteCenter>
    );
  }

  return (
    <ParallaxContainer>
      <CoverImageContainer>
        <CoverImage srcSet="assets/home-536.jpg 600w, assets/home-1072.jpg 1200w, assets/home-2144.jpg 2000w" />
      </CoverImageContainer>

      <Content>
        <Title>inemit!</Title>

        <Shard1 />
        <LogoContainer>
          <LoginButton onClick={login}>
            <Icon type="logo" />
          </LoginButton>
        </LogoContainer>

        <Shard2>
          <Intro>
            <Paragraph>
              Lernen heisst
              <br />
              <strong>
                Wiederholen. <em>Wiederholen</em>
              </strong>
              <br />
              <em>braucht</em>{' '}
              <strong>
                <em>Zeit.</em> Zeit
              </strong>{' '}
              spart,
              <br />
              wer effizient lernt.
            </Paragraph>
            <Paragraph>
              <strong>inemit</strong>
              <br />
              hilft, effizient zu lernen.
              <br />
              <StyledLink to="/about">Wie das?</StyledLink>
            </Paragraph>
            <Paragraph>
              <LinkButton onClick={login}>Anmelden oder registrieren</LinkButton>
            </Paragraph>
          </Intro>
        </Shard2>
      </Content>
    </ParallaxContainer>
  );
};

const AbsoluteCenter = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  place-items: center;
`;

const ParallaxContainer = styled.div`
  height: 100vh;
  width: 100vw;
  perspective: 3px;
  overflow-x: hidden;
`;

const CoverImageContainer = styled.div`
  position: relative;
  height: 90vh;
  z-index: -1;
`;

const CoverImage = styled.img`
  object-fit: cover;
  height: 100vh;
  width: 100vw;
`;

const Content = styled.div`
  position: absolute;
  top: 80vh;
  z-index: 1;
  width: 100vw;
  transform-style: preserve-3d; // Safari needs this ¯\_(ツ)_/¯
`;

const Title = styled.h1`
  position: absolute;
  left: 0;
  right: 0;
  padding: 0 1rem;
  margin: 0 auto;
  margin-top: calc(-12vw - 10vh - 40px);
  text-align: center;
  color: ${({ theme: { colors } }) => colors.grey[98]};
  font-size: clamp(4rem, calc(2.5rem + 8vw), 10rem);
  font-weight: ${({ theme: { font } }) => font.weights.massive};
  overflow-wrap: break-word;
  transform-origin: bottom;
  transform: translateZ(1px) scale(0.66);
  text-shadow: 0 0 4rem #000;
`;

// =======

const Shard1 = styled.div`
  position: absolute;
  z-index: -1;
  height: max(550px, 50vw);
  width: 100vw;
  background: ${({ theme: { colors } }) => colors.primary[100]};

  ::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: -15vw;
    left: 0;
    border-left: 100vw solid transparent;
    border-bottom: 15vw solid ${({ theme: { colors } }) => colors.primary[100]};
  }
`;

const LogoContainer = styled.div`
  position: absolute;
  top: calc(40px - 2vw);
  width: 100vw;
  display: flex;
  justify-content: center;
`;

const LoginButton = styled.button`
  cursor: pointer;
  color: ${({ theme: { colors } }) => colors.grey[98]};
  background: none;
  border: none;
  width: calc(4rem + 6vw);
`;

// =========

const Shard2 = styled.div`
  position: absolute;
  z-index: -1;
  width: 100vw;
  top: calc(35vw + 120px); // 50vw - 15vw + px primary[100] on the right
  background: ${({ theme: { colors } }) => colors.primary[150]};

  ::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: -50vw;
    left: 0;
    border-left: 100vw solid transparent;
    border-bottom: 50vw solid ${({ theme: { colors } }) => colors.primary[150]};
  }

  box-sizing: border-box;
  padding: 0 1rem 1rem;
`;

const Intro = styled.div`
  position: relative;
  text-align: center;

  @media (min-width: 480px) {
    top: calc(80px - 15vw);
  }
`;

const Paragraph = styled.p`
  line-height: 1.5;
  color: ${({ theme: { colors } }) => colors.grey[98]};

  strong {
    font-weight: ${({ theme: { font } }) => font.weights.massive};
  }

  em {
    color: ${({ theme: { colors } }) => colors.secondary[50]};
    font-style: normal;
  }

  font-size: ${({ theme: { font } }) => font.sizes.md};
  @media (min-width: 720px) {
    font-size: ${({ theme: { font } }) => font.sizes.lg};
  }
  @media (min-width: 720px) {
    font-size: ${({ theme: { font } }) => font.sizes.xl};
  }
`;

const StyledLink = styled(Link)`
  color: ${({ theme: { colors } }) => colors.grey[98]};

  :hover {
    color: ${({ theme: { colors } }) => colors.secondary[50]};
  }
`;

const LinkButton = styled.button`
  line-height: 1.5;
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  color: ${({ theme: { colors } }) => colors.grey[98]};

  :hover {
    color: ${({ theme: { colors } }) => colors.secondary[50]};
  }
`;
