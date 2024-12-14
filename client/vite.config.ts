import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import runtimeErrorModal from '@replit/vite-plugin-runtime-error-modal';

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorModal(),
  ],
  server: {
    port: 3001,
    host: '0.0.0.0',
    hmr: {
      protocol: 'ws',
      timeout: 30000,
      clientPort: 443,
      host: 'portfoliopro.maxprog.repl.co'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@db': path.resolve(__dirname, '../db')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  build: {
    sourcemap: true,
    outDir: '../dist/client',
    emptyOutDir: true
  }
});
