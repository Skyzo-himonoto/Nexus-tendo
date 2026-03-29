export default async function close(context) {
  const { sock, sender, m, isGroup, isOwner } = context;
  if (!isGroup) return await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk grup!' });
  
  const groupMetadata = await sock.groupMetadata(sender);
  const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin';
  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin';
  
  if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin!' });
  if (!isBotAdmin) return await sock.sendMessage(sender, { text: '❌ Bot harus admin!' });
  
  await sock.groupSettingUpdate(sender, 'announcement');
  await sock.sendMessage(sender, { text: '🔒 Grup ditutup bray, nunggu admin buka ya.' });
}

