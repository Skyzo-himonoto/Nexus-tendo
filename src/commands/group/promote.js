export default async function promote(context) {
  const { sock, sender, m, isGroup, isOwner, args } = context;
  
  if (!isGroup) return await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk grup!' });
  
  const groupMetadata = await sock.groupMetadata(sender);
  const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin' || 
                  groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'superadmin';
  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin';
  
  if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin!' });
  if (!isBotAdmin) return await sock.sendMessage(sender, { text: '❌ Bot harus admin!' });
  
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  if (mentioned.length === 0) return await sock.sendMessage(sender, { text: '📝 .promote @user' });
  
  let success = [], failed = [];
  for (const target of mentioned) {
    try { await sock.groupParticipantsUpdate(sender, [target], 'promote'); success.push(target); } 
    catch { failed.push(target); }
  }
  
  let text = '';
  if (success.length) text += `✅ Berhasil promosikan:\n${success.map(s => `@${s.split('@')[0]}`).join('\n')}\n`;
  if (failed.length) text += `❌ Gagal:\n${failed.map(f => `@${f.split('@')[0]}`).join('\n')}`;
  await sock.sendMessage(sender, { text, mentions: [...success, ...failed] });
}
