import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUIStore } from '@pathket/shared';
import App from './App';
import './styles/index.css';

// Initialize theme from store and apply to DOM
const initialTheme = useUIStore.getState().theme;
console.log('[Theme Init] Initial theme:', initialTheme);
console.log('[Theme Init] localStorage theme:', localStorage.getItem('theme'));

if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', initialTheme);
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
    console.log('[Theme Init] Added dark class to HTML');
  } else {
    document.documentElement.classList.remove('dark');
    console.log('[Theme Init] Removed dark class from HTML');
  }
  console.log('[Theme Init] HTML classList:', Array.from(document.documentElement.classList));
  console.log('[Theme Init] data-theme attribute:', document.documentElement.getAttribute('data-theme'));
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
