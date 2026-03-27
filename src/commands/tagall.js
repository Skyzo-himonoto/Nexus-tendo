export default async function tagall(context) {
  const { sock, sender, m, isGroup, isOwner, args } = context;
  
  if (!isGroup) {
    return await sock.sendMessage(sender, {
      text: '❌ Command ini hanya bisa digunakan di grup!'
    });
  }
  
  const groupMetadata = await sock.groupMetadata(sender);
  const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin' || 
                  groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'superadmin';
  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin' ||
                     groupMetadata.participants.find(p => p.id === botId)?.admin === 'superadmin';
  
  if (!isAdmin && !isOwner) {
    return await sock.sendMessage(sender, { text: '❌ Hanya admin yang bisa menggunakan tagall!' });
  }
  
  if (!isBotAdmin) {
    return await sock.sendMessage(sender, { text: '❌ Bot harus menjadi admin untuk menggunakan tagall!' });
  }
  
  let message = args.length > 0 ? args.join(' ') : '📢 *PENGUMUMAN* 📢\n\n';
  const mentions = groupMetadata.participants.map(p => p.id);
  message += '\n\n' + mentions.map(m => `@${m.split('@')[0]}`).join(' ');
  
  await sock.sendMessage(sender, {
    text: message,
    mentions: mentions
  });
}
