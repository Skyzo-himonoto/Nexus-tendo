import qrcode from 'qrcode';
import fs from 'fs-extra';
import path from 'path';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function qrcodeCmd(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .qrcode <teks atau link>' });
  
  const text = args.join(' ');
  const qrPath = path.join(config.tempPath, `${randomString()}.png`);
  await qrcode.toFile(qrPath, text, { width: 500 });
  await sock.sendMessage(sender, { image: { url: qrPath }, caption: `📱 QR Code\n🔗 ${text}` });
  await fs.unlink(qrPath);
}
