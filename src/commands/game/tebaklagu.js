import axios from 'axios';

const activeGames = new Map();

export default async function tebaklagu(context) {
  const { sock, sender, args, m } = context;
  const groupId = sender;
  
  if (args.length === 0) return await sock.sendMessage(sender, { text: '🎵 TEBAK LAGU\n\n📝 .tebaklagu start\n🎤 Tebak judul lagu dari lirik!\n💰 Hadiah: 50 poin' });
  
  const cmd = args[0].toLowerCase();
  
  if (cmd === 'start') {
    if (activeGames.has(groupId)) return await sock.sendMessage(sender, { text: '❌ Masih ada game!' });
    
    try {
      const res = await axios.get('https://api.ryzendesu.vip/api/game/tebaklagu');
      const data = res.data;
      
      activeGames.set(groupId, {
        answer: data.jawaban.toLowerCase(),
        lirik: data.lirik,
        artis: data.artis,
        player: m.key.participant,
        attempts: 0
      });
      
      await sock.sendMessage(sender, { text: `🎵 TEBAK LAGU\n\n📝 Lirik:\n"${data.lirik}"\n\n💡 .jawab <judul lagu>\n⏱️ 30 detik\n💰 50 poin` });
      
      setTimeout(() => {
        if (activeGames.has(groupId)) {
          const game = activeGames.get(groupId);
          activeGames.delete(groupId);
          sock.sendMessage(sender, { text: `⏰ Habis!\nJudul: ${game.answer}\nArtis: ${game.artis}` });
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
      await sock.sendMessage(sender, { text: `🎉 BENAR! ${game.answer}\n🎤 Artis: ${game.artis}\n🏆 +50 poin` });
      activeGames.delete(groupId);
    } else {
      await sock.sendMessage(sender, { text: `❌ SALAH Sisa: ${3 - game.attempts}` });
      if (game.attempts >= 3) {
        await sock.sendMessage(sender, { text: `GAME OVER\nJudul: ${game.answer}\nArtis: ${game.artis}` });
        activeGames.delete(groupId);
      }
    }
  }
}
