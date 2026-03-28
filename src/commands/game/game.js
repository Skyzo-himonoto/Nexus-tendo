import gameManager from '../../../lib/gameManager.js';

export default async function game(context) {
  const { sock, m, sender, isGroup, args, prefix } = context;
  
  if (!isGroup) return await sock.sendMessage(sender, { text: '❌ Game hanya bisa di grup!' });
  
  const groupId = sender;
  const player = m.key.participant;
  
  if (args.length === 0) {
    const text = `╭━━━━━ *GAME MENU* ━━━━━╮
┃
┃ 🎮 Daftar Game:
┃ ✦ ${prefix}game truth
┃ ✦ ${prefix}game dare
┃ ✦ ${prefix}game tebakgambar
┃ ✦ ${prefix}game tebakkata
┃ ✦ ${prefix}game tebaklagu
┃ ✦ ${prefix}game family100
┃ ✦ ${prefix}game caklontong
┃ ✦ ${prefix}suit - Batu-gunting-kertas
┃ ✦ ${prefix}tebakangka - Tebak angka 1-100
┃
┃ 📝 Cara: ${prefix}game <nama_game>
┃ ⏱️ Waktu: 30 detik/soal
┃ 🏆 Skor: 20 poin/jawaban benar
╰━━━━━━━━━━━━━━━━━━━╯`;
    return await sock.sendMessage(sender, { text });
  }
  
  const gameType = args[0].toLowerCase();
  const availableGames = ['truth', 'dare', 'tebakgambar', 'tebakkata', 'tebaklagu', 'tebakfilm', 'family100', 'caklontong', 'siapakahaku', 'susunkata', 'tebakhewan'];
  
  if (!availableGames.includes(gameType)) {
    return await sock.sendMessage(sender, { text: `❌ Game ${gameType} tidak ditemukan!` });
  }
  
  const start = gameManager.startGame(groupId, gameType, player);
  if (!start.success) return await sock.sendMessage(sender, { text: `❌ ${start.message}` });
  
  const soal = await gameManager.getRandomQuestion(gameType);
  if (!soal) {
    gameManager.endGame(groupId);
    return await sock.sendMessage(sender, { text: `❌ Game ${gameType} belum punya soal! Hubungi owner.` });
  }
  
  await gameManager.setQuestion(groupId, soal);
  
  await sock.sendMessage(sender, {
    text: `╭━━━━━ GAME ${gameType.toUpperCase()} ━━━━━╮
┃
┃ 🎮 Game: ${gameType}
┃ 👤 Player: @${player.split('@')[0]}
┃ ⏱️ Waktu: 30 detik
┃
┃ 📝 Soal:
┃ ${soal.question}
┃
┃ 💡 Jawab: .jawab <jawaban>
╰━━━━━━━━━━━━━━━━━━━╯`,
    mentions: [player]
  });
  
  setTimeout(async () => {
    const active = gameManager.getActiveGame(groupId);
    if (active && active.player === player && active.currentQuestion === soal) {
      gameManager.endGame(groupId);
      await sock.sendMessage(sender, {
        text: `⏰ Waktu habis!\n\nJawaban: ${soal.answer}\nSkor akhir: ${active.score} poin`,
        mentions: [player]
      });
    }
  }, 30000);
}
