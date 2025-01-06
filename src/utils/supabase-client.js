// Importa a biblioteca oficial do Supabase para criar clientes de acesso ao banco de dados e autentica��o
import { createClient } from '@supabase/supabase-js';

// Configura��es do Supabase: URL e chave de autentica��o (definidas no .env e expostas pelo Vite)
// A URL identifica o projeto do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// A chave an�nima (anon key) fornece acesso seguro ao Supabase com base nas pol�ticas configuradas
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Cria��o do cliente Supabase
// O objeto de configura��o personalizado desativa o uso do Navigator LockManager para evitar problemas no navegador
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Habilita a persist�ncia da sess�o no navegador (os tokens ser�o salvos automaticamente no storage)
        persistSession: true,

        // Substitui o comportamento padr�o do Navigator LockManager por uma fun��o vazia (noop)
        // Isso elimina erros causados por conflitos no gerenciamento de bloqueios em navegadores incompat�veis
        lock: () => { },
    },
});
