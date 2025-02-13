<!-- App.vue -->
<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import HeaderVisitor from '@/components/HeaderVisitor.vue';
    import HeaderLoggedIn from '@/components/HeaderLoggedIn.vue';
    import LoginPopup from '@/components/LoginPopup.vue';

    const authStore = useAuthStore();
    const appLoading = ref(true);
    const showLoginPopup = ref(false);

    const isLoggedIn = computed(() => !!authStore.user);

    onMounted(async () => {
        console.log('[DEBUG] App.vue: onMounted');
        try {
            await authStore.initAuth();
        } catch (error) {
            console.error('Erro ao inicializar a aplicação:', error);
        } finally {
            appLoading.value = false;
        }
    });
</script>

<template>
    <div class="app-container">
        <!-- Se não estiver logado, exibe o HeaderVisitor e escuta o evento -->
        <HeaderVisitor v-if="!isLoggedIn" @openLoginPopup="showLoginPopup = true" />
        <!-- Se estiver logado, exibe o HeaderLoggedIn -->
        <HeaderLoggedIn v-else />

        <main>
            <div v-if="appLoading" class="loading-screen">
                <p>Carregando aplicação...</p>
            </div>
            <div v-else>
                <router-view @openLoginPopup="showLoginPopup = true" />
                <!-- O componente LoginPopup é controlado pela variável showLoginPopup -->
                <LoginPopup :show="showLoginPopup" @close="showLoginPopup = false" />
            </div>
        </main>
    </div>
</template>

<style scoped>
    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
    }

    .loading-screen {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 70vh;
        font-weight: bold;
        font-size: 1.2rem;
        color: #555;
        background-color: #fafafa;
    }
</style>
