import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Support decoupled frontend/backend deployment (e.g. Vercel for UI + Cloud Run for API)
const apiBaseUrl = (import.meta as any).env.VITE_API_BASE_URL;
if (apiBaseUrl) {
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    let url = typeof input === "string" ? input : (input as Request).url;
    if (url.startsWith("/api/")) {
      url = `${apiBaseUrl.replace(/\/$/, "")}${url}`;
    }
    if (typeof input === "string") {
      return originalFetch(url, init);
    } else {
      const request = new Request(url, input as any);
      return originalFetch(request, init);
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
