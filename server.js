import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
app.use(express.static('dist'));

const PORT = process.env.PORT || 3000;

app.get('*', (req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
});

// Rota para escutar notificações do PayPal
app.post('/webhook/paypal', async (req, res) => {
    console.log('Notificação recebida do PayPal:', req.body);

    const { user_id, check_in, check_out, room_id } = req.body;

    if (!user_id || !check_in || !check_out || !room_id) {
        return res.status(400).json({ error: 'Dados inválidos' });
    }

    try {
        // Enviar os dados para o Supabase
        const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/reservations`, {
            method: 'POST',
            headers: {
                'apikey': process.env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id,
                check_in,
                check_out,
                room_id,
                payment_status: "completed",
                status: "confirmada"
            })
        });

        const result = await response.json();
        console.log('Reserva salva no Supabase:', result);

        return res.status(200).json({ message: 'Reserva confirmada' });

    } catch (error) {
        console.error('Erro ao salvar reserva no Supabase:', error);
        return res.status(500).json({ error: 'Erro interno' });
    }
});

app.listen(PORT, () => {
    console.log(` Servidor rodando na porta ${PORT}`);
});
