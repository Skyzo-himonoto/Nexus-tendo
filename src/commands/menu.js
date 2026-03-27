import config from '../../config.js';
import moment from 'moment-timezone';

export default async function menu(context) {
  const { sock, sender, m, isGroup, isOwner, prefix } = context;
  
  const usedPrefix = prefix || config.prefix;
  const time = moment().tz(config.timezone || 'Asia/Jakarta').format('HH:mm:ss');
  const date = moment().tz(config.timezone || 'Asia/Jakarta').format('DD/MM/YYYY');
  const senderNumber = sender.split('@')[0];
  const ownerNumber = config.getOwnerNumber();
  const botNumber = config.getBotNumber() || 'Belum terhubung';
  const ownerLink = `wa.me/${ownerNumber}`;
  const botLink = `wa.me/${botNumber}`;
  
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
║                                                                ║
║  Hai @${senderNumber}, selamat datang di *${config.botName}*!  ║
║  Ketik tombol di bawah untuk akses fitur.                      ║
║                                                                ║
║  🌟 *Fitur Populer:*                                           ║
║  • 🎨 Stiker     → Buat stiker dari media                     ║
║  • 🤖 AI Chat    → Chat dengan AI Gemini                      ║
║  • 📥 Downloader → Download YouTube, IG, TikTok               ║
║  • 🎮 Game       → Main game tebak gambar, tebak kata, dll    ║
║                                                                ║
╠══════════════════════════════════════════════════════════════╣
║  📞 *Hubungi Owner:* ${ownerLink}                              ║
║  💡 Ketik *${usedPrefix}allmenu* untuk semua kategori          ║
╚══════════════════════════════════════════════════════════════╝`;
  
  const buttons = [
    { index: 1, quickReplyButton: { displayText: '🌟 MENU REKOMENDASI', id: `${usedPrefix}recom` } },
    { index: 2, quickReplyButton: { displayText: '📋 ALL MENU', id: `${usedPrefix}allmenu` } },
    { index: 3, quickReplyButton: { displayText: '🎨 BUAT STIKER', id: `${usedPrefix}sticker` } },
    { index: 4, quickReplyButton: { displayText: '🤖 AI CHAT', id: `${usedPrefix}ai` } },
    { index: 5, quickReplyButton: { displayText: '👑 HUBUNGI OWNER', id: `${usedPrefix}owner` } }
  ];
  
  const mentions = [sender, `${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`];
  
  await sock.sendMessage(sender, {
    text: menuText,
    footer: `⚡ ${config.botName} v${config.version} | Klik tombol di bawah`,
    templateButtons: buttons,
    mentions: mentions
  });
}
