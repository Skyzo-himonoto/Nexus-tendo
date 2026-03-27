import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { randomString } from '../../lib/utils.js';
import config from '../../config.js';

export default async function stickerwm(context) {
  const { sock, sender, m, args } = context;
  
  let textTop = '', textBottom = '';
  if (args.length > 0) {
    const fullText = args.join(' ');
    if (fullText.includes('|')) {
      [textTop, textBottom] = fullText.split('|');
    } else {
      textTop = fullText;
    }
  }
  
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const isImage = quoted?.imageMessage || m.message?.imageMessage;
  const isVideo = quoted?.videoMessage || m.message?.videoMessage;
  
  if (!isImage && !isVideo) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara membuat sticker watermark:*\n.stickerwm <teks atas>|<teks bawah>\n\nContoh: .stickerwm Bot|Quantum\n\n*Atau reply gambar/video dengan command di atas*'
    });
  }

  const stream = await sock.downloadMediaMessage({
    key: m.key,
    message: quoted || m.message
  });
  
  const mimetype = isImage ? (quoted?.imageMessage?.mimetype || m.message?.imageMessage?.mimetype) : (quoted?.videoMessage?.mimetype || m.message?.videoMessage?.mimetype);
  const ext = mimetype.split('/')[1];
  const inputPath = path.join(config.tempPath, `${randomString()}.${ext}`);
  const outputPath = path.join(config.tempPath, `${randomString()}.webp`);
  
  await fs.writeFile(inputPath, stream);
  let image = sharp(inputPath);
  const metadata = await image.metadata();
  
  let svgText = '';
  if (textTop) {
    svgText += `<text x="50%" y="20%" font-size="48" fill="white" stroke="black" stroke-width="2" text-anchor="middle">${textTop}</text>`;
  }
  if (textBottom) {
    svgText += `<text x="50%" y="80%" font-size="48" fill="white" stroke="black" stroke-width="2" text-anchor="middle">${textBottom}</text>`;
  }
  
  const svg = `<svg width="${metadata.width}" height="${metadata.height}">
    <style>
      text { font-family: Arial; font-weight: bold; }
    </style>
    ${svgText}
  </svg>`;

  await image
    .composite([{
      input: Buffer.from(svg),
      blend: 'over'
    }])
    .resize(512, 512, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(outputPath);

  await sock.sendMessage(sender, {
    sticker: { url: outputPath },
    mimetype: 'image/webp'
  });
  
  await fs.unlink(inputPath);
  await fs.unlink(outputPath);
}
