import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Using relative base path ensures seamless hosting on any GitHub Pages repository URL
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});
