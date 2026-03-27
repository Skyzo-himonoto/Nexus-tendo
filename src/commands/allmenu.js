import config from '../../config.js';
import moment from 'moment-timezone';
import db from '../../lib/database/index.js';

export default async function allmenu(context) {
  const { sock, sender, isOwner, prefix } = context;
  
  const isPremiumUser = await db.isPremium(sender);
  const usedPrefix = prefix || config.prefix;
  const time = moment().tz(config.timezone || 'Asia/Jakarta').format('HH:mm:ss');
  const date = moment().tz(config.timezone || 'Asia/Jakarta').format('DD/MM/YYYY');
  const senderNumber = sender.split('@')[0];
  const ownerNumber = config.getOwnerNumber();
  const botNumber = config.getBotNumber() || 'Belum terhubung';
  
  const allCommands = {
    '📁 UTAMA': ['menu', 'allmenu', 'ping', 'owner', 'donasi', 'settings'],
    '🖼️ STICKER': ['sticker', 'stickerwm', 'toimg', 'tourl'],
    '🤖 AI': ['ai', 'gpt', 'gemini', 'blackbox'],
    '📥 DOWNLOADER': ['ytmp3', 'ytmp4', 'tiktok', 'ig', 'fb', 'twitter', 'mediafire', 'spotify'],
    '🎮 GAMES': ['game', 'jawab', 'gamelist', 'truth', 'dare', 'tebakgambar', 'tebakkata', 'tebaklagu', 'family100'],
    '🛠️ TOOLS': ['qrcode', 'tts', 'translate', 'styletext', 'calc', 'shorturl', 'weather', 'whois'],
    '🎌 ANIME': ['anime', 'waifu', 'neko'],
    '👥 GROUP': ['group', 'add', 'kick', 'promote', 'demote', 'setpp', 'tagall'],
    '🕌 ISLAM': ['quran', 'jadwalsholat', 'doa', 'asmaulhusna'],
    '🎲 RANDOM': ['quotes', 'fakta', 'pantun', 'meme', 'cat', 'dog', 'random'],
    '⚙️ OWNER': ['exec', 'eval', 'bc', 'addprem', 'delprem', 'listprem', 'restart', 'cleartmp', 'backup', 'get', 'sewa'],
    '🔄 CONVERTER': ['toimg', 'tomp3', 'tomp4', 'togif', 'towebp'],
    '🎨 MAKER': ['carbon', 'neon', 'glitch', 'burn', 'wanted', 'rip'],
    '🔍 SEARCH': ['google', 'image', 'pinterest', 'github', 'npm']
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
║  💎 Premium : ${isPremiumUser ? '✅' : '❌'}                 ║
║  📊 Total  : ${Object.values(allCommands).flat().length} Command ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
`;
  
  for (const [category, cmds] of Object.entries(allCommands)) {
    text += `║  ┏━━━━ ${category} ━━━━┓\n`;
    for (const cmd of cmds) {
      text += `║  ┃ ✦ ${usedPrefix}${cmd}\n`;
    }
    text += `║  ┗━━━━━━━━━━━━━━━┛\n║\n`;
  }
  
  text += `║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  📞 *Hubungi Owner:* wa.me/${ownerNumber}                      ║
║  💡 Gunakan *${usedPrefix}category <nama>* untuk filter kategori  ║
║  📌 Contoh: *${usedPrefix}category downloader*                   ║
╚══════════════════════════════════════════════════════════════╝`;
  
  const buttons = [
    { index: 1, quickReplyButton: { displayText: '🏠 MENU UTAMA', id: `${usedPrefix}menu` } },
    { index: 2, quickReplyButton: { displayText: '📥 DOWNLOADER', id: `${usedPrefix}category downloader` } },
    { index: 3, quickReplyButton: { displayText: '🎮 GAMES', id: `${usedPrefix}category game` } },
    { index: 4, quickReplyButton: { displayText: '👑 OWNER', id: `${usedPrefix}owner` } },
    { index: 5, quickReplyButton: { displayText: '📞 HUBUNGI OWNER', id: `${usedPrefix}owner` } }
  ];
  
  const mentions = [sender, `${ownerNumber}@s.whatsapp.net`, `${botNumber}@s.whatsapp.net`];
  
  await sock.sendMessage(sender, {
    text: text,
    footer: `⚡ ${config.botName} v${config.version} | Klik tombol di bawah untuk akses cepat`,
    templateButtons: buttons,
    mentions: mentions
  });
}
