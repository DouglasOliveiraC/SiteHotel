// server.js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Função para obter detalhes do pedido do PayPal
async function getOrderDetailsFromPayPal(orderId) {
    // Obter token de acesso do PayPal
    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en_US',
            'Authorization': `Basic ${Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_SECRET).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
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

// Webhook para notificações do PayPal
app.post('/webhook/paypal', async (req, res) => {
    console.log('Notificação recebida do PayPal:', JSON.stringify(req.body, null, 2));

    // Validar se o evento é do tipo CHECKOUT.ORDER.APPROVED e se o recurso existe
    if (!req.body.resource || req.body.event_type !== 'CHECKOUT.ORDER.APPROVED') {
        console.error('Webhook inválido ou evento não suportado');
        return res.status(400).json({ error: 'Webhook inválido ou evento não suportado' });
    }

    const paypalOrderId = req.body.resource.id;

    try {
        // Obter detalhes completos do pedido a partir da API do PayPal
        const orderDetails = await getOrderDetailsFromPayPal(paypalOrderId);
        console.log('Order details do PayPal:', JSON.stringify(orderDetails, null, 2));

        const purchaseUnit = orderDetails.purchase_units[0];
        const customId = purchaseUnit.custom_id;
        if (!customId) {
            console.error('custom_id não encontrado no pedido');
            return res.status(400).json({ error: 'Dados personalizados ausentes' });
        }

        // Interpretar os dados enviados no custom_id
        let reservationData;
        try {
            reservationData = JSON.parse(customId);
        } catch (error) {
            console.error('Erro ao parsear custom_id:', error);
            return res.status(400).json({ error: 'Formato dos dados inválido' });
        }

        const { reservation_id, user_id, check_in, check_out, room_id } = reservationData;
        if (!reservation_id || !user_id || !check_in || !check_out || !room_id) {
            console.error('Dados de reserva incompletos no custom_id');
            return res.status(400).json({ error: 'Dados de reserva inválidos' });
        }

        // Obter o número da transação: usa o primeiro capture se disponível ou o próprio order id
        const transaction_number =
            purchaseUnit.payments && purchaseUnit.payments.captures && purchaseUnit.payments.captures[0]
                ? purchaseUnit.payments.captures[0].id
                : paypalOrderId;

        // Atualizar a reserva pendente no Supabase para "confirmada"
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

// Endpoint para capturar o pedido do PayPal
app.post('/api/paypal/order/capture', async (req, res) => {
    const { orderID } = req.body;
    if (!orderID) {
        return res.status(400).json({ error: 'orderID é obrigatório' });
    }

    try {
        // Obter token de acesso do PayPal
        const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': `Basic ${Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_SECRET).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        if (!tokenResponse.ok) {
            throw new Error('Falha ao obter token do PayPal');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Chamar a API de captura do PayPal
        const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!captureResponse.ok) {
            const err = await captureResponse.text();
            throw new Error(err);
        }

        const captureData = await captureResponse.json();
        res.json(captureData);
    } catch (error) {
        console.error('Erro ao capturar o pedido:', error);
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
