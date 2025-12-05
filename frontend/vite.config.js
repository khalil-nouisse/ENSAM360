import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // Load all env variables

  return {
    define: {
      'process.env.BACKEND_SERVER': JSON.stringify(env.BACKEND_SERVER),
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // Now you can use "@/components/..."
      },
    },
  };
});