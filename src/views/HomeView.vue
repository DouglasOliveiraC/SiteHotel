<template>
    <div class="home">
        <!-- Header dinâmico com base no estado de login no App-->
        <!-- Conteúdo principal da página -->
        <main class="content">
            <!-- Seção de Boas-Vindas e Diferenciais do Hotel -->
            <section class="welcome">
                <h1>Bem-vindo ao HotelSite!</h1>
                <p>Planeje sua próxima estadia conosco.</p>
            </section>

            <section class="features">
                <h2>Nossos Diferenciais</h2>
                <div class="feature-list">
                    <FeatureCard title="Conforto"
                                 description="Quartos confortáveis para uma estadia agradável." />
                    <FeatureCard title="Facilidade"
                                 description="Sistema fácil de navegar para facilitar sua reserva." />
                    <FeatureCard title="Preço Justo"
                                 description="Oferecemos os melhores preços do mercado." />
                </div>
            </section>

            <!-- Seção de Localização (Google Maps) -->
            <section class="location">
                <h2>Nosso Hotel</h2>
                <p>Estamos localizados no coração de Porto Alegre, no campus da PUC-RS.</p>
                <GoogleMap />
            </section>

            <!-- Seção da Galeria de Fotos -->
            <section class="gallery">
                <h2>Conheça nossas instalações</h2>
                <p>Veja um pouco mais sobre nosso ambiente e estrutura.</p>
                <PhotoGallery />
            </section>

        </main>

        <!-- Footer comum para todas as páginas -->
        <FooterCommon />
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';

    // O objetivo é manter a verificação de login apenas no App.vue,
    import { useAuthStore } from '@/stores/auth';

    // Componentes usados nesta página
    import FeatureCard from '@/components/FeatureCard.vue';
    import FooterCommon from '@/components/FooterCommon.vue';
    import GoogleMap from '@/components/GoogleMap.vue';
    import PhotoGallery from '@/components/PhotoGallery.vue';
</script>

<style scoped>
    /* Contêiner principal: layout em coluna com altura mínima para cobrir a tela */
    .home {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    /* Conteúdo principal: layout vertical para que cada seção fique uma abaixo da outra */
    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        text-align: center;
        padding: 2rem;
    }

    /* Estilos da seção de Boas-Vindas */
    .welcome h1 {
        font-size: 2.5rem;
        color: #333;
        margin-bottom: 1rem;
    }

    .welcome p {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        color: #555;
    }

    /* Estilos da seção de Diferenciais */
    .features {
        margin-top: 3rem;
        width: 100%;
    }

        .features h2 {
            color: #333;
            font-size: 2rem;
            margin-bottom: 1.5rem;
        }

    .feature-list {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
        width: 100%;
        max-width: 1200px;
    }

    .feature-card {
        width: 100%;
        max-width: 350px;
    }

    /* Estilos da seção de Localização */
    .location {
        width: 100%;
        max-width: 800px;
        margin: 3rem 0;
    }

        .location h2 {
            font-size: 2rem;
            color: #333;
            margin-bottom: 1rem;
        }

        .location p {
            font-size: 1.2rem;
            color: #555;
            margin-bottom: 1rem;
        }

    /* Estilos da seção de Galeria */
    .gallery {
        margin-top: 3rem;
        width: 100%;
        max-width: 800px;
    }

        .gallery h2 {
            font-size: 2rem;
            color: #333;
            margin-bottom: 1rem;
        }

        .gallery p {
            font-size: 1.2rem;
            color: #555;
            margin-bottom: 1rem;
        }

    /* Responsividade para telas maiores */
    @media (min-width: 768px) {
        .content {
            /* Mantendo o layout vertical para que as seções fiquem empilhadas */
            flex-direction: column;
            padding: 4rem;
            text-align: center;
        }
        
    }
</style>
