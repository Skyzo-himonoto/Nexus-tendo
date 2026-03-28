import db from '../../../lib/database/index.js';

export default async function group(context) {
  const { sock, sender, m, isGroup, isOwner, args, prefix } = context;
  
  if (!isGroup) return await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk grup!' });
  
  const groupId = sender;
  const groupMetadata = await sock.groupMetadata(groupId);
  const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin' || 
                  groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'superadmin';
  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin';
  
  if (args.length === 0) {
    const settings = await db.getGroup(groupId);
    let text = `╭━━━━━ GROUP SETTINGS ━━━━━╮
┃
┃ 👥 Group: ${groupMetadata.subject}
┃ 👤 Member: ${groupMetadata.participants.length}
┃
┃ ⚙️ Pengaturan:
┃ ✦ Welcome: ${settings.welcome ? '✅' : '❌'}
┃ ✦ Anti Link: ${settings.antiLink ? '✅' : '❌'}
┃
┃ 📝 Command:
┃ ✦ ${prefix}setwelcome on/off
┃ ✦ ${prefix}setantilink on/off
┃ ✦ ${prefix}add <nomor>
┃ ✦ ${prefix}kick @tag
┃ ✦ ${prefix}promote @tag
┃ ✦ ${prefix}demote @tag
┃ ✦ ${prefix}tagall <pesan>
┃ ✦ ${prefix}groupinfo
┃ ✦ ${prefix}setpp (reply gambar)
╰━━━━━━━━━━━━━━━━━━━╯`;
    return await sock.sendMessage(sender, { text });
  }
  
  const cmd = args[0].toLowerCase();
  
  if (cmd === 'setwelcome') {
    if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin!' });
    const status = args[1];
    if (status === 'on') { await db.saveGroup(groupId, { welcome: true }); await sock.sendMessage(sender, { text: '✅ Welcome diaktifkan!' }); }
    else if (status === 'off') { await db.saveGroup(groupId, { welcome: false }); await sock.sendMessage(sender, { text: '❌ Welcome dinonaktifkan!' }); }
    else await sock.sendMessage(sender, { text: '📝 .setwelcome on/off' });
  }
  
  else if (cmd === 'setantilink') {
    if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin!' });
    const status = args[1];
    if (status === 'on') { await db.saveGroup(groupId, { antiLink: true }); await sock.sendMessage(sender, { text: '✅ Anti Link diaktifkan!' }); }
    else if (status === 'off') { await db.saveGroup(groupId, { antiLink: false }); await sock.sendMessage(sender, { text: '❌ Anti Link dinonaktifkan!' }); }
    else await sock.sendMessage(sender, { text: '📝 .setantilink on/off' });
  }
  
  else if (cmd === 'groupinfo') {
    let text = `╭━━━━━ GROUP INFO ━━━━━╮
┃
┃ 📛 Nama: ${groupMetadata.subject}
┃ 🆔 ID: ${groupId}
┃ 👥 Member: ${groupMetadata.participants.length}
┃ 👑 Owner: ${groupMetadata.owner || '-'}
┃ 📅 Dibuat: ${new Date(groupMetadata.creation * 1000).toLocaleDateString('id-ID')}
┃
┃ 👤 Admin:
`;
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    for (const admin of admins) text += `┃ ✦ @${admin.id.split('@')[0]}\n`;
    text += `╰━━━━━━━━━━━━━━━━━━━╯`;
    await sock.sendMessage(sender, { text, mentions: admins.map(a => a.id) });
  }
  
  else if (cmd === 'tagall') {
    if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin!' });
    if (!isBotAdmin) return await sock.sendMessage(sender, { text: '❌ Bot harus admin!' });
    const message = args.slice(1).join(' ') || '📢 PENGUMUMAN 📢\n\n';
    const mentions = groupMetadata.participants.map(p => p.id);
    await sock.sendMessage(sender, { text: message + '\n\n' + mentions.map(m => `@${m.split('@')[0]}`).join(' '), mentions });
  }
  
  else {
    await sock.sendMessage(sender, { text: `❌ Command ${cmd} tidak dikenal!` });
  }
}
