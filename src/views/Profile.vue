<script setup lang="ts">
    // Importação de funções e estados reativos do Vue
    import { ref, onMounted, computed, watchEffect } from 'vue'
    import { useAuthStore } from '@/stores/auth'

    // Inicializa o store de autenticação
    const authStore = useAuthStore()
    const isLoggedIn = computed(() => !!authStore.user)

    // Estados reativos para controle do usuário e da interface
    const loadingUser = ref(true) // Indica se os dados do usuário ainda estão carregando
    const user = computed(() => authStore.user) // Usuário autenticado

    // Estados para controle da edição do perfil
    const userOriginal = ref<any>(null) // Guarda os dados originais do usuário
    const userEdit = ref<any>({}) // Guarda os dados editáveis do usuário
    const editing = ref(false) // Indica se o modo de edição está ativado
    const saving = ref(false) // Indica se os dados estão sendo salvos
    const message = ref<{ type: 'success' | 'error'; text: string } | null>(null) // Mensagem de feedback para o usuário

    // Lista de campos críticos que precisam ser atualizados no Supabase Auth
    const criticalFields = ['name', 'surname', 'email', 'cpf']

    /**
     * Sincroniza os dados do usuário autenticado para os estados locais.
     * Isso garante que as edições sejam feitas sem modificar os dados originais.
     */
    function syncLocalUserData() {
        if (authStore.user) {
            userOriginal.value = { ...authStore.user }
            userEdit.value = { ...authStore.user }
            loadingUser.value = false
        }
    }

    /**
     * Alterna entre os modos de edição e visualização do perfil.
     * Caso o usuário cancele a edição, os valores editados são restaurados.
     */
    function toggleEdit() {
        editing.value = !editing.value
        if (!editing.value) {
            userEdit.value = { ...userOriginal.value }
        }
    }

    /**
     * Obtém o token de acesso armazenado no localStorage para autenticação das requisições.
     * Retorna `null` se não houver sessão salva.
     */
    function getAccessToken() {
        const storedSession = localStorage.getItem('supabase_session')
        if (storedSession) {
            const parsedSession = JSON.parse(storedSession)
            return parsedSession.access_token || null
        }
        return null
    }

    /**
     * Atualiza os dados do perfil buscando diretamente do Supabase,
     * garantindo que os dados apresentados são os mais recentes.
     */
    async function refreshProfileData() {
        if (!authStore.user) return
        console.log("[DEBUG] Atualizando dados do perfil diretamente do Supabase...")
        await authStore.fetchUserProfileDirectly({ user: authStore.user })
        syncLocalUserData()
    }

    /**
     * Salva as alterações feitas pelo usuário no perfil, enviando para o Supabase.
     * Atualiza os campos críticos no Supabase Auth e os demais campos na tabela `profiles`.
     */
    async function saveProfile() {
        if (!userOriginal.value) return

        saving.value = true
        try {
            // Identifica os campos alterados que são críticos (exemplo: nome, email, CPF)
            const changedCritical = criticalFields.reduce((acc, field) => {
                if (userEdit.value[field] !== userOriginal.value[field]) {
                    acc[field] = userEdit.value[field]
                }
                return acc
            }, {} as Record<string, any>)

            // Identifica os demais campos alterados que devem ser atualizados na tabela `profiles`
            const changedNonCritical = Object.keys(userEdit.value).reduce((acc, field) => {
                if (!criticalFields.includes(field) && field !== 'id') {
                    if (userEdit.value[field] !== userOriginal.value[field]) {
                        acc[field] = userEdit.value[field]
                    }
                }
                return acc
            }, {} as Record<string, any>)

            const userId = userOriginal.value.id
            const accessToken = getAccessToken()
            const apiKey = import.meta.env.VITE_SUPABASE_KEY

            if (!accessToken) {
                message.value = { type: 'error', text: 'Erro de autenticação. Faça login novamente.' }
                return
            }

            let successCritical = true
            let successNonCritical = true

            //  Atualiza campos críticos no Supabase Auth (name, surname, email, cpf)
            if (Object.keys(changedCritical).length > 0) {
                console.log("[DEBUG] Atualizando campos críticos:", changedCritical)

                const response = await fetch(
                    `https://itzogmezyvdtuhnitibj.supabase.co/auth/v1/user`,
                    {
                        method: "PUT",
                        headers: {
                            "apikey": apiKey,
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: changedCritical.email,
                            data: {
                                name: changedCritical.name,
                                surname: changedCritical.surname,
                                cpf: changedCritical.cpf
                            }
                        })
                    }
                )

                const responseData = await response.json()

                if (!response.ok || responseData.error) {
                    successCritical = false
                    console.error("[DEBUG] Erro ao atualizar auth.user:", response.status, response.statusText, responseData)
                } else {
                    console.log("[DEBUG] Atualização bem-sucedida em auth.user", responseData)
                }
            }

            // Atualiza os demais campos na tabela `profiles` (exemplo: endereço, telefone)
            if (Object.keys(changedNonCritical).length > 0) {
                console.log("[DEBUG] Atualizando campos não críticos:", changedNonCritical)

                const response = await fetch(
                    `https://itzogmezyvdtuhnitibj.supabase.co/rest/v1/profiles?id=eq.${userId}`,
                    {
                        method: "PATCH",
                        headers: {
                            "apikey": apiKey,
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(changedNonCritical)
                    }
                )

                if (!response.ok) {
                    successNonCritical = false
                    console.error("[DEBUG] Erro ao atualizar profiles:", response.status, response.statusText)
                } else {
                    console.log("[DEBUG] Atualização bem-sucedida em profiles.")
                }
            }

            //  Aguarda um curto intervalo para garantir a propagação da atualização no Supabase
            console.log("[DEBUG] Aguardando a propagação da atualização...")
            await new Promise((resolve) => setTimeout(resolve, 800))

            //  Busca os dados mais recentes para validar se foram alterados corretamente
            await refreshProfileData()

            // Confirma se os dados realmente mudaram antes de exibir mensagens de sucesso/erro
            let atualizacaoBemSucedida = true
            Object.keys(userEdit.value).forEach((field) => {
                if (userEdit.value[field] !== authStore.user?.[field]) {
                    console.warn("[DEBUG] O campo", field, "não foi atualizado corretamente.")
                    atualizacaoBemSucedida = false
                }
            })

            // Mensagem final ao usuário baseada na validação da atualização
            if (successCritical && successNonCritical && atualizacaoBemSucedida) {
                console.log("[DEBUG] Perfil atualizado com sucesso!")

                // Sai do modo de edição
                editing.value = false

                // Exibe mensagem de sucesso
                message.value = { type: 'success', text: 'Perfil atualizado com sucesso!' }
            } else {
                console.warn("[DEBUG] Atualização parcial detectada.")
                message.value = { type: 'error', text: 'Algumas informações podem não ter sido salvas corretamente.' }
            }

        } catch (error) {
            console.error("[DEBUG] Erro ao atualizar perfil:", error)
            message.value = { type: 'error', text: 'Erro ao atualizar perfil. Tente novamente.' }
        } finally {
            saving.value = false
        }
    }

    /**
     * Observa mudanças no `authStore.user` e sincroniza os dados locais sempre que necessário.
     */
    watchEffect(() => {
        if (authStore.user) {
            syncLocalUserData()
        }
    })

    /**
     * Executado ao montar o componente: busca os dados mais recentes do perfil.
     */
    onMounted(async () => {
        console.log('[DEBUG] onMounted: user atual =', authStore.user)
        await refreshProfileData()
    })
