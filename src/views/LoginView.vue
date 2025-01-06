<script setup>
    import { ref } from 'vue';
    import { supabase } from '@/utils/supabase'; // Cliente Supabase

    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const loading = ref(false);

    const handleLogin = async () => {
        errorMessage.value = '';
        loading.value = true;

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value,
            });
            if (error) throw error;
            alert('Login realizado com sucesso!');
        } catch (error) {
            errorMessage.value = error.message;
        } finally {
            loading.value = false;
        }
    };
</script>

<template>
    <div class="login-container">
        <h1>Entrar</h1>
        <form @submit.prevent="handleLogin">
            <div>
                <label for="email">Email</label>
                <input id="email" type="email" v-model="email" required />
            </div>
            <div>
                <label for="password">Senha</label>
                <input id="password" type="password" v-model="password" required />
            </div>
            <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
            <button type="submit" :disabled="loading">
                {{ loading ? 'Carregando...' : 'Entrar' }}
            </button>
        </form>
    </div>
</template>

<style scoped>
    .login-container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 1rem;
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    label {
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    input {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    button {
        padding: 0.75rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
    }

        button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

    .error {
        color: red;
        font-size: 0.9rem;
    }
</style>
