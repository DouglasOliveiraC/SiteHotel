<template>
    <div class="gallery-container">
        <!-- Grid de fotos -->
        <div class="photo-grid">
            <div v-for="(photo, index) in photos" :key="index" class="photo-item">
                <!-- Exibe a mesma imagem reduzida e permite clicar para ampliar -->
                <img :src="photo" alt="Foto do Campus" @click="openPhoto(photo)" />
            </div>
        </div>

        <!-- Modal para exibição da foto ampliada -->
        <div v-if="selectedPhoto" class="modal-overlay" @click.self="closePhoto">
            <div class="modal-photo">
                <img :src="selectedPhoto" alt="Foto Ampliada do Campus" />
                <button class="close-photo" @click="closePhoto">X</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/* -----------------------------------------------------------------------------
   Lista de imagens da galeria.
   Usamos apenas um para a imagem, CSS cuida do tamanho.
-----------------------------------------------------------------------------*/
const photos = ref<string[]>([
  '/images/PhotoGallery/puc1.jpg',
  '/images/PhotoGallery/puc2.jpg',
  '/images/PhotoGallery/puc3.jpg',
  '/images/PhotoGallery/puc4.png',
  '/images/PhotoGallery/puc5.png',
  '/images/PhotoGallery/puc6.png',
  '/images/PhotoGallery/puc7.png',
  '/images/PhotoGallery/puc8.png',
  '/images/PhotoGallery/puc9.png',

]);

/* -----------------------------------------------------------------------------
   Estado que controla a foto selecionada para visualização ampliada.
-----------------------------------------------------------------------------*/
const selectedPhoto = ref<string | null>(null);

/* -----------------------------------------------------------------------------
   Abre a visualização ampliada definindo a foto selecionada.
-----------------------------------------------------------------------------*/
function openPhoto(photo: string) {
  selectedPhoto.value = photo;
}

/* -----------------------------------------------------------------------------
   Fecha a visualização ampliada, resetando o estado.
-----------------------------------------------------------------------------*/
function closePhoto() {
  selectedPhoto.value = null;
}
</script>

<style scoped>
    .gallery-container {
        margin: 2rem 0;
    }

    /* Grid responsivo para as fotos */
    .photo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }

    /* As imagens agora são reduzidas automaticamente */
    .photo-item img {
        width: 100%;
        height: 120px; /* Define altura fixa para thumbnails */
        object-fit: cover; /* Corta a imagem para se encaixar no espaço */
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.3s;
    }

        .photo-item img:hover {
            transform: scale(1.05);
        }

    /* Modal para visualização ampliada da foto */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }

    .modal-photo {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }

        .modal-photo img {
            width: 100%;
            height: auto;
            border-radius: 8px;
        }

    /* Botão de fechar a foto ampliada */
    .close-photo {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #fff;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>
