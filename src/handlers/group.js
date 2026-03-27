import db from '../../lib/database/index.js';
import config from '../../config.js';

export default async function groupHandler(sock, event) {
  try {
    if (event.action === 'add') {
      const groupId = event.jid;
      const groupSettings = await db.getGroup(groupId);
      
      if (groupSettings.welcome) {
        const groupMetadata = await sock.groupMetadata(groupId);
        const addedUsers = event.participants;
        
        for (const user of addedUsers) {
          const welcomeText = `👋 *WELCOME TO ${groupMetadata.subject}* 👋\n\nHalo @${user.split('@')[0]}!\nSelamat bergabung di grup.\n\n📌 *Baca deskripsi grup untuk info lebih lanjut*\n\nSelamat bersenang-senang! 🎉`;
          
          await sock.sendMessage(groupId, {
            text: welcomeText,
            mentions: [user]
          });
        }
      }
    }

    if (event.action === 'remove') {
      const groupId = event.jid;
      const groupSettings = await db.getGroup(groupId);
      
      if (groupSettings.welcome) {
        const removedUsers = event.participants;
        
        for (const user of removedUsers) {
          const leaveText = `*GOODBYE* 👋\n\n@${user.split('@')[0]} telah meninggalkan grup.\n\nSemoga tenang di sana`;
          
          await sock.sendMessage(groupId, {
            text: leaveText,
            mentions: [user]
          });
        }
      }
    }
    
  } catch (err) {
    console.error('Group handler error:', err);
  }
}

export async function checkAntiLink(sock, message, groupId, sender) {
  const groupSettings = await db.getGroup(groupId);
  
  if (!groupSettings.antiLink) return false;
  
  const text = message.message?.conversation || 
               message.message?.extendedTextMessage?.text || '';
 
  const linkPatterns = [
    /https?:\/\//i,
    /whatsapp\.com/i,
    /chat\.whatsapp\.com/i,
    /youtube\.com/i,
    /youtu\.be/i,
    /instagram\.com/i,
    /facebook\.com/i,
    /tiktok\.com/i,
    /twitter\.com/i,
    /telegram\.org/i
  ];
  
  const hasLink = linkPatterns.some(pattern => pattern.test(text));
  
  if (hasLink) {
    const groupMetadata = await sock.groupMetadata(groupId);
    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin === 'admin' ||
                    groupMetadata.participants.find(p => p.id === sender)?.admin === 'superadmin';
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin' ||
                       groupMetadata.participants.find(p => p.id === botId)?.admin === 'superadmin';
    
    if (isAdmin) return false;
    if (isBotAdmin) {
      await sock.sendMessage(groupId, {
        delete: message.key
      });
    }
    
    await sock.sendMessage(groupId, {
      text: `⚠️ *ANTI LINK DETECTED* ⚠️\n\n@${sender.split('@')[0]}, dilarang mengirim link di grup ini!\n\nLink akan otomatis dihapus.`,
      mentions: [sender]
    });
    
    return true;
  }
  
  return false;
}
