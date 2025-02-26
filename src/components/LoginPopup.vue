<script setup lang="ts">
    /* -----------------------------------------------------------------------------
       Componente: LoginPopup
       Descrição: Exibe um modal de autenticação que permite ao usuário realizar login,
                  registro ou autenticar via Google. O design adota a paleta de cores e
                  tipografia consistentes com o restante do projeto.
    -----------------------------------------------------------------------------*/
    import { ref } from 'vue';
    import { supabase } from '@/utils/supabase-client';
    import { useAuthStore } from '@/stores/auth';

    // Acesso à store de autenticação global
    const authStore = useAuthStore();

    /* -----------------------------------------------------------------------------
       PROPRIEDADES DO COMPONENTE
    -----------------------------------------------------------------------------*/
    const props = defineProps({
        show: {
            type: Boolean,
            default: false,
        },
    });
    const emits = defineEmits(['close']);

    /* -----------------------------------------------------------------------------
       ESTADOS DO FORMULÁRIO
    -----------------------------------------------------------------------------*/
    const isRegistering = ref(false);
    const name = ref('');
    const surname = ref('');
    const email = ref('');
    const password = ref('');
    const cpf = ref('');
    const errorMessage = ref('');
    const loading = ref(false);

    /* -----------------------------------------------------------------------------
       FUNÇÃO: closePopup
       Descrição: Fecha o modal e reseta os campos e estados do formulário.
    -----------------------------------------------------------------------------*/
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

    /* -----------------------------------------------------------------------------
       FUNÇÃO: toggleRegister
       Descrição: Alterna entre os modos de login e registro.
    -----------------------------------------------------------------------------*/
    function toggleRegister() {
        isRegistering.value = !isRegistering.value;
    }

    /* -----------------------------------------------------------------------------
       FUNÇÃO: handleSubmit
       Descrição: Determina se o formulário deve executar o login ou o registro,
                  com base no estado atual.
    -----------------------------------------------------------------------------*/
    function handleSubmit() {
        if (isRegistering.value) {
            handleRegister();
        } else {
            handleLogin();
        }
    }

    /* -----------------------------------------------------------------------------
       FUNÇÃO: handleLogin
       Descrição: Realiza o login do usuário utilizando email e senha.
    -----------------------------------------------------------------------------*/
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

    /* -----------------------------------------------------------------------------
       FUNÇÃO: handleRegister
       Descrição: Registra um novo usuário utilizando os dados fornecidos.
    -----------------------------------------------------------------------------*/
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

    /* -----------------------------------------------------------------------------
       FUNÇÃO: handleGoogleLogin
       Descrição: Realiza o login do usuário utilizando autenticação via Google.
    -----------------------------------------------------------------------------*/
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
    <!-- Modal: Exibe a tela de login/registro somente se "show" for verdadeiro -->
    <div v-if="show" class="modal-overlay">
        <div class="modal-container">
            <!-- Cabeçalho do Modal -->
            <div class="modal-header">
                <h2>{{ isRegistering ? 'Registrar' : 'Login' }}</h2>
                <button class="close-btn" @click="closePopup">X</button>
            </div>

            <!-- Corpo do Modal: Formulário de autenticação -->
            <div class="modal-body">
                <form @submit.prevent="handleSubmit">
                    <!-- Campos adicionais para o modo de registro -->
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
                    <!-- Campos comuns para login e registro -->
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" type="email" v-model="email" required />
                    </div>
                    <div class="form-group">
                        <label for="password">Senha</label>
                        <input id="password" type="password" v-model="password" required />
                    </div>

                    <!-- Exibição de mensagens de erro -->
                    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

                    <!-- Botão principal de ação: Login ou Registro -->
                    <button class="btn-submit" type="submit" :disabled="Boolean(loading)">
                        {{ loading ? 'Carregando...' : isRegistering ? 'Registrar' : 'Entrar' }}
                    </button>
                </form>

                <!-- Opção de autenticação via Google (apenas no modo login) -->
                <div class="divider" v-if="!isRegistering">ou</div>
                <button v-if="!isRegistering"
                        class="btn-google"
                        @click="handleGoogleLogin"
                        :disabled="Boolean(loading)">
                    {{ loading ? 'Carregando...' : 'Entrar com Google' }}
                </button>

                <!-- Botão para alternar entre os modos de login e registro -->
                <div class="divider"></div>
                <button class="btn-switch" @click="toggleRegister" :disabled="Boolean(loading)">
                    {{ isRegistering ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Registrar' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
        /* -----------------------------------------------------------------------------
       Importação da fonte 'Poppins' para manter a consistência tipográfica
    -----------------------------------------------------------------------------*/
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        /* -----------------------------------------------------------------------------
       Estilização do Modal de Autenticação
    -----------------------------------------------------------------------------*/
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Fundo escurecido */
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000; /* Aumentado para ficar acima do header */
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
            font-family: 'Poppins', sans-serif;
        }

        /* -----------------------------------------------------------------------------
       Cabeçalho do Modal
    -----------------------------------------------------------------------------*/
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

        /* -----------------------------------------------------------------------------
       Corpo do Modal e Formulário
    -----------------------------------------------------------------------------*/
        .modal-body {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        /* Estilização dos inputs para uma aparência moderna */
        .modal-body input {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 0.5rem;
            font-size: 1rem;
            margin-top: 0.2rem;
            transition: border-color 0.3s;
        }

            .modal-body input:focus {
                outline: none;
                border-color: rgba(0, 128, 96, 0.8);
            }

        .error-message {
            color: red;
            font-size: 0.9rem;
        }

        /* -----------------------------------------------------------------------------
       Botões: Estilização consistente com a paleta e design moderno
    -----------------------------------------------------------------------------*/
        .btn-submit,
        .btn-google,
        .btn-switch {
            width: 100%;
            padding: 0.8rem 1.5rem;
            font-weight: 600;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            transition: background 0.3s ease, color 0.3s ease;
            font-family: 'Poppins', sans-serif;
        }

        /* Botão principal (Login/Registro): Verde translúcido */
    .btn-submit {
        margin-top: 1rem;
        background-color: rgba(0, 128, 96, 0.8);
        color: #fff;
    }

        .btn-submit:hover:not(:disabled) {
                background-color: rgba(0, 128, 96, 1); /* Verde mais intenso no hover */
                border: 1px solid rgba(0, 128, 96, 1);
                color: #fff;
        }

        /* Botão de login com Google: Tom vermelho */
        .btn-google {
            background-color: #ea4335;
            color: #fff;
        }

            .btn-google:hover:not(:disabled) {
                background-color: #c93329;
            }

        /* Botão para alternar entre modos: Cinza neutro */
        .btn-switch {
            background-color: #6c757d;
            color: #fff;
        }

            .btn-switch:hover:not(:disabled) {
                background-color: #5a6268;
            }

        /* -----------------------------------------------------------------------------
       Divisores e Separadores
    -----------------------------------------------------------------------------*/
        .divider {
            text-align: center;
            color: #999;
            font-size: 0.85rem;
        }
</style>
