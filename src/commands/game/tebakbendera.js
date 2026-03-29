import axios from 'axios';

const activeGames = new Map();

export default async function tebakbendera(context) {
  const { sock, sender, args, m } = context;
  const groupId = sender;
  
  if (args.length === 0) return await sock.sendMessage(sender, { text: '🏳️ TEBAK BENDERA\n\n📝 .tebakbendera start\n💰 Hadiah: 50 poin' });
  
  const cmd = args[0].toLowerCase();
  
  if (cmd === 'start') {
    if (activeGames.has(groupId)) return await sock.sendMessage(sender, { text: '❌ Masih ada game!' });
    
    try {
      const res = await axios.get('https://api.ryzendesu.vip/api/game/tebakbendera');
      const data = res.data;
      
      activeGames.set(groupId, {
        answer: data.jawaban.toLowerCase(),
        clue: data.clue,
        image: data.bendera,
        player: m.key.participant,
        attempts: 0
      });
      
      await sock.sendMessage(sender, {
        image: { url: data.bendera },
        caption: `🏳️ TEBAK BENDERA\n\n📝 ${data.clue}\n\n💡 .jawab <nama negara>\n⏱️ 30 detik\n💰 50 poin`
      });
      
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
    
    game.attempts++;
    if (cmd === game.answer) {
      await sock.sendMessage(sender, { text: `🎉 BENAR ${game.answer}\n🏆 +50 poin` });
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
