// rastreador.js
// Sistema de rastreamento via WhatsApp Web com QR Code pequeno e logs limpos.
// Versão estável 2.0.0 — QR otimizado (small: true), autenticação persistente, e inicialização direta.

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('✅ Servidor rastreador WhatsApp ativo e rodando.');
});

// Criação do cliente com cache de autenticação local
const client = new Client({
  authStrategy: new LocalAuth(),
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

// Exibe o QR Code de forma compacta
client.on('qr', (qr) => {
  console.clear();
  console.log('📱 Escaneie o QR Code abaixo (modo pequeno):');
  qrcode.generate(qr, { small: true });
});

// Confirmação de login bem-sucedido
client.on('ready', () => {
  console.clear();
  console.log('✅ Conexão estabelecida com sucesso!');
  console.log('WhatsApp conectado e rastreador ativo.');
});

// Lida com mensagens recebidas (personalize à vontade)
client.on('message', async (msg) => {
  if (msg.body.toLowerCase() === 'ping') {
    msg.reply('🏓 Pong! Servidor ativo.');
  }
});

// Inicializa cliente
client.initialize();

// Servidor Express (Render health check)
app.get('/healthz', (req, res) => res.send('OK'));
app.listen(PORT, () => console.log(`🌐 Servidor web ativo na porta ${PORT}`));
