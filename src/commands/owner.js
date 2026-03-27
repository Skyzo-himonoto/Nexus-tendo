import config from '../../config.js';
import fs from 'fs-extra';
import path from 'path';
import moment from 'moment-timezone';

export default async function owner(context) {
  const { sock, sender, m, isOwner, args, prefix } = context;
  
  const usedPrefix = prefix || config.prefix;
  const ownerNumber = config.getOwnerNumber();
  const ownerNumbers = config.getOwnerNumbers();
  const botNumber = config.getBotNumber() || 'Belum terhubung';
  const time = moment().tz(config.timezone).format('HH:mm:ss');
  const date = moment().tz(config.timezone).format('DD/MM/YYYY');

  const ownerLinks = ownerNumbers.map(num => `wa.me/${num}`).join('\n');
  
  if (!isOwner) {
    const text = `╔══════════════════════════════════════╗
║            *OWNER INFO*                ║
╠══════════════════════════════════════╣
║  🤖 *Bot:* ${config.botName}
║  📱 *Bot Number:* @${botNumber}
║  👑 *Owner Name:* ${config.ownerName}
║  📞 *Owner Number:* @${ownerNumber}
║
║  📌 *Hubungi Owner untuk:*
║  • Laporan bug
║  • Request fitur
║  • Sewa bot
║  • Premium
║
║  🔗 *Klik link di bawah:*
║  wa.me/${ownerNumber}
║
╠══════════════════════════════════════╣
║  💡 Gunakan *${usedPrefix}donasi* untuk support
╚══════════════════════════════════════╝`;
    
    const mentions = [sender, `${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`];
    
    return await sock.sendMessage(sender, {
      text: text,
      mentions: mentions
    });
  }
  
  const text = `╔══════════════════════════════════════╗
║          *OWNER MENU*                  ║
╠══════════════════════════════════════╣
║  📅 ${date}              ⏰ ${time}
║  🤖 *Bot:* ${config.botName}
║  📱 *Bot Number:* @${botNumber}
║  👑 *Owner:* ${config.ownerName} (@${ownerNumber})
║
║  🔧 *Command Owner:*
║  ✦ ${usedPrefix}exec <code>
║  ✦ ${usedPrefix}eval <code>
║  ✦ ${usedPrefix}setprefix <prefix>
║  ✦ ${usedPrefix}bc <pesan>
║  ✦ ${usedPrefix}addprem <nomor> <hari>
║  ✦ ${usedPrefix}delprem <nomor>
║  ✦ ${usedPrefix}listprem
║  ✦ ${usedPrefix}restart
║  ✦ ${usedPrefix}cleartmp
║  ✦ ${usedPrefix}backup
║  ✦ ${usedPrefix}get <url>
║  ✦ ${usedPrefix}sewa <durasi> <group>
║
╠══════════════════════════════════════╣
║  📊 *Statistik:*
║  👥 Total Owner: ${ownerNumbers.length}
║  🤖 Bot Status: ✅ Online
╚══════════════════════════════════════╝`;
  
  const mentions = [`${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`];
  
  await sock.sendMessage(sender, {
    text: text,
    mentions: mentions
  });
}
