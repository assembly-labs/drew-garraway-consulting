import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller builds
    minify: 'terser', // Better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate vendor chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor';
            }
            if (id.includes('@tanstack')) {
              return 'tanstack-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            return 'vendor';
          }
        },
        // Asset naming for better caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      },
    },
    // Performance optimizations
    chunkSizeWarningLimit: 1000, // Warn for chunks > 1MB
    cssCodeSplit: true, // Split CSS for parallel loading
    assetsInlineLimit: 4096, // Inline assets < 4kb
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query'],
    exclude: []
  },
  // Enable CSS optimization
  css: {
    devSourcemap: false,
    modules: {
      localsConvention: 'camelCase'
    }
  }
})