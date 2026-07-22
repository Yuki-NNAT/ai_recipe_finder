import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split heavy libraries into their own cached chunks. Combined with
        // route-level lazy loading, this keeps the initial payload lean.
        manualChunks: {
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          'vendor-motion': ['framer-motion'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
