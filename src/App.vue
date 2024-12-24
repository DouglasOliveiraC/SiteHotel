<script lang="ts">
    import { defineComponent } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import HeaderVisitor from '@/components/HeaderVisitor.vue';
    import HeaderLoggedIn from '@/components/HeaderLoggedIn.vue';
    import FooterCommon from '@/components/FooterCommon.vue';
    
    export default defineComponent({
        setup() {
            const auth = useAuthStore();

            return {
                auth,
            };
        },
    });
</script>

<template>
    <div>
        <HeaderVisitor v-if="!auth.isLoggedIn" />
        <HeaderLoggedIn v-else />
        <router-view />
        <FooterCommon />
    </div>
</template>