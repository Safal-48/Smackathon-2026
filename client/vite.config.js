import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_URL || 'http://localhost:5000';

  return {
    plugins: [react(), tailwindcss()],

    server: {
      port: 3000,
      host: '127.0.0.1',
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },

    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
            'vendor-motion': ['framer-motion', 'gsap'],
            'vendor-three':  ['three', '@react-three/fiber', '@react-three/drei'],
            'vendor-charts': ['recharts', 'react-is'],
            'vendor-axios':  ['axios'],
          },
        },
      },
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', 'axios', 'lucide-react'],
    },
  };
});
