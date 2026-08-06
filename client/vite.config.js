import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 3000,
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Increase warning threshold
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — always needed
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // Animation libraries — loaded for most pages
          'vendor-motion': ['framer-motion', 'gsap'],

          // 3D rendering — heavy, lazy-loaded
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],

          // Charts — only on dashboard / soil pages
          'vendor-charts': ['recharts', 'react-is'],

          // HTTP client
          'vendor-axios': ['axios'],
        },
      },
    },
  },

  // Optimize deps for faster cold start
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'axios', 'lucide-react'],
  },
});
