import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    allowedHosts: ['j6948f58.natappfree.cc'],
    host: '0.0.0.0', // 使用0.0.0.0监听所有网络接口的IP地址
    port: 5173, // 或者你选择的端口号
    proxy: {
      '/app-api': {
        target: 'http://192.168.1.191:48080',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/app-api/, ''),
      },
    },
  },
})
