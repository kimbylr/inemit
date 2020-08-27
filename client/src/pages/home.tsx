import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { version } from '../../../package.json';
import { ExpandableArea } from '../components/expandable-area';
import { Button } from '../elements/button';
import { ExtLink } from '../elements/link';
import {
  Heading,
  Paragraph,
  SubHeadingUncolored,
} from '../elements/typography';
import { useAuth } from '../helpers/auth';

export const Home: FC = () => {
  const { user, login } = useAuth();

  return (
    <div>
      <Heading>inemit statt Bullshit</Heading>
      <Paragraph>
        Lernen heisst Wiederholen. Wiederholen braucht Zeit. Zeit spart, wer
        effizient lernt. <Highlight color="green">Effizient Lernen</Highlight>{' '}
        ist der Fokus von inemit.
      </Paragraph>

      {!user && (
        <CenteredParagraph>
          <LoginButton primary onClick={login}>
            Login
          </LoginButton>
        </CenteredParagraph>
      )}

      <ExpandableArea
        canExpand
        teaser={<SubHeadingUncolored>Mehr Infos</SubHeadingUncolored>}
        teaserStyles={TeaserStyles}
      >
        <ExplainerParagraph>
          Inemit kombiniert{' '}
          <Highlight color="yellow">wissenschaftliche Erkenntnisse</Highlight>{' '}
          und <Highlight color="orange">Technologie</Highlight>, um{' '}
          <Highlight color="green">effizientes und sinnvolles Lernen</Highlight>{' '}
          so einfach wie möglich zu machen.
        </ExplainerParagraph>
        <ExplainerParagraph>
          Am Anfang steht die Erkenntnis, dass{' '}
          <Highlight color="yellow">Wiederholung</Highlight> zentral ist, um
          Vokabeln zu lernen. Diesen Effekt machen sich analoge Lernkarteien
          schon seit langer Zeit zunutze. Davon leitet sich die Methode der{' '}
          <ExtLink href="https://de.wikipedia.org/wiki/Spaced_repetition">
            spaced repetition
          </ExtLink>{' '}
          ab.
        </ExplainerParagraph>
        <ExplainerParagraph>
          Digitales Lernen ermöglicht{' '}
          <Highlight color="orange">systematisches Lernen</Highlight>: Jeder
          Lerninhalt hat einen aus positiven und negativen Antworten berechneten{' '}
          <Highlight color="orange">Schwierigkeitsgrad</Highlight>. Darauf
          basierend wird der{' '}
          <Highlight color="orange">optimale Zeitabstand</Highlight> bis zur
          nächsten Abfrage gesetzt. So kann die Lernzeit effizient genutzt
          werden. (<Inemit>Inemit</Inemit> implementiert den{' '}
          <ExtLink href="https://supermemo.guru/wiki/SuperMemo_1.0_for_DOS_(1987)#Algorithm_SM-2">
            <em>SM-2</em>-Algorithmus
          </ExtLink>
          ).
        </ExplainerParagraph>
        <ExplainerParagraph>
          Lernerfolg hängt von der eigenen Investition ab. Keine App der Welt
          kann einem das Lernen abnehmen. Technologie kann nur unterstützen.
          Entscheidend sind neben regelmässiger Wiederholung insbesondere{' '}
          <Highlight color="green">passende Lerninhalte</Highlight> (vgl.{' '}
          <ExtLink href="https://universeofmemory.com/spaced-repetition-apps-dont-work/">
            Why Most Spaced Repetition Apps Don't Work
          </ExtLink>
          ). Inemit soll zu{' '}
          <Highlight color="green">sinnvollem Lernen animieren</Highlight>.
        </ExplainerParagraph>

        <TechnicalNotes>
          Version: {version} •{' '}
          <ExtLink href="https://github.com/kimbylr/inemit/blob/master/CHANGELOG.md">
            Changelog
          </ExtLink>{' '}
          •{' '}
          <ExtLink href="https://github.com/kimbylr/inemit/">
            Quellcode auf Github
          </ExtLink>
        </TechnicalNotes>
      </ExpandableArea>
    </div>
  );
};

const CenteredParagraph = styled(Paragraph)`
  text-align: center;
`;

const LoginButton = styled(Button)`
  min-width: 200px;

  @media (max-width: 360px) {
    width: 100%;
  }
`;

const TeaserStyles = css`
  width: 100%;
  color: ${({ theme: { colors } }) => colors.primary[150]};

  :hover {
    color: ${({ theme: { colors } }) => colors.primary[100]};
  }
`;

const Highlight = styled.strong<{ color: 'orange' | 'yellow' | 'green' }>`
  background: ${({ color, theme: { colors } }) =>
    color === 'green' ? colors.secondary[20] : colors[color][20]};
`;

const Inemit = styled.strong`
  font-weight: ${({ theme: { font } }) => font.weights.massive} !important;
  color: ${({ theme: { colors } }) => colors.primary[150]} !important;
`;

const ExplainerParagraph = styled(Paragraph)`
  font-size: ${({ theme: { font } }) => font.sizes.xs};
`;

const TechnicalNotes = styled(Paragraph)`
  margin-top: 2.5rem;
  font-size: ${({ theme: { font } }) => font.sizes.xxs};
`;
