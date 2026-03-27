import config from '../../config.js';
import db from '../../lib/database/index.js';

export default async function category(context) {
  const { sock, sender, args, prefix } = context;
  
  const currentPrefix = await db.getPrefix();
  const usedPrefix = prefix || currentPrefix;
  
  const categories = {
    'menu': {
      name: '📁 UTAMA',
      commands: ['menu', 'allmenu', 'ping', 'owner', 'donasi', 'settings']
    },
    'sticker': {
      name: '🖼️ STICKER',
      commands: ['sticker', 'stickerwm', 'toimg', 'tourl']
    },
    'ai': {
      name: '🤖 AI',
      commands: ['ai', 'gpt', 'gemini', 'blackbox']
    },
    'downloader': {
      name: '📥 DOWNLOADER',
      commands: ['ytmp3', 'ytmp4', 'tiktok', 'ig', 'fb', 'twitter', 'mediafire', 'spotify']
    },
    'game': {
      name: '🎮 GAMES',
      commands: ['game', 'jawab', 'gamelist', 'truth', 'dare', 'tebakgambar', 'tebakkata']
    },
    'tools': {
      name: '🛠️ TOOLS',
      commands: ['qrcode', 'tts', 'translate', 'styletext', 'calc', 'shorturl', 'weather', 'whois']
    },
    'anime': {
      name: '🎌 ANIME',
      commands: ['anime', 'waifu', 'neko']
    },
    'group': {
      name: '👥 GROUP',
      commands: ['group', 'add', 'kick', 'promote', 'demote', 'setpp', 'tagall']
    },
    'islam': {
      name: '🕌 ISLAM',
      commands: ['quran', 'jadwalsholat', 'doa', 'asmaulhusna']
    },
    'random': {
      name: '🎲 RANDOM',
      commands: ['quotes', 'fakta', 'pantun', 'meme', 'cat', 'dog']
    },
    'owner': {
      name: '⚙️ OWNER',
      commands: ['exec', 'eval', 'bc', 'addprem', 'delprem', 'listprem', 'restart', 'cleartmp', 'backup']
    },
    'converter': {
      name: '🔄 CONVERTER',
      commands: ['toimg', 'tomp3', 'tomp4', 'togif']
    },
    'maker': {
      name: '🎨 MAKER',
      commands: ['carbon', 'neon', 'glitch', 'burn', 'wanted', 'rip']
    },
    'search': {
      name: '🔍 SEARCH',
      commands: ['google', 'image', 'pinterest', 'github']
    }
  };
  
  if (args.length === 0) {
    let text = `╭━━━━━ *CATEGORY MENU* ━━━━━╮
┃
┃ 📋 *Available Categories:*
`;
    
    for (const [key, cat] of Object.entries(categories)) {
      text += `┃ ✦ ${cat.name} - .category ${key}\n`;
    }
    
    text += `┃
┃ 📌 *Example:* .category downloader
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    return await sock.sendMessage(sender, { text });
  }
  
  const categoryKey = args[0].toLowerCase();
  const category = categories[categoryKey];
  
  if (!category) {
    return await sock.sendMessage(sender, {
      text: `❌ Category *${categoryKey}* tidak ditemukan!\n\nGunakan .category untuk melihat daftar category.`
    });
  }
  
  let text = `╭━━━━━ ${category.name} ━━━━━╮
┃
┃ 📊 *Total:* ${category.commands.length} Command
┃
`;
  
  for (const cmd of category.commands) {
    text += `┃ ✦ ${usedPrefix}${cmd}\n`;
  }
  
  text += `┃
╰━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(sender, { text });
}
