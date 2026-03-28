import config from '../../../config.js';
import moment from 'moment-timezone';

export default async function recom(context) {
  const { sock, sender, prefix } = context;
  
  const usedPrefix = prefix || config.prefix;
  const time = moment().tz(config.timezone).format('HH:mm:ss');
  const date = moment().tz(config.timezone).format('DD/MM/YYYY');
  const ownerNumber = config.getOwnerNumber();
  
  const text = `╔══════════════════════════════════════╗
║     🌟 *MENU REKOMENDASI*         ║
║     Fitur Populer                 ║
╠══════════════════════════════════════╣
║  📅 ${date} | ⏰ ${time}               ║
║  🎯 Prefix: ${usedPrefix}              ║
╠══════════════════════════════════════╣
║
║ 🔥 *LAGI TREND*
║
║ 🤖 *AI Chat Gemini*
║ 📌 ${usedPrefix}ai [pertanyaan]
║
║ 🎨 *Pembuat Stiker*
║ 📌 Reply gambar dengan ${usedPrefix}sticker
║
║ 📥 *Download YouTube*
║ 📌 ${usedPrefix}ytmp3 [url]
║
║ 🎮 *Main Game*
║ 📌 ${usedPrefix}game tebakgambar
║
║ 🛠️ *Tools Populer*
║ 📌 ${usedPrefix}qrcode, ${usedPrefix}tts, ${usedPrefix}translate
║
╠══════════════════════════════════════╣
║  💡 Ketik ${usedPrefix}allmenu untuk semua fitur
║  📞 Hubungi: wa.me/${ownerNumber}
╚══════════════════════════════════════╝`;
  
  await sock.sendMessage(sender, { text });
}
