import db from '../../lib/database/index.js';

export default async function listprem(context) {
  const { sock, sender, isOwner } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  const premiumUsers = await db.getPremiumList();
  
  if (premiumUsers.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📋 *Daftar Premium User*\n\nTidak ada user premium saat ini.'
    });
  }
  
  let text = `╭━━━━━ *PREMIUM USER LIST* ━━━━━╮\n┃\n`;
  
  for (let i = 0; i < premiumUsers.length; i++) {
    const userId = premiumUsers[i];
    const user = await db.getUser(userId);
    const expired = user.expired ? new Date(user.expired).toLocaleDateString('id-ID') : 'Tidak terbatas';
    text += `┃ ${i+1}. ${userId.split('@')[0]}\n┃    ⏰ Expired: ${expired}\n┃\n`;
  }
  
  text += `╰━━━━━━━━━━━━━━━━━━━━━━━━╯\n\nTotal: ${premiumUsers.length} user premium`;
  
  await sock.sendMessage(sender, { text });
}￼Enter
