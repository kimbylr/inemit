import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Header } from './components/header';
import { Menu } from './components/menu';
import { Test } from './test';
import { theme } from './theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header />
      <Menu />
      <Test />
    </ThemeProvider>
  );
};

const GlobalStyle = createGlobalStyle`
  html {
    font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    font-size: 125%
  }
  h1, h2, h3, h4 { margin: 0 }
`;

var mountNode = document.getElementById('app');
ReactDOM.render(<App />, mountNode);
