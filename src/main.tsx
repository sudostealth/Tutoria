import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AdminApp } from './admin/AdminApp';

import './index.css';

// Register Service Worker for PWA (Progressive Web App)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (reg) => {
        console.log('Tutoria PWA ServiceWorker registered with scope:', reg.scope);
      },
      (err) => {
        console.log('Tutoria PWA ServiceWorker registration failed:', err);
      }
    );
  });
}


const adminSlug = import.meta.env.VITE_ADMIN_SLUG;
const currentPath = window.location.pathname;

let RootComponent = <App />;

const adminBasePath = adminSlug ? `/${adminSlug.replace(/^\//, '').replace(/\/$/, '')}` : null;
if (adminBasePath && (currentPath === adminBasePath || currentPath.startsWith(`${adminBasePath}/`))) {
  RootComponent = <AdminApp />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {RootComponent}
  </StrictMode>,
);

