import React, { FC } from 'react';
import styled from 'styled-components';
import { version } from '../../package.json';
import { ExtLink } from '../elements/link';
import { Heading, Paragraph, SubHeading } from '../elements/typography';

export const Home: FC = () => (
  <div>
    <Heading>Inemit</Heading>
    <Paragraph>
      Vokabeln lernen ist keine Magie. Es braucht vor allem eines: Wiederholung.
      Es gibt aber auch keinen magischen Trick, der alles viel einfacher macht.
    </Paragraph>
    <SubHeading>No bullshit.</SubHeading>
    <Paragraph>
      Inemit gibt dir die Werkzeuge an die Hand, um deine Lernzeit effizient zu
      nutzen. Es gaukelt dir nicht vor, mit teurem Lernmaterial könne man besser
      lernen. Die "Kärtchen" machst du selbst – weil das am meisten bringt. Und
      dann heisst es:{' '}
      <strong>
        <em>Inemit!</em>
      </strong>
    </Paragraph>
    <SubHeading>Science, mate!</SubHeading>
    <Paragraph>
      <em>Inemit</em> basiert der Erkenntnis, dass Wiederholung zentral ist, um
      Vokabeln zu lernen (<em>Spaced repetition</em>, siehe z.B.{' '}
      <ExtLink href="https://universeofmemory.com/spaced-repetition-apps-dont-work/">
        Universe of memory
      </ExtLink>
      ).
    </Paragraph>
    <Paragraph>
      Diesen Effekt machen sich auch analoge Lernkarteien zunutze. Apps haben
      den Vorteil, dass Zeitabstände optimal gesetzt werden können.{' '}
      <strong>
        <em>Inemit</em>
      </strong>{' '}
      implementiert den{' '}
      <ExtLink href="https://supermemo.guru/wiki/SuperMemo_1.0_for_DOS_(1987)#Algorithm_SM-2">
        <em>SM-2</em>-Algorithmus
      </ExtLink>
      .
    </Paragraph>
    <TechnicalNotes>
      Version: {version} (
      <ExtLink href="https://github.com/kimbylr/inemit/blob/master/CHANGELOG.md">
        Changelog
      </ExtLink>
      )
    </TechnicalNotes>
  </div>
);

const TechnicalNotes = styled(Paragraph)`
  margin-top: 2.5rem;
  font-size: ${({ theme: { font } }) => font.sizes.xs};
`;
