import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      generateScopedName: '[name]_[local]__[hash:base64:5]',
      hashPrefix: 'prefix'
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  }
})
