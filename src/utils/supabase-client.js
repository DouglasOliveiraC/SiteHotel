// Importa a biblioteca oficial do Supabase para criar clientes de acesso ao banco de dados e autenticação
import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase: URL e chave de autenticação (definidas no .env e expostas pelo Vite)
// A URL identifica o projeto do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// A chave anônima (anon key) fornece acesso seguro ao Supabase com base nas políticas configuradas
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Criação do cliente Supabase
// O objeto de configuração personalizado desativa o uso do Navigator LockManager para evitar problemas no navegador
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Habilita a persistência da sessão no navegador (os tokens serão salvos automaticamente no storage)
        persistSession: true,

        // Substitui o comportamento padrão do Navigator LockManager por uma função vazia (noop)
        // Isso elimina erros causados por conflitos no gerenciamento de bloqueios em navegadores incompatíveis
        lock: () => { },
    },
});
