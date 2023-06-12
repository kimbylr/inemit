import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './helpers/auth';
import { PrivateRoute } from './helpers/private-route';
import { About } from './pages/about';
import { EditList } from './pages/edit-list';
import { LandingPage } from './pages/landing-page';
import { Learn } from './pages/learn';
import { List } from './pages/list';
import { Start } from './pages/start';
import { StoreProvider } from './store';

import './index.css';

const App = () => (
  <StoreProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/lists/:slug/learn"
            element={<PrivateRoute redirectTo="/" children={<Learn />} />}
          />
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/start" element={<PrivateRoute children={<Start />} />} />
          <Route path="/lists/:slug" element={<PrivateRoute children={<List />} />} />
          <Route path="/lists/:slug/edit" element={<PrivateRoute children={<EditList />} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StoreProvider>
);

const mountNode = document.getElementById('app');
const root = createRoot(mountNode!);
root.render(<App />);
