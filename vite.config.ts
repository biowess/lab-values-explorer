import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/lab-values-explorer/',
  plugins: [react()],
});