</script>





<template>
    <div v-if="loadingUser" class="profile-container">
        <p class="info-text">Carregando perfil...</p>
    </div>

    <div v-else-if="!user" class="profile-container">
        <p class="info-text">Usuário não encontrado. Faça login para acessar seu perfil.</p>
    </div>

    <div v-else class="profile-container">
        <h1>Meu Perfil</h1>

        <!-- Mensagem de feedback -->
        <p v-if="message" :class="['message', message.type]">
            {{ message.text }}
        </p>

        <form @submit.prevent="saveProfile">
            <div class="form-grid">
                <label>
                    Nome:
                    <input v-model="userEdit.name" type="text" :disabled="!editing" required />
                </label>

                <label>
                    Sobrenome:
                    <input v-model="userEdit.surname" type="text" :disabled="!editing" required />
                </label>

                <label>
                    Email:
                    <input v-model="userEdit.email" type="email" :disabled="!editing" required />
                </label>

                <label>
                    CPF:
                    <input v-model="userEdit.cpf" type="text" :disabled="!editing" required placeholder="000.000.000-00" />
                </label>

                <label>
                    Endereço:
                    <input v-model="userEdit.address" type="text" :disabled="!editing" />
                </label>

                <label>
                    Cidade:
                    <input v-model="userEdit.city" type="text" :disabled="!editing" />
                </label>

                <label>
                    Estado:
                    <input v-model="userEdit.state" type="text" :disabled="!editing" />
                </label>

                <label>
                    CEP:
                    <input v-model="userEdit.zip_code" type="text" :disabled="!editing" placeholder="00000-000" />
                </label>

                <label>
                    País:
                    <input v-model="userEdit.country" type="text" :disabled="!editing" />
                </label>

                <label>
                    Telefone:
                    <input v-model="userEdit.phone" type="text" :disabled="!editing" />
                </label>
            </div>

            <div class="button-container">
                <button v-if="!editing" type="button" class="edit-btn" @click="toggleEdit">
                    Editar Perfil
                </button>

                <button v-if="editing" type="submit" class="save-btn" :disabled="saving">
                    {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
                </button>

                <button v-if="editing" type="button" class="cancel-btn" @click="toggleEdit">
                    Cancelar
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
    /* Definição de variáveis para as cores */
    :root {
        --primary: #007bff;
        --primary-dark: #0056b3;
        --background: #f0f4f8;
        --white: #ffffff;
        --gray: #e0e0e0;
        --text: #333333;
    }

    /* Reset e configuração mobile-first */
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Container principal */
    .profile-container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 1.5rem;
        background-color: var(--white);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* Títulos e textos informativos */
    h1 {
        font-size: 1.8rem;
        text-align: center;
        color: var(--primary);
        margin-bottom: 1.5rem;
    }

    .info-text {
        text-align: center;
        font-size: 1rem;
        color: var(--text);
    }

    /* Mensagens de feedback */
    .message {
        padding: 0.75rem;
        margin-bottom: 1.5rem;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
    }

        .message.success {
            background-color: #d4edda;
            color: #155724;
        }

        .message.error {
            background-color: #f8d7da;
            color: #721c24;
        }

    /* Grid do formulário */
    .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    /* Labels e inputs */
    label {
        display: flex;
        flex-direction: column;
        font-size: 0.95rem;
        color: var(--text);
    }

    input {
        margin-top: 0.5rem;
        padding: 0.75rem;
        border: 1px solid var(--gray);
        border-radius: 8px;
        font-size: 1rem;
        transition: border 0.3s ease;
    }

        input:focus {
            border-color: var(--primary);
            outline: none;
        }

    /* Botões */
    .button-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

        .button-container button {
            padding: 0.75rem;
            font-size: 1rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

    /* Estilos específicos para cada botão */
    .edit-btn {
        background-color: var(--primary);
        color: var(--white);
    }

        .edit-btn:hover {
            background-color: var(--primary-dark);
        }

    .save-btn {
        background-color: var(--primary);
        color: var(--white);
    }

        .save-btn:disabled {
            background-color: var(--gray);
            cursor: not-allowed;
        }

    .cancel-btn {
        background-color: #cccccc;
        color: #333;
    }

        .cancel-btn:hover {
            background-color: #b3b3b3;
        }

    /* Responsividade para telas maiores */
    @media (min-width: 768px) {
        .form-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .button-container {
            flex-direction: row;
            justify-content: space-between;
        }
    }
</style>
