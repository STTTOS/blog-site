import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

const fs = require('fs')

// const base = process.env.NODE_ENV === 'development' ? '/' : 'https://xuan-1313104191.cos.ap-chengdu.myqcloud.com/base/blog';
// https://vitejs.dev/config/
const target = 'https://www.wishufree.com'
// http://localhost:7500
export default defineConfig({
  // base,
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
  },
  server: {
    https: {
      key: fs.readFileSync('./https/key.pem'),
      cert: fs.readFileSync('./https/cert.pem')
    },
    proxy: {
      '/api': {
        target,
        changeOrigin: true,
        cookieDomainRewrite: {
          'wishufree.com': 'localhost'
        }
      },
      '/static': {
        changeOrigin: true,
        target
      }
    }
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      plugins: [
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 1024 * 30,
          algorithm: 'gzip',
          ext: '.gz'
        })
      ],
      cache: true,
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      },
      output: {
        manualChunks(id) {
          if (id.includes('antd') || id.includes('highlight')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        },
        assetFileNames: () => {
          return '[name]-[hash][extname]'
        },
        chunkFileNames(chunk) {
          if (chunk.facadeModuleId) {
            const name = chunk.facadeModuleId
              .split('src/page/')[1]
              .split('.')[0]
              .split('/')
              .join('_')
            return `p_${name}-[hash].async.js`
          }
          return '[name]-[hash].js'
        },
        entryFileNames() {
          return 'entry-[hash].js'
        },
        experimentalMinChunkSize: 1024 * 20
      }
    }
  },
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, './src') }]
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
})
