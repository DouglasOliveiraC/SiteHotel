import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabase-client';

// Interface para armazenar metadados do usu�rio (nome, configura��es adicionais, etc.)
interface UserMetadata {
    name?: string;
    [key: string]: any; // Permite incluir outros campos adicionais dinamicamente
}

// Interface principal para o usu�rio autenticado
interface User {
    id: string;         // Identificador �nico do usu�rio no Supabase
    name: string;       // Nome do usu�rio
    email?: string;     // E-mail do usu�rio (opcional, dependendo da autentica��o)
    metadata?: UserMetadata; // Metadados associados ao usu�rio
}

// Defini��o da store de autentica��o
export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false as boolean,  // Estado de autentica��o (true se o usu�rio estiver logado)
        user: null as User | null,     // Armazena as informa��es do usu�rio autenticado
    }),

    getters: {
        // Retorna o nome do usu�rio ou um valor padr�o caso n�o esteja autenticado
        userName: (state) => state.user?.name || 'Usu�rio An�nimo',
    },

    actions: {
        /**
         * Inicializa a autentica��o ao carregar a aplica��o.
         * Verifica se h� uma sess�o ativa no Supabase e atualiza o estado da store.
         * Tamb�m monitora mudan�as de sess�o automaticamente.
         */
        async initAuth() {
            try {
                // Tenta obter a sess�o de usu�rio armazenada
                const response = await supabase.auth.getSession();

                if (response?.data?.session) {
                    // Se houver uma sess�o ativa, extrai os dados do usu�rio
                    const user = response.data.session.user;
                    this.login({
                        id: user.id,
                        name: user.user_metadata?.name || 'Usu�rio An�nimo',
                        email: user.email,
                        metadata: user.user_metadata,
                    });
                } else {
                    // Se n�o houver sess�o, faz logout para limpar o estado
                    this.logout();
                }

                // Monitora mudan�as no estado de autentica��o (ex.: login/logout)
                supabase.auth.onAuthStateChange(async (event, session) => {
                    if (session) {
                        const user = session.user;
                        this.login({
                            id: user.id,
                            name: user.user_metadata?.name || 'Usu�rio An�nimo',
                            email: user.email,
                            metadata: user.user_metadata,
                        });
                    } else {
                        this.logout();
                    }
                });

            } catch (error) {
                console.error('Erro ao inicializar autentica��o:', error);
                this.logout();
            }
        },

        /**
         * Faz login do usu�rio e armazena as informa��es na store e no localStorage.
         * @param user - Objeto contendo as informa��es do usu�rio autenticado.
         */
        async login(user: User) {
            this.isLoggedIn = true;
            this.user = user;

            // Armazena o usu�rio localmente para persist�ncia de sess�o
            localStorage.setItem('user', JSON.stringify(user));

            console.log('Usu�rio logado com sucesso:', user);
        },

        /**
         * Faz logout do usu�rio, limpando o estado local e chamando o Supabase.
         */
        async logout() {
            this.isLoggedIn = false;
            this.user = null;

            // Remove os dados armazenados localmente
            localStorage.removeItem('user');

            // Encerra a sess�o no Supabase
            await supabase.auth.signOut();

            console.log('Usu�rio deslogado.');
        },
    },
});
