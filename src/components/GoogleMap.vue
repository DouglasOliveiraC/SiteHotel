<template>
    <!-- Container do mapa com responsividade e margens -->
    <div class="map-container">
        <!-- Iframe do Google Maps com a localização correta da PUC-RS -->
        <iframe class="google-map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16425.87379826737!2d-51.183607097874365!3d-30.06224944155418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951977fea1504897%3A0x1e20a65cc662a5c2!2sPontif%C3%ADcia%20Universidade%20Cat%C3%B3lica%20do%20Rio%20Grande%20do%20Sul!5e0!3m2!1spt-BR!2sus!4v1739483886463!5m2!1spt-BR!2sus"
                frameborder="0"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    </div>
</template>



<script setup lang="ts">
    /* -----------------------------------------------------------------------------
       Componente: GoogleMap
       Descrição: Exibe um mapa interativo utilizando o Google Maps embed, centralizado
                  na localização da PUC-RS.
    -----------------------------------------------------------------------------*/
</script>

<style scoped>
    .map-container {
        width: 100%;
        height: 400px;
        margin: 2rem 0;
    }

    .google-map {
        width: 100%;
        height: 100%;
        border: 0;
    }
</style>
