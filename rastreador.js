// rastreador.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Garante que o cache exista (já copiado)
const cachePath = path.join(__dirname, '.wwebjs_auth');
if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
}

// Pasta para salvar QR Code PNG
const qrPath = path.join(__dirname, 'qrcode.png');

// Rota padrão
app.get('/', (req, res) => {
    res.send('✅ Servidor rastreador WhatsApp ativo e rodando.');
});

// Criação do cliente com sessão persistente
const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'default', dataPath: cachePath }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
            '--single-process'
        ]
    }
});

// QR Code em PNG (somente se não houver sessão)
client.on('qr', async (qr) => {
    try {
        await qrcode.toFile(qrPath, qr, { type: 'png' });
        console.clear();
        console.log(`📱 QR Code gerado em PNG: ${qrPath}`);
        console.log('Abra o PNG e escaneie com seu celular.');
    } catch (err) {
        console.error('Erro ao gerar QR Code PNG:', err);
    }
});

// Confirmação de login bem-sucedido
client.on('ready', () => {
    console.clear();
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('WhatsApp conectado e rastreador ativo.');
});

// Resposta a mensagens
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === 'ping') {
        msg.reply('🏓 Pong! Servidor ativo.');
    }
});

// Inicializa cliente
client.initialize();

// Health check para Render
app.get('/healthz', (req, res) => res.send('OK'));
app.listen(PORT, () => console.log(`🌐 Servidor web ativo na porta ${PORT}`));
