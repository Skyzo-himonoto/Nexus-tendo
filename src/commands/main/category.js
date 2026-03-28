import config from '../../../config.js';
import db from '../../../lib/database/index.js';

export default async function category(context) {
  const { sock, sender, args, prefix } = context;
  const usedPrefix = prefix || await db.getPrefix();
  
  const categories = {
    menu: { name: '📁 UTAMA', commands: ['menu', 'allmenu', 'ping', 'owner', 'donasi', 'settings'] },
    sticker: { name: '🖼️ STICKER', commands: ['sticker', 'stickerwm', 'toimg'] },
    ai: { name: '🤖 AI', commands: ['ai', 'gpt', 'gemini', 'blackbox'] },
    downloader: { name: '📥 DOWNLOADER', commands: ['ytmp3', 'ytmp4', 'tiktok', 'ig', 'fb', 'twitter', 'mediafire', 'spotify'] },
    game: { name: '🎮 GAMES', commands: ['game', 'jawab', 'gamelist'] },
    tools: { name: '🛠️ TOOLS', commands: ['qrcode', 'tts', 'translate', 'styletext', 'calc', 'shorturl', 'weather', 'whois'] },
    anime: { name: '🎌 ANIME', commands: ['anime', 'waifu'] },
    group: { name: '👥 GROUP', commands: ['group', 'add', 'kick', 'promote', 'demote', 'setpp', 'tagall'] },
    islam: { name: '🕌 ISLAM', commands: ['quran', 'jadwal', 'doa', 'asmaulhusna'] },
    random: { name: '🎲 RANDOM', commands: ['random', 'quotes', 'fakta', 'meme', 'cat', 'dog'] },
    owner: { name: '⚙️ OWNER', commands: ['exec', 'eval', 'bc', 'addprem', 'delprem', 'listprem', 'restart', 'backup', 'sewa'] }
  };
  
  if (args.length === 0) {
    let text = `╭━━━━━ *CATEGORY MENU* ━━━━━╮\n┃\n`;
    for (const [key, cat] of Object.entries(categories)) text += `┃ ✦ ${cat.name} - .category ${key}\n`;
    text += `┃\n┃ 📌 Example: .category downloader\n╰━━━━━━━━━━━━━━━━━━━╯`;
    return await sock.sendMessage(sender, { text });
  }
  
  const cat = categories[args[0].toLowerCase()];
  if (!cat) return await sock.sendMessage(sender, { text: `❌ Category *${args[0]}* tidak ditemukan!` });
  
  let text = `╭━━━━━ ${cat.name} ━━━━━╮\n┃\n┃ 📊 Total: ${cat.commands.length} Command\n┃\n`;
  for (const cmd of cat.commands) text += `┃ ✦ ${usedPrefix}${cmd}\n`;
  text += `┃\n╰━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(sender, { text });
}
