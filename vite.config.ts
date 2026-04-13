import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/lab-values-explorer/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
