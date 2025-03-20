<template>
  <div class="my-reservations">
    <h1>Minhas Reservas</h1>
    <div v-if="loading" class="loading">
      Carregando reservas...
    </div>
    <div v-else>
      <div v-if="reservations.length === 0" class="no-reservations">
        <p>Você não possui reservas.</p>
      </div>
      <div class="reservations-grid">
          <div v-for="reservation in reservations"
               :key="reservation.id"
               class="reservation-card">
              <!-- Você pode ajustar quais campos exibir -->
              <p><strong>Reserva ID:</strong> {{ reservation.id }}</p>
              <p><strong>Quarto Número:</strong> {{ reservation.rooms?.room_number || 'Carregando...' }}</p>


              <p><strong>Check-in:</strong> {{  formatDate(reservation.check_in) }}</p>
              <p><strong>Check-out:</strong> {{  formatDate(reservation.check_out) }}</p>
              <p><strong>Status:</strong> {{ reservation.status }}</p>
              <p><strong>Pagamento:</strong> {{ reservation.payment_status }}</p>
              <p><strong>Criada em:</strong> {{ formatDate(reservation.created_at) }}</p>

              <!-- Botão para cancelar a reserva, se ainda não cancelada -->
              <button v-if="reservation.status !== 'cancelada'"
                      class="cancel-btn"
                      @click="cancelReservation(reservation.id)">
                  Cancelar Reserva
              </button>
              <p v-else class="cancelled">Reserva Cancelada</p>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;

const reservations = ref([]);
const loading = ref(true);

// Função para formatar datas
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

// Função para obter as reservas do usuário via fetch (usando a REST API do Supabase)
async function fetchReservations() {
  if (!user || !user.id) {
    alert("Você precisa estar logado para visualizar suas reservas.");
    router.push('/');
    return;
  }
  const apiKey = import.meta.env.VITE_SUPABASE_KEY;
  const storedSession = localStorage.getItem('supabase_session');
  const accessToken = storedSession ? JSON.parse(storedSession).access_token : null;
  if (!accessToken) {
    alert("Token de autenticação ausente. Faça login novamente.");
    router.push('/login');
    return;
  }
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/reservations?user_id=eq.${user.id}`, {
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
    const data = await response.json();
    reservations.value = data;
  } catch (error: any) {
    console.error("Erro ao buscar reservas:", error);
    alert(`Erro: ${error.message}`);
  } finally {
    loading.value = false;
  }
}


// Função para cancelar uma reserva via fetch DELETE
async function cancelReservation(reservationId: string) {
  if (!confirm("Tem certeza que deseja cancelar essa reserva?")) {
    return;
  }
  const apiKey = import.meta.env.VITE_SUPABASE_KEY;
  const storedSession = localStorage.getItem('supabase_session');
  const accessToken = storedSession ? JSON.parse(storedSession).access_token : null;
  if (!accessToken) {
    alert("Token de autenticação ausente. Faça login novamente.");
    router.push('/login');
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
    // Atualiza a lista local: marque a reserva como cancelada
    reservations.value = reservations.value.map((r: any) => {
      if (r.id === reservationId) {
        r.status = 'cancelada';
      }
      return r;
    });
    alert("Reserva cancelada com sucesso.");
  } catch (error: any) {
    console.error("Erro ao cancelar reserva:", error);
    alert(`Erro ao cancelar reserva: ${error.message}`);
  }
}

onMounted(() => {
  if (!user || !user.id) {
    alert("Você precisa estar logado para visualizar suas reservas.");
    router.push('/');
    return;
  }
  fetchReservations();
});
</script>

<style scoped>
.my-reservations {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Poppins', sans-serif;
  color: #333;
}
h1 {
  text-align: center;
  margin-bottom: 2rem;
}
.loading {
  text-align: center;
  font-size: 1.2rem;
}
.no-reservations {
  text-align: center;
  font-size: 1.1rem;
  margin-top: 2rem;
}
.reservations-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.reservation-card {
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.reservation-card p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
}
.cancel-btn {
  background: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  width: 100%;
  margin-top: 0.5rem;
}
.cancel-btn:hover {
  background: #c82333;
}
.cancelled {
  color: #dc3545;
  font-weight: bold;
  text-align: center;
  margin-top: 0.5rem;
}
</style>
