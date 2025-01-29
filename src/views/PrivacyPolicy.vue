<template>
    <div class="privacy-policy">
        <!-- Header dinâmico com base no estado de login no App-->

        <main class="content">
            <section class="privacy">
                <h1>Política de Privacidade</h1>
                <p>
                    No HotelSite, respeitamos sua privacidade e estamos comprometidos em protegê-la. Esta política de privacidade explica como coletamos, usamos e protegemos suas informações pessoais.
                </p>
                <h2>Coleta de Informações</h2>
                <p>
                    Podemos coletar informações pessoais como nome, endereço de e-mail, número de telefone e dados de pagamento quando você realiza uma reserva ou se cadastra em nosso site.
                </p>
                <h2>Uso das Informações</h2>
                <p>
                    As informações coletadas são usadas para processar reservas, personalizar sua experiência no site e enviar comunicações relacionadas aos nossos serviços.
                </p>
                <h2>Proteção de Dados</h2>
                <p>
                    Implementamos medidas de segurança avançadas para proteger suas informações contra acesso não autorizado, alteração ou divulgação.
                </p>
                <h2>Compartilhamento de Dados</h2>
                <p>
                    Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para processar reservas ou conforme exigido por lei.
                </p>
                <p>
                    Para mais informações sobre como tratamos seus dados, entre em contato conosco através da nossa <router-link to="/contact">página de contato</router-link>.
                </p>
            </section>
        </main>

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
        name: 'PrivacyPolicy',
        components: {
            HeaderVisitor,
            HeaderLoggedIn,
            FooterCommon,
        },
        setup() {
            const isLoggedIn = ref(false);

            useHead({
                title: 'Política de Privacidade - HotelSite',
                meta: [
                    { charset: 'utf-8' },
                    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                    { name: 'description', content: 'Leia nossa política de privacidade e entenda como protegemos seus dados no HotelSite.' },
                ],
            });

            return { isLoggedIn };
        },
    };
</script>

<style scoped>
    .privacy-policy {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        text-align: left;
    }

    .privacy h1 {
        font-size: 2.5rem;
        color: #333;
        margin-bottom: 1.5rem;
    }

    .privacy h2 {
        font-size: 1.8rem;
        color: #555;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    .privacy p {
        font-size: 1.2rem;
        color: #555;
        margin-bottom: 1rem;
        line-height: 1.6;
    }

    @media (max-width: 768px) {
        .privacy h1 {
            font-size: 2rem;
        }

        .privacy h2 {
            font-size: 1.5rem;
        }

        .privacy p {
            font-size: 1rem;
        }
    }
</style>
