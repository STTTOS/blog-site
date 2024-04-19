import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.NODE_ENV === 'development' ? '/' : 'https://xuan-1313104191.cos.ap-chengdu.myqcloud.com/base/blog';
// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7500',
        cookieDomainRewrite: {
          'wishufree.com': 'localhost'
        }
      },
      '/static': {
        target: 'http://localhost:7500'
      }
    }
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      cache: true,
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
      output: {
        assetFileNames: (assetInfo) => {
          return  '[name]-[hash][extname]'
        },
        chunkFileNames() {
          return  '[name]-[hash].js'
        },
        entryFileNames() {
          return  '[name]-[hash].js'
        },
        experimentalMinChunkSize: 1024 * 100,
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
