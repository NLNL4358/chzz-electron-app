import React from 'react';
import { HashRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import App from './App';

import { AuthProvider } from './providers/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HashRouter>
);