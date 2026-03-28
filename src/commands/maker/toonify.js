import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import FormData from 'form-data';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function toonify(context) {
  const { sock, sender, m } = context;
  
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const isImage = quoted?.imageMessage || m.message?.imageMessage;
  
  if (!isImage) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\nReply gambar dengan .toonify\n\n🎨 *Ubah foto jadi gaya kartun!*'
    });
  }
  
  await sock.sendMessage(sender, { text: '🎨 *Mengubah ke gaya kartun...*' });
  
  try {
    const stream = await sock.downloadMediaMessage({ key: m.key, message: quoted || m.message });
    const inputPath = path.join(config.tempPath, `${randomString()}.jpg`);
    await fs.writeFile(inputPath, stream);
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(inputPath));
    
    const response = await axios.post('https://api.ryzendesu.vip/api/maker/toonify', formData, {
      headers: formData.getHeaders(),
      responseType: 'arraybuffer'
    });
    
    const outputPath = path.join(config.tempPath, `${randomString()}.png`);
    await fs.writeFile(outputPath, response.data);
    
    await sock.sendMessage(sender, {
      image: { url: outputPath },
      caption: '✨ *Hasil ke gaya kartun!*'
    });
    
    await fs.unlink(inputPath);
    await fs.unlink(outputPath);
    
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ *Error:* ${err.message}` });
  }
}
