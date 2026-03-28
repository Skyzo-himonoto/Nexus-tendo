import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function stickerwm(context) {
  const { sock, m, sender, args } = context;
  
  let textTop = '', textBottom = '';
  if (args.length > 0) {
    const full = args.join(' ');
    if (full.includes('|')) [textTop, textBottom] = full.split('|');
    else textTop = full;
  }
  
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const isImage = quoted?.imageMessage || m.message?.imageMessage;
  if (!isImage) return await sock.sendMessage(sender, { text: '📝 Reply gambar dengan .stickerwm teks|teks' });
  
  const stream = await sock.downloadMediaMessage({ key: m.key, message: quoted || m.message });
  const inputPath = path.join(config.tempPath, `${randomString()}.jpg`);
  const outputPath = path.join(config.tempPath, `${randomString()}.webp`);
  await fs.writeFile(inputPath, stream);
  
  let image = sharp(inputPath);
  const metadata = await image.metadata();
  let svgText = '';
  if (textTop) svgText += `<text x="50%" y="20%" font-size="48" fill="white" stroke="black" stroke-width="2" text-anchor="middle">${textTop}</text>`;
  if (textBottom) svgText += `<text x="50%" y="80%" font-size="48" fill="white" stroke="black" stroke-width="2" text-anchor="middle">${textBottom}</text>`;
  const svg = `<svg width="${metadata.width}" height="${metadata.height}"><style>text{font-family:Arial;font-weight:bold}</style>${svgText}</svg>`;
  
  await image.composite([{ input: Buffer.from(svg), blend: 'over' }]).resize(512, 512, { fit: 'cover' }).webp({ quality: 80 }).toFile(outputPath);
  await sock.sendMessage(sender, { sticker: { url: outputPath }, mimetype: 'image/webp' });
  await fs.unlink(inputPath);
  await fs.unlink(outputPath);
}
