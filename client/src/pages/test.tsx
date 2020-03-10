import 'normalize.css';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../elements/button';
import { Heading, Paragraph } from '../elements/typography';

const Box = styled.div<{ tint: number }>`
  background: ${({ tint, theme: { colors } }) => colors.grey[tint]};
  color: ${({ tint, theme: { colors } }) => (tint < 50 ? colors.grey[98] : '')};
  width: 100px;
  height: 100px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Test: FC = () => {
  return (
    <>
      <Heading>inemit! Wörter lernen!</Heading>
      <Paragraph>
        Hello. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Excepturi, <em>laborum. Lorem ipsum dolor sit amet</em> consectetur
        adipisicing{' '}
        <strong>
          elit. Quo, hic. Dolores unde <em>necessitatibus</em>
        </strong>{' '}
        cumque omnis quis laborum exercitationem alias reiciendis?
      </Paragraph>
      <Paragraph>
        <Button>asdf</Button>
        <Button primary>primary</Button>
      </Paragraph>
      <div>
        <Box tint={10}>10</Box>
        <Box tint={25}>25</Box>
        <Box tint={50}>50</Box>
        <Box tint={60}>60</Box>
        <Box tint={75}>75</Box>
        <Box tint={85}>85</Box>
        <Box tint={95}>95</Box>
        <Box tint={98}>98</Box>
      </div>
    </>
  );
};
