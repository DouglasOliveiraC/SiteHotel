import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)), // Aponta para a pasta 'src'
        },
    }, 
    server: {
        port: 5173,
        host: '0.0.0.0',
        proxy: {
            // Redireciona chamadas para /api ao backend
            '/api': {
                target: 'http://localhost:5000', // URL do backend
                changeOrigin: true,
                secure: false,
            },
        }
    }
});