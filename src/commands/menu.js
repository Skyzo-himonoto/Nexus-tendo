/**
 * ==============================================
 * NEXUS TENDO MD - FITUR MENU
 * ==============================================
 * 
 * Fitur:
 * - Button quick access
 * - Dynamic content
 * - Rekomendasi fitur
 * ==============================================
 */

const config = require('../../config');
const moment = require('moment-timezone');

async function menuCommand(sock, sender, prefix) {
    const usedPrefix = prefix || config.prefix;
    const time = moment().tz(config.timezone).format('HH:mm:ss');
    const date = moment().tz(config.timezone).format('DD/MM/YYYY');
    
    const menuText = `
╔══════════════════════════════════════════════════════════╗
║     ✦  ${config.botName}  ✦  MULTI-DEVICE  ✦          ║
║              WhatsApp Bot SOMEBODY                      ║
╠══════════════════════════════════════════════════════════╣
║  📅 ${date}                    ⏰ ${time}                ║
║  🤖 Bot Name : ${config.botName}                         ║
║  📦 Version  : ${config.version}                         ║
║  🎯 Prefix   : ${usedPrefix}                             ║
║  👑 Owner    : @${config.getOwnerNumber()}               ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🗿 *PILIH MENU DI BAWAH*                                ║
║                                                          ║
║  🌟 Rekomendasi  → Fitur paling populer                 ║
║  📋 All Menu     → Semua fitur lengkap                  ║
║  🎨 Stiker       → Buat stiker dari gambar/video        ║
║  🤖 AI Chat      → Chat dengan AI Gemini                ║
║  📥 Downloader   → Download YouTube, IG, TikTok         ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  💡 *Tips:* Ketik ${usedPrefix}allmenu untuk semua fitur   ║
║  📌 *Info:* Bot aktif ✨ | multi-device                    ║
╚══════════════════════════════════════════════════════════╝
    `;
    
    const buttons = [
        { index: 1, quickReplyButton: { displayText: '🌟 Menu Rekomendasi', id: `${usedPrefix}recom` } },
        { index: 2, quickReplyButton: { displayText: '📋 All Menu (Kategori)', id: `${usedPrefix}allmenu` } },
        { index: 3, quickReplyButton: { displayText: '🎨 Bikin Stiker', id: `${usedPrefix}stiker` } },
        { index: 4, quickReplyButton: { displayText: '🤖 AI Chat', id: `${usedPrefix}ai` } },
        { index: 5, quickReplyButton: { displayText: '📥 Downloader', id: `${usedPrefix}ytmp3` } }
    ];
    
    await sock.sendMessage(sender, {
        text: menuText,
        footer: `Nexus Tendo MD v${config.version} | Klik tombol di bawah`,
        templateButtons: buttons
    });
}

module.exports = { menuCommand };
