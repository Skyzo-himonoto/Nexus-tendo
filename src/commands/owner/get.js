import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { randomString, isValidUrl } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function get(context) {
  const { sock, sender, isOwner, args } = context;
  
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .get <url>' });
  
  const url = args[0];
  if (!isValidUrl(url)) return await sock.sendMessage(sender, { text: '❌ URL tidak valid' });
  
  await sock.sendMessage(sender, { text: '📥 Downloading file...' });
  
  try {
    const headRes = await axios.head(url);
    const contentType = headRes.headers['content-type'];
    const contentLength = parseInt(headRes.headers['content-length'] || 0);
    
    if (contentLength > 50 * 1024 * 1024) {
      return await sock.sendMessage(sender, { text: `❌ File terlalu besar! Max 50MB` });
    }
    
    const response = await axios({ method: 'GET', url, responseType: 'stream' });
    const ext = contentType.split('/')[1] || 'bin';
    const filename = `${randomString()}.${ext}`;
    const filepath = path.join(config.tempPath, filename);
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    const sizeMB = (await fs.stat(filepath)).size / 1024 / 1024;
    
    if (contentType.startsWith('image/')) {
      await sock.sendMessage(sender, { image: { url: filepath }, caption: `🖼️ Downloaded\n📦 ${sizeMB.toFixed(2)}MB` });
    } else if (contentType.startsWith('video/')) {
      await sock.sendMessage(sender, { video: { url: filepath }, caption: `🎬 Downloaded\n📦 ${sizeMB.toFixed(2)}MB` });
    } else {
      await sock.sendMessage(sender, { document: { url: filepath }, fileName: filename, caption: `📄 Downloaded\n📦 ${sizeMB.toFixed(2)}MB` });
    }
    
    await fs.unlink(filepath);
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Error: ${err.message}` });
  }
}
