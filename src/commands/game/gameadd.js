import gameManager from '../../../lib/gameManager.js';

export default async function gameadd(context) {
  const { sock, sender, isOwner, args } = context;
  
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  if (args.length < 2) {
    return await sock.sendMessage(sender, {
      text: `📝 .gameadd <game> <soal>|<jawaban>\n\n📌 Game: truth, dare, tebakgambar, tebakkata, tebaklagu, family100, caklontong`
    });
  }
  
  const gameName = args[0].toLowerCase();
  const input = args.slice(1).join(' ');
  const [question, answer] = input.split('|');
  
  if (!question || !answer) {
    return await sock.sendMessage(sender, { text: '❌ Format salah! Gunakan: .gameadd <game> <soal>|<jawaban>' });
  }
  
  const availableGames = ['truth', 'dare', 'tebakgambar', 'tebakkata', 'tebaklagu', 'tebakfilm', 'family100', 'caklontong', 'siapakahaku', 'susunkata', 'tebakhewan'];
  if (!availableGames.includes(gameName)) {
    return await sock.sendMessage(sender, { text: `❌ Game ${gameName} tidak ditemukan!` });
  }
  
  await gameManager.addQuestion(gameName, question, answer);
  await sock.sendMessage(sender, { text: `✅ Soal ditambahkan!\n🎮 ${gameName}\n📝 ${question}\n🔑 ${answer}` });
}
