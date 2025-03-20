<template>
    <div class="my-reservations">
        <h1>Minhas Reservas</h1>

        <!-- Se não estiver logado, redireciona para home -->
        <div v-if="!user">
            <p>Você precisa estar logado para visualizar suas reservas.</p>
            <button @click="goToHome">Ir para Home</button>
        </div>

        <!-- Se estiver carregando -->
        <div v-else-if="loading">
            <p>Carregando reservas...</p>
        </div>

        <!-- Se houver reservas -->
        <div v-else-if="reservations.length > 0">
            <div class="reservations-list">
                <div v-for="reservation in reservations" :key="reservation.id" class="reservation-card">
                    <h3>Quarto {{ reservation.room_number }} - {{ reservation.type }}</h3>
                    <p><strong>Check-in:</strong> {{ reservation.check_in }}</p>
                    <p><strong>Check-out:</strong> {{ reservation.check_out }}</p>
                    <p><strong>Status:</strong> {{ reservation.status }}</p>
                    <button class="cancel-btn" @click="cancelReservation(reservation.id)">Cancelar Reserva</button>
                </div>
            </div>
        </div>

        <!-- Se não houver reservas -->
        <div v-else>
            <p>Você ainda não tem reservas.</p>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';

    // Acesso à autenticação e router
    const authStore = useAuthStore();
    const router = useRouter();
    const user = computed(() => authStore.user);

    // Estado das reservas
    const reservations = ref([]);
    const loading = ref(true);

    /**
     * Obtém o token de autenticação armazenado localmente.
     */
    function getAccessToken() {
        const storedSession = localStorage.getItem('supabase_session');
        if (storedSession) {
            const parsedSession = JSON.parse(storedSession);
            return parsedSession.access_token || null;
        }
        return null;
    }

    /**
     * Busca as reservas do usuário autenticado.
     */
    async function fetchReservations() {
        if (!user.value) {
            loading.value = false;
            return;
        }

        loading.value = true;
        const accessToken = getAccessToken();
        const apiKey = import.meta.env.VITE_SUPABASE_KEY;

        if (!accessToken) {
            console.error("Erro de autenticação. Faça login novamente.");
            loading.value = false;
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/reservations?user_id=eq.${user.value.id}`, {
                method: 'GET',
                headers: {
                    'apikey': apiKey,
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar reservas: ${response.status} ${response.statusText}`);
            }

            reservations.value = await response.json();
        } catch (error) {
            console.error("Erro ao buscar reservas:", error);
        } finally {
            loading.value = false;
        }
    }

    /**
     * Cancela uma reserva do usuário autenticado.
     */
    async function cancelReservation(reservationId) {
        const accessToken = getAccessToken();
        const apiKey = import.meta.env.VITE_SUPABASE_KEY;

        if (!accessToken) {
            console.error("Erro de autenticação. Faça login novamente.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/reservations?id=eq.${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'apikey': apiKey,
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao cancelar reserva: ${response.status} ${response.statusText}`);
            }

            // Remove a reserva da lista
            reservations.value = reservations.value.filter(res => res.id !== reservationId);
        } catch (error) {
            console.error("Erro ao cancelar reserva:", error);
        }
    }

    /**
     * Redireciona para a página inicial caso o usuário não esteja logado.
     */
    function goToHome() {
        router.push('/');
    }

    onMounted(fetchReservations);
</script>

<style scoped>
    .my-reservations {
        max-width: 700px;
        margin: 2rem auto;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    h1 {
        font-size: 2rem;
        color: #333;
        margin-bottom: 1rem;
    }

    .reservations-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .reservation-card {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        text-align: left;
    }

        .reservation-card h3 {
            margin: 0;
            font-size: 1.2rem;
            color: #333;
        }

        .reservation-card p {
            margin: 5px 0;
            font-size: 1rem;
            color: #555;
        }

    .cancel-btn {
        background: #dc3545;
        color: white;
        font-size: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        transition: background 0.3s;
    }

        .cancel-btn:hover {
            background: #a71d2a;
        }
</style>
