import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabase-client';

/**
 * Interface para armazenar informações adicionais do usuário, como nome,
 * sobrenome, CPF e quaisquer outros campos relevantes.
 */
interface UserMetadata {
    name?: string;
    surname?: string;
    cpf?: string;
    [key: string]: any;
}

/**
 * Interface principal que representa o usuário autenticado.
 */
interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    metadata?: UserMetadata;
    cpf: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Formato de retorno para os métodos de atualização (sucesso ou erro).
 */
interface UpdateResponse {
    success: boolean;
    message: string;
}

/**
 * Store responsável pela autenticação e gerenciamento de informações do usuário.
 */
export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false as boolean,
        user: null as User | null,
    }),

    getters: {
        userName: (state) => state.user?.name || 'Usuário Anônimo',
    },

    actions: {
        /**
         * initAuth
         *
         * Inicializa a autenticação ao carregar a aplicação:
         * - Obtém a sessão atual.
         * - Se houver sessão ativa, mapeia o usuário do Supabase e realiza o login.
         * - Configura um listener para mudanças de sessão.
         */
        async initAuth() {
            try {
                let session = null;

                // 1️ Tenta buscar a sessão diretamente do Supabase
                const response = await supabase.auth.getSession();

                if (response && response.data && response.data.session) {
                    session = response.data.session;
                    console.log('[DEBUG]initAuth() Sessão encontrada via Supabase:', session);
                } else {
                    // 2️ Se `getSession()` falhar, tenta recuperar do localStorage
                    const savedSession = localStorage.getItem('supabase_session');
                    if (savedSession) {
                        session = JSON.parse(savedSession);
                        console.warn('[DEBUG]initAuth() Usando sessão salva no localStorage:', session);
                    }
                }

                if (session && session.user) {
                    this.login(this.mapSupabaseUserToLocalUser(session.user));
                } else {
                    console.warn('[DEBUG]initAuth() Nenhuma sessão ativa encontrada. Não chamando logout.');
                }

                // Configura o listener para mudanças na sessão
                supabase.auth.onAuthStateChange(async (event, session) => {
                    console.log('[DEBUG]initAuth() Evento de autenticação:', event, session);

                    if (event === 'SIGNED_IN') {
                        console.log('[DEBUG]initAuth() Evento SIGNED_IN: carregando usuário...');
                        if (session?.user) {
                            this.login(this.mapSupabaseUserToLocalUser(session.user));
                            //await this.fetchUserProfileDirectly(session);
                        }
                    } else if (event === 'SIGNED_OUT') {
                        console.log('[DEBUG]initAuth() Evento SIGNED_OUT detectado. Chamando logout...');
                        this.logout();
                    } else {
                        console.warn('[DEBUG]initAuth() Evento inesperado:', event);
                    }
                });

            } catch (error) {
                console.error('[DEBUG] Erro ao inicializar autenticação:', error);
                this.logout();
            }
        },

        /**
         * printUser
         *
         * Função para debugar a saída de getUser()
         */
        async printUser() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                console.log("Usuário retornado:", user);
            } catch (error) {
                console.error("Erro ao obter usuário:", error);
            }
        },

        /**
         * fetchUserProfileDirectly
         *
         * Busca o perfil do usuário na tabela 'profiles' utilizando o userId obtido da sessão.
         */
        async fetchUserProfileDirectly(session: { user: any }) {
            try {
                const userId = session?.user?.id;
                if (!userId) {
                    console.error("[DEBUG] Nenhum userId encontrado.");
                    return;
                }

                console.log('[DEBUG] fetchUserProfileDirectly() -> userId:', userId);

                // Verifica se há uma sessão ativa antes de buscar o token
                let accessToken = session?.access_token;

                if (!accessToken) {
                    const storedSession = localStorage.getItem('supabase_session');
                    if (storedSession) {
                        const parsedSession = JSON.parse(storedSession);
                        accessToken = parsedSession.access_token;
                        console.warn('[DEBUG] Usando token salvo localmente.');
                    }
                }

                if (!accessToken) {
                    console.error('[DEBUG] Erro: Nenhum token disponível para autenticação.');
                    return;
                }

                const apiKey = import.meta.env.VITE_SUPABASE_KEY;

                const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
                    {
                        method: "GET",
                        headers: {
                            "apikey": apiKey,
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    console.error("[DEBUG] Erro na requisição:", response.status, response.statusText);
                    return;
                }

                const profileData = await response.json();
                console.log('[DEBUG] Resposta da API:', profileData);

                if (!Array.isArray(profileData) || profileData.length === 0) {
                    console.warn('[DEBUG] Nenhum perfil encontrado.');
                    return;
                }

                this.user = { ...this.user, ...profileData[0] };
                console.log('[DEBUG] Perfil carregado com sucesso:', this.user);
            } catch (err) {
                console.error('[DEBUG] fetchUserProfileDirectly() Erro inesperado:', err);
            }
        },

        /**
         * login
         *
         * Realiza o login do usuário:
         * - Atualiza o estado local e armazena os dados no localStorage.
         */
        async login(user: User) {
            this.isLoggedIn = true;
            this.user = user;
            localStorage.setItem('user', JSON.stringify(user));
            console.log('Usuário autenticado com sucesso:', user);
        },

        /**
         * logout
         *
         * Realiza o logout do usuário:
         * - Limpa o estado local, remove os dados do localStorage e encerra a sessão no Supabase.
         */
        async logout() {
            try {
                const accessToken = localStorage.getItem('supabase_session')
                    ? JSON.parse(localStorage.getItem('supabase_session')!).access_token
                    : null;

                if (!accessToken) {
                    console.warn('[DEBUG] Nenhum token encontrado. O usuário pode já estar deslogado.');
                } else {
                    const apiKey = import.meta.env.VITE_SUPABASE_KEY;

                    // Realiza a requisição de logout via fetch
                    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/logout`, {
                        method: "POST",
                        headers: {
                            "apikey": apiKey,
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    });

                    if (!response.ok) {
                        console.error('[DEBUG] Erro ao fazer logout:', response.status, response.statusText);
                    } else {
                        console.log('[DEBUG] Logout realizado com sucesso.');
                    }
                }

                // Remove a sessão localmente para garantir que o usuário é deslogado da UI
                this.isLoggedIn = false;
                this.user = null;
                localStorage.removeItem('supabase_session'); // Removendo sessão salva
            } catch (err) {
                console.error('[DEBUG] Exceção durante logout:', err);
            }
        },


        /**
         * mapSupabaseUserToLocalUser
         *
         * Converte o objeto 'user' retornado pelo Supabase para o formato da nossa interface local.
         */
        mapSupabaseUserToLocalUser(supabaseUser: any): User {
            return {
                id: supabaseUser.id,
                name: supabaseUser.user_metadata?.name ?? 'Usuário Anônimo',
                surname: supabaseUser.user_metadata?.surname ?? '',
                email: supabaseUser.email ?? '',
                metadata: supabaseUser.user_metadata,
                cpf: supabaseUser.user_metadata?.cpf ?? '',
            };
        },

        /**
         * createEmptyUser
         *
         * Cria um objeto User vazio com valores mínimos, dado um userId.
         */
        createEmptyUser(userId: string): User {
            return {
                id: userId,
                name: '',
                surname: '',
                email: '',
                cpf: '',
            };
        },
    },
});
