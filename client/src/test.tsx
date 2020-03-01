import 'normalize.css';
import React from 'react';
import styled from 'styled-components';
import { Button } from './elements/button';
import { Paragraph } from './elements/paragraph';

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.primary[100]};
  font-size: 2.074rem;
  font-weight: 800;
`;

const Strong = styled.strong`
  font-weight: 600;
  color: ${({ theme: { colors } }) => colors.grey[25]};
`;

const Box = styled.div<{ yolor: number }>`
  background: ${({ yolor, theme: { colors } }) => colors.grey[yolor]};
  width: 100px;
  height: 100px;
  float: left;
`;

export const Test = () => {
  return (
    <>
      <Title>inemit! Wörter lernen!</Title>
      <Paragraph>
        Hello. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Excepturi, <em>laborum. Lorem ipsum dolor sit amet</em> consectetur
        adipisicing{' '}
        <Strong>
          elit. Quo, hic. Dolores unde <em>necessitatibus</em>
        </Strong>{' '}
        cumque omnis quis laborum exercitationem alias reiciendis?
      </Paragraph>
      <p>
        <Button>asdf</Button>
        <Button primary>primary</Button>
      </p>
      <p>
        <Box yolor={10} />
        <Box yolor={25} />
        <Box yolor={50} />
        <Box yolor={75} />
        <Box yolor={85} />
        <Box yolor={95} />
        <Box yolor={98} />
      </p>
    </>
  );
};
