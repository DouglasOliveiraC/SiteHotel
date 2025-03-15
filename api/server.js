import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('dist'));

const PORT = process.env.PORT || 3000;

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Webhook para notificações do PayPal
app.post('/webhook/paypal', async (req, res) => {
    console.log('Notificação recebida do PayPal:', req.body);

    // Extrai o custom_id da purchase_unit
    const purchaseUnit = req.body.resource?.purchase_units?.[0];
    if (!purchaseUnit || !purchaseUnit.custom_id) {
        return res.status(400).json({ error: 'Dados personalizados ausentes' });
    }

    let reservationData;
    try {
        reservationData = JSON.parse(purchaseUnit.custom_id);
    } catch (error) {
        console.error('Erro ao parsear custom_id:', error);
        return res.status(400).json({ error: 'Formato dos dados inválido' });
    }

    // Extrai os dados essenciais enviados no customData
    const { reservation_id, user_id, check_in, check_out, room_id } = reservationData;
    if (!reservation_id || !user_id || !check_in || !check_out || !room_id) {
        return res.status(400).json({ error: 'Dados de reserva inválidos' });
    }

    // Obtém o número da transação do PayPal
    const transaction_number = req.body.resource?.id;

    try {
        // Atualiza a reserva pendente para confirmada no Supabase
        const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/reservations?id=eq.${reservation_id}`, {
            method: 'PATCH',
            headers: {
                'apikey': process.env.SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payment_status: "completed",
                status: "confirmada",
                transaction_number: transaction_number
            })
        });

        const result = await response.json();
        console.log('Reserva atualizada no Supabase:', result);

        return res.status(200).json({ message: 'Reserva confirmada', reservation: result });
    } catch (error) {
        console.error('Erro ao atualizar reserva no Supabase:', error);
        return res.status(500).json({ error: 'Erro interno' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
