import gameManager from '../../lib/gameManager.js';
import db from '../../lib/database/index.js';

export default async function gameadd(context) {
  const { sock, sender, isOwner, args } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  if (args.length < 2) {
    return await sock.sendMessage(sender, {
      text: `📝 *Cara menambah soal game:*
.gameadd <nama_game> <soal>|<jawaban>

📋 *Contoh:*
.gameadd tebakkata Apa ibu kota Indonesia?|Jakarta
.gameadd truth Apa rahasia terbesarmu?|Tidak ada
.gameadd dare Lakukan push up 10 kali|done

📌 *Game yang tersedia:*
truth, dare, tebakkimia, tebaktebakan, tebakmakanan, bucin, 
caklontong, family100, tebakbendera2, tebakfilm, tebaklirik, 
tebaklagu, tekateki, tebakprofesi, tebaknegara, siapakahaku, 
susunkata, tebakkata, tebakkabupaten, tebakjkt48, riddle, 
renungan, kataacak, tebakhewan, tebakepep`
    });
  }
  
  const gameName = args[0].toLowerCase();
  const input = args.slice(1).join(' ');
  const [question, answer] = input.split('|');
  
  if (!question || !answer) {
    return await sock.sendMessage(sender, {
      text: '❌ Format salah! Gunakan: .gameadd <nama_game> <soal>|<jawaban>'
    });
  }

  const availableGames = [
    'truth', 'dare', 'tebakkimia', 'tebaktebakan', 'tebakmakanan',
    'bucin', 'caklontong', 'family100', 'tebakbendera2', 'tebakfilm',
    'tebaklirik', 'tebaklagu', 'tekateki', 'tebakprofesi', 'tebaknegara',
    'siapakahaku', 'susunkata', 'tebakkata', 'tebakkabupaten', 'tebakjkt48',
    'riddle', 'renungan', 'kataacak', 'tebakhewan', 'tebakepep'
  ];
  
  if (!availableGames.includes(gameName)) {
    return await sock.sendMessage(sender, {
      text: `❌ Game *${gameName}* tidak ditemukan!\n\n📋 Gunakan .gamelist untuk melihat daftar game.`
    });
  }
  
  await gameManager.addQuestion(gameName, question, answer);
  
  await sock.sendMessage(sender, {
    text: `✅ *Berhasil menambah soal game!*\n\n🎮 *Game:* ${gameName}\n📝 *Soal:* ${question}\n🔑 *Jawaban:* ${answer}\n\nSoal telah ditambahkan ke database.`
  });
}
