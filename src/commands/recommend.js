const config = require('../../config');
const moment = require('moment-timezone');

async function recommendCommand(sock, sender, prefix) {
    const usedPrefix = prefix || config.prefix;
    const time = moment().tz(config.timezone).format('HH:mm:ss');
    const date = moment().tz(config.timezone).format('DD/MM/YYYY');
    
    const recomText = `╔══════════════════════════════════════╗
║     🌟 *MENU REKOMENDASI*         ║
║     Fitur Paling Populer Saat Ini  ║
╠══════════════════════════════════════╣
║  📅 ${date} | ⏰ ${time}               ║
║  🎯 Prefix: ${usedPrefix}                      ║
╠══════════════════════════════════════╣

🔥 *LAGI TREND WOK*

🤖 *AI Chat Gemini*
Chat dengan AI canggih
📌 Cara: ${usedPrefix}ai [pertanyaan]

🎨 *Pembuat Stiker*
Buat stiker dari gambar/video
📌 Cara: Balas gambar dengan ${usedPrefix}stiker

📥 *Download YouTube*
Download audio/video YouTube
📌 Cara: ${usedPrefix}ytmp3 [url]

⚡ *QUICK ACCESS*
• Stiker: ${usedPrefix}stiker
• AI Chat: ${usedPrefix}ai [text]
• Download: ${usedPrefix}ytmp3 [url]

╚══════════════════════════════════════╝

💡 Ketik ${usedPrefix}allmenu untuk semua fitur`;

    await sock.sendMessage(sender, { text: recomText });
}

module.exports = { recommendCommand };
