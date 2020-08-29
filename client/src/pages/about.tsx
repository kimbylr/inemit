import React, { FC } from 'react';
import styled from 'styled-components';
import { version } from '../../../package.json';
import { ExtLink, Link } from '../elements/link';
import { Heading, Paragraph } from '../elements/typography';

export const About: FC = () => (
  <div>
    <Heading>Die Idee</Heading>
    <ExplainerParagraph>
      Inemit kombiniert{' '}
      <Highlight color="yellow">wissenschaftliche Erkenntnisse</Highlight> und{' '}
      <Highlight color="orange">Technologie</Highlight>, um{' '}
      <Highlight color="green">effizientes und sinnvolles Lernen</Highlight> so
      einfach wie möglich zu machen.
    </ExplainerParagraph>
    <ExplainerParagraph>
      Am Anfang steht die Erkenntnis, dass{' '}
      <Highlight color="yellow">Wiederholung</Highlight> zentral ist, um
      Vokabeln zu lernen. Diesen Effekt machen sich analoge Lernkarteien schon
      seit langer Zeit zunutze. Davon leitet sich die Methode der{' '}
      <ExtLink href="https://de.wikipedia.org/wiki/Spaced_repetition">
        spaced repetition
      </ExtLink>{' '}
      ab.
    </ExplainerParagraph>
    <ExplainerParagraph>
      Digitales Lernen ermöglicht{' '}
      <Highlight color="orange">systematisches Lernen</Highlight>: Jeder
      Lerninhalt hat einen aus positiven und negativen Antworten berechneten{' '}
      <Highlight color="orange">Schwierigkeitsgrad</Highlight>. Darauf basierend
      wird der <Highlight color="orange">optimale Zeitabstand</Highlight> bis
      zur nächsten Abfrage gesetzt. So kann die Lernzeit effizient genutzt
      werden. (<Inemit>Inemit</Inemit> implementiert den{' '}
      <ExtLink href="https://supermemo.guru/wiki/SuperMemo_1.0_for_DOS_(1987)#Algorithm_SM-2">
        <em>SM-2</em>-Algorithmus
      </ExtLink>
      ).
    </ExplainerParagraph>
    <ExplainerParagraph>
      Lernerfolg hängt von der eigenen Investition ab. Keine App der Welt kann
      einem das Lernen abnehmen. Technologie kann nur unterstützen. Entscheidend
      sind neben regelmässiger Wiederholung insbesondere{' '}
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
  </div>
);

const ExplainerParagraph = styled(Paragraph)`
  font-size: ${({ theme: { font } }) => font.sizes.xs};
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
