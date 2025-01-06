<template>
    <div class="not-found">
        <h1>404 - Página Não Encontrada</h1>
        <p>Desculpe, a página que você está procurando não existe.</p>
        <router-link to="/" class="back-home">Voltar para Home</router-link>
    </div>
</template>

<script>
    import { defineComponent } from 'vue';
    import { useHead } from '@unhead/vue'; // Gerenciador moderno de <meta> e títulos

    export default defineComponent({
        name: 'NotFound',
        setup() {
            useHead({
                title: '404 - Página Não Encontrada', // Título dinâmico
                meta: [
                    { charset: 'utf-8' }, 
                    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                    { name: 'description', content: 'A página que você está tentando acessar não foi encontrada.' },
                ],
            });
        },
    });
</script>

<style scoped>
    .not-found {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        background-color: #f8f9fa;
        color: #333;
    }

        .not-found h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }

        .not-found p {
            font-size: 1.5rem;
            margin-bottom: 2rem;
        }

    .back-home {
        padding: 0.75rem 1.5rem;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
    }

        .back-home:hover {
            background-color: #0056b3;
        }
</style>