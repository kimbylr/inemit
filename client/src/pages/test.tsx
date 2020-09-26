import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from '../elements/button';
import { Heading, Paragraph } from '../elements/typography';
import { Icon } from '../elements/icon';

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

const Böxli = styled(Box)`
  width: 20px;
  height: 20px;
`;

const rotate = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;

const Rotating = styled.div`
  animation: ${rotate} 2s infinite linear;
  height: 100%;
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
        <Box tint={98}>
          <Icon type="chevronDown" />
        </Box>
        <Box tint={98}>
          <Icon type="ok" />
        </Box>
        <Box tint={98}>
          <Icon type="new" />
        </Box>
        <Box tint={98}>
          <Icon type="attention" />
        </Box>

        <Box tint={98}>
          <Icon type="sync" />
        </Box>
        <Box tint={98}>
          <Rotating>
            <Icon type="syncInCircle" />
          </Rotating>
        </Box>
        <Box tint={98}>
          <Icon type="deleteInCircle" />
        </Box>
        <Box tint={98}>
          <Icon type="edit" />
        </Box>

        <Böxli tint={98}>
          <Icon type="attention" />
        </Böxli>
        <Böxli tint={98}>
          <Icon type="ok" />
        </Böxli>
        <Böxli tint={98}>
          <Icon type="new" />
        </Böxli>
        <Böxli tint={98}>
          <Icon type="sync" />
        </Böxli>
        <Böxli tint={98}>
          <Icon type="flag" />
        </Böxli>
      </div>
      <div style={{ clear: 'both', margin: '10px 0' }}>&nbsp;</div>

      <div>
        <Box tint={98}>
          <Icon type="addList" />
        </Box>
        <Box tint={98}>
          <Icon type="logo" />
        </Box>
        <Box tint={98}>
          <Icon type="next" />
        </Box>
        <Box tint={98}>
          <Icon type="cancel" />
        </Box>
        <Box tint={98}>
          <Icon type="flag" />
        </Box>
      </div>

      <div style={{ clear: 'both', margin: '10px 0' }}>&nbsp;</div>

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
