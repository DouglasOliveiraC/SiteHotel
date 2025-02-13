import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa o router configurado
import { createPinia } from 'pinia'; // Importar o Pinia para monitorar estado do usuário
import { createHead } from '@unhead/vue'; // Importa o @vueuse/head para metadados
import { supabase } from './utils/supabase-client.js'; // Acesso ao banco de dados


const app = createApp(App);   // Cria a instância do app
const pinia = createPinia(); // Criar a instância do Pinia
const head = createHead();  // Criar a instância do unhead

app.use(router); // Usa o router
app.use(pinia); // Adicionar ao Vue o monitor de estado Pinia
app.use(head); // Adiciona o gerenciador de metadados (UTF-8)


console.log('[DEBUG] main.ts: Antes de montar o app');
app.mount('#app'); // Monta o app na div com id 'app' do index.html
console.log('[DEBUG] main.ts: Depois de montar o app');