<script>
    // -----------------------------------------------------------------------------
    // Componente: HeaderVisitor
    // Descrição: Exibe o cabeçalho para usuários visitantes (não autenticados).
    //            Emite o evento 'openLoginPopup' para acionar a abertura do modal de login.
    // -----------------------------------------------------------------------------
    export default {
        name: 'HeaderVisitor',
        // Emite um evento para abrir o popup de login quando o usuário clicar no botão "Entrar"
        emits: ['openLoginPopup'],
    };
</script>

<template>
    <header class="header-visitor">
        <nav class="nav-container">
            <!-- Menu de navegação principal -->
            <ul class="menu">
                <li><router-link to="/">Início</router-link></li>
                <li><router-link to="/about">Sobre</router-link></li>
            </ul>
            <!-- Botão de login: ao clicar, dispara o evento 'openLoginPopup' -->
            <button class="login-btn" @click="$emit('openLoginPopup')">
                Entrar
            </button>
        </nav>
    </header>
</template>

<style scoped>
    /* Importação da fonte 'Poppins' para consistência tipográfica */
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    /* -----------------------------------------------------------------------------
       Estilização do Cabeçalho para Visitantes
    ----------------------------------------------------------------------------- */
    .header-visitor {
        position: sticky; /* Alterado de fixed para sticky para evitar sobreposição */
        top: 0;
        left: 0;
        width: 100%;
        background: rgba(0, 128, 96, 0.8); /* Verde translúcido, mesmo da paleta principal */
        backdrop-filter: blur(10px); /* Efeito de desfoque moderno */
        padding: 1rem 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Sombra sutil para profundidade */
    }

    /* Container para os elementos de navegação */
    .nav-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 1200px;
    }

    /* Lista de itens do menu */
    .menu {
        display: flex;
        list-style: none;
        gap: 2rem;
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
    }

        /* Estilização dos links do menu */
        .menu a {
            color: white;
            text-decoration: none;
            font-size: 1rem;
            transition: color 0.3s;
        }

            .menu a:hover {
                color: #cce3de; /* Tom de verde mais claro ao passar o mouse */
            }

    /* Botão de login com efeito outline */
    .login-btn {
        background: transparent;
        border: 2px solid white;
        color: white;
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        font-weight: 600;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s ease, color 0.3s ease;
        font-family: 'Poppins', sans-serif;
    }

        .login-btn:hover {
            background: white;
            color: rgba(0, 128, 96, 0.8);
        }

    /* -----------------------------------------------------------------------------
       Responsividade: Ajusta o layout em telas menores
    ----------------------------------------------------------------------------- */
    @media (max-width: 768px) {
        .nav-container {
            flex-direction: column;
            gap: 1rem;
        }

        .menu {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
        }
    }
</style>
