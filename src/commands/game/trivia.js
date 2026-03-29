import axios from 'axios';

const activeGames = new Map();

export default async function trivia(context) {
  const { sock, sender, args, m } = context;
  const groupId = sender;
  
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📚 TRIVIA\n\n📝 .trivia start\n🧠 Kuis pengetahuan umum\n💰 Hadiah: 50 poin' });
  
  const cmd = args[0].toLowerCase();
  
  if (cmd === 'start') {
    if (activeGames.has(groupId)) return await sock.sendMessage(sender, { text: '❌ Masih ada game!' });
    
    try {
      const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
      const data = res.data.results[0];
      
      activeGames.set(groupId, {
        answer: data.correct_answer.toLowerCase(),
        question: data.question,
        options: [...data.incorrect_answers, data.correct_answer].sort(() => Math.random() - 0.5),
        player: m.key.participant,
        attempts: 0
      });
      
      const optText = activeGames.get(groupId).options.map((opt, i) => `${i+1}. ${opt}`).join('\n');
      
      await sock.sendMessage(sender, { text: `📚 TRIVIA\n\n📝 ${data.question}\n\n${optText}\n\n💡 .jawab <angka 1-4> atau <jawaban>\n⏱️ 30 detik\n💰 50 poin` });
      
      setTimeout(() => {
        if (activeGames.has(groupId)) {
          const game = activeGames.get(groupId);
          activeGames.delete(groupId);
          sock.sendMessage(sender, { text: `⏰ Habis! Jawaban: ${game.answer}` });
        }
      }, 30000);
      
    } catch (err) {
      await sock.sendMessage(sender, { text: `❌ Error: ${err.message}` });
    }
  }
  
  else if (cmd === 'end') {
    if (activeGames.has(groupId)) activeGames.delete(groupId);
    await sock.sendMessage(sender, { text: 'Game dihentikan' });
  }
  
  else {
    const game = activeGames.get(groupId);
    if (!game) return;
    if (game.player !== m.key.participant) return;
    
    let jawabanUser = cmd;
    const index = parseInt(cmd) - 1;
    if (!isNaN(index) && game.options[index]) jawabanUser = game.options[index].toLowerCase();
    
    game.attempts++;
    if (jawabanUser === game.answer) {
      await sock.sendMessage(sender, { text: `🎉 BENAR! ${game.answer}\n🏆 +50 poin` });
      activeGames.delete(groupId);
    } else {
      await sock.sendMessage(sender, { text: `❌ SALAH Sisa: ${3 - game.attempts}` });
      if (game.attempts >= 3) {
        await sock.sendMessage(sender, { text: `GAME OVER Jawaban: ${game.answer}` });
        activeGames.delete(groupId);
      }
    }
  }
}
