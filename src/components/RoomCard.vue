<template>
    <!-- O card é um link para a página de detalhes do quarto -->
    <router-link :to="`/room/${room.id}`" class="room-card" :class="{ large: large }">
        <!-- Thumbnail do quarto -->
        <img :src="imageSrc" alt="Imagem do Quarto" class="room-thumbnail" />
        <!-- Detalhes do quarto -->
        <div class="room-details">
            <h4 class="room-type">{{ room.type }}</h4>
            <p class="room-number">Quarto {{ room.room_number }}</p>
            <p class="room-price">R$ {{ room.price.toFixed(2) }}</p>
            <p class="room-summary">{{ summary }}</p>
        </div>
    </router-link>
</template>

<script setup lang="ts">
    import { computed, defineProps } from 'vue';

    /**
     * Props:
     * - room: Objeto com dados do quarto.
     * - large (opcional): Se true, exibe o card em formato grande.
     */
    const props = defineProps({
        room: {
            type: Object,
            required: true,
        },
        large: {
            type: Boolean,
            default: false,
        },
    });

    /**
     * Computa a URL da imagem do quarto com base no tipo.
     * Caso room.thumbnail esteja definido, utiliza-o; caso contrário,
     * retorna uma imagem padrão para cada tipo.
     */
    const imageSrc = computed(() => {
        if (props.room.thumbnail) return props.room.thumbnail;
        const type = props.room.type.toLowerCase();
        if (type === 'premium') return 'public/images/RoomImages/premium.jpg';
        if (type === 'luxo') return 'public/images/RoomImages/luxo.jpg';
        if (type === 'standard') return 'public/images/RoomImages/standard.jpg';
        return 'public/images/RoomImages/default.jpg';
    });

    /**
     * Computa um resumo das principais características do quarto,
     * de acordo com seu tipo.
     */
    const summary = computed(() => {
        const type = props.room.type.toLowerCase();
        if (type === 'premium')
            return 'Inclui banheira de hidromassagem, sauna, e vista panorâmica.';
        if (type === 'luxo')
            return 'Ambiente sofisticado, decoração premium e cama king-size.';
        if (type === 'standard')
            return 'Conforto e praticidade com tudo o que você precisa.';
        return '';
    });
</script>

<style scoped>
    /* Estilo padrão do card (modo pequeno) */
    .room-card {
        display: flex;
        align-items: center;
        background: #f4f4f4;
        padding: 0.5rem;
        border-radius: 8px;
        width: 250px;
        flex-shrink: 0;
        text-decoration: none;
        color: inherit;
        transition: transform 0.3s;
    }

        .room-card:hover {
            transform: scale(1.02);
        }

    .room-thumbnail {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 6px;
        margin-right: 0.5rem;
    }

    .room-details {
        text-align: left;
    }

    .room-type {
        margin: 0;
        font-size: 1rem;
        font-weight: bold;
        color: #333;
    }

    .room-number,
    .room-price,
    .room-summary {
        margin: 0;
        font-size: 0.9rem;
        color: #555;
    }

    /* Estilo para modo "large" */
    .room-card.large {
        width: 100%;
        padding: 1rem;
        display: flex;
        flex-direction: row;
    }

        .room-card.large .room-thumbnail {
            width: 150px;
            height: 150px;
            margin-right: 1rem;
        }

        .room-card.large .room-type {
            font-size: 1.5rem;
        }

        .room-card.large .room-number,
        .room-card.large .room-price,
        .room-card.large .room-summary {
            font-size: 1.1rem;
        }
</style>
