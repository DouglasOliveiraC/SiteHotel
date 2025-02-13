<script setup lang="ts">
    import { ref } from 'vue';
    import { supabase } from '@/utils/supabase-client';
    import { useAuthStore } from '@/stores/auth';

    const authStore = useAuthStore();

    // PROPRIEDADES E EVENTOS
    const props = defineProps({
        show: {
            type: Boolean,
            default: false,
        },
    });
    const emits = defineEmits(['close']);

    // ESTADOS DO FORMULÁRIO
    const isRegistering = ref(false);
    const name = ref('');
    const surname = ref('');
    const email = ref('');
    const password = ref('');
    const cpf = ref('');
    const errorMessage = ref('');
    const loading = ref(false);

    // FUNÇÃO PARA FECHAR O POPUP E LIMPAR OS CAMPOS
    function closePopup() {
        emits('close');
        isRegistering.value = false;
        name.value = '';
        surname.value = '';
        email.value = '';
        password.value = '';
        cpf.value = '';
        errorMessage.value = '';
        loading.value = false;
    }

    // ALTERNAR ENTRE LOGIN E REGISTRO
    function toggleRegister() {
        isRegistering.value = !isRegistering.value;
    }

    // DECIDE QUAL FUNÇÃO CHAMAR NO SUBMIT
    function handleSubmit() {
        if (isRegistering.value) {
            handleRegister();
        } else {
            handleLogin();
        }
    }

    
    // FUNÇÃO DE LOGIN (email/senha)
    async function handleLogin() {
        if (!email.value || !password.value) {
            errorMessage.value = 'Preencha todos os campos.';
            return;
        }
        errorMessage.value = '';
        loading.value = true;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value,
            });

            if (error) throw error;

            console.log('[DEBUG]handleLogin(): Login realizado com sucesso.');
            console.log('[DEBUG]handleLogin(): Usuário autenticado:', data.user);
            console.log('[DEBUG]handleLogin(): Sessão após login:', data.session);

            if (!data.session) {
                console.warn('[DEBUG]handleLogin(): ⚠ Sessão não foi retornada após login.');
            } else {
                // Salvando sessão manualmente para evitar perda de contexto
                localStorage.setItem('supabase_session', JSON.stringify(data.session));
            }

        
            alert('Login realizado com sucesso!');
            closePopup();
        } catch (err: any) {
            errorMessage.value = err.message || 'Erro desconhecido.';
        } finally {
            loading.value = false;
        }
    }






    // FUNÇÃO DE REGISTRO
    async function handleRegister() {
        if (!name.value || !surname.value || !email.value || !password.value || !cpf.value) {
            errorMessage.value = 'Preencha todos os campos.';
            return;
        }
        errorMessage.value = '';
        loading.value = true;

        try {
            // Ajuste para 'emailRedirectTo' no Supabase v2
            const response = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
                options: {
                    data: {
                        name: name.value,
                        surname: surname.value,
                        cpf: cpf.value,
                    },
                    emailRedirectTo: window.location.origin + '/auth/callback',
                },
            });

            console.log('Resposta do signUp:', JSON.stringify(response, null, 2));
            if (!response) {
                throw new Error('Resposta indefinida ao tentar registrar o usuário.');
            }

            const { data, error } = response;
            if (error) throw error;

            alert('Registro realizado com sucesso! Verifique seu email para confirmar.');
            closePopup();
        } catch (err: any) {
            errorMessage.value = err.message || 'Erro desconhecido.';
        } finally {
            loading.value = false;
        }
    }

    // FUNÇÃO DE LOGIN COM GOOGLE
    async function handleGoogleLogin() {
        errorMessage.value = '';
        loading.value = true;

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
            if (error) throw error;

            alert('Login com Google realizado com sucesso!');
            closePopup();
        } catch (err: any) {
            errorMessage.value = err.message || 'Erro desconhecido.';
        } finally {
            loading.value = false;
        }
    }
</script>

<template>
    <div v-if="show" class="modal-overlay">
        <div class="modal-container">
            <!-- Cabeçalho do modal -->
            <div class="modal-header">
                <h2>{{ isRegistering ? 'Registrar' : 'Login' }}</h2>
                <button class="close-btn" @click="closePopup">X</button>
            </div>

            <!-- Corpo do modal: formulário -->
            <div class="modal-body">
                <form @submit.prevent="handleSubmit">
                    <!-- Campos somente no modo de registro -->
                    <div v-if="isRegistering" class="form-group">
                        <label for="name">Nome</label>
                        <input id="name" type="text" v-model="name" required />
                    </div>
                    <div v-if="isRegistering" class="form-group">
                        <label for="surname">Sobrenome</label>
                        <input id="surname" type="text" v-model="surname" required />
                    </div>
                    <div v-if="isRegistering" class="form-group">
                        <label for="cpf">CPF</label>
                        <input id="cpf" type="text" v-model="cpf" required />
                    </div>
                    <!-- Campos comuns -->
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" type="email" v-model="email" required />
                    </div>
                    <div class="form-group">
                        <label for="password">Senha</label>
                        <input id="password" type="password" v-model="password" required />
                    </div>

                    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

                    <!-- Ajuste: convertemos o "loading" em boolean -->
                    <button class="btn-submit" type="submit" :disabled="Boolean(loading)">
                        {{ loading ? 'Carregando...' : isRegistering ? 'Registrar' : 'Entrar' }}
                    </button>
                </form>

                <!-- Botão de login com Google (somente no modo login) -->
                <div class="divider" v-if="!isRegistering">ou</div>
                <button v-if="!isRegistering"
                        class="btn-google"
                        @click="handleGoogleLogin"
                        :disabled="Boolean(loading)">
                    {{ loading ? 'Carregando...' : 'Entrar com Google' }}
                </button>

                <!-- Alternar entre modos -->
                <div class="divider"></div>
                <button class="btn-switch" @click="toggleRegister" :disabled="Boolean(loading)">
                    {{ isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Registrar' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    }

    .modal-container {
        background: #fff;
        width: 90%;
        max-width: 400px;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .close-btn {
        background: transparent;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
    }

    .modal-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .error-message {
        color: red;
        font-size: 0.9rem;
    }

    .btn-submit {
        margin-top: 0.5rem;
        background-color: #007bff;
        color: #fff;
        width: 100%;
        padding: 0.6rem 1rem;
        font-weight: bold;
        border-radius: 4px;
        border: none;
        cursor: pointer;
    }

    .btn-google {
        background-color: #ea4335;
        color: #fff;
        width: 100%;
        padding: 0.6rem 1rem;
        font-weight: bold;
        border-radius: 4px;
        border: none;
        cursor: pointer;
    }

    .divider {
        text-align: center;
        color: #999;
        font-size: 0.85rem;
    }

    .btn-switch {
        background-color: #6c757d;
        color: #fff;
        width: 100%;
        padding: 0.6rem 1rem;
        font-weight: bold;
        border-radius: 4px;
        border: none;
        cursor: pointer;
    }
</style>
