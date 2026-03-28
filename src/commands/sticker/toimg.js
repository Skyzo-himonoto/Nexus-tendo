import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function toimg(context) {
  const { sock, m, sender } = context;
  
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const isSticker = quoted?.stickerMessage || m.message?.stickerMessage;
  if (!isSticker) return await sock.sendMessage(sender, { text: '📝 Reply sticker dengan .toimg' });
  
  const stream = await sock.downloadMediaMessage({ key: m.key, message: quoted || m.message });
  const inputPath = path.join(config.tempPath, `${randomString()}.webp`);
  const outputPath = path.join(config.tempPath, `${randomString()}.png`);
  await fs.writeFile(inputPath, stream);
  await sharp(inputPath).png().toFile(outputPath);
  await sock.sendMessage(sender, { image: { url: outputPath }, caption: '✨ Sticker to image' });
  await fs.unlink(inputPath);
  await fs.unlink(outputPath);
}
