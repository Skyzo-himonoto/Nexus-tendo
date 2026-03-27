import gameManager from '../../lib/gameManager.js';
import db from '../../lib/database/index.js';

export default async function gamelist(context) {
  const { sock, sender, isOwner, args } = context;
  
  if (args.length === 0) {
    const stats = await gameManager.getAllGamesStats();
    
    let text = `╭━━━━━ *GAME DATABASE* ━━━━━╮
┃
┃ 📊 *Statistik Game:*
┃
`;
    
    for (const [game, data] of Object.entries(stats)) {
      text += `┃ 🎮 ${game}: ${data.totalQuestions} soal\n`;
    }
    
    text += `┃
┃ 📝 *Command:*
┃ ✦ .gamelist <nama_game> - lihat detail game
┃ ✦ .gameadd <nama_game> <soal>|<jawaban> - tambah soal (owner)
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    return await sock.sendMessage(sender, { text });
  }
  
  const gameName = args[0].toLowerCase();
  const gameData = await gameManager.loadGameData(gameName);
  
  if (!gameData) {
    return await sock.sendMessage(sender, {
      text: `❌ Game *${gameName}* tidak ditemukan!`
    });
  }
  
  let text = `╭━━━━━ *${gameName.toUpperCase()}* ━━━━━╮
┃
┃ 📊 *Total soal:* ${gameData.length}
┃
┃ 📝 *Contoh soal:*
`;

  const sampleQuestions = gameData.slice(0, 5);
  for (let i = 0; i < sampleQuestions.length; i++) {
    const q = sampleQuestions[i];
    text += `┃ ${i+1}. ${q.question.substring(0, 50)}${q.question.length > 50 ? '...' : ''}\n`;
    text += `┃    🔑 Jawaban: ${q.answer}\n┃\n`;
  }
  
  if (gameData.length > 5) {
    text += `┃ ... dan ${gameData.length - 5} soal lainnya\n`;
  }
  
  text += `╰━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(sender, { text });
}
