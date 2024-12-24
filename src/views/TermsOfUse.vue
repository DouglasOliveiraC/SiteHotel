<template>
    <div class="terms-of-use">
        <!-- Header dinâmico com base no estado de login -->
        <HeaderVisitor v-if="!isLoggedIn" />
        <HeaderLoggedIn v-else />

        <!-- Conteúdo principal -->
        <main class="content">
            <section class="terms">
                <h1>Termos de Uso</h1>
                <p>
                    Bem-vindo ao HotelSite! Estes termos de uso descrevem as regras e regulamentos para o uso do nosso site.
                </p>
                <p>
                    Ao acessar este site, assumimos que você aceita estes termos na íntegra. Não continue a usar o HotelSite caso você não concorde com todos os termos de uso declarados nesta página.
                </p>
                <ul>
                    <li>Não é permitido copiar ou republicar o conteúdo do HotelSite.</li>
                    <li>Não é permitido usar o site para fins ilegais ou prejudiciais.</li>
                    <li>Respeite a privacidade e os direitos dos outros usuários.</li>
                </ul>
                <p>
                    Para mais informações, consulte nossa <router-link to="/privacy-policy">Política de Privacidade</router-link>.
                </p>
            </section>
        </main>

        <!-- Rodapé comum -->
        <FooterCommon />
    </div>
</template>

<script>
    import { ref } from 'vue';
    import { useHead } from '@unhead/vue';
    import HeaderVisitor from '@/components/HeaderVisitor.vue';
    import HeaderLoggedIn from '@/components/HeaderLoggedIn.vue';
    import FooterCommon from '@/components/FooterCommon.vue';

    export default {
        name: 'TermsOfUse',
        components: {
            HeaderVisitor,
            HeaderLoggedIn,
            FooterCommon,
        },
        setup() {
            const isLoggedIn = ref(false); // Simulando o estado de login

            // Metadados para SEO
            useHead({
                title: 'Termos de Uso - HotelSite',
                meta: [
                    { charset: 'utf-8' },
                    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                    { name: 'description', content: 'Leia os Termos de Uso do HotelSite para entender as regras e regulamentos do site.' },
                ],
            });

            return { isLoggedIn };
        },
    };
</script>

<style scoped>
    .terms-of-use {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    /* Estilos do conte�do */
    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        text-align: left;
    }

    .terms h1 {
        font-size: 2.5rem;
        color: #333;
        margin-bottom: 1.5rem;
    }

    .terms p {
        font-size: 1.2rem;
        color: #555;
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    .terms ul {
        margin: 1rem 0;
        padding-left: 1.5rem;
    }

        .terms ul li {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            color: #444;
        }

    /* Responsividade */
    @media (max-width: 768px) {
        .terms h1 {
            font-size: 2rem;
        }

        .terms p, .terms ul li {
            font-size: 1rem;
        }
    }
</style>
