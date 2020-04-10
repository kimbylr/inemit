import React, { FC } from 'react';
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
      Inemit gibt dir die Werkzeuge in die Hand, um die eigene Zeit effizient
      einzusetzen. Es gaukelt dir nicht vor, mit teuren Kärtchen könne man
      besser lernen. Die "Kärtchen" machst du selbst – weil das am meisten
      bringt. Und dann heisst es: Inemit!
    </Paragraph>
    <SubHeading>Science, mate!</SubHeading>
    <Paragraph>
      Wiederholung ist zentral. Spaced repetition.
      https://universeofmemory.com/spaced-repetition-apps-dont-work/
    </Paragraph>
  </div>
);
