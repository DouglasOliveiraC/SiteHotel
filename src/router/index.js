// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFound from '@/views/NotFound.vue'; 
import AboutView from '@/views/AboutView.vue';
import TermsOfUse from '@/views/TermsOfUse.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import ContactView from '@/views/ContactView.vue';
import AuthCallback from '@/views/AuthCallback.vue';
import { useAuthStore } from '@/stores/auth';
import Profile from '@/views/Profile.vue';




const routes = [
    { path: '/', name: 'HomeView', component: HomeView },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue') },
    { path: '/about', name: 'About', component: AboutView },
    { path: '/terms-of-use', name: 'TermsOfUse', component: TermsOfUse },
    { path: '/privacy', name: 'PrivacyPolicy', component: PrivacyPolicy },
    { path: '/contact', name: 'ContactView', component: ContactView },
    
    { path: '/auth/callback', name: 'AuthCallback', component: AuthCallback },
    //{ path: '/reservations', name: 'ReservationsView', component: () => import('@/views/Reservations.vue') },

    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        beforeEnter: async (to, from) => {
            const authStore = useAuthStore();

            if (!authStore.isLoggedIn) {
                await authStore.initAuth();
            }

            if (!authStore.isLoggedIn) {
                // Redireciona para Home
                return { name: 'HomeView' };
            }

            // Se estiver logado, libera
            return true;
        },
    },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;