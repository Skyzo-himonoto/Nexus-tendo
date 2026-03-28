export default async function add(context) {
  const { sock, sender, m, isGroup, isOwner, args } = context;
  
  if (!isGroup) return await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk grup!' });
  
  const groupMetadata = await sock.groupMetadata(sender);
  const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin' || 
                  groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'superadmin';
  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin';
  
  if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin!' });
  if (!isBotAdmin) return await sock.sendMessage(sender, { text: '❌ Bot harus admin!' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .add 628xxxxx' });
  
  let number = args[0].replace(/[^0-9]/g, '');
  if (number.startsWith('0')) number = '62' + number.slice(1);
  const jid = number + '@s.whatsapp.net';
  
  try {
    await sock.groupParticipantsUpdate(sender, [jid], 'add');
    await sock.sendMessage(sender, { text: `✅ Berhasil menambah @${number}`, mentions: [jid] });
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Gagal: ${err.message}` });
  }
}
