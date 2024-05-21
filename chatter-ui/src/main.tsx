import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from './components/toggle-theme-button.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import App from './app.tsx';
import { AuthProvider } from './components/auth/auth-context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <App />
      </AuthProvider>
      <div className="fixed top-4 right-4">
        <ModeToggle />
      </div>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
);
