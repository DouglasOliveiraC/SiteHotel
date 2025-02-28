<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';
    import RoomCard from '@/components/RoomCard.vue';

    // Acesso à store de autenticação e ao roteador
    const authStore = useAuthStore();
    const router = useRouter();
    const user = computed(() => authStore.user);

    // Estados do formulário de reserva e disponibilidade
    const checkIn = ref(null);
    const checkOut = ref(null);
    const availableRooms = ref([]);
    const loadingRooms = ref(false);
    const message = ref<{ type: 'success' | 'error'; text: string } | null>(null);

    // Estados para paginação
    const currentPage = ref(1);
    const pageSize = ref(10); // Opção para 10 ou 20, conforme escolha do usuário

    /**
     * Computa a data atual no formato ISO (yyyy-mm-dd) para atribuir ao atributo :min dos inputs.
     */
    const today = computed(() => {
        return new Date().toISOString().split('T')[0];
    });

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
     * Busca os quartos disponíveis para o período solicitado.
     * Utiliza o método fetch para chamar a função RPC "get_available_rooms" via REST.
     */
    async function fetchAvailableRooms() {
        if (!checkIn.value || !checkOut.value) {
            message.value = { type: 'error', text: 'Selecione datas válidas para pesquisar.' };
            return;
        }

        // Impede que datas anteriores à data atual sejam selecionadas
        if (checkIn.value < today.value || checkOut.value < today.value) {
            message.value = { type: 'error', text: 'Não é possível selecionar datas passadas.' };
            return;
        }

        loadingRooms.value = true;
        const accessToken = getAccessToken();
        const apiKey = import.meta.env.VITE_SUPABASE_KEY;

        if (!accessToken) {
            message.value = { type: 'error', text: 'Erro de autenticação. Faça login novamente.' };
            loadingRooms.value = false;
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/reservations`, {
                method: 'POST',
                headers: {
                    'apikey': apiKey,
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _check_in: checkIn.value,
                    _check_out: checkOut.value
                })
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar quartos: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[DEBUG] Quartos disponíveis:', data);
            availableRooms.value = data || [];

            // Reinicia a página atual após nova busca
            currentPage.value = 1;

            if (availableRooms.value.length === 0) {
                message.value = { type: 'error', text: 'Nenhum quarto disponível para as datas selecionadas.' };
            } else {
                message.value = { type: 'success', text: 'Quartos disponíveis encontrados!' };
            }
        } catch (error: any) {
            console.error('[DEBUG] Erro ao buscar disponibilidade:', error);
            message.value = { type: 'error', text: error.message || 'Erro ao carregar disponibilidade. Tente novamente.' };
        } finally {
            loadingRooms.value = false;
        }
    }

    /**
     * Computa os quartos disponíveis ordenados por preço (dos mais caros para os mais baratos).
     */
    const sortedRooms = computed(() => {
        return availableRooms.value.slice().sort((a, b) => b.price - a.price);
    });

    /**
     * Computa os quartos que serão exibidos na página atual.
     */
    const paginatedRooms = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        return sortedRooms.value.slice(start, start + pageSize.value);
    });

    /**
     * Calcula o número total de páginas para a navegação.
     */
    const totalPages = computed(() => {
        return Math.ceil(sortedRooms.value.length / pageSize.value);
    });

    /**
     * Redireciona o usuário para visualizar suas reservas antigas.
     */
    function goToMyReservations() {
        router.push('/my-reservations');
    }

    /**
     * Define a página atual conforme a seleção do usuário.
     */
    function selectPage(page: number) {
        currentPage.value = page;
    }

    /**
     * Executa a inicialização da página.
     */
    onMounted(() => {
        console.log('[DEBUG] Página de reservas carregada.');
    });
</script>

<template>
    <div class="reservations-container">
        <!-- Barra fixa com botão "Minhas Reservas" centralizado -->
        <div class="reservations-header">
            <button class="my-reservations-btn" @click="goToMyReservations">
                <i class="fa fa-calendar"></i> Minhas Reservas
            </button>
        </div>

        <h1>Reservas</h1>

        <!-- Mensagem de feedback -->
        <p v-if="message" :class="['message', message.type]">
            {{ message.text }}
        </p>

        <!-- Seção para nova reserva -->
        <div class="booking-section">
            <h2>Faça uma Nova Reserva</h2>
            <!-- Área de seleção das datas -->
            <div class="date-picker">
                <div class="date-field">
                    <label for="check-in">Check-in:</label>
                    <input type="date"
                           id="check-in"
                           v-model="checkIn"
                           :min="today"
                           lang="pt-BR"
                           required />
                </div>
                <div class="date-field">
                    <label for="check-out">Check-out:</label>
                    <input type="date"
                           id="check-out"
                           v-model="checkOut"
                           :min="checkIn || today"
                           lang="pt-BR"
                           required />
                </div>
            </div>
            <!-- Seletor para quantidade de quartos por página -->
            <div class="page-size-selector">
                <label for="page-size">Exibir por página:</label>
                <select id="page-size" v-model.number="pageSize">
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                </select>
            </div>
            <!-- Botão para buscar quartos -->
            <button @click="fetchAvailableRooms" class="search-btn">
                Buscar Quartos
            </button>
        </div>

        <!-- Carregamento -->
        <div v-if="loadingRooms" class="loading">
            <p>Carregando disponibilidade...</p>
        </div>

        <!-- Exibição dos cards dos quartos disponíveis com paginação -->
        <div v-if="paginatedRooms.length > 0" class="available-rooms">
            <h3>Quartos Disponíveis</h3>
            <div class="rooms-grid">
                <!-- Cada card é exibido em modo "large" e é um link para a página de detalhes -->
                <RoomCard v-for="room in paginatedRooms"
                          :key="room.id"
                          :room="room"
                          :large="true" />
            </div>
            <!-- Navegação de páginas -->
            <div class="pagination">
                <span v-for="page in totalPages" :key="page" class="page-number"
                      :class="{ active: currentPage === page }"
                      @click="selectPage(page)">
                    {{ page }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    /* Container principal */
    .reservations-container {
        max-width: 700px;
        margin: 2rem auto;
        padding: 2rem;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
        font-family: 'Poppins', sans-serif;
        position: relative;
    }

    /* Barra fixa para o botão "Minhas Reservas" centralizado */
    .reservations-header {
        width: 100%;
        background: #f0f0f0;
        padding: 1rem;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
    }

    /* Botão "Minhas Reservas" */
    .my-reservations-btn {
        background: #14783c;
        color: white;
        font-size: 1.2rem;
        font-weight: bold;
        padding: 0.75rem 1.5rem;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        transition: background 0.3s;
    }

        .my-reservations-btn:hover {
            background: #0f5d2e;
        }

    /* Título principal */
    .reservations-container h1 {
        font-size: 2.5rem;
        color: #333;
        margin-top: 2rem;
        margin-bottom: 1.5rem;
    }

    /* Mensagens de feedback */
    .message {
        padding: 0.75rem;
        border-radius: 8px;
        margin: 1rem auto;
        font-weight: bold;
    }

        .message.success {
            background: #d4edda;
            color: #155724;
        }

        .message.error {
            background: #f8d7da;
            color: #721c24;
        }

    /* Seção de nova reserva */
    .booking-section {
        margin: 2rem 0;
        padding: 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #fafafa;
    }

        .booking-section h2 {
            margin-bottom: 1rem;
            color: #333;
        }

    /* Área de seleção de datas */
    .date-picker {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .date-field {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }

        .date-field label {
            font-weight: 600;
            margin-bottom: 0.3rem;
        }

        .date-field input {
            padding: 0.5rem;
            border-radius: 5px;
            border: 1px solid #ccc;
            width: 100%;
        }

    /* Seção para seleção do pageSize */
    .page-size-selector {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

        .page-size-selector label {
            font-weight: 600;
        }

    /* Botão de busca de quartos */
    .search-btn {
        background: #007bff;
        color: white;
        font-size: 1rem;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background 0.3s;
    }

        .search-btn:hover {
            background: #0056b3;
        }

    /* Mensagem de carregamento */
    .loading p {
        font-size: 1.1rem;
        color: #555;
        margin-top: 1rem;
    }

    /* Exibição dos cards de quartos disponíveis em formato "large" */
    .available-rooms {
        margin-top: 2rem;
        text-align: left;
    }

        .available-rooms h3 {
            margin-bottom: 1rem;
            color: #333;
        }

    /* Grid para os cards em modo "large" */
    .rooms-grid {
        display: grid;
        gap: 1rem;
    }

    /* Em telas maiores, usamos uma coluna única para destacar o card */
    @media (min-width: 768px) {
        .rooms-grid {
            grid-template-columns: repeat(1, 1fr);
        }
    }

    /* Navegação de paginação */
    .pagination {
        margin-top: 1rem;
        text-align: center;
    }

    .page-number {
        display: inline-block;
        margin: 0 0.25rem;
        padding: 0.5rem 0.75rem;
        background: #f0f0f0;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;
    }

        .page-number.active {
            background: #007bff;
            color: white;
        }
</style>
