import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    tsc: false
  },
  server: {
    allowedHosts: ['j6948f58.natappfree.cc'],
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/app-api': {
        // target: 'http://192.168.1.191:48080',
        target: 'http://121.36.66.72:48080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
