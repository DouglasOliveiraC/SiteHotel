<!-- src/components/AboutView.vue -->
<template>
    <div class="about">
        <!-- Header dinâmico com base no estado de login no App-->
        

        <!-- Conteúdo principal -->
        <main class="content">
            <section class="intro">
                <h1>Sobre o HotelSite</h1>
                <p>O HotelSite é a plataforma ideal para você planejar e reservar sua estadia em hotéis. Através do nosso sistema, você pode facilmente encontrar a melhor opção de hospedagem e garantir o melhor preço.</p>
                <p>Nosso objetivo é oferecer a melhor experiência de viagem com uma interface simples e intuitiva.</p>
            </section>
        </main>

        <!-- Rodapé comum -->
        <FooterCommon />
    </div>
</template>

<script>
    import { ref } from 'vue';
    import { useHead } from '@unhead/vue'; // Gerenciar metadados
    import HeaderVisitor from '@/components/HeaderVisitor.vue';
    import HeaderLoggedIn from '@/components/HeaderLoggedIn.vue';
    import FooterCommon from '@/components/FooterCommon.vue';

    export default {
        name: 'AboutView',
        components: {
            HeaderVisitor,
            HeaderLoggedIn,
            FooterCommon,
        },
        setup() {
            const isLoggedIn = ref(false); // Simulando estado de login

            // Metadados para SEO
            useHead({
                title: 'Sobre o HotelSite',
                meta: [
                    { charset: 'utf-8' },
                    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                    { name: 'description', content: 'Saiba mais sobre o HotelSite, a melhor plataforma para planejar sua viagem.' },
                ],
            });

            return { isLoggedIn };
        },
    };
</script>

<style scoped>
    .about {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    /* Estilos do conteúdo */
    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        text-align: center;
    }

    .intro h1 {
        font-size: 2.5rem;
        color: #333;
        margin-bottom: 1rem;
    }

    .intro p {
        font-size: 1.2rem;
        color: #555;
        margin-bottom: 1rem;
    }

    /* Responsividade */
    @media (max-width: 768px) {
        .intro h1 {
            font-size: 2rem;
        }

        .intro p {
            font-size: 1rem;
        }
    }
</style>