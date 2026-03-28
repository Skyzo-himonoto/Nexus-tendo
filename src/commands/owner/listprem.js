import db from '../../../lib/database/index.js';

export default async function listprem(context) {
  const { sock, sender, isOwner } = context;
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  
  const users = await db.getPremiumList();
  if (users.length === 0) return await sock.sendMessage(sender, { text: '📋 No premium users' });
  
  let text = `╭━━━━━ PREMIUM LIST ━━━━━╮\n`;
  for (let i = 0; i < users.length; i++) {
    const user = await db.getUser(users[i]);
    text += `┃ ${i+1}. ${users[i].split('@')[0]}\n┃    ⏰ Expired: ${user.expired ? new Date(user.expired).toLocaleDateString() : 'Unlimited'}\n┃\n`;
  }
  text += `╰━━━━━━━━━━━━━━━━━━━━━━╯\nTotal: ${users.length}`;
  await sock.sendMessage(sender, { text });
}
