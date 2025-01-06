<script>
    import { ref, onMounted } from 'vue';
    import { supabase } from '@/utils/supabase-client';
    import { useAuthStore } from '@/stores/auth';

    export default {
        name: 'HeaderLoggedIn',

        setup() {
            const authStore = useAuthStore();
            const userName = ref('');

            // Atualizar estado ao montar
            onMounted(async () => {
                await authStore.fetchUser(); // Atualiza o estado do usuário na store
                userName.value = authStore.user?.email || 'Usuário Anônimo'; // Substitua 'email' por outro campo do perfil, se necessário
            });

            const logout = async () => {
                await authStore.logout();
            };

            return { userName, logout };
        },
    };
</script>

<template>
    <header>
        <nav>
            <ul class="menu">
                <li>Bem-vindo, {{ userName }}!</li>
                <li><router-link to="/">Início</router-link></li>
                <li><router-link to="/reservations">Reservas</router-link></li>
                <li><router-link to="/profile">Perfil</router-link></li>
                <li><button @click="logout">Sair</button></li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
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

    a, button {
        color: white;
        text-decoration: none;
        background: none;
        border: none;
        font-weight: bold;
        cursor: pointer;
    }

        a:hover, button:hover {
            text-decoration: underline;
        }
</style>
