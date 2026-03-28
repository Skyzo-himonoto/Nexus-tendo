import config from '../../../config.js';
import moment from 'moment-timezone';
import db from '../../../lib/database/index.js';

export default async function menu(context) {
  const { sock, sender, m, prefix } = context;
  
  const usedPrefix = prefix || config.prefix;
  const time = moment().tz(config.timezone).format('HH:mm:ss');
  const date = moment().tz(config.timezone).format('DD/MM/YYYY');
  const senderNumber = sender.split('@')[0];
  const ownerNumber = config.getOwnerNumber();
  const botNumber = config.getBotNumber() || 'Belum terhubung';
  const ownerLink = `wa.me/${ownerNumber}`;
  
  const menuText = `╔══════════════════════════════════════════════════════════╗
║              ✨ *${config.botName}* ✨                       ║
║           WhatsApp Bot Multi-Device                          ║
╠══════════════════════════════════════════════════════════════╣
║  📅 ${date}                          ⏰ ${time}              ║
║  🤖 Bot    : ${config.botName}                               ║
║  📦 Versi  : ${config.version}                               ║
║  🎯 Prefix : ${usedPrefix}                                   ║
║  👑 Owner  : @${ownerNumber}                                 ║
║  📱 Bot    : @${botNumber}                                   ║
╠══════════════════════════════════════════════════════════════╣
║  Hai @${senderNumber}, selamat datang di *${config.botName}*!  ║
║                                                                ║
║  🌟 *Fitur Populer:*                                           ║
║  • 🎨 Stiker     → ${usedPrefix}sticker                       ║
║  • 🤖 AI Chat    → ${usedPrefix}ai [pesan]                    ║
║  • 📥 Downloader → ${usedPrefix}ytmp3 [url]                   ║
║  • 🎮 Game       → ${usedPrefix}game tebakgambar              ║
║                                                                ║
╠══════════════════════════════════════════════════════════════╣
║  📞 *Hubungi Owner:* ${ownerLink}                              ║
║  💡 Ketik *${usedPrefix}allmenu* untuk semua kategori          ║
╚══════════════════════════════════════════════════════════════╝`;
  
  const buttons = [
    { index: 1, quickReplyButton: { displayText: '📋 ALL MENU', id: `${usedPrefix}allmenu` } },
    { index: 2, quickReplyButton: { displayText: '🎨 BUAT STIKER', id: `${usedPrefix}sticker` } },
    { index: 3, quickReplyButton: { displayText: '🤖 AI CHAT', id: `${usedPrefix}ai` } },
    { index: 4, quickReplyButton: { displayText: '👑 OWNER', id: `${usedPrefix}owner` } }
  ];
  
  const mentions = [sender, `${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`];
  
  await sock.sendMessage(sender, {
    text: menuText,
    footer: `⚡ ${config.botName} v${config.version}`,
    templateButtons: buttons,
    mentions
  });
}
