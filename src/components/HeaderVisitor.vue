<!--
  HeaderVisitor.vue

  Componente responsável por exibir o cabeçalho para visitantes não autenticados.
  Possui links de navegação básicos e um botão "Entrar", que emite um evento para abrir o popup de login.
-->
<script>
    export default {
        name: 'HeaderVisitor',

        /**
         * Eventos emitidos por este componente.
         * - openLoginPopup: Indica que o usuário clicou no botão "Entrar"
         *   e deseja exibir o popup de autenticação.
         */
        emits: ['openLoginPopup'],
    };
</script>

<template>
    <header>
        <nav>
            <ul class="menu">
                <!-- Link para página inicial -->
                <li><router-link to="/">Início</router-link></li>
                <!-- Link para página "Sobre" -->
                <li><router-link to="/about">Sobre</router-link></li>

                <!-- Botão que aciona o evento para exibir o modal de login -->
                <li>
                    <button @click="$emit('openLoginPopup')">
                        Entrar
                    </button>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
    /* Estilos do cabeçalho para visitantes */

    header {
        background-color: #333;
        color: white;
        padding: 1rem;
    }

    .menu {
        display: flex;
        list-style: none;
        gap: 2rem;
    }

    a {
        color: white;
        text-decoration: none;
        font-weight: bold;
    }

        a:hover {
            text-decoration: underline;
        }
</style>
