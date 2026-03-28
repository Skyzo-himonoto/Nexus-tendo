import config from '../../../config.js';

export default async function donasi(context) {
  const { sock, sender } = context;
  const ownerNumber = config.getOwnerNumber();
  const botNumber = config.getBotNumber() || 'Belum terhubung';
  
  const text = `╔══════════════════════════════════════╗
║        *SUPPORT DEVELOPMENT*            ║
╠══════════════════════════════════════╣
║  💰 *Donasi / Support*
║  
║  💳 *DANA / OVO / GOPAY*
║    ${config.ownerNumbers[0] || 'Dana: 085715818953'}
║
║  🌟 *Saweria*
║    https://saweria.co/nexus
║
╠══════════════════════════════════════╣
║  🤖 *Bot:* ${config.botName}
║  📱 *Bot Number:* @${botNumber}
║  👑 *Owner:* @${ownerNumber}
║
║  🤝 *Terima kasih atas dukungannya!*
╚══════════════════════════════════════╝`;
  
  await sock.sendMessage(sender, { text, mentions: [`${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`] });
}
