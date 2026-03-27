import db from '../../lib/database/index.js';

export default async function delprem(context) {
  const { sock, sender, isOwner, args } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.delprem <nomor>\n\n📋 *Contoh:*\n.delprem 6285715818953'
    });
  }
  
  let targetNumber = args[0];
  if (!targetNumber.includes('@')) {
    targetNumber = targetNumber.replace(/[^0-9]/g, '');
    if (targetNumber.startsWith('0')) {
      targetNumber = '62' + targetNumber.slice(1);
    }
    targetNumber = targetNumber + '@s.whatsapp.net';
  }
  
  const isPremium = await db.isPremium(targetNumber);
  
  if (!isPremium) {
    return await sock.sendMessage(sender, {
      text: `❌ User @${targetNumber.split('@')[0]} bukan premium`,
      mentions: [targetNumber]
    });
  }
  
  await db.removePremium(targetNumber);
  
  await sock.sendMessage(sender, {
    text: `✅ *Berhasil menghapus premium user*\n\n📱 *User:* @${targetNumber.split('@')[0]}\n👑 *Status:* Premium dihapus`,
    mentions: [targetNumber]
  });
}
