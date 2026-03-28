export default async function setname(context) {
  const { sock, sender, m, isGroup, isOwner, args } = context;
  
  if (!isGroup) return await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk grup' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .setname <nama grup baru>' });
  
  const groupMetadata = await sock.groupMetadata(sender);
  const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin';
  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin';
  
  if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin' });
  if (!isBotAdmin) return await sock.sendMessage(sender, { text: '❌ Bot harus admin' });
  
  const newName = args.join(' ');
  try {
    await sock.groupUpdateSubject(sender, newName);
    await sock.sendMessage(sender, { text: `✅ Nama grup berhasil diganti menjadi: ${newName}` });
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Gagal: ${err.message}` });
  }
}
