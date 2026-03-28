export default async function unblock(context) {
  const { sock, sender, isOwner, args } = context;
  
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .unblock 628xxxxx' });
  
  let number = args[0].replace(/[^0-9]/g, '');
  if (number.startsWith('0')) number = '62' + number.slice(1);
  const jid = number + '@s.whatsapp.net';
  
  try {
    await sock.updateBlockStatus(jid, 'unblock');
    await sock.sendMessage(sender, { text: `✅ Berhasil unblock @${number}`, mentions: [jid] });
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Gagal: ${err.message}` });
  }
}
