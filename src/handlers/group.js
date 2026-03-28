import db from '../../lib/database/index.js';

export default async function groupHandler(sock, event) {
  try {
    if (event.action === 'add') {
      const groupId = event.jid;
      const groupSettings = await db.getGroup(groupId);
      if (groupSettings.welcome) {
        const groupMetadata = await sock.groupMetadata(groupId);
        for (const user of event.participants) {
          await sock.sendMessage(groupId, {
            text: `👋 *WELCOME TO ${groupMetadata.subject}*\n\nHalo @${user.split('@')[0]}!\nSelamat bergabung!\n\n📌 Baca deskripsi grup ya!`,
            mentions: [user]
          });
        }
      }
    }
    if (event.action === 'remove') {
      const groupId = event.jid;
      const groupSettings = await db.getGroup(groupId);
      if (groupSettings.welcome) {
        for (const user of event.participants) {
          await sock.sendMessage(groupId, {
            text: `👋 *GOODBYE*\n\n@${user.split('@')[0]} telah meninggalkan grup.`,
            mentions: [user]
          });
        }
      }
    }
  } catch (err) {
    console.error('fix error:', err);
  }
}

export async function checkAntiLink(sock, message, groupId, sender) {
  const groupSettings = await db.getGroup(groupId);
  if (!groupSettings.antiLink) return false;
  
  const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
  const linkPatterns = [/https?:\/\//i, /whatsapp\.com/i, /chat\.whatsapp\.com/i, /youtube\.com/i, /youtu\.be/i, /instagram\.com/i, /facebook\.com/i, /tiktok\.com/i, /twitter\.com/i];
  const hasLink = linkPatterns.some(p => p.test(text));
  
  if (hasLink) {
    const groupMetadata = await sock.groupMetadata(groupId);
    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin === 'admin' ||
                    groupMetadata.participants.find(p => p.id === sender)?.admin === 'superadmin';
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin';
    
    if (isAdmin) return false;
    if (isBotAdmin) await sock.sendMessage(groupId, { delete: message.key });
    await sock.sendMessage(groupId, {
      text: `⚠️ *ANTI LINK*\n@${sender.split('@')[0]}, dilarang kirim link!`,
      mentions: [sender]
    });
    return true;
  }
  return false;
}
