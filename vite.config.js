import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import wasmPack from 'vite-plugin-wasm-pack'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasmPack(['../wasm-sudoku'])],
  build: {
    rollupOptions: {
      input: {
        'en': './index.html',
        'zh': './zh/index.html',
        'ja': './ja/index.html',
      },
      // output: {
      //   dir: 'dist',
      //   format: 'esm',
      // },
    },
  },
})
