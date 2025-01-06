// src/stores/auth.ts
import { defineStore } from 'pinia';
import { supabase } from '@/utils/supabase-client';

/**
 * Store respons�vel pela autentica��o e gerenciamento de estado do usu�rio.
 * Implementa m�todos de login e logout, e armazena o estado de autentica��o.
 */

interface User {
    id: string;        // Identificador �nico do usu�rio
    name: string;      // Nome do usu�rio
    email?: string;    // Campo opcional para email do usu�rio
    // Adicionar outros campos conforme a necessidade do projeto
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false as boolean, // Indica se o usu�rio est� autenticado
        user: null as User | null,    // Armazena as informa��es do usu�rio logado
    }),
    actions: {
        /**
         * Realiza o login do usu�rio, salvando os dados na store.
         * 
         * @param user - Objeto contendo as informa��es do usu�rio.
         */
        login(user: User) {
            this.isLoggedIn = true;
            this.user = user; // Salva as informa��es do usu�rio logado
        },

        /**
         * Realiza o logout do usu�rio, limpando os dados da store.
         */
        logout() {
            this.isLoggedIn = false;
            this.user = null; // Limpa as informa��es do usu�rio ao sair
        },

        /**
         * Recupera o usu�rio autenticado do Supabase e atualiza a store.
         * Garante que o estado de autentica��o est� sincronizado.
         */
        async fetchUser() {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                    console.error('Erro ao recuperar usu�rio autenticado:', error.message);
                    this.logout(); // Desloga em caso de erro ao recuperar o usu�rio
                } else if (user) {
                    this.login({
                        id: user.id, // id � tipo string
                        name: user.user_metadata.name || 'Usu�rio An�nimo',
                        email: user.email,
                    });
                }
            } catch (err) {
                console.error('Erro inesperado ao buscar usu�rio:', err);
                this.logout(); // Limpa estado em caso de erro inesperado
            }
        },
    },
});
