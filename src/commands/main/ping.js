import config from '../../../config.js';

export default async function ping(context) {
  const { sock, sender } = context;
  
  const start = Date.now();
  await sock.sendMessage(sender, { text: '🕐 Tunggu sayang' });
  const pingTime = Date.now() - start;
  const botNumber = config.getBotNumber() || 'Belum terhubung';
  const ownerNumber = config.getOwnerNumber();
  
  await sock.sendMessage(sender, {
    text: `💥 *PONG!*\n\n📡 *Latensi:* ${pingTime}ms\n⏱️ *Timestamp:* ${new Date().toLocaleString('id-ID')}\n🤖 *Bot:* ${config.botName}\n📱 *Bot Number:* @${botNumber}\n👑 *Owner:* @${ownerNumber}`,
    mentions: [`${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`]
  });
}
