<template>
    <div class="home">
        <!-- Renderiza o Header dependendo do estado de login -->
        <HeaderVisitor v-if="!auth.isLoggedIn" />
        <HeaderLoggedIn v-else />

        <!-- Renderiza o conteúdo principal da página -->
        <main class="content">
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
        </main>

        <!-- Footer comum para todas as páginas -->
        <FooterCommon />
    </div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';  // Certifique-se de importar onMounted
    import { useAuthStore } from '@/stores/auth'; // Store de autenticação
    import FeatureCard from '@/components/FeatureCard.vue'; // Componente de cards
    import HeaderVisitor from '@/components/HeaderVisitor.vue';
    import HeaderLoggedIn from '@/components/HeaderLoggedIn.vue';
    import FooterCommon from '@/components/FooterCommon.vue';

    const auth = useAuthStore(); // Acesso à store de autenticação

    // Sincronizando o estado de autenticação com o Supabase ou outra fonte
    onMounted(async () => {
        await auth.fetchUser(); // Garante que o estado de login seja atualizado
    });
</script>

<style scoped>
    .home {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column; 
        justify-content: flex-start;
        align-items: center;
        text-align: center;
        padding: 2rem;
    }

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

    .cta-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        max-width: 300px;
    }

    .cta {
        padding: 0.75rem 1.5rem;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        transition: background-color 0.3s ease;
        text-align: center;
    }

        .cta:hover {
            background-color: #0056b3;
        }

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

    @media (min-width: 768px) {
        .content {
            flex-direction: row; 
            justify-content: space-around;
            align-items: flex-start;
            padding: 4rem;
            text-align: left;
        }

        .welcome, .features {
            width: 45%;
        }

        .cta-buttons {
            flex-direction: row;
            justify-content: flex-start;
        }

            .cta-buttons .cta {
                margin-right: 1rem;
                width: auto;
            }

        .feature-list {
            flex-direction: row; 
            justify-content: space-between;
        }

        .feature-card {
            flex: 1;
            max-width: 300px;
        }
    }
</style>
