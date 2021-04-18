import React, { FC } from 'react';
import styled from 'styled-components';
import { version } from '../../../package.json';
import { ExtLink } from '../elements/link';
import { Heading, Paragraph } from '../elements/typography';
import { PageLayout } from '../layout/page-layout';

export const About: FC = () => (
  <PageLayout>
    <Heading>Die Idee: inemit statt Bullshit.</Heading>
    <ExplainerParagraph big>
      Heisst: Die <Highlight color="yellow">beste Methode</Highlight> für{' '}
      <Highlight color="green">effizientes Lernen</Highlight> als{' '}
      <Highlight color="orange">moderne App</Highlight>.
    </ExplainerParagraph>
    <ExplainerParagraph>
      Am Anfang steht die wissenschaftlich abgestützte Erkenntnis, dass{' '}
      <Highlight color="yellow">Wiederholung</Highlight> zentral ist, um Vokabeln zu
      lernen. Diesen Effekt machen sich analoge Lernkarteien schon seit langer Zeit
      zunutze.{' '}
      <ExtLink href="https://de.wikipedia.org/wiki/Spaced_repetition">
        Spaced repetition
      </ExtLink>{' '}
      ist die etwas raffiniertere Version davon.
    </ExplainerParagraph>
    <ExplainerParagraph>
      Eine App nicht deswegen, weil digital und ergo toll, sondern weil digital{' '}
      <Highlight color="orange">systematisches Lernen</Highlight> erst ermöglicht: Die App
      kümmert sich darum, dass Vokabeln desto seltener angezeigt werden, je besser du sie
      kannst. Aus jeder richtigen oder falschen Antwort wird der Schwierigkeitsgrad neu
      berechnet. Darauf basierend wird der{' '}
      <Highlight color="orange">optimale Zeitabstand</Highlight> bis zur nächsten Abfrage
      gesetzt. Das garantiert, dass die Lernzeit effizient genutzt wird. (
      <Inemit>Inemit</Inemit> implementiert den{' '}
      <ExtLink href="https://supermemo.guru/wiki/SuperMemo_1.0_for_DOS_(1987)#Algorithm_SM-2">
        <em>SM-2</em>-Algorithmus
      </ExtLink>
      ).
    </ExplainerParagraph>
    <ExplainerParagraph>
      Inemit stellt die Basis für <Highlight color="green">sinnvolles Lernen</Highlight>{' '}
      bereit – lernen musst du selbst. Technologie kann nur unterstützen. Entscheidend
      sind neben regelmässiger Wiederholung insbesondere{' '}
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
      • <ExtLink href="https://github.com/kimbylr/inemit/">Quellcode auf Github</ExtLink>
    </TechnicalNotes>
  </PageLayout>
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
