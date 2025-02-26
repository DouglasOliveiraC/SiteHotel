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
        host: '0.0.0.0', // Permite acesso externo no Railway
        port: process.env.PORT || 5173, // Usa a porta 5173 localmente e 3000 no Railway
        strictPort: true, // Garante que o Vite não tente outras portas
    },
    build: {
        outDir: 'dist', // Garante que os arquivos de produção vão para a pasta correta
        emptyOutDir: true, // Limpa a pasta antes do build
    },
    base: './', // 🔹 Movido para o escopo principal (corrigido)
});
