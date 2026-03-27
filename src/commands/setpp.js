import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { randomString } from '../../lib/utils.js';
import config from '../../config.js';

export default async function setpp(context) {
  const { sock, sender, m, isGroup, isOwner } = context;
  
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const isImage = quoted?.imageMessage || m.message?.imageMessage;
  
  if (!isImage) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\nReply gambar dengan .setpp\n\nAtau kirim gambar dengan caption .setpp'
    });
  }
  
  let targetJid = sender;
  let isGroupPp = false;
  
  if (isGroup) {
    const groupMetadata = await sock.groupMetadata(sender);
    const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin' || 
                    groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'superadmin';
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin' ||
                       groupMetadata.participants.find(p => p.id === botId)?.admin === 'superadmin';
    
    if (!isAdmin && !isOwner) {
      return await sock.sendMessage(sender, { text: '❌ Hanya admin yang bisa mengganti foto grup!' });
    }
    
    if (!isBotAdmin) {
      return await sock.sendMessage(sender, { text: '❌ Bot harus menjadi admin untuk mengganti foto grup!' });
    }
    
    isGroupPp = true;
  }

  const stream = await sock.downloadMediaMessage({
    key: m.key,
    message: quoted || m.message
  });
  
  const inputPath = path.join(config.tempPath, `${randomString()}.jpg`);
  const outputPath = path.join(config.tempPath, `${randomString()}.jpg`);
  
  await fs.writeFile(inputPath, stream);
  await sharp(inputPath)
    .resize(640, 640, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toFile(outputPath);

  try {
    if (isGroupPp) {
      await sock.updateProfilePicture(sender, { url: outputPath });
      await sock.sendMessage(sender, { text: '✅ *Berhasil mengganti foto grup!*' });
    } else {
      await sock.updateProfilePicture(sock.user.id, { url: outputPath });
      await sock.sendMessage(sender, { text: '✅ *Berhasil mengganti foto profil bot!*' });
    }
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ *Gagal mengganti foto:* ${err.message}` });
  }

  await fs.unlink(inputPath);
  await fs.unlink(outputPath);
}
