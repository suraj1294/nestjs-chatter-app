import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from './components/toggle-theme-button.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { RouterProvider, createRouter } from '@tanstack/react-router';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <div className="fixed top-4 right-4">
        <ModeToggle />
      </div>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
);
