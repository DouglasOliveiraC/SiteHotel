//server.js
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

    // Verificar se temos um recurso válido e se é um pedido aprovado
    if (!req.body.resource || req.body.event_type !== 'CHECKOUT.ORDER.APPROVED') {
        console.error('Webhook inválido ou evento não suportado');
        return res.status(400).json({ error: 'Webhook inválido ou evento não suportado' });
    }

    // Extrair o ID do pedido do PayPal
    const paypalOrderId = req.body.resource.id;

    // Obter as informações completas do pedido da API do PayPal para obter o custom_id
    try {
        // Aqui você precisa fazer uma chamada à API do PayPal para obter os detalhes completos do pedido
        // incluindo o custom_id que você está esperando
        const orderDetails = await getOrderDetailsFromPayPal(paypalOrderId);

        // Verificar se temos o custom_id
        const customId = orderDetails.purchase_units[0].custom_id;
        if (!customId) {
            console.error('Custom ID não encontrado no pedido');
            return res.status(400).json({ error: 'Dados personalizados ausentes' });
        }

        // Processar os dados do custom_id
        let reservationData;
        try {
            reservationData = JSON.parse(customId);
        } catch (error) {
            console.error('Erro ao parsear custom_id:', error);
            return res.status(400).json({ error: 'Formato dos dados inválido' });
        }

        // Extrair os dados essenciais enviados no customData
        const { reservation_id, user_id, check_in, check_out, room_id } = reservationData;
        if (!reservation_id || !user_id || !check_in || !check_out || !room_id) {
            return res.status(400).json({ error: 'Dados de reserva inválidos' });
        }

        // Obtém o número da transação do PayPal
        const transaction_number = req.body.resource.id;

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

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erro ao atualizar reserva:', response.status, errorData);
            return res.status(500).json({ error: 'Erro ao atualizar reserva' });
        }

        console.log('Reserva atualizada com sucesso:', reservation_id);
        return res.status(200).json({ message: 'Reserva confirmada com sucesso' });
    } catch (error) {
        console.error('Erro ao processar webhook:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Função para obter detalhes do pedido do PayPal
async function getOrderDetailsFromPayPal(orderId) {
    // Obter token de acesso do PayPal
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en_US',
            'Authorization': `Basic ${Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_SECRET).toString('base64')}`
        },
        body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
        throw new Error('Falha ao obter token do PayPal');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Obter detalhes do pedido
    const orderResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!orderResponse.ok) {
        throw new Error('Falha ao obter detalhes do pedido do PayPal');
    }

    return await orderResponse.json();
}

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
