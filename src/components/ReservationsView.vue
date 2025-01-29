<script setup>
    import { ref, onMounted } from 'vue';
    import { supabase } from '@/utils/supabase-client';

    const users = ref([]);

    async function getUsers() {
        const { data, error } = await supabase.from('users').select('*');
        if (error) {
            console.error('Erro ao buscar usuários:', error.message);
        } else {
            users.value = data;
        }
    }

    onMounted(() => {
        getUsers();
    });
</script>

<template>
    <div>
        <h1>Lista de Usuários</h1>
        <ul>
            <li v-for="user in users" :key="user.id">
                {{ user.name }} ({{ user.email }})
            </li>
        </ul>
    </div>
</template>
