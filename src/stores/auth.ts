import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabase-client';

// Interface para armazenar metadados do usuário (nome, configurações adicionais, etc.)
interface UserMetadata {
    name?: string;
    [key: string]: any; // Permite incluir outros campos adicionais dinamicamente
}

// Interface principal para o usuário autenticado
interface User {
    id: string;         // Identificador único do usuário no Supabase
    name: string;       // Nome do usuário
    email?: string;     // E-mail do usuário (opcional, dependendo da autenticação)
    metadata?: UserMetadata; // Metadados associados ao usuário
}

// Definição da store de autenticação
export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false as boolean,  // Estado de autenticação (true se o usuário estiver logado)
        user: null as User | null,     // Armazena as informações do usuário autenticado
    }),

    getters: {
        // Retorna o nome do usuário ou um valor padrão caso não esteja autenticado
        userName: (state) => state.user?.name || 'Usuário Anônimo',
    },

    actions: {
        /**
         * Inicializa a autenticação ao carregar a aplicação.
         * Verifica se há uma sessão ativa no Supabase e atualiza o estado da store.
         * Também monitora mudanças de sessão automaticamente.
         */
        async initAuth() {
            try {
                // Tenta obter a sessão de usuário armazenada
                const response = await supabase.auth.getSession();

                if (response?.data?.session) {
                    // Se houver uma sessão ativa, extrai os dados do usuário
                    const user = response.data.session.user;
                    this.login({
                        id: user.id,
                        name: user.user_metadata?.name || 'Usuário Anônimo',
                        email: user.email,
                        metadata: user.user_metadata,
                    });
                } else {
                    // Se não houver sessão, faz logout para limpar o estado
                    this.logout();
                }

                // Monitora mudanças no estado de autenticação (ex.: login/logout)
                supabase.auth.onAuthStateChange(async (event, session) => {
                    if (session) {
                        const user = session.user;
                        this.login({
                            id: user.id,
                            name: user.user_metadata?.name || 'Usuário Anônimo',
                            email: user.email,
                            metadata: user.user_metadata,
                        });
                    } else {
                        this.logout();
                    }
                });

            } catch (error) {
                console.error('Erro ao inicializar autenticação:', error);
                this.logout();
            }
        },

        /**
         * Faz login do usuário e armazena as informações na store e no localStorage.
         * @param user - Objeto contendo as informações do usuário autenticado.
         */
        async login(user: User) {
            this.isLoggedIn = true;
            this.user = user;

            // Armazena o usuário localmente para persistência de sessão
            localStorage.setItem('user', JSON.stringify(user));

            console.log('Usuário logado com sucesso:', user);
        },

        /**
         * Faz logout do usuário, limpando o estado local e chamando o Supabase.
         */
        async logout() {
            this.isLoggedIn = false;
            this.user = null;

            // Remove os dados armazenados localmente
            localStorage.removeItem('user');

            // Encerra a sessão no Supabase
            await supabase.auth.signOut();

            console.log('Usuário deslogado.');
        },
    },
});
