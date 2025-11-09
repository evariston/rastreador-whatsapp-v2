// rastreador.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Caminho para cache de autenticação
const cachePath = path.join(__dirname, '.wwebjs_cache');
if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
}

// Caminho para o QR Code PNG
const qrImagePath = path.join(__dirname, 'qrcode.png');

// Servidor simples para health check
app.get('/', (req, res) => {
    res.send('✅ Servidor rastreador WhatsApp ativo e rodando.');
});

app.get('/healthz', (req, res) => res.send('OK'));

// Servir QR Code PNG
app.get('/qrcode.png', (req, res) => {
    if (fs.existsSync(qrImagePath)) {
        res.sendFile(qrImagePath);
    } else {
        res.status(404).send('QR Code ainda não gerado.');
    }
});

// Criação do cliente WhatsApp
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

// Evento QR Code: gera PNG e loga URL
client.on('qr', async (qr) => {
    try {
        await qrcode.toFile(qrImagePath, qr, { type: 'png', width: 300 });
        console.clear();
        console.log('📱 QR Code gerado em PNG. Abra no navegador do celular:');
        console.log(`https://rastreador-whatsapp-v2.onrender.com/qrcode.png`);
    } catch (err) {
        console.error('Erro ao gerar QR Code PNG:', err);
    }
});

// Evento pronto
client.on('ready', () => {
    console.clear();
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('WhatsApp conectado e rastreador ativo.');
});

// Evento mensagem
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === 'ping') {
        msg.reply('🏓 Pong! Servidor ativo.');
    }
});

// Inicializa cliente
client.initialize();

// Inicializa servidor
app.listen(PORT, () => console.log(`🌐 Servidor web ativo na porta ${PORT}`));
