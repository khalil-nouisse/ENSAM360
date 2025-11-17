import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
          const env = loadEnv(mode, process.cwd(), ''); // Load all env variables

          return {
            define: {
              'process.env.BACKEND_SERVER': JSON.stringify(env.BACKEND_SERVER), // Define specific variables
            },
            plugins: [react()],
          };
        });
