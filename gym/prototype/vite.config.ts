import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true  // Allow mobile device access on local network
  },
  build: {
    outDir: 'dist',
    sourcemap: true,  // Enable source maps for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']  // Separate React bundle for better caching
        }
      }
    }
  },
  base: './'  // Use relative paths for deployment
})
