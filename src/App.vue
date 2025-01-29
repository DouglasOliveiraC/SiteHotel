<script setup lang="ts">
    /**
     * App.vue
     *
     * Componente raiz que gerencia:
     * - Exibição de cabeçalho (visitante vs. logado),
     * - Controle do popup de login,
     * - Rotas (router-view).
     */

    import { ref, onMounted, computed } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import HeaderVisitor from '@/components/HeaderVisitor.vue';
    import HeaderLoggedIn from '@/components/HeaderLoggedIn.vue';
    import LoginPopup from '@/components/LoginPopup.vue';
    import { supabase } from '@/utils/supabase-client'
    
    /**
     * Exibe ou oculta o popup de login/registro.
     */
    const showLoginPopup = ref(false);

    /**
     * Store de autenticação, gerenciada por Pinia.
     */
    const authStore = useAuthStore();

    /**
     * Boa prática: usar 'computed' para derivar se está logado.
     * Assim, qualquer mudança em 'auth.user' é reativa e reflete imediatamente no template.
     */
    const isLoggedIn = computed(() => !!authStore.user);

    /**
     * onMounted:
     *  - Dispara a busca inicial do usuário na store (ex.: validação de token, etc.).
     *  - Garante que 'auth.user' será definido (ou null) ao carregar a aplicação.
     */
    onMounted(async () => {
        await authStore.initAuth();
    });
</script>

<template>
    <div>
        <!-- Header muda dinamicamente conforme 'isLoggedIn' -->
        <HeaderVisitor v-if="!authStore.isLoggedIn" @openLoginPopup="showLoginPopup = true" />
        <HeaderLoggedIn v-else />


        <!-- Conteúdo principal (rotas) -->
        <router-view @openLoginPopup="showLoginPopup = true" />

        <!-- Popup de Login/Registro -->
        <LoginPopup :show="showLoginPopup"
                    @close="showLoginPopup = false" />
    </div>
</template>

<style scoped>
    /* Estilos globais podem ser definidos aqui ou em arquivos separados */
</style>
