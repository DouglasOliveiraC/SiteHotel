<template>
    <div class="reservation-popup" v-if="visible">
        <div class="popup-overlay" @click.self="closePopup"></div>
        <div class="popup-content">
            <h2>Confirme sua Reserva</h2>
            <!-- Exibir informações da reserva -->
            <div class="reservation-info">
                <p><strong>Quarto:</strong> {{ room.room_number }} - {{ room.type }}</p>
                <p><strong>Data de Check-in:</strong> {{ checkIn }}</p>
                <p><strong>Data de Check-out:</strong> {{ checkOut }}</p>
            </div>
            <!-- Container para o botão do PayPal -->
            <div id="paypal-button-container"></div>
            <!-- Botão para fechar o popup -->
            <button class="close-btn" @click="closePopup">Cancelar</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, watch } from 'vue';
    import { useRouter } from 'vue-router';

    /**
     * ReservationPopup.vue
     * Descrição: Modal para confirmação de reserva. Exibe dados da reserva e integra o botão
     * do PayPal para concluir o pagamento. Após a aprovação, dispara uma função para registrar
     * a reserva no banco de dados.
     *
     * Props:
     *  - visible: Boolean que controla a exibição do popup.
     *  - room: Objeto com dados do quarto.
     *  - checkIn: Data de check-in.
     *  - checkOut: Data de check-out.
     */
    const props = defineProps({
        visible: {
            type: Boolean,
            required: true
        },
        room: {
            type: Object,
            required: true
        },
        checkIn: {
            type: String,
            required: true
        },
        checkOut: {
            type: String,
            required: true
        }
    });
    const emit = defineEmits(['close', 'payment-success']);
    const router = useRouter();

    /**
     * Função que inicializa os botões do PayPal.
     * Utilize o SDK do PayPal, que já deve estar incluído no index.html.
     */
    function initPayPalButton() {
        // Certifique-se de que "paypal" está disponível globalmente
        // e use o client ID do ambiente configurado.
        paypal.Buttons({
            // Cria o pedido com os detalhes da reserva
            createOrder(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        description: `Reserva do Quarto ${props.room.room_number}`,
                        amount: {
                            currency_code: "BRL",
                            value: props.room.price // Valor pode ser calculado conforme a estadia
                        }
                    }]
                });
            },
            // Callback para quando o pagamento for aprovado
            onApprove(data, actions) {
                return actions.order.capture().then(function (details) {
                    // Aqui você pode chamar sua API para registrar a reserva no banco de dados
                    console.log('Pagamento aprovado:', details);
                    emit('payment-success', details);
                    // Opcional: redirecionar para uma página de confirmação
                    router.push({ name: 'ReservationConfirmation', params: { roomId: props.room.id } });
                });
            },
            onError(err) {
                console.error('Erro no PayPal:', err);
            }
        }).render('#paypal-button-container');
    }

    // Inicializa o botão do PayPal quando o popup for exibido
    watch(() => props.visible, (newVal) => {
        if (newVal) {
            // Delay para garantir que o container está renderizado
            setTimeout(() => {
                initPayPalButton();
            }, 100);
        }
    });

    function closePopup() {
        emit('close');
    }
</script>

<style scoped>
    .reservation-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 3000;
    }

    .popup-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
    }

    .popup-content {
        position: relative;
        max-width: 500px;
        margin: 5% auto;
        background: #fff;
        padding: 2rem;
        border-radius: 8px;
        z-index: 3100;
        text-align: center;
    }

    .reservation-info p {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }

    .close-btn {
        margin-top: 1.5rem;
        background: #d9534f;
        color: #fff;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
    }

        .close-btn:hover {
            background: #c9302c;
        }
</style>
