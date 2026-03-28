export default async function leave(context) {
  const { sock, sender, m, isGroup, isOwner, args } = context;
  
  if (!isGroup) return await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk grup' });
  
  const groupMetadata = await sock.groupMetadata(sender);
  const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin';
  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  
  if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin yang bisa bot keluar' });
  
  await sock.sendMessage(sender, { text: '👋 Bye' });
  await sock.groupLeave(sender);
}
