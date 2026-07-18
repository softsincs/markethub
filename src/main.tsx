import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error catcher for visual debugging
window.addEventListener('error', (event) => {
  const container = document.getElementById('root');
  if (container) {
    container.innerHTML = `
      <div style="padding: 24px; background: #fff5f5; color: #c53030; font-family: monospace; border: 2px solid #feb2b2; margin: 20px; text-align: left;">
        <h3 style="margin-top: 0; color: #9B2C2C;">⚠️ Client-Side Runtime Crash</h3>
        <p><strong>Message:</strong> ${event.message}</p>
        <p><strong>Source:</strong> ${event.filename}:${event.lineno}:${event.colno}</p>
        <pre style="background: #fff; padding: 12px; border: 1px solid #fed7d7; overflow: auto; max-height: 400px; white-space: pre-wrap;">${event.error?.stack || 'No stack trace available'}</pre>
      </div>
    `;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
