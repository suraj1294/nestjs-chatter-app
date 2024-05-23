import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const API_URL = `${env.VITE_API_URL ?? 'http://localhost:3000'}`;
  const PORT = `${env.VITE_PORT ?? '3000'}`;

  console.log(env);

  console.log({ API_URL, PORT });

  return {
    plugins: [react(), TanStackRouterVite()],
    server: {
      proxy: {
        '/api': {
          target: API_URL,
          changeOrigin: true,
        },
        '/graphql': {
          target: API_URL,
          changeOrigin: true,
        },
      },
      port: Number(PORT),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
