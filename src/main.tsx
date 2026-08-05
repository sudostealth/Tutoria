import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AdminApp } from './admin/AdminApp';

import './index.css';

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

