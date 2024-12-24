import { defineStore } from 'pinia';

// Definiremos uma interface para o usuário, adicionando os campos necessários
interface User {
    id: number;
    name: string;
    // Adicionar outros campos conforme necessário
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false as boolean,
        user: null as User | null,
    }),
    actions: {
        login(user: User) {
            this.isLoggedIn = true;
            this.user = user; // Salvar informações do usuário
        },
        logout() {
            this.isLoggedIn = false;
            this.user = null;
        },
    },
});
