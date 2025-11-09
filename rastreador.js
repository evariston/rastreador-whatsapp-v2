import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// Evento: QR gerado
client.on("qr", (qr) => {
  console.clear();
  console.log("📱 Escaneie este QR Code para conectar ao WhatsApp:");
  // QR compacto e nítido
  qrcode.generate(qr, { small: true });
});

// Evento: Cliente autenticado
client.on("authenticated", () => {
  console.log("✅ Autenticado com sucesso!");
});

// Evento: Cliente pronto
client.on("ready", () => {
  console.log("🚀 Rastreador conectado e pronto!");
});

// Evento: Mensagem recebida
client.on("message", (message) => {
  console.log(`💬 Mensagem de ${message.from}: ${message.body}`);
});

client.initialize();
