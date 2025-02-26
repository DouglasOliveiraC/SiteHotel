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
        proxy: {
            // Redireciona chamadas do frontend para o backend no Railway
            '/api': {
                target: 'https://sitehotel-production.up.railway.app', // URL do backend no Railway
                changeOrigin: true,
                secure: true, // Mantém HTTPS ativo
            },
        },
    }
});
