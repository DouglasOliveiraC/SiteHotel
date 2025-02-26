<script>
    // -----------------------------------------------------------------------------
    // Componente: FooterCommon
    // Descrição: Exibe o rodapé do site com links para páginas essenciais como
    //            Termos de Uso, Política de Privacidade e Contato.
    // -----------------------------------------------------------------------------
    export default {
        name: 'FooterCommon',
    };
</script>

<template>
    <footer class="footer-container">
        <div class="footer-content">
            <p>&copy; 2024 HotelSite. Todos os direitos reservados.</p>
            <!-- Menu de navegação do rodapé -->
            <ul class="footer-menu">
                <li><router-link to="/terms-of-use">Termos de Uso</router-link></li>
                <li><router-link to="/privacy">Política de Privacidade</router-link></li>
                <li><router-link to="/contact">Contato</router-link></li>
            </ul>
        </div>
    </footer>
</template>

<style scoped>
        /* Importação da fonte 'Poppins' para manter a consistência tipográfica */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        /* -----------------------------------------------------------------------------
       Estilização do Rodapé
    ----------------------------------------------------------------------------- */
        .footer-container {
            background: rgba(0, 128, 96, 0.8); /* Verde translúcido conforme a paleta do cabeçalho */
            color: white;
            padding: 2rem;
            text-align: center;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); /* Sombra sutil para um efeito elevado */
        }

        /* Layout do conteúdo interno do rodapé */
        .footer-content {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Menu de navegação no rodapé */
        .footer-menu {
            display: flex;
            gap: 2rem;
            list-style: none;
            margin-top: 1rem;
            font-weight: 400;
        }

            /* Estilização dos links do menu do rodapé */
            .footer-menu a {
                color: white;
                text-decoration: none;
                transition: color 0.3s ease;
            }

                .footer-menu a:hover {
                    color: #cce3de; /* Verde mais claro ao passar o mouse */
                    text-decoration: underline;
                }

        /* -----------------------------------------------------------------------------
       Responsividade: Ajusta o layout do rodapé em dispositivos menores
    ----------------------------------------------------------------------------- */
        @media (max-width: 768px) {
            .footer-menu {
                flex-direction: column;
                gap: 1rem;
            }
        }
</style>
