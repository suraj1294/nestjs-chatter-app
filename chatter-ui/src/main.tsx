import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from './components/ui/toaster.tsx';
import App, { queryClient } from './app.tsx';
import { AuthProvider } from './features/auth/auth-context.tsx';
import { QueryClientProvider } from '@tanstack/react-query';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <App />
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
