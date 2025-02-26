<script setup lang="ts">
    import { computed } from 'vue';
    import { useAuthStore } from '@/stores/auth';

    /**
     * HeaderLoggedIn.vue
     * Descrição: Exibe o cabeçalho para usuários autenticados, mostrando uma mensagem
     * de boas-vindas e links de navegação (Início, Reservas, Perfil), além do botão de logout.
     */
    const authStore = useAuthStore();

    // Computa o nome do usuário a partir do estado global (authStore.user)
    const userName = computed(() => {
        return authStore.user?.email ?? 'Usuário Anônimo';
    });

    // Função de logout
    const logout = async () => {
        await authStore.logout();
    };
</script>

<template>
    <header>
        <nav>
            <ul class="menu">
                <li class="welcome-text">Bem-vindo, {{ userName }}!</li>
                <li><router-link to="/">Início</router-link></li>
                <li><router-link to="/reservations">Reservas</router-link></li>
                <li><router-link to="/profile">Perfil</router-link></li>
                <li>
                    <button @click="logout" class="logout-btn">Sair</button>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    /* -----------------------------------------------------------------------------
       Estilização do Cabeçalho para Usuários Autenticados
    ----------------------------------------------------------------------------- */
    header {
        background: rgba(0, 128, 96, 0.8);
        backdrop-filter: blur(10px);
        padding: 1rem 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }

    /* Estilização da navegação */
    .menu {
        display: flex;
        list-style: none;
        gap: 2rem;
        align-items: center;
        font-family: 'Poppins', sans-serif;
        font-weight: 400;
    }

    /* Texto de boas-vindas */
    .welcome-text {
        font-weight: 600;
        color: #fff;
        font-size: 1.1rem;
    }

    /* Links de navegação */
    a {
        color: #fff;
        text-decoration: none;
        font-size: 1rem;
        transition: color 0.3s;
    }

        a:hover {
            color: #cce3de;
        }

    /* Botão de logout */
    .logout-btn {
        background: #d9534f;
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
        font-weight: 600;
    }

        .logout-btn:hover {
            background: #c9302c;
        }

    /* Responsividade: disposição vertical para telas menores */
    @media (max-width: 768px) {
        .menu {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
    }
</style>
