import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
