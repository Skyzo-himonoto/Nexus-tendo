export default async function add(context) {
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
    return await sock.sendMessage(sender, { text: '❌ Hanya admin yang bisa menambah anggota!' });
  }
  
  if (!isBotAdmin) {
    return await sock.sendMessage(sender, { text: '❌ Bot harus menjadi admin untuk menambah anggota!' });
  }
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.add 628xxxxx\n\nContoh: .add 6285715818953'
    });
  }
  
  let number = args[0].replace(/[^0-9]/g, '');
  if (number.startsWith('0')) {
    number = '62' + number.slice(1);
  }
  const jid = number + '@s.whatsapp.net';
  
  try {
    await sock.groupParticipantsUpdate(sender, [jid], 'add');
    await sock.sendMessage(sender, {
      text: `✅ *Berhasil menambah:* @${number}\nKe dalam grup.`,
      mentions: [jid]
    });
  } catch (err) {
    await sock.sendMessage(sender, {
      text: `❌ *Gagal menambah:* @${number}\nError: ${err.message}`,
      mentions: [jid]
    });
  }
}
