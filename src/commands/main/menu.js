import config from '../../../config.js';
import moment from 'moment-timezone';
import db from '../../../lib/database/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function menu(context) {
  const { sock, sender, m, prefix } = context;
  
  const usedPrefix = prefix || config.prefix;
  const time = moment().tz(config.timezone).format('HH:mm:ss');
  const date = moment().tz(config.timezone).format('DD/MM/YYYY');
  const senderNumber = sender.split('@')[0];
  const ownerNumber = config.getOwnerNumber();
  const botNumber = config.getBotNumber() || 'Belum terhubung';
  const ownerLink = `wa.me/${ownerNumber}`;
  const audioPath = path.join(config.assetsPath, 'audio', 'Nexus.mp3');
  const imagePath = path.join(config.assetsPath, 'images', 'nexus.jpg');
  
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
  try {
    if (await fs.pathExists(audioPath)) {
      await sock.sendMessage(sender, {
        audio: { url: audioPath },
        mimetype: 'audio/mpeg',
        fileName: 'Nexus.mp3',
        ptt: false 
      });
    }
  } catch (err) {
    console.log('Gagal kirim audio:', err.message);
  }
  
  try {
    if (await fs.pathExists(imagePath)) {
      await sock.sendMessage(sender, {
        image: { url: imagePath },
        caption: menuText,
        footer: `🈲 ${config.botName} v${config.version}`,
        templateButtons: buttons,
        mentions
      });
    } else {
      await sock.sendMessage(sender, {
        text: menuText,
        footer: `❄️ ${config.botName} v${config.version}`,
        templateButtons: buttons,
        mentions
      });
    }
  } catch (err) {
    console.log('Gagal kirim menu:', err.message);
    await sock.sendMessage(sender, { text: menuText });
  }
}
