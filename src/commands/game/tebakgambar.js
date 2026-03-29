import axios from 'axios';

const activeGames = new Map();

export default async function tebakgambar(context) {
  const { sock, sender, args, m } = context;
  const groupId = sender;
  
  if (args.length === 0) return await sock.sendMessage(sender, { text: '🎮 TEBAK GAMBAR\n\n📝 .tebakgambar start\n🖼️ Tebak gambar dari API\n💰 Hadiah: 50 poin' });
  
  const cmd = args[0].toLowerCase();
  
  if (cmd === 'start') {
    if (activeGames.has(groupId)) return await sock.sendMessage(sender, { text: '❌ Masih ada game!' });
    
    await sock.sendMessage(sender, { text: '🖼️ Mengambil gambar...' });
    
    try {
      const res = await axios.get('https://api.ryzendesu.vip/api/game/tebakgambar');
      const data = res.data;
      
      activeGames.set(groupId, {
        answer: data.jawaban.toLowerCase(),
        player: m.key.participant,
        attempts: 0,
        image: data.gambar
      });
      
      await sock.sendMessage(sender, {
        image: { url: data.gambar },
        caption: `🎮 TEBAK GAMBAR\n\n🔍 Gambar apakah ini?\n💡 .jawab <jawaban>\n⏱️ 30 detik\n💰 50 poin`
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
    if (!game) return await sock.sendMessage(sender, { text: '❌ Tidak ada game! Ketik .tebakgambar start' });
    if (game.player !== m.key.participant) return await sock.sendMessage(sender, { text: '❌ Bukan game kamu!' });
    
    game.attempts++;
    if (cmd === game.answer) {
      await sock.sendMessage(sender, { text: `🎉 BENAR ${game.answer}\n🏆 +50 poin` });
      activeGames.delete(groupId);
    } else {
      await sock.sendMessage(sender, { text: `❌ SALAH! Sisa: ${3 - game.attempts}` });
      if (game.attempts >= 3) {
        await sock.sendMessage(sender, { text: `GAME OVER Jawaban: ${game.answer}` });
        activeGames.delete(groupId);
      }
    }
  }
}
