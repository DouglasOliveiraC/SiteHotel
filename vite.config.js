import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        host: '0.0.0.0',
        
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    base: './', // Garante que os assets sejam referenciados corretamente
});
