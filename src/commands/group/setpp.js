import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function setpp(context) {
  const { sock, sender, m, isGroup, isOwner } = context;
  
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const isImage = quoted?.imageMessage || m.message?.imageMessage;
  if (!isImage) return await sock.sendMessage(sender, { text: '📝 Reply gambar dengan .setpp' });
  
  let isGroupPp = false;
  if (isGroup) {
    const groupMetadata = await sock.groupMetadata(sender);
    const isAdmin = groupMetadata.participants.find(p => p.id === m.key.participant)?.admin === 'admin';
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin === 'admin';
    if (!isAdmin && !isOwner) return await sock.sendMessage(sender, { text: '❌ Hanya admin!' });
    if (!isBotAdmin) return await sock.sendMessage(sender, { text: '❌ Bot harus admin!' });
    isGroupPp = true;
  }
  
  const stream = await sock.downloadMediaMessage({ key: m.key, message: quoted || m.message });
  const inputPath = path.join(config.tempPath, `${randomString()}.jpg`);
  const outputPath = path.join(config.tempPath, `${randomString()}.jpg`);
  await fs.writeFile(inputPath, stream);
  await sharp(inputPath).resize(640, 640, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(outputPath);
  
  try {
    if (isGroupPp) await sock.updateProfilePicture(sender, { url: outputPath });
    else await sock.updateProfilePicture(sock.user.id, { url: outputPath });
    await sock.sendMessage(sender, { text: '✅ Foto profil berhasil diganti!' });
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Gagal: ${err.message}` });
  }
  
  await fs.unlink(inputPath);
  await fs.unlink(outputPath);
}
