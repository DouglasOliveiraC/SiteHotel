// Importa a biblioteca oficial do Supabase para criar clientes de acesso ao banco de dados e autenticação
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase: URL e chave de autenticação (definidas no .env e expostas pelo Vite)
// A URL identifica o projeto do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// A chave anônima (anon key) fornece acesso seguro ao Supabase com base nas políticas configuradas
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Variáveis de ambiente do Supabase não definidas!');
}

// Criação do cliente Supabase com configuração customizada para o auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Habilita a persistência da sessão no navegador (os tokens serão salvos automaticamente no storage)
        persistSession: true,
        // Substitui o comportamento padrão do Navigator LockManager por uma função vazia (noop)
        // Isso elimina erros causados por conflitos no gerenciamento de bloqueios em navegadores incompatíveis
        storage: localStorage, // Define localStorage como armazenamento
        autoRefreshToken: true, // Renova o token automaticamente quando necessário
        detectSessionInUrl: true, //Garante que o login via URL é tratado corretamente
        lock: () => { },
    },

});
