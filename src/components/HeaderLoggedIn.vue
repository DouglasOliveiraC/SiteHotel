<!--
  HeaderLoggedIn.vue

  Componente responsável por exibir o cabeçalho para usuários autenticados.
  Mostra o nome (ou email) do usuário, links específicos (Reservas, Perfil) e
  um botão de logout para encerrar a sessão.
-->
<script setup>
    import { computed } from 'vue';
    import { useAuthStore } from '@/stores/auth.ts';

    const authStore = useAuthStore();

    /**
     * userName: Computed reativo que lê direto do estado global (authStore.user).
     */
    const userName = computed(() => {
        return authStore.user?.email ?? 'Usuário Anônimo';
    });

    /**
     * Função de logout
     */
    const logout = async () => {
        await authStore.logout();
    };
</script>

<template>
    <header>
        <nav>
            <ul class="menu">
                <!-- Exibe uma saudação com o nome (ou email) do usuário -->
                <li>Bem-vindo, {{ userName }}!</li>

                <!-- Links de navegação para usuários logados -->
                <li><router-link to="/">Início</router-link></li>
                <li><router-link to="/reservations">Reservas</router-link></li>
                <li><router-link to="/profile">Perfil</router-link></li>

                <!-- Botão para encerrar sessão e retornar ao estado de visitante -->
                <li>
                    <button @click="logout">
                        Sair
                    </button>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
    /* Estilos do cabeçalho para usuários autenticados */

    header {
        background-color: #222;
        color: white;
        padding: 1rem;
    }

    .menu {
        display: flex;
        list-style: none;
        gap: 2rem;
    }

    /* Links e botões compartilhados */
    a,
    button {
        color: white;
        text-decoration: none;
        background: none;
        border: none;
        font-weight: bold;
        cursor: pointer;
    }

        a:hover,
        button:hover {
            text-decoration: underline;
        }
</style>
