import gameManager from '../../lib/gameManager.js';
import { randomItem } from '../../lib/utils.js';

export default async function game(context) {
  const { sock, m, sender, isGroup, args, prefix } = context;
  
  if (!isGroup) {
    return await sock.sendMessage(sender, {
      text: '❌ Game hanya bisa dimainkan di grup!'
    });
  }
  
  const groupId = sender;
  const player = m.key.participant;
  
  if (args.length === 0) {
    const text = `╭━━━━━ *GAME MENU* ━━━━━╮
┃
┃ 🎮 *Daftar Game:*
┃
┃ ✦ ${prefix}game truth
┃ ✦ ${prefix}game dare
┃ ✦ ${prefix}game tebakgambar
┃ ✦ ${prefix}game tebakkata
┃ ✦ ${prefix}game tebaklagu
┃ ✦ ${prefix}game tebakfilm
┃ ✦ ${prefix}game family100
┃ ✦ ${prefix}game caklontong
┃ ✦ ${prefix}game siapakahaku
┃ ✦ ${prefix}game susunkata
┃ ✦ ${prefix}game tebakhewan
┃
┃ 📝 *Cara main:*
┃ ${prefix}game <nama_game>
┃
┃ ⏱️ Waktu: 30 detik per soal
┃ 🏆 Skor: 1 poin per jawaban benar
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    return await sock.sendMessage(sender, { text });
  }
  
  const gameType = args[0].toLowerCase();
  const availableGames = [
    'truth', 'dare', 'tebakkimia', 'tebaktebakan', 'tebakmakanan',
    'bucin', 'caklontong', 'family100', 'tebakbendera2', 'tebakfilm',
    'tebaklirik', 'tebaklagu', 'tekateki', 'tebakprofesi', 'tebaknegara',
    'siapakahaku', 'susunkata', 'tebakkata', 'tebakkabupaten', 'tebakjkt48',
    'riddle', 'renungan', 'kataacak', 'tebakhewan', 'tebakepep'
  ];
  
  if (!availableGames.includes(gameType)) {
    return await sock.sendMessage(sender, {
      text: `❌ Game *${gameType}* tidak ditemukan!\n\n📋 Gunakan *${prefix}game* untuk melihat daftar game.`
    });
  }

  const startResult = gameManager.startGame(groupId, gameType, player);
  if (!startResult.success) {
    return await sock.sendMessage(sender, {
      text: `❌ ${startResult.message}`
    });
  }

  const questionData = await gameManager.getRandomQuestion(gameType);
  if (!questionData) {
    gameManager.endGame(groupId);
    return await sock.sendMessage(sender, {
      text: `❌ Game *${gameType}* belum memiliki soal. Silahkan hubungi owner untuk menambahkan soal.`
    });
  }
  
  await gameManager.setQuestion(groupId, questionData);
  
  let gameText = `╭━━━━━ *GAME ${gameType.toUpperCase()}* ━━━━━╮
┃
┃ 🎮 *Game:* ${gameType}
┃ 👤 *Player:* @${player.split('@')[0]}
┃ ⏱️ *Waktu:* 30 detik
┃
┃ 📝 *Soal:*
┃ ${questionData.question}
┃
┃ 💡 *Jawab dengan:* .jawab <jawaban>
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(sender, {
    text: gameText,
    mentions: [player]
  });
  
  setTimeout(async () => {
    const activeGame = gameManager.getActiveGame(groupId);
    if (activeGame && activeGame.player === player && activeGame.currentQuestion === questionData) {
      gameManager.endGame(groupId);
      await sock.sendMessage(sender, {
        text: `⏰ *Waktu habis!*\n\nJawaban: *${questionData.answer}*\n\nSkor akhir: *${activeGame.score}* poin`,
        mentions: [player]
      });
    }
  }, 30000);
}
