import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { theme } from './theme';
import { Button } from './elements/button';

const GlobalStyle = createGlobalStyle`
body, * {
  font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
}
`;

const Text = styled.div`
  color: ${({ theme: { colors } }) => colors.grey[10]};
  font-size: 1.25rem;
`;

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.primary[100]};
  font-size: 2.5rem;
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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Title>inemit! Wörter lernen!</Title>
      <Text>
        Hello. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Excepturi, <em>laborum. Lorem ipsum dolor sit amet</em> consectetur
        adipisicing{' '}
        <Strong>
          elit. Quo, hic. Dolores unde <em>necessitatibus</em>
        </Strong>{' '}
        cumque omnis quis laborum exercitationem alias reiciendis?
      </Text>
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
    </ThemeProvider>
  );
};

var mountNode = document.getElementById('app');
ReactDOM.render(<App />, mountNode);
