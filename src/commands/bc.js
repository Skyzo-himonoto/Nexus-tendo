import db from '../../lib/database/index.js';
import fs from 'fs-extra';
import path from 'path';

export default async function broadcast(context) {
  const { sock, sender, isOwner, args, m } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.bc <pesan>\n\n📋 *Fitur:*\n- Broadcast ke semua chat\n- Support media (reply gambar/video)\n- Auto delay 3 detik per chat\n\n📌 *Contoh:*\n.bc Halo ini broadcast\n\n*Atau reply media dengan .bc*'
    });
  }

  const chats = sock.chats;
  const groups = await sock.groupFetchAllParticipating();
  const allJids = [
    ...Object.keys(chats),
    ...Object.keys(groups)
  ].filter((v, i, a) => a.indexOf(v) === i);
  
  const message = args.join(' ');
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const hasMedia = quoted?.imageMessage || quoted?.videoMessage || quoted?.audioMessage || quoted?.documentMessage;
  
  await sock.sendMessage(sender, {
    text: `📢 *Broadcast Started*\n\n📊 *Total target:* ${allJids.length} chat\n📝 *Message:* ${message}\n\n⏳ Sedang mengirim...`
  });
  
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < allJids.length; i++) {
    const jid = allJids[i];
    
    try {
      if (hasMedia && quoted) {
        const mediaType = Object.keys(quoted)[0];
        const media = quoted[mediaType];
        
        const stream = await sock.downloadMediaMessage({
          key: m.key,
          message: quoted
        });
        
        await sock.sendMessage(jid, {
          [mediaType.replace('Message', '')]: stream,
          caption: message,
          mimetype: media.mimetype
        });
      } else {
        await sock.sendMessage(jid, { text: message });
      }
      
      success++;

      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (err) {
      failed++;
      console.error(`Failed to send to ${jid}:`, err.message);
    }

    if ((i + 1) % 50 === 0) {
      await sock.sendMessage(sender, {
        text: `📊 *Progress:* ${i + 1}/${allJids.length}\n✅ Success: ${success}\n❌ Failed: ${failed}`
      });
    }
  }
  
  await sock.sendMessage(sender, {
    text: `✅ *Broadcast done*\n\n📊 *Total:* ${allJids.length}\n✅ *Success:* ${success}\n❌ *Failed:* ${failed}`
  });
}
