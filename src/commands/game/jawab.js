import gameManager from '../../../lib/gameManager.js';

export default async function jawab(context) {
  const { sock, m, sender, isGroup, args } = context;
  
  if (!isGroup) return await sock.sendMessage(sender, { text: '❌ Command ini untuk game di grup!' });
  
  const groupId = sender;
  const player = m.key.participant;
  
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .jawab <jawaban>' });
  
  const answer = args.join(' ');
  const result = await gameManager.checkAnswer(groupId, answer, player);
  
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.message}` });
  
  const active = gameManager.getActiveGame(groupId);
  
  if (result.correct) {
    const nextSoal = await gameManager.getRandomQuestion(active.gameType);
    
    if (nextSoal && active.questionsAsked < 10) {
      await gameManager.setQuestion(groupId, nextSoal);
      await sock.sendMessage(sender, {
        text: `✅ Benar +20 poin\nSkor: ${result.score}\n\n📝 Soal selanjutnya:\n${nextSoal.question}\n\n⏱️ 30 detik`,
        mentions: [player]
      });
      
      setTimeout(async () => {
        const current = gameManager.getActiveGame(groupId);
        if (current && current.currentQuestion === nextSoal) {
          gameManager.endGame(groupId);
          await sock.sendMessage(sender, {
            text: `⏰ Game selesai\nSkor akhir: ${current.score} poin`,
            mentions: [player]
          });
        }
      }, 30000);
      
    } else {
      gameManager.endGame(groupId);
      await sock.sendMessage(sender, {
        text: `🎉 Game selesai!\n👤 @${player.split('@')[0]}\n🏆 Skor akhir: ${result.score} poin\n📊 Total soal: ${active.questionsAsked + 1}`,
        mentions: [player]
      });
    }
  } else {
    gameManager.endGame(groupId);
    await sock.sendMessage(sender, {
      text: `❌ ${result.message}\n\n🎮 Game selesai!\n🏆 Skor: ${result.score} poin`,
      mentions: [player]
    });
  }
}
