import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  publicDir: path.resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      assets: path.resolve(__dirname, 'public'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, './dist'),
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        learn: path.resolve(__dirname, 'src/learn.html'),
        juices: path.resolve(__dirname, 'src/juices.html'),
        // Add more entries as needed
      },
    },
  },
})
