import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TalentTreeProvider } from './context/TalentTreeContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <TalentTreeProvider>
      <App />
    </TalentTreeProvider>
  </React.StrictMode>
);

document.documentElement.dataset.appMounted = 'true';

reportWebVitals();
