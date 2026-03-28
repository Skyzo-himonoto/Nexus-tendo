import config from '../../../config.js';
import moment from 'moment-timezone';

export default async function owner(context) {
  const { sock, sender, isOwner, prefix } = context;
  
  const usedPrefix = prefix || config.prefix;
  const ownerNumber = config.getOwnerNumber();
  const botNumber = config.getBotNumber() || 'Belum terhubung';
  
  if (!isOwner) {
    const text = `╔══════════════════════════════════════╗
║            *OWNER INFO*                ║
╠══════════════════════════════════════╣
║  🤖 *Bot:* ${config.botName}
║  📱 *Bot Number:* @${botNumber}
║  👑 *Owner:* @${ownerNumber}
║
║  📌 *Hubungi Owner untuk:*
║  • Laporan bug • Request fitur
║  • Sewa bot • Premium
║
║  🔗 wa.me/${ownerNumber}
╚══════════════════════════════════════╝`;
    return await sock.sendMessage(sender, { text, mentions: [`${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`] });
  }
  
  const text = `╔══════════════════════════════════════╗
║          *OWNER MENU*                  ║
╠══════════════════════════════════════╣
║  🤖 *Bot:* ${config.botName}
║  📱 *Bot Number:* @${botNumber}
║  👑 *Owner:* ${config.ownerName} (@${ownerNumber})
║
║  🔧 *Command Owner:*
║  ✦ ${usedPrefix}exec <code>
║  ✦ ${usedPrefix}eval <code>
║  ✦ ${usedPrefix}bc <pesan>
║  ✦ ${usedPrefix}addprem <nomor> <hari>
║  ✦ ${usedPrefix}delprem <nomor>
║  ✦ ${usedPrefix}listprem
║  ✦ ${usedPrefix}restart
║  ✦ ${usedPrefix}backup
║  ✦ ${usedPrefix}sewa <durasi> <group>
║
╚══════════════════════════════════════╝`;
  
  await sock.sendMessage(sender, { text, mentions: [`${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`] });
}
