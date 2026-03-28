import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function setbotpp(context) {
  const { sock, sender, m, isOwner } = context;
  
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const isImage = quoted?.imageMessage || m.message?.imageMessage;
  if (!isImage) return await sock.sendMessage(sender, { text: '📝 Reply gambar dengan .setbotpp' });
  
  const stream = await sock.downloadMediaMessage({ key: m.key, message: quoted || m.message });
  const inputPath = path.join(config.tempPath, `${randomString()}.jpg`);
  const outputPath = path.join(config.tempPath, `${randomString()}.jpg`);
  await fs.writeFile(inputPath, stream);
  await sharp(inputPath).resize(640, 640, { fit: 'cover' }).jpeg({ quality: 80 }).toFile(outputPath);
  
  try {
    await sock.updateProfilePicture(sock.user.id, { url: outputPath });
    await sock.sendMessage(sender, { text: '✅ Foto profil bot berhasil diganti' });
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Gagal: ${err.message}` });
  }
  
  await fs.unlink(inputPath);
  await fs.unlink(outputPath);
}
