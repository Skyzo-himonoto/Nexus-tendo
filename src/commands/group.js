import db from '../../lib/database/index.js';

export default async function group(context) {
  const { sock, sender, m, isGroup, isOwner, args, prefix } = context;
  
  if (!isGroup) {
    return await sock.sendMessage(sender, {
      text: '❌ Command ini hanya bisa digunakan di grup!'
    });
  }
  
  const groupId = sender;
  const groupMetadata = await sock.groupMetadata(groupId);
  const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin' || 
                  groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'superadmin';
  const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
  const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin' ||
                     groupMetadata.participants.find(p => p.id === botId)?.admin === 'superadmin';
  
  if (args.length === 0) {
    const groupSettings = await db.getGroup(groupId);
    
    let text = `╭━━━━━ *GROUP SETTINGS* ━━━━━╮
┃
┃ 👥 *Group:* ${groupMetadata.subject}
┃ 👤 *Member:* ${groupMetadata.participants.length}
┃ 🔖 *Topic:* ${groupMetadata.topic || '-'}
┃
┃ ⚙️ *Pengaturan:*
┃ ✦ Welcome: ${groupSettings.welcome ? '✅' : '❌'}
┃ ✦ Anti Link: ${groupSettings.antiLink ? '✅' : '❌'}
┃ ✦ Anti Spam: ${groupSettings.antiSpam ? '✅' : '❌'}
┃ ✦ NSFW: ${groupSettings.nsfw ? '✅' : '❌'}
┃
┃ 📝 *Command Group:*
┃ ✦ ${prefix}setwelcome on/off
┃ ✦ ${prefix}setantilink on/off
┃ ✦ ${prefix}setantispam on/off
┃ ✦ ${prefix}setnsfw on/off
┃ ✦ ${prefix}add <nomor>
┃ ✦ ${prefix}kick @tag
┃ ✦ ${prefix}promote @tag
┃ ✦ ${prefix}demote @tag
┃ ✦ ${prefix}tagall
┃ ✦ ${prefix}groupinfo
┃ ✦ ${prefix}setpp <reply gambar>
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    return await sock.sendMessage(sender, { text });
  }
  
  const command = args[0].toLowerCase();
  if (command === 'setwelcome') {
    if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin yang bisa mengubah pengaturan!' });
    
    const status = args[1];
    if (status === 'on') {
      await db.saveGroup(groupId, { welcome: true });
      await sock.sendMessage(sender, { text: '✅ *Welcome message diaktifkan!*' });
    } else if (status === 'off') {
      await db.saveGroup(groupId, { welcome: false });
      await sock.sendMessage(sender, { text: '❌ *Welcome message dinonaktifkan!*' });
    } else {
      await sock.sendMessage(sender, { text: '📝 Gunakan: .setwelcome on/off' });
    }
  }
  
  else if (command === 'setantilink') {
    if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin yang bisa mengubah pengaturan!' });
    
    const status = args[1];
    if (status === 'on') {
      await db.saveGroup(groupId, { antiLink: true });
      await sock.sendMessage(sender, { text: '✅ *Anti Link diaktifkan!*' });
    } else if (status === 'off') {
      await db.saveGroup(groupId, { antiLink: false });
      await sock.sendMessage(sender, { text: '❌ *Anti Link dinonaktifkan!*' });
    } else {
      await sock.sendMessage(sender, { text: '📝 Gunakan: .setantilink on/off' });
    }
  }
  
  else if (command === 'groupinfo') {
    let text = `╭━━━━━ *GROUP INFO* ━━━━━╮
┃
┃ 📛 *Nama:* ${groupMetadata.subject}
┃ 🆔 *ID:* ${groupId}
┃ 👥 *Member:* ${groupMetadata.participants.length}
┃ 👑 *Owner:* ${groupMetadata.owner || '-'}
┃ 📅 *Dibuat:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString('id-ID')}
┃ 🔖 *Topic:* ${groupMetadata.topic || '-'}
┃
┃ 👤 *Admin:*
`;
    
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    for (const admin of admins) {
      text += `┃ ✦ @${admin.id.split('@')[0]}\n`;
    }
    
    text += `┃
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(sender, {
      text: text,
      mentions: admins.map(a => a.id)
    });
  }
  
  else if (command === 'tagall') {
    if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin yang bisa menggunakan tagall!' });
    if (!isBotAdmin) return await sock.sendMessage(sender, { text: '❌ Bot harus menjadi admin untuk menggunakan fitur ini!' });
    
    let message = args.slice(1).join(' ') || '⚠️ *PENGUMUMAN PENTING* ⚠️\n\n';
    message += '\n\n' + groupMetadata.participants.map(p => `@${p.id.split('@')[0]}`).join('\n');
    
    await sock.sendMessage(sender, {
      text: message,
      mentions: groupMetadata.participants.map(p => p.id)
    });
  }
  
  else {
    await sock.sendMessage(sender, { text: `❌ Command group tidak dikenal: ${command}\n\nGunakan ${prefix}group untuk melihat daftar command.` });
  }
}
