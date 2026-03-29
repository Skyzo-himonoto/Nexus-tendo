const activeGames = new Map();

export default async function mathgame(context) {
  const { sock, sender, args, m } = context;
  const groupId = sender;
  
  if (args.length === 0) return await sock.sendMessage(sender, { text: '🧮 MATH GAME\n\n📝 .mathgame start\n🧠 Soal matematika sederhana\n💰 Hadiah: 30 poin' });
  
  const cmd = args[0].toLowerCase();
  
  if (cmd === 'start') {
    if (activeGames.has(groupId)) return await sock.sendMessage(sender, { text: '❌ Masih ada game!' });
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let jawaban;
    if (op === '+') jawaban = num1 + num2;
    else if (op === '-') jawaban = num1 - num2;
    else jawaban = num1 * num2;
    activeGames.set(groupId, { answer: jawaban, soal: `${num1} ${op} ${num2}`, player: m.key.participant, attempts: 0 });
    await sock.sendMessage(sender, { text: `🧮 MATH GAME\n\n📝 Soal: ${num1} ${op} ${num2} = ?\n\n💡 .jawab <angka>\n⏱️ 30 detik\n💰 30 poin` });
    setTimeout(() => { if (activeGames.has(groupId)) { const g = activeGames.get(groupId); activeGames.delete(groupId); sock.sendMessage(sender, { text: `⏰ Habis! Jawaban: ${g.answer}` }); } }, 30000);
  } else if (cmd === 'end') { if (activeGames.has(groupId)) activeGames.delete(groupId); await sock.sendMessage(sender, { text: 'Game dihentikan' }); }
  else {
    const jawab = parseInt(cmd);
    if (isNaN(jawab)) return;
    const game = activeGames.get(groupId);
    if (!game) return;
    if (game.player !== m.key.participant) return;
    if (jawab === game.answer) { await sock.sendMessage(sender, { text: `🎉 BENAR! ${game.soal} = ${game.answer}\n🏆 +30 poin!` }); activeGames.delete(groupId); }
    else { await sock.sendMessage(sender, { text: `❌ SALAH Jawaban: ${game.answer}` }); activeGames.delete(groupId); }
  }
}
