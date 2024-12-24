import { defineStore } from 'pinia';

// Definiremos uma interface para o usu�rio, adicionando os campos necess�rios
interface User {
    id: number;
    name: string;
    // Adicionar outros campos conforme necess�rio
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false as boolean,
        user: null as User | null,
    }),
    actions: {
        login(user: User) {
            this.isLoggedIn = true;
            this.user = user; // Salvar informa��es do usu�rio
        },
        logout() {
            this.isLoggedIn = false;
            this.user = null;
        },
    },
});
