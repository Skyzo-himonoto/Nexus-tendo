import config from '../../../config.js';
import moment from 'moment-timezone';
import db from '../../../lib/database/index.js';

export default async function allmenu(context) {
  const { sock, sender, prefix } = context;
  
  const isPremium = await db.isPremium(sender);
  const usedPrefix = prefix || config.prefix;
  const time = moment().tz(config.timezone).format('HH:mm:ss');
  const date = moment().tz(config.timezone).format('DD/MM/YYYY');
  const ownerNumber = config.getOwnerNumber();
  const botNumber = config.getBotNumber() || 'Belum terhubung';
  
  const allCommands = {
    '📁 UTAMA': ['menu', 'allmenu', 'ping', 'owner', 'donasi', 'settings'],
    '🖼️ STICKER': ['sticker', 'stickerwm', 'toimg'],
    '🤖 AI': ['ai', 'gpt', 'gemini', 'blackbox'],
    '📥 DOWNLOADER': ['ytmp3', 'ytmp4', 'tiktok', 'ig', 'fb', 'twitter', 'mediafire', 'spotify'],
    '🎮 GAMES': ['game', 'jawab', 'gamelist', 'suit', 'tebakangka', 'suit', 'tebakangka', 'slot ' , 'tebakgambar' , 'tebakhewan' , 'tebaklagu' , 'tebakbendera' , 'trivia' , 'mathgame' , 'tebakfilm'],
    '🛠️ TOOLS': ['qrcode', 'tts', 'translate', 'styletext', 'calc', 'shorturl', 'weather', 'whois', 'afk', 'report', 'runtime', 'url2img'],
    '🎌 ANIME': ['anime', 'waifu'],
    '👥 GROUP': ['group', 'add', 'kick', 'promote', 'demote', 'setpp', 'tagall'],
    '🕌 ISLAM': ['quran', 'jadwal', 'doa', 'asmaulhusna'],
    '🎲 RANDOM': ['random', 'quotes', 'fakta', 'meme', 'cat', 'dog'],
    '⚙️ OWNER': ['exec', 'eval', 'bc', 'addprem', 'delprem', 'listprem', 'restart', 'cleartmp', 'backup', 'sewa'],
    '🔄 CONVERTER': ['toimg', 'tomp3', 'tomp4', 'togif'],
    '🎨 MAKER': ['carbon', 'neon', 'glitch', 'burn', 'wanted', 'rip', 'rainbow', '3dtext'],
    '🔍 SEARCH': ['google', 'image', 'pinterest', 'github']
  };
  
  let text = `╔══════════════════════════════════════════════════════════╗
║              ✨ *${config.botName}* ✨                       ║
║              *ALL COMMAND LIST*                              ║
╠══════════════════════════════════════════════════════════════╣
║  📅 ${date}                          ⏰ ${time}              ║
║  🤖 Bot    : ${config.botName}                               ║
║  📱 Bot No : @${botNumber}                                   ║
║  🎯 Prefix : ${usedPrefix}                                   ║
║  👑 Owner  : @${ownerNumber}                                 ║
║  💎 Premium : ${isPremium ? '✅' : '❌'}                     ║
║  📊 Total  : ${Object.values(allCommands).flat().length} Command ║
╠══════════════════════════════════════════════════════════════╣\n`;
  
  for (const [category, cmds] of Object.entries(allCommands)) {
    text += `║  ┏━━━━ ${category} ━━━━┓\n`;
    for (const cmd of cmds) text += `║  ┃ ✦ ${usedPrefix}${cmd}\n`;
    text += `║  ┗━━━━━━━━━━━━━━━┛\n║\n`;
  }
  
  text += `╠══════════════════════════════════════════════════════════════╣
║  📞 *Hubungi Owner:* wa.me/${ownerNumber}                      ║
║  💡 Gunakan *${usedPrefix}category <nama>* untuk filter          ║
╚══════════════════════════════════════════════════════════════╝`;
  
  const mentions = [sender, `${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`];
  
  await sock.sendMessage(sender, { text, mentions });
}
