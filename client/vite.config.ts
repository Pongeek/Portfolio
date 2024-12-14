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
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: '0.0.0.0',
      port: 3001,
      clientPort: 3001,
      timeout: 5000,
      overlay: true,
    },
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === "production" ? 'http://localhost:3000' : 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    },
    watch: {
      usePolling: true,
      interval: 1000,
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@db': path.resolve(__dirname, '../db')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
});
