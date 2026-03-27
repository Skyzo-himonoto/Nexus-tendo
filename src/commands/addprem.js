import db from '../../lib/database/index.js';

export default async function addprem(context) {
  const { sock, sender, isOwner, args } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.addprem 628xxxxx 30\n\nKeterangan:\n- 30 = jumlah hari (default 30)'
    });
  }
  
  let targetNumber = args[0];
  let days = parseInt(args[1]) || 30;
  if (!targetNumber.includes('@')) {
    targetNumber = targetNumber.replace(/[^0-9]/g, '');
    if (targetNumber.startsWith('0')) {
      targetNumber = '62' + targetNumber.slice(1);
    }
    targetNumber = targetNumber + '@s.whatsapp.net';
  }
  
  await db.addPremium(targetNumber, days);
  
  await sock.sendMessage(sender, {
    text: `✅ *Berhasil menambahkan premium user!*\n\n📱 *User:* ${targetNumber}\n📅 *Durasi:* ${days} hari\n👑 *Status:* Premium aktif`
  });
}
