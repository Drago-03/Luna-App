import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Define the MainApp component here instead of importing from "MainApp"
function MainApp() {
  return <div>Hello from MainApp!</div>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);

export { MainApp };