import config from '../../config.js';
import db from '../../lib/database/index.js';

export default async function allmenu(context) {
  const { sock, sender, isOwner, prefix } = context;
  
  const isPremiumUser = await db.isPremium(sender);
  const currentPrefix = await db.getPrefix();
  const usedPrefix = prefix || currentPrefix;
  
  const allCommands = {
    '📁 UTAMA': ['menu', 'allmenu', 'ping', 'owner', 'donasi', 'settings'],
    '🖼️ STICKER': ['sticker', 'stickerwm', 'toimg', 'tourl'],
    '🤖 AI': ['ai', 'gpt', 'gemini', 'blackbox'],
    '📥 DOWNLOADER': ['ytmp3', 'ytmp4', 'tiktok', 'ig', 'fb', 'twitter', 'mediafire', 'spotify'],
    '🎮 GAMES': ['game', 'jawab', 'gamelist', 'truth', 'dare', 'tebakgambar', 'tebakkata', 'tebaklagu', 'family100'],
    '🛠️ TOOLS': ['qrcode', 'tts', 'translate', 'styletext', 'calc', 'shorturl', 'weather', 'whois'],
    '🎌 ANIME': ['anime', 'waifu', 'neko', 'character'],
    '👥 GROUP': ['group', 'add', 'kick', 'promote', 'demote', 'setpp', 'tagall', 'groupinfo'],
    '🕌 ISLAM': ['quran', 'jadwalsholat', 'doa', 'asmaulhusna', 'kisahnabi'],
    '🎲 RANDOM': ['quotes', 'fakta', 'pantun', 'meme', 'cat', 'dog', 'random'],
    '⚙️ OWNER': ['exec', 'eval', 'bc', 'addprem', 'delprem', 'listprem', 'restart', 'cleartmp', 'backup', 'get', 'sewa'],
    '🔄 CONVERTER': ['toimg', 'tomp3', 'tomp4', 'togif', 'sticker'],
    '🎨 MAKER': ['maker', 'carbon', 'neon', 'glitch', 'burn', 'wanted', 'rip', 'trash'],
    '🔍 SEARCH': ['google', 'image', 'pinterest', 'wikimedia', 'npm', 'github']
  };
  
  let text = `╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃      *${config.botName}*      
┃   *ALL COMMAND LIST*   
┃      📊 Total: ${Object.values(allCommands).flat().length} Command
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;
  
  for (const [category, cmds] of Object.entries(allCommands)) {
    text += `\n┏━━━━ ${category} ━━━━┓\n`;
    for (const cmd of cmds) {
      text += `┃ ✦ ${usedPrefix}${cmd}\n`;
    }
    text += `┗━━━━━━━━━━━━━━━┛\n`;
  }
  
  text += `\n╭━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *Bot:* ${config.botName}
┃ 👑 *Owner:* ${config.ownerName}
┃ 💎 *Premium:* ${isPremiumUser ? '✅' : '❌'}
┃ 🔧 *Prefix:* ${usedPrefix}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`;
  
  await sock.sendMessage(sender, { text });
}
