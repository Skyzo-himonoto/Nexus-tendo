export default async function tagall(context) {
  const { sock, sender, m, isGroup, isOwner, args } = context;
  
  if (!isGroup) return await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk grup!' });
  
  const groupMetadata = await sock.groupMetadata(sender);
  const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin';
  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin';
  
  if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin!' });
  if (!isBotAdmin) return await sock.sendMessage(sender, { text: '❌ Bot harus admin!' });
  
  const message = args.length > 0 ? args.join(' ') : '📢 PENGUMUMAN \n\n';
  const mentions = groupMetadata.participants.map(p => p.id);
  await sock.sendMessage(sender, {
    text: message + '\n\n' + mentions.map(m => `@${m.split('@')[0]}`).join(' '),
    mentions
  });
}
