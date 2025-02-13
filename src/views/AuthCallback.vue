<script setup lang="ts">
    import { onMounted } from 'vue';
    import { supabase } from '@/utils/supabase-client';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    onMounted(async () => {
        const { data, error } = await supabase.auth.getSessionFromUrl();
        if (error) {
            console.error('Erro ao obter sessão a partir da URL:', error.message);
            // Opcional: redirecionar para uma página de erro ou exibir uma mensagem
        } else if (data.session) {
            // Aqui a sessão foi estabelecida com sucesso
            console.log('Sessão obtida:', data.session);
            // Opcional: redirecionar para a página principal ou outra rota
            router.push('/');
        }
    });
</script>
