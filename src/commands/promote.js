export default async function promote(context) {
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
    return await sock.sendMessage(sender, { text: '❌ Hanya admin yang bisa mempromosikan anggota!' });
  }
  
  if (!isBotAdmin) {
    return await sock.sendMessage(sender, { text: '❌ Bot harus menjadi admin untuk mempromosikan anggota!' });
  }
  
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  
  if (mentioned.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.promote @user\n\n*Tag user yang ingin dipromosikan!*'
    });
  }
  
  let success = [];
  let failed = [];
  
  for (const target of mentioned) {
    try {
      await sock.groupParticipantsUpdate(sender, [target], 'promote');
      success.push(target);
    } catch (err) {
      failed.push(target);
    }
  }
  
  let text = '';
  if (success.length > 0) {
    text += `✅ *Berhasil mempromosikan:*\n${success.map(s => `@${s.split('@')[0]}`).join('\n')}\n\n`;
  }
  if (failed.length > 0) {
    text += `❌ *Gagal mempromosikan:*\n${failed.map(f => `@${f.split('@')[0]}`).join('\n')}`;
  }
  
  await sock.sendMessage(sender, {
    text: text,
    mentions: [...success, ...failed]
  });
}
