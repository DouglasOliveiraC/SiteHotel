<!--views/ContactView.vue-->
<template>
    <div class="contact-page">
        
        <main class="content">
            <section class="contact-container">
                <!-- Dados à esquerda -->
                <div class="contact-details">
                    <h1>Entre em Contato</h1>
                    <p>Adoraríamos ouvir você! Entre em contato conosco através das redes sociais ou pelo nosso email.</p>

                    <div class="contact-info">
                        <p><strong>Email:</strong> contato@hotelsite.com</p>
                        <p><strong>Telefone:</strong> +55 (11) 99999-9999</p>
                    </div>

                    <!-- Links para redes sociais -->
                    <div class="social-links">
                        <h2>Siga-nos nas redes sociais:</h2>
                        <a href="https://github.com/DouglasOliveiraC" target="_blank" aria-label="GitHub">
                            <img src="/icons/github.svg" alt="GitHub" />
                        </a>
                        <a href="https://www.linkedin.com/in/douglas-oliveira-6a9b0813a/" target="_blank" aria-label="LinkedIn">
                            <img src="/icons/linkedin.png" alt="LinkedIn" />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" aria-label="Instagram">
                            <img src="/icons/instagram.png" alt="Instagram" />
                        </a>
                    </div>
                </div>

                <!-- Foto à direita -->
                <div class="contact-photo">
                    <img src="/images/profile-photo.jpg" alt="Minha Foto" />
                </div>
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
        name: 'ContactView',
        components: {
            HeaderVisitor,
            HeaderLoggedIn,
            FooterCommon,
        },
        setup() {
            const isLoggedIn = ref(false);

            useHead({
                title: 'Contato - HotelSite',
                meta: [
                    { charset: 'utf-8' },
                    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                    { name: 'description', content: 'Entre em contato conosco! Veja nossas redes sociais e informações de contato.' },
                ],
            });

            return { isLoggedIn };
        },
    };
</script>

<style scoped>
    .contact-page {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    .content {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
    }

    .contact-container {
        display: flex;
        flex-direction: row;
        gap: 2rem;
        align-items: center;
        width: 100%;
        max-width: 1200px;
    }

    /* Dados à esquerda */
    .contact-details {
        flex: 1;
        text-align: left;
    }

        .contact-details h1 {
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 1rem;
        }

        .contact-details p {
            font-size: 1.2rem;
            color: #555;
            margin-bottom: 1rem;
            line-height: 1.6;
        }

    .contact-info p {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }

    /* Links das redes sociais */
    .social-links {
        margin-top: 2rem;
    }

        .social-links h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .social-links a {
            margin-right: 1rem;
            display: inline-block;
            width: 40px;
            height: 40px;
        }

        .social-links img {
            width: 40px;
            height: 40px;
            object-fit: contain;
        }

    /* Foto à direita */
    .contact-photo {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

        .contact-photo img {
            border-radius: 50%; 
            max-width: 400px; 
            height: auto; 
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
            object-fit: cover; 
        }

    /* Responsividade */
    @media (max-width: 768px) {
        .contact-container {
            flex-direction: column;
        }

        .contact-details {
            text-align: center;
        }

        .social-links a {
            margin: 0 0.5rem;
        }
    }
</style>
