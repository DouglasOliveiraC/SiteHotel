<template>
    <div class="room-detailed">
        <!-- Layout principal -->
        <div class="main-content">
            <div class="image-column">
                <img :src="mainImage"
                     alt="Imagem do Quarto"
                     class="main-image"
                     @click="enlargeImage(mainImage)" />
                <div class="thumbnails" v-if="roomImages.length">
                    <img v-for="(img, index) in roomImages"
                         :key="index"
                         :src="img"
                         alt="Miniatura do Quarto"
                         class="thumbnail"
                         @click="enlargeImage(img)" />
                </div>
            </div>
            <div class="info-column">
                <h1>Quarto {{ room.room_number }} - {{ room.type }}</h1>
                <p class="price">Preço: R$ {{ room.price.toFixed(2) }}</p>
                <p class="detailed-summary" v-html="detailedSummary"></p>
                <!-- Container para o botão do PayPal -->
                <div id="paypal-button-container"></div>

                <!-- Informações sandbox -->
                <div class="sandbox-info">
                    <p>Este é um ambiente de testes do PayPal. Para testar o pagamento, use as credenciais abaixo:</p>
                    <ul>
                        <li><strong>Email:</strong> sb-2yfc738082087@personal.example.com</li>
                        <li><strong>Senha:</strong> "k0J%mOQ </li>
                    </ul>
                    <p>Não há necessidade de cartões reais. Este é um ambiente de simulação.</p>
                </div>
            </div>
        </div>

        <!-- Modal para imagem ampliada -->
        <div v-if="showModal" class="modal" @click.self="closeModal">
            <img :src="modalImage" alt="Imagem Ampliada" class="modal-image" />
            <button class="close-modal" @click="closeModal">X</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/auth';

    // Acesso à store de autenticação para obter dados do usuário (incluindo CPF, se disponível)
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);

    // Obter o ID do quarto e as datas (check-in/check-out) via rota (ou query parameters)
    const route = useRoute();
    const router = useRouter();
    const roomId = route.params.id;
    // Supondo que as datas foram passadas como query: ?check_in=YYYY-MM-DD&check_out=YYYY-MM-DD
    const checkIn = ref(route.query.check_in || '');
    const checkOut = ref(route.query.check_out || '');

    // Estado para armazenar os dados do quarto (buscados do backend)
    const room = ref({
        id: '',
        room_number: '',
        type: '',
        price: 0,
        thumbnail: ''
    });

    // Função para buscar os detalhes do quarto
    async function fetchRoomDetails() {
        const apiKey = import.meta.env.VITE_SUPABASE_KEY;
        const storedSession = localStorage.getItem('supabase_session');
        const accessToken = storedSession ? JSON.parse(storedSession).access_token : null;
        if (!accessToken) {
            console.error('Erro de autenticação');
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rooms?id=eq.${roomId}`, {
                method: 'GET',
                headers: {
                    'apikey': apiKey,
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Erro ao buscar detalhes do quarto: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (data && data.length > 0) {
                room.value = data[0];
            }
        } catch (error: any) {
            console.error('[DEBUG] Erro ao buscar detalhes do quarto:', error);
        }
    }

    // Função para criar a reserva pendente no Supabase
    async function createPendingReservation(): Promise<string | null> {
        const apiKey = import.meta.env.VITE_SUPABASE_KEY;
        const storedSession = localStorage.getItem('supabase_session');
        const accessToken = storedSession ? JSON.parse(storedSession).access_token : null;
        if (!accessToken) {
            console.error('Erro de autenticação ao criar reserva pendente.');
            return null;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/reservations`, {
                method: 'POST',
                headers: {
                    'apikey': apiKey,
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'  // Essa linha garante que o registro inserido seja retornado
                },
                body: JSON.stringify({
                    user_id: user.value?.id,
                    check_in: checkIn.value,
                    check_out: checkOut.value,
                    room_id: room.value.id,
                    status: "pendente",
                    payment_status: "pendente"
                })
            });
            // Verifica se a resposta foi ok e faz o parse do JSON
            if (!response.ok) {
                console.error('Erro ao criar reserva pendente:', response.statusText);
                return null;
            }
            const data = await response.json();
            // Supõe-se que a resposta seja um array com o registro inserido
            return data[0]?.id || null;
        } catch (error) {
            console.error('[DEBUG] Erro ao criar reserva pendente:', error);
            return null;
        }
    }

    /**
     * Computa a imagem principal do quarto com base no tipo.
     */
    const mainImage = computed(() => {
        if (!room.value.type) return '/images/RoomImages/default.jpg';
        const type = room.value.type.toLowerCase();
        return `/images/RoomImages/${type}.jpg`;
    });

    /**
     * Define uma galeria fixa de miniaturas para navegação.
     */
    const roomImages = computed(() => [
        '/images/RoomImages/extra_1.jpg',
        '/images/RoomImages/extra_2.jpg',
        '/images/RoomImages/extra_3.jpg'
    ]);

    /**
     * Computa um resumo detalhado para o quarto.
     */
    const detailedSummary = computed(() => {
        if (!room.value.type) return '';
        const type = room.value.type.toLowerCase();
        if (type === 'premium')
            return `
        <strong>Experimente o máximo de luxo no Quarto Premium.</strong><br><br>
        Desfrute de uma banheira de hidromassagem privativa, sauna exclusiva e uma vista panorâmica estonteante.
        Cada detalhe, da cama king-size aos acabamentos sofisticados, foi projetado para uma experiência única.
        <br><br>
        Reserve agora e sinta a exclusividade e o conforto inigualável!
      `;
        if (type === 'luxo')
            return `
        <strong>Descubra a sofisticação do Quarto Luxo.</strong><br><br>
        Com uma cama king-size ultra confortável, minibar premium, e serviço de quarto 24h,
        este ambiente foi criado para proporcionar uma estadia relaxante e elegante.
        <br><br>
        Viva uma experiência de alto padrão e surpreenda-se com cada detalhe!
      `;
        if (type === 'standard')
            return `
        <strong>O Quarto Standard oferece conforto e funcionalidade.</strong><br><br>
        Equipado com cama queen-size, ambiente climatizado e serviços essenciais,
        ele é ideal para uma estadia prática e agradável.
        <br><br>
        Garanta sua reserva e desfrute de um ambiente acolhedor e eficiente!
      `;
        return '';
    });

    // Estados para controle da imagem principal e modal de ampliação
    const currentImage = ref('');
    const showModal = ref(false);
    const modalImage = ref('');
    function enlargeImage(img: string) {
        modalImage.value = img;
        showModal.value = true;
    }
    function closeModal() {
        showModal.value = false;
        modalImage.value = '';
    }

    // Função para carregar o SDK do PayPal dinamicamente
    function loadPayPalScript(clientId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (document.getElementById('paypal-sdk')) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.id = 'paypal-sdk';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=BRL`;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Falha ao carregar o script do PayPal'));
            document.head.appendChild(script);
        });
    }

    onMounted(async () => {
        await fetchRoomDetails();
        currentImage.value = mainImage.value;
        try {
            // Carrega o PayPal SDK utilizando o Client ID do .env
            await loadPayPalScript(import.meta.env.VITE_PAYPAL_CLIENT_ID);
            // Inicializa o botão do PayPal se o objeto estiver disponível
            if ((window as any).paypal) {
                (window as any).paypal.Buttons({
                    createOrder: async (data: any, actions: any) => {
                        // Cria a reserva pendente e obtém o reservation_id
                        const reservationId = await createPendingReservation();
                        if (!reservationId) {
                            alert("Erro ao criar a reserva pendente.");
                            throw new Error("Reserva pendente não criada.");
                        }

                        // Monta os dados personalizados para enviar ao PayPal
                        const customData = {
                            reservation_id: reservationId,
                            user_id: user.value?.id || "user-placeholder",
                            cpf: user.value?.cpf || "cpf-placeholder",
                            check_in: checkIn.value,
                            check_out: checkOut.value,
                            room_id: room.value.id,
                            room_number: room.value.room_number,
                            status: "pendente",
                            transaction_number: ""
                        };

                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: room.value.price.toFixed(2)
                                },
                                // Converte os dados personalizados em string e envia via custom_id 
                                custom_id: JSON.stringify(customData)
                            }]
                        });
                    },
                    onApprove: (data: any, actions: any) => {
                        return actions.order.capture().then((details: any) => {
                            alert('Pagamento realizado com sucesso, ' + details.payer.name.given_name + '!');
                            // A atualização final da reserva para "confirmada" será feita via webhook do PayPal.
                        });
                    },
                    onError: (err: any) => {
                        console.error('Erro no pagamento:', err);
                        alert('Ocorreu um erro no pagamento. Por favor, tente novamente.');
                    }
                }).render('#paypal-button-container');
            }
        } catch (error) {
            console.error('Erro ao carregar o PayPal SDK:', error);
        }
    });
</script>

<style scoped>
    /* (Estilos permanecem inalterados) */
    .sandbox-info {
        background: #fffae6;
        padding: 10px;
        border-left: 5px solid #ffcc00;
        margin-top: 15px;
        font-size: 14px;
    }

    .room-detailed {
        max-width: 100%;
        margin: 1rem auto;
        padding: 1rem;
        font-family: 'Poppins', sans-serif;
        color: #333;
    }

    .main-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .image-column {
        width: 100%;
        padding: 0.5rem;
        text-align: center;
    }

    .main-image {
        width: 100%;
        height: auto;
        max-height: 400px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 0.5rem;
    }

    .thumbnails {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .thumbnail {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        transition: transform 0.3s;
    }

        .thumbnail:hover {
            transform: scale(1.05);
        }

    .info-column {
        width: 100%;
        padding: 0.5rem;
        text-align: left;
    }

        .info-column h1 {
            margin-bottom: 1rem;
            font-size: 1.75rem;
        }

    .price {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .detailed-summary {
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
        line-height: 1.5;
    }

    .proceed-btn {
        background: #28a745;
        color: white;
        font-size: 1.2rem;
        padding: 0.75rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.3s;
        width: 100%;
    }

        .proceed-btn:hover {
            background: #218838;
        }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }

    .modal-image {
        max-width: 90%;
        max-height: 90%;
        border-radius: 8px;
    }

    .close-modal {
        position: absolute;
        top: 20px;
        right: 20px;
        background: #fff;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
        cursor: pointer;
    }

    @media (min-width: 768px) {
        .room-detailed {
            max-width: 1000px;
            margin: 2rem auto;
            padding: 2rem;
        }

        .main-content {
            flex-direction: row;
            gap: 2rem;
            align-items: center;
        }

        .image-column {
            flex: 2;
            padding: 1rem;
        }

        .info-column {
            flex: 1;
            padding: 1rem;
        }

            .info-column h1 {
                font-size: 2.5rem;
            }

        .price {
            font-size: 2rem;
        }

        .detailed-summary {
            font-size: 1.25rem;
        }

        .proceed-btn {
            font-size: 1.5rem;
            padding: 1rem;
        }
    }
</style>
