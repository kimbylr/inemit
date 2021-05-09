import React, { FC } from 'react';
import styled from 'styled-components';
import { version } from '../../../package.json';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Menu } from '../components/menu';
import { ExtLink } from '../elements/link';
import { Heading, Paragraph } from '../elements/typography';
import { PageLayout } from '../layout/page-layout';

export const About: FC = () => (
  <>
    <Header />
    <Menu />
    <Main>
      <PageLayout>
        <Heading>Die Idee: inemit statt Bullshit.</Heading>
        <ExplainerParagraph big>
          Die <Highlight color="yellow">beste Methode</Highlight> für{' '}
          <Highlight color="green">effizientes Lernen</Highlight> als{' '}
          <Highlight color="orange">moderne App</Highlight>.
        </ExplainerParagraph>
        <ExplainerParagraph>
          <Highlight color="yellow">Mit Methode:</Highlight> Am Anfang steht die
          wissenschaftlich abgestützte Erkenntnis, dass{' '}
          <Highlight color="yellow">Wiederholung</Highlight> zentral ist, um Vokabeln zu
          lernen. Diesen Effekt machen sich analoge Lernkarteien schon seit langer Zeit
          zunutze.{' '}
          <ExtLink href="https://de.wikipedia.org/wiki/Spaced_repetition">
            Spaced repetition
          </ExtLink>{' '}
          ist die raffiniertere Version davon.
        </ExplainerParagraph>
        <ExplainerParagraph>
          <Highlight color="orange">Eine App</Highlight> nicht deswegen, weil digital so
          toll klingt, sondern weil es die ideale Voraussetzung für{' '}
          <Highlight color="orange">systematisches Lernen</Highlight> ist: Die App kümmert
          sich darum, dass gut verankerte Vokabeln seltener angezeigt werden. Der
          Schwierigkeitsgrad wird bei jeder richtigen oder falschen Antwort neu berechnet.
          Daraus ergibt sich der{' '}
          <Highlight color="orange">optimale Zeitabstand</Highlight> bis zur nächsten
          Abfrage. So ist garantiert, dass die Lernzeit effizient genutzt wird. (
          <Inemit>Inemit</Inemit> implementiert den{' '}
          <ExtLink href="https://supermemo.guru/wiki/SuperMemo_1.0_for_DOS_(1987)#Algorithm_SM-2">
            <em>SM-2</em>-Algorithmus
          </ExtLink>
          ).
        </ExplainerParagraph>
        <ExplainerParagraph>
          Inemit stellt die Basis für{' '}
          <Highlight color="green">sinnvolles Lernen</Highlight> bereit – lernen musst du
          selbst. Technologie kann nur unterstützen. Entscheidend sind neben regelmässiger
          Wiederholung insbesondere{' '}
          <Highlight color="green">passende Lerninhalte</Highlight> (vgl.{' '}
          <ExtLink href="https://universeofmemory.com/spaced-repetition-apps-dont-work/">
            Why Most Spaced Repetition Apps Don't Work
          </ExtLink>
          ).
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
      </PageLayout>
    </Main>
  </>
);

const ExplainerParagraph = styled(Paragraph)<{ big?: boolean }>`
  font-size: ${({ big, theme: { font } }) => font.sizes[big ? 'md' : 'sm']};
`;

const Highlight = styled.strong<{ color: 'orange' | 'yellow' | 'green' }>`
  background: ${({ color, theme: { colors } }) =>
    color === 'green' ? colors.secondary[20] : colors[color][20]};
`;

const Inemit = styled.strong`
  font-weight: ${({ theme: { font } }) => font.weights.massive} !important;
  color: ${({ theme: { colors } }) => colors.primary[150]} !important;
`;

const TechnicalNotes = styled(Paragraph)`
  margin-top: 2.5rem;
  font-size: ${({ theme: { font } }) => font.sizes.xs};
`;
