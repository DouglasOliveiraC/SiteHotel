// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFound from '@/views/NotFound.vue'; 
import AboutView from '@/views/AboutView.vue';
import TermsOfUse from '@/views/TermsOfUse.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import ContactView from '@/views/ContactView.vue';




const routes = [
    { path: '/', name: 'HomeView', component: HomeView },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFound.vue') },
    { path: '/about', name: 'About', component: AboutView },
    { path: '/terms-of-use', name: 'TermsOfUse', component: TermsOfUse },
    { path: '/privacy', name: 'PrivacyPolicy', component: PrivacyPolicy },
    { path: '/contact', name: 'ContactView', component: ContactView },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;