import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: '诗韵星 - AI诗词解析平台'
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3003,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/variables.scss" as *;'
      }
    }
  }
})