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

    /**
     * RoomDetailed.vue
     *
     * Exibe os detalhes do quarto selecionado. O componente busca os dados reais do quarto (via fetch)
     * e, com base no tipo, define a imagem principal e carrega uma galeria fixa de miniaturas.
     * O resumo detalhado é renderizado com HTML para uma formatação rica, e o layout é mobile-first,
     * adaptando-se para duas colunas em telas maiores, com a coluna de imagem centralizada verticalmente.
     */

    // Obter o ID do quarto a partir da rota
    const route = useRoute();
    const router = useRouter();
    const roomId = route.params.id;

    // Estado para armazenar os dados do quarto (buscados do backend)
    const room = ref({
        id: '',
        room_number: '',
        type: '',
        price: 0,
        thumbnail: ''
    });

    /**
     * Busca os detalhes reais do quarto usando fetch.
     * O endpoint retorna um array com o quarto cujo id coincide com roomId.
     */
    async function fetchRoomDetails() {
        const apiKey = import.meta.env.VITE_SUPABASE_KEY;
        const storedSession = localStorage.getItem('supabase_session');
        const accessToken = storedSession ? JSON.parse(storedSession).access_token : null;
        if (!accessToken) {
            console.error('Erro de autenticação');
            return;
        }
        try {
            const response = await fetch(`https://itzogmezyvdtuhnitibj.supabase.co/rest/v1/rooms?id=eq.${roomId}`, {
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

    /**
     * Computa a imagem principal do quarto com base no tipo.
     * As imagens devem estar na pasta "/images/RoomImages/" e nomeadas como "premium.jpg", "luxo.jpg", "standard.jpg", etc.
     */
    const mainImage = computed(() => {
        if (!room.value.type) return '/images/RoomImages/default.jpg';
        const type = room.value.type.toLowerCase();
        return `/images/RoomImages/${type}.jpg`;
    });

    /**
     * Define uma galeria fixa de miniaturas para navegação, que permanece a mesma para todos os quartos.
     */
    const roomImages = computed(() => [
        '/images/RoomImages/extra_1.jpg',
        '/images/RoomImages/extra_2.jpg',
        '/images/RoomImages/extra_3.jpg'
    ]);

    /**
     * Computa um resumo detalhado e envolvente para o quarto, utilizando HTML para formatação.
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
                    createOrder: (data: any, actions: any) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    // Certifique-se de que o valor esteja no formato correto (string com 2 casas decimais)
                                    value: room.value.price.toFixed(2)
                                }
                            }]
                        });
                    },
                    onApprove: (data: any, actions: any) => {
                        return actions.order.capture().then((details: any) => {
                            alert('Pagamento realizado com sucesso, ' + details.payer.name.given_name + '!');
                            // redirecionar para uma página de confirmação ou atualizar o estado da reserva
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
    /* Informaçoes sandbox */
    .sandbox-info {
        background: #fffae6;
        padding: 10px;
        border-left: 5px solid #ffcc00;
        margin-top: 15px;
        font-size: 14px;
    }

    /* Estilo base Mobile-First */
    .room-detailed {
        max-width: 100%;
        margin: 1rem auto;
        padding: 1rem;
        font-family: 'Poppins', sans-serif;
        color: #333;
    }

    /* Layout principal: coluna única para mobile */
    .main-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    /* Coluna da imagem (inclui a galeria abaixo) */
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

    /* Galeria de miniaturas: fica logo abaixo da imagem principal */
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

    /* Coluna de informações */
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

    /* Botão para prosseguir com a reserva */
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

    /* Modal para imagem ampliada */
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

    /* Layout para telas maiores (Desktop) */
    @media (min-width: 768px) {
        .room-detailed {
            max-width: 1000px;
            margin: 2rem auto;
            padding: 2rem;
        }

        .main-content {
            flex-direction: row;
            gap: 2rem;
            align-items: center; /* Alinha verticalmente os itens para centralizar a coluna de imagem se necessário */
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
