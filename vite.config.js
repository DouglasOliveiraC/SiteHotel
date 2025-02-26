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
        port: 3000, // Mantém a porta consistente com a configuração do Docker e Railway
        strictPort: true, // Garante que o Vite não tente outras portas
    },
    build: {
        outDir: 'dist', // Garante que os arquivos de produção vão para a pasta correta
        emptyOutDir: true, // Limpa a pasta antes do build
    }
});
