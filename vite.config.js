import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const config = {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    open: true,
  },
};

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return config;
  } else {
    return { base: '/citytrade/', ...config };
  }
})
