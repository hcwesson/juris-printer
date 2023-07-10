import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      'data': path.resolve(__dirname, 'data'),
    }
  },
  assetsInclude: ['**/*.csv'],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    }
  }
})

