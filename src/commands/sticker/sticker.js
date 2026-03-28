import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function sticker(context) {
  const { sock, m, sender } = context;
  
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const isImage = quoted?.imageMessage || m.message?.imageMessage;
  const isVideo = quoted?.videoMessage || m.message?.videoMessage;
  const isSticker = quoted?.stickerMessage || m.message?.stickerMessage;
  
  let media, mimetype;
  if (isImage) media = quoted?.imageMessage || m.message?.imageMessage;
  else if (isVideo) media = quoted?.videoMessage || m.message?.videoMessage;
  else if (isSticker) media = quoted?.stickerMessage || m.message?.stickerMessage;
  else return await sock.sendMessage(sender, { text: '📝 Reply gambar/video dengan .sticker' });
  
  mimetype = media.mimetype;
  const stream = await sock.downloadMediaMessage({ key: m.key, message: quoted || m.message });
  const ext = mimetype.split('/')[1];
  const inputPath = path.join(config.tempPath, `${randomString()}.${ext}`);
  const outputPath = path.join(config.tempPath, `${randomString()}.webp`);
  
  await fs.writeFile(inputPath, stream);
  
  if (isImage || isSticker) {
    await sharp(inputPath).resize(512, 512, { fit: 'cover' }).webp({ quality: 80 }).toFile(outputPath);
  } else if (isVideo) {
    const ffmpeg = require('fluent-ffmpeg');
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .inputOptions(['-ss 0'])
        .outputOptions(['-vf', 'scale=512:512:force_original_aspect_ratio=increase,crop=512:512', '-t', '10', '-r', '15', '-loop', '0'])
        .toFormat('webp')
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });
  }
  
  await sock.sendMessage(sender, { sticker: { url: outputPath }, mimetype: 'image/webp' });
  await fs.unlink(inputPath);
  await fs.unlink(outputPath);
}
