import config from '../../config.js';

export default async function donasi(context) {
  const { sock, sender } = context;
  
  const ownerNumber = config.getOwnerNumber();
  const botNumber = config.getBotNumber() || 'Belum terhubung';
  
  const text = `╔══════════════════════════════════════╗
║        *SUPPORT DEVELOPMENT*            ║
╠══════════════════════════════════════╣
║
║  💰 *Donasi / Support*
║  
║  🏦 *Bank BCA*
║    // tulis nomor a.n nama lu
║
║  🏦 *Bank Mandiri*
║    // tulis nomor a.n nama lu
║
║  💳 *DANA / OVO*
║    Dana : 085715818953
║
║  🌟 *Saweria*
║    https://saweria.co/username
║
║  💝 *Trakteer*
║    https://trakteer.id/username
║
╠══════════════════════════════════════╣
║  🤖 *Bot:* ${config.botName}
║  📱 *Bot Number:* @${botNumber}
║  👑 *Owner:* @${ownerNumber}
║  📞 *Kontak:* wa.me/${ownerNumber}
║
║  🤝 *Terima kasih atas dukungannya!*
║  Setiap donasi membantu bot tetap aktif
║  dan pengembangan fitur baru.
║
╚══════════════════════════════════════╝`;
  
  const mentions = [`${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`];
  
  await sock.sendMessage(sender, {
    text: text,
    mentions: mentions
  });
}
