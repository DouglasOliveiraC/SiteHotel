// server.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { supabase } from './src/utils/supabase-server.js';


const app = express();
const PORT = 5000;

app.get('/api/users', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }  
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
