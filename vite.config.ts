import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'http://www.wishufree.com',
        cookieDomainRewrite: {
          'wishufree.com': 'localhost'
        }
      },
      '/static': {
        target: 'http://www.wishufree.com'
      }
    }
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
      output: {
        experimentalMinChunkSize: 1024 * 30,
      }
    }
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') }
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
})
