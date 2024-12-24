<!-- src/components/FooterCommmon.vue -->
<script>
    export default {
        name: 'FooterCommon',
    };
</script>

<template>
    <footer>
        <div class="footer-content">
            <p>&copy; 2024 HotelSite. Todos os direitos reservados.</p>
            <ul class="footer-menu">
                <li><router-link to="/terms-of-use">Termos de Uso</router-link></li>
                <li><router-link to="/privacy">Política de Privacidade</router-link></li>
                <li><router-link to="/contact">Contato</router-link></li>
            </ul>
        </div>
    </footer>
</template>


<style scoped>
    footer {
        background-color: #222;
        color: #ccc;
        padding: 1.5rem;
        text-align: center;
    }

    .footer-content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .footer-menu {
        display: flex;
        gap: 1.5rem;
        list-style: none;
        margin-top: 1rem;
    }

        .footer-menu a {
            color: #ccc;
            text-decoration: none;
        }

            .footer-menu a:hover {
                text-decoration: underline;
            }
</style>
