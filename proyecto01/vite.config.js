import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Resuelve problemas con importaciones
      axios: 'axios',  
    },
  },
  build: {
    rollupOptions: {
      // Excluir módulos específicos del bundle si es necesario
      external: [],  // Deja vacío o especifica módulos si los tienes
    },
  },
})
