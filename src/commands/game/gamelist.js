import gameManager from '../../../lib/gameManager.js';

export default async function gamelist(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    const stats = await gameManager.getAllGamesStats();
    let text = `╭━━━━━ GAME DATABASE ━━━━━╮\n┃\n┃ 📊 Statistik:\n┃\n`;
    for (const [game, data] of Object.entries(stats)) {
      text += `┃ 🎮 ${game}: ${data.totalQuestions} soal\n`;
    }
    text += `┃\n┃ 📝 Command:\n┃ ✦ .gamelist <game> - detail game\n┃ ✦ .gameadd <game> <soal>|<jawaban> - tambah soal (owner)\n╰━━━━━━━━━━━━━━━━━━━╯`;
    return await sock.sendMessage(sender, { text });
  }
  
  const gameName = args[0].toLowerCase();
  const data = await gameManager.loadGameData(gameName);
  if (!data) return await sock.sendMessage(sender, { text: `❌ Game ${gameName} tidak ditemukan!` });
  
  let text = `╭━━━━━ ${gameName.toUpperCase()} ━━━━━╮\n┃\n┃ 📊 Total: ${data.length} soal\n┃\n┃ 📝 Contoh soal:\n`;
  for (let i = 0; i < Math.min(data.length, 5); i++) {
    text += `┃ ${i+1}. ${data[i].question.substring(0, 50)}${data[i].question.length > 50 ? '...' : ''}\n`;
    text += `┃    🔑 ${data[i].answer}\n┃\n`;
  }
  if (data.length > 5) text += `┃ ... dan ${data.length - 5} soal lainnya\n`;
  text += `╰━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(sender, { text });
}
