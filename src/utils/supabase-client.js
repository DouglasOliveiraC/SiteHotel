// Importa a biblioteca oficial do Supabase para criar clientes de acesso ao banco de dados e autentica��o
import { createClient } from '@supabase/supabase-js';

// Configura��es do Supabase: URL e chave de autentica��o (definidas no .env e expostas pelo Vite)
// A URL identifica o projeto do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// A chave an�nima (anon key) fornece acesso seguro ao Supabase com base nas pol�ticas configuradas
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Verifica se as vari�veis de ambiente est�o definidas
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Vari�veis de ambiente do Supabase n�o definidas!');
}

// Cria��o do cliente Supabase com configura��o customizada para o auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Habilita a persist�ncia da sess�o no navegador (os tokens ser�o salvos automaticamente no storage)
        persistSession: true,
        // Substitui o comportamento padr�o do Navigator LockManager por uma fun��o vazia (noop)
        // Isso elimina erros causados por conflitos no gerenciamento de bloqueios em navegadores incompat�veis
        storage: localStorage, // Define localStorage como armazenamento
        autoRefreshToken: true, // Renova o token automaticamente quando necess�rio
        detectSessionInUrl: true, //Garante que o login via URL � tratado corretamente
        lock: () => { },
    },

});
