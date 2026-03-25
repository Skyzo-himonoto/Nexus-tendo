const config = require('../../config');
const moment = require('moment-timezone');

async function menuCommand(sock, sender, prefix) {
    const usedPrefix = prefix || config.prefix;
    const time = moment().tz(config.timezone).format('HH:mm:ss');
    const date = moment().tz(config.timezone).format('DD/MM/YYYY');
    const senderName = sender.split('@')[0];
    
    const menuText = `╔══════════════════════════════════════════════════════════╗
║              ✨ *${config.botName}* ✨                      ║
║           WhatsApp Bot Multi-Device                         ║
╠══════════════════════════════════════════════════════════════╣
║  📅 ${date}                          ⏰ ${time}              ║
║  🤖 Bot    : ${config.botName}                               ║
║  📦 Versi  : ${config.version}                               ║
║  🎯 Prefix : ${usedPrefix}                                   ║
║  👑 Owner  : @${config.getOwnerNumber()}                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Hai @${senderName}, selamat datang di *${config.botName}*!  ║
║  Ketik tombol di bawah untuk akses fitur.                    ║
║                                                              ║
║  🌟 *Fitur Populer:*                                         ║
║  • 🎨 Stiker     → Buat stiker dari media                   ║
║  • 🤖 AI Chat    → Chat dengan AI Gemini                    ║
║  • 📥 Downloader → Download YouTube, IG, TikTok             ║
║  • 🎮 Game       → Main suit, slot, tebak gambar            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  💡 Ketik *${usedPrefix}allmenu* untuk semua kategori          ║
╚══════════════════════════════════════════════════════════════╝`;
    
    const buttons = [
        { index: 1, quickReplyButton: { displayText: '🌟 MENU REKOMENDASI', id: `${usedPrefix}recom` } },
        { index: 2, quickReplyButton: { displayText: '📋 ALL MENU', id: `${usedPrefix}allmenu` } },
        { index: 3, quickReplyButton: { displayText: '🎨 BUAT STIKER', id: `${usedPrefix}stiker` } },
        { index: 4, quickReplyButton: { displayText: '🤖 AI CHAT', id: `${usedPrefix}ai` } },
        { index: 5, quickReplyButton: { displayText: '🎮 GAME', id: `${usedPrefix}game` } }
    ];
    
    const mentions = [sender, `${config.getOwnerNumber()}@s.whatsapp.net`];
    
    await sock.sendMessage(sender, {
        text: menuText,
        footer: `⚡ ${config.botName} v${config.version} | Klik tombol di bawah`,
        templateButtons: buttons,
        mentions: mentions
    });
}

module.exports = { menuCommand };
