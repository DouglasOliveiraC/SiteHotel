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
        port: 3000, // Mant�m a porta consistente com a configura��o do Docker e Railway
        strictPort: true, // Garante que o Vite n�o tente outras portas
    },
    build: {
        outDir: 'dist', // Garante que os arquivos de produ��o v�o para a pasta correta
        emptyOutDir: true, // Limpa a pasta antes do build
    }
});
