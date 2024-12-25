import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// Removed the 'App' import from 'electron'
import { MainApp } from './MainApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);