<script setup lang="ts">
    /**
     * LoginPopup.vue
     *
     * Componente Vue para gerenciar login e registro de usuários.
     * Utiliza o Supabase como backend de autenticação.
     *
     * Recursos principais:
     * - Alternância entre login e registro.
     * - Integração com sign in via Google.
     * - Realiza validações básicas de campos.
     * - Limpa os campos ao fechar o popup.
     */

    import { ref } from 'vue';
    import { supabase } from '@/utils/supabase-client';
    import { useAuthStore } from '@/stores/auth';

    const authStore = useAuthStore();
    // -------------------- PROPRIEDADES E EVENTOS -------------------- //

    /**
     * Propriedade 'show' indica se o popup está visível.
     */
    const props = defineProps({
        show: {
            type: Boolean,
            default: false,
        },
    });

    /**
     * Evento 'close' para notificar o componente pai de que o popup deve ser fechado.
     */
    const emits = defineEmits(['close']);

    // -------------------- ESTADOS DO FORMULÁRIO -------------------- //

    /**
     * Define se o usuário está no modo de registro (true) ou login (false).
     */
    const isRegistering = ref(false);

    /**
     * Campos de formulário (nome, sobrenome, email e senha).
     */
    const name = ref('');
    const surname = ref('');
    const email = ref('');
    const password = ref('');

    /**
     * Mensagem de erro exibida para o usuário em caso de falha.
     */
    const errorMessage = ref('');

    /**
     * Indicador de carregamento para desabilitar ações enquanto processa login/registro.
     */
    const loading = ref(false);

    // -------------------- FUNÇÕES DE APOIO -------------------- //

    /**
     * Fecha o popup e limpa todos os campos do formulário.
     * Emite o evento 'close' para que o componente pai trate o encerramento do modal.
     */
    function closePopup() {
        emits('close');
        isRegistering.value = false;
        name.value = '';
        surname.value = '';
        email.value = '';
        password.value = '';
        errorMessage.value = '';
        loading.value = false;
    }

    /**
     * Alterna entre o modo de registro e login.
     * Caso o usuário queira registrar, é setado 'isRegistering' como true, e vice-versa.
     */
    function toggleRegister() {
        isRegistering.value = !isRegistering.value;
    }

    // -------------------- FUNÇÕES DE PROCESSAMENTO -------------------- //

    /**
     * handleSubmit
     *
     * Função intermediária para decidir se deve invocar a lógica de login ou registro.
     * Evita problemas ao usar operadores ternários em diretivas Vue do tipo @submit.
     */
    function handleSubmit() {
        if (isRegistering.value) {
            handleRegister();
        } else {
            handleLogin();
        }
    }

     /**
     * handleLogin
     *
     * Processa o login via Supabase e atualiza a store automaticamente.
     */
    async function handleLogin() {
        if (!email.value || !password.value) {
            errorMessage.value = 'Preencha todos os campos.';
            return;
        }
        errorMessage.value = '';
        loading.value = true;

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value,
            });
            if (error) throw error;

            alert('Login realizado com sucesso!');
            closePopup();
        } catch (err: any) {
            errorMessage.value = err.message || 'Erro desconhecido.';
        } finally {
            loading.value = false;
        }
    }

    /**
     * handleRegister
     *
     * Processa o registro via Supabase.
     * Verifica se os campos 'name', 'surname', 'email' e 'password' estão preenchidos.
     * Em caso de sucesso, fecha o popup e exibe mensagem para o usuário conferir o email de confirmação.
     */
    async function handleRegister() {
        if (!name.value || !surname.value || !email.value || !password.value) {
            errorMessage.value = 'Preencha todos os campos.';
            return;
        }
        errorMessage.value = '';
        loading.value = true;

        try {
            const { error } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
                options: {
                    data: {
                        name: name.value,
                        surname: surname.value,
                    },
                },
            });
            if (error) throw error;

            alert('Registro realizado com sucesso! Verifique seu email para confirmar.');
            closePopup();
        } catch (err: any) {
            errorMessage.value = err.message || 'Erro desconhecido.';
        } finally {
            loading.value = false;
        }
    }

    /**
     * handleGoogleLogin
     *
     * Processa o login via Google OAuth.
     * Em caso de sucesso, fecha o popup após redirecionamento.
     */
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
    <!-- Exibe somente se "show" for true -->
    <div v-if="show" class="modal-overlay">
        <div class="modal-container">
            <!-- Cabeçalho do modal -->
            <div class="modal-header">
                <h2>{{ isRegistering ? 'Registrar' : 'Login' }}</h2>
                <button class="close-btn" @click="closePopup">X</button>
            </div>

            <!-- Corpo do modal: formulário de login/registro e botões -->
            <div class="modal-body">
                <!-- Submissão do formulário passa pela função handleSubmit -->
                <form @submit.prevent="handleSubmit">
                    <!-- Campos exibidos somente no modo registro -->
                    <div v-if="isRegistering" class="form-group">
                        <label for="name">Nome</label>
                        <input id="name" type="text" v-model="name" required />
                    </div>

                    <div v-if="isRegistering" class="form-group">
                        <label for="surname">Sobrenome</label>
                        <input id="surname" type="text" v-model="surname" required />
                    </div>

                    <!-- Campos comuns a login e registro -->
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" type="email" v-model="email" required />
                    </div>
                    <div class="form-group">
                        <label for="password">Senha</label>
                        <input id="password" type="password" v-model="password" required />
                    </div>

                    <!-- Mensagem de erro (quando presente) -->
                    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

                    <!-- Botão principal para Login ou Registro -->
                    <button class="btn-submit" type="submit" :disabled="loading">
                        {{ loading ? 'Carregando...' : isRegistering ? 'Registrar' : 'Entrar' }}
                    </button>
                </form>

                <!-- Botão de login com Google (somente em modo login) -->
                <div class="divider" v-if="!isRegistering">ou</div>
                <button v-if="!isRegistering"
                        class="btn-google"
                        @click="handleGoogleLogin"
                        :disabled="loading">
                    {{ loading ? 'Carregando...' : 'Entrar com Google' }}
                </button>

                <!-- Botão para alternar entre Registro e Login -->
                <div class="divider"></div>
                <button class="btn-switch" @click="toggleRegister" :disabled="loading">
                    {{ isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Registrar' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /* Estilos visuais do modal e dos formulários */

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
