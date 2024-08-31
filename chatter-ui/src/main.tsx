import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from './components/ui/toaster.tsx';
import App from './app.tsx';
import { AuthProvider } from './features/auth/auth-context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <App />
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
);
