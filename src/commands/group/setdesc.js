export default async function setdesc(context) {
  const { sock, sender, m, isGroup, isOwner, args } = context;
  
  if (!isGroup) return await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk grup' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .setdesc <deskripsi baru>' });
  
  const groupMetadata = await sock.groupMetadata(sender);
  const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin';
  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin';
  
  if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin' });
  if (!isBotAdmin) return await sock.sendMessage(sender, { text: '❌ Bot harus admin' });
  
  const newDesc = args.join(' ');
  try {
    await sock.groupUpdateDescription(sender, newDesc);
    await sock.sendMessage(sender, { text: `✅ Deskripsi grup berhasil diganti` });
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Gagal: ${err.message}` });
  }
}
