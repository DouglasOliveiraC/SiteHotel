// src/stores/auth.ts
import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabase-client';

/**
 * Store responsável pela autenticação e gerenciamento de estado do usuário.
 * Implementa métodos de login e logout, e armazena o estado de autenticação.
 */

interface User {
    id: string;        // Identificador único do usuário
    name: string;      // Nome do usuário
    email?: string;    // Campo opcional para email do usuário
    // Adicionar outros campos conforme a necessidade do projeto
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false as boolean, // Indica se o usuário está autenticado
        user: null as User | null,    // Armazena as informações do usuário logado
    }),
    actions: {
        /**
         * Realiza o login do usuário, salvando os dados na store.
         * 
         * @param user - Objeto contendo as informações do usuário.
         */
        login(user: User) {
            this.isLoggedIn = true;
            this.user = user; // Salva as informações do usuário logado
        },

        /**
         * Realiza o logout do usuário, limpando os dados da store.
         */
        logout() {
            this.isLoggedIn = false;
            this.user = null; // Limpa as informações do usuário ao sair
        },

        /**
         * Recupera o usuário autenticado do Supabase e atualiza a store.
         * Garante que o estado de autenticação está sincronizado.
         */
        async fetchUser() {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                    console.error('Erro ao recuperar usuário autenticado:', error.message);
                    this.logout(); // Desloga em caso de erro ao recuperar o usuário
                } else if (user) {
                    this.login({
                        id: user.id, // id é tipo string
                        name: user.user_metadata.name || 'Usuário Anônimo',
                        email: user.email,
                    });
                }
            } catch (err) {
                console.error('Erro inesperado ao buscar usuário:', err);
                this.logout(); // Limpa estado em caso de erro inesperado
            }
        },
    },
});
