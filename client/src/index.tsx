import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Header } from './components/header';
import { Main } from './components/main';
import { Menu } from './components/menu';
import { Home } from './pages/home';
import { Test } from './pages/test';
import { theme } from './theme';

const App = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <GlobalStyle />
      <Header />
      <Menu />
      <Main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/test" component={Test} />
        </Switch>
      </Main>
    </BrowserRouter>
  </ThemeProvider>
);

const GlobalStyle = createGlobalStyle`
  html {
    font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
  }
  h1, h2, h3, h4 { margin: 0 }
`;

var mountNode = document.getElementById('app');
ReactDOM.render(<App />, mountNode);
