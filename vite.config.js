import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Use 5174 to avoid conflict with MCA frontend on 5173
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // AICIT backend (8081 to avoid conflict with MCA's 8080)
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
