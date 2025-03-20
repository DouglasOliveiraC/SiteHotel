import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFound from '@/views/NotFound.vue';
import AboutView from '@/views/AboutView.vue';
import TermsOfUse from '@/views/TermsOfUse.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import ContactView from '@/views/ContactView.vue';
import AuthCallback from '@/views/AuthCallback.vue';
import { useAuthStore } from '@/stores/auth';

// Rotas protegidas por autenticação
const requireAuth = async (to, from) => {
    const authStore = useAuthStore();

    // Inicializa a autenticação, se necessário
    if (!authStore.isLoggedIn) {
        await authStore.initAuth();
    }

    // Se não estiver logado, redireciona para a Home com alerta
    if (!authStore.isLoggedIn) {
        alert('Você precisa estar logado para acessar essa página.');
        return { name: 'HomeView' };
    }

    return true;
};

const routes = [
    { path: '/', name: 'HomeView', component: HomeView },
    { path: '/about', name: 'About', component: AboutView },
    { path: '/terms-of-use', name: 'TermsOfUse', component: TermsOfUse },
    { path: '/privacy', name: 'PrivacyPolicy', component: PrivacyPolicy },
    { path: '/contact', name: 'ContactView', component: ContactView },
    { path: '/auth/callback', name: 'AuthCallback', component: AuthCallback },

    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        beforeEnter: requireAuth, // Protege a rota do perfil
    },

    {
        path: '/reservations',
        name: 'Reservations',
        component: () => import('@/views/Reservations.vue'),
        beforeEnter: requireAuth, // Protege a rota de reservas gerais
    },

    {
        path: '/my-reservations',
        name: 'MyReservations',
        component: () => import('@/views/MyReservations.vue'),
        beforeEnter: requireAuth, // Protege a rota das reservas do usuário logado
    },

    {
        path: '/room/:id',
        name: 'RoomDetailed',
        component: () => import('@/components/RoomDetailed.vue')
    },

    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
