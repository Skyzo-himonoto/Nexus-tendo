const activeGames = new Map();

export default async function tebakangka(context) {
  const { sock, sender, args, isGroup, m } = context;
  
  const groupId = sender;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `🎮 *TEBAK ANGKA*\n\n📝 Cara: .tebakangka start\n\n🎯 Tebak angka 1-100!\n💰 Hadiah: 50 poin!`
    });
  }
  
  const cmd = args[0].toLowerCase();
  
  if (cmd === 'start') {
    if (activeGames.has(groupId)) {
      return await sock.sendMessage(sender, { text: '❌ Masih ada game tebak angka yang berlangsung!' });
    }
    
    const angka = Math.floor(Math.random() * 100) + 1;
    activeGames.set(groupId, { angka, player: m.key.participant, attempts: 0 });
    
    await sock.sendMessage(sender, {
      text: `🎮 *TEBAK ANGKA DIMULAI!*\n\n🔢 Tebak angka 1-100\n💡 Ketik: .tebakangka <angka>\n\n⏱️ Kamu punya 5 kesempatan!`
    });
    
    setTimeout(() => {
      if (activeGames.has(groupId)) {
        const game = activeGames.get(groupId);
        activeGames.delete(groupId);
        sock.sendMessage(sender, { text: `⏰ Waktu habis! Angkanya adalah *${game.angka}*` });
      }
    }, 60000);
  }
  
  else if (cmd === 'end') {
    if (activeGames.has(groupId)) {
      activeGames.delete(groupId);
      await sock.sendMessage(sender, { text: '❌ Game dihentikan' });
    } else {
      await sock.sendMessage(sender, { text: '❌ Tidak ada game yang berlangsung!' });
    }
  }
  
  else {
    const tebakan = parseInt(cmd);
    if (isNaN(tebakan)) return await sock.sendMessage(sender, { text: '📝 Masukkan angka!' });
    
    const game = activeGames.get(groupId);
    if (!game) return await sock.sendMessage(sender, { text: '❌ Tidak ada game! Ketik .tebakangka start' });
    
    if (game.player !== m.key.participant) {
      return await sock.sendMessage(sender, { text: '❌ Bukan game kamu!' });
    }
    
    game.attempts++;
    
    let pesan = '';
    if (tebakan === game.angka) {
      pesan = `🎉 *BENAR!* Angkanya adalah ${game.angka}\n📊 Percobaan: ${game.attempts} kali\n🏆 Kamu menang!`;
      activeGames.delete(groupId);
    } else if (tebakan > game.angka) {
      pesan = `📉 Terlalu *BESAR*! Sisa percobaan: ${5 - game.attempts}`;
    } else {
      pesan = `📈 Terlalu *KECIL*! Sisa percobaan: ${5 - game.attempts}`;
    }
    
    if (game.attempts >= 5 && tebakan !== game.angka) {
      pesan = `💀 *GAME OVER 😂* Angkanya adalah *${game.angka}*\n📊 Percobaan: ${game.attempts} kali`;
      activeGames.delete(groupId);
    }
    
    await sock.sendMessage(sender, { text: pesan });
  }
}
