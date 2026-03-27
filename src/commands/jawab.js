import gameManager from '../../lib/gameManager.js';

export default async function jawab(context) {
  const { sock, m, sender, isGroup, args } = context;
  
  if (!isGroup) {
    return await sock.sendMessage(sender, {
      text: '❌ Ini adalah command untuk game di grup!'
    });
  }
  
  const groupId = sender;
  const player = m.key.participant;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara menjawab:* .jawab <jawaban>\n\nContoh: .jawab merah'
    });
  }
  
  const answer = args.join(' ');
  const result = await gameManager.checkAnswer(groupId, answer, player);
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ ${result.message}`
    });
  }
  
  const activeGame = gameManager.getActiveGame(groupId);
  
  if (result.correct) {
    const nextQuestion = await gameManager.getRandomQuestion(activeGame.gameType);
    
    if (nextQuestion && activeGame.questionsAsked < 10) { // Max 10 pertanyaan 
      await gameManager.setQuestion(groupId, nextQuestion);
      
      const nextText = `✅ *Jawaban Benar!* +1 poin\nSkor: *${result.score}*\n\n📝 *Soal selanjutnya:*\n${nextQuestion.question}\n\n⏱️ Waktu 30 detik`;
      
      await sock.sendMessage(sender, {
        text: nextText,
        mentions: [player]
      });
      
      setTimeout(async () => {
        const currentGame = gameManager.getActiveGame(groupId);
        if (currentGame && currentGame.currentQuestion === nextQuestion) {
          gameManager.endGame(groupId);
          await sock.sendMessage(sender, {
            text: `⏰ *Game selesai!*\n\nSkor akhir: *${currentGame.score}* poin dari ${currentGame.questionsAsked} soal`,
            mentions: [player]
          });
        }
      }, 30000);
      
    } else {
      const finalScore = activeGame.score;
      gameManager.endGame(groupId);
      
      await sock.sendMessage(sender, {
        text: `🎉 *Game selesai!*\n\n👤 *Player:* @${player.split('@')[0]}\n🏆 *Skor akhir:* *${finalScore}* poin\n📊 *Total soal:* ${activeGame.questionsAsked + 1}\n\nTerima kasih sudah bermain! 🎮`,
        mentions: [player]
      });
    }
  } else {

    gameManager.endGame(groupId);   
    await sock.sendMessage(sender, {
      text: `❌ ${result.message}\n\n🎮 *Game selesai!*\n👤 *Player:* @${player.split('@')[0]}\n🏆 *Skor akhir:* *${result.score}* poin`,
      mentions: [player]
    });
  }
}
