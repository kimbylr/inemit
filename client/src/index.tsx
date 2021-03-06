import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Header } from './components/header';
import { Main } from './components/main';
import { Menu } from './components/menu';
import { AuthProvider } from './helpers/auth';
import { PrivateRoute } from './helpers/private-route';
import { About } from './pages/about';
import { EditList } from './pages/edit-list';
import { Home } from './pages/home';
import { Learn } from './pages/learn';
import { List } from './pages/list';
import { Start } from './pages/start';
import { StoreProvider } from './store';
import { theme } from './theme';

const App = () => (
  <ThemeProvider theme={theme}>
    <StoreProvider>
      <AuthProvider>
        <BrowserRouter>
          <GlobalStyle />
          <Switch>
            <PrivateRoute path="/lists/:slug/learn" component={Learn} />
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <PrivateRoute path="/start" component={Start} />
            <Route path="/lists/:slug?">
              <Header />
              <Menu />
              <Main>
                <Switch>
                  <PrivateRoute path="/lists/:slug/edit" component={EditList} />
                  <PrivateRoute path="/lists/:slug" component={List} />
                </Switch>
              </Main>
            </Route>
          </Switch>
        </BrowserRouter>
      </AuthProvider>
    </StoreProvider>
  </ThemeProvider>
);

const GlobalStyle = createGlobalStyle`
  html {
    font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    background: #fafafa;
  }
  h1, h2, h3, h4 { margin: 0 }
`;

var mountNode = document.getElementById('app');
ReactDOM.render(<App />, mountNode);
