const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// Inicializa o cliente WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true, // Deixa invisível no servidor Render
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Gera o QR Code no terminal para autenticação
client.on('qr', qr => {
  console.log('📱 Escaneie este QR Code com o WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// Quando estiver pronto
client.on('ready', () => {
  console.log('✅ Conexão estabelecida com sucesso!');
});

// Exemplo: resposta automática
client.on('message', async msg => {
  const texto = msg.body.toLowerCase();

  if (texto.includes('pedido')) {
    msg.reply('🔎 Estou rastreando seu pedido! Por favor, envie o número do pedido.');
  }

  if (texto.match(/\d{5,}/)) {
    const numero = texto.match(/\d{5,}/)[0];
    msg.reply(`✅ Seu pedido **${numero}** está em processamento.`);
  }
});

client.initialize();
