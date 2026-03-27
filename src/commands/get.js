import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { randomString, isValidUrl } from '../../lib/utils.js';
import config from '../../config.js';

export default async function get(context) {
  const { sock, sender, isOwner, args } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.get <url>\n\n📋 *Contoh:*\n.get https://example.com/image.jpg\n.get https://example.com/file.pdf\n\n📌 *Fitur:*\n- Download file dari URL\n- Auto detect file type\n- Max size 50MB'
    });
  }
  
  const url = args[0];
  
  if (!isValidUrl(url)) {
    return await sock.sendMessage(sender, {
      text: '❌ URL tidak valid!'
    });
  }
  
  await sock.sendMessage(sender, {
    text: '📥 *Downloading file...*\nMohon tunggu sebentar.'
  });
  
  try {
    const headResponse = await axios.head(url);
    const contentType = headResponse.headers['content-type'];
    const contentLength = parseInt(headResponse.headers['content-length'] || 0);
    
    if (contentLength > 50 * 1024 * 1024) {
      return await sock.sendMessage(sender, {
        text: `❌ File terlalu besar! Maksimal 50MB.\n📦 *Size:* ${(contentLength / 1024 / 1024).toFixed(2)}MB`
      });
    }
    
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });
    
    const ext = contentType.split('/')[1] || 'bin';
    const filename = `${randomString()}.${ext}`;
    const filepath = path.join(config.tempPath, filename);
    
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    const stats = await fs.stat(filepath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    
    if (contentType.startsWith('image/')) {
      await sock.sendMessage(sender, {
        image: { url: filepath },
        caption: `🖼️ *Image Downloaded*\n\n🔗 *Source:* ${url}\n📦 *Size:* ${sizeMB}MB`
      });
    } else if (contentType.startsWith('video/')) {
      await sock.sendMessage(sender, {
        video: { url: filepath },
        caption: `🎬 *Video Downloaded*\n\n🔗 *Source:* ${url}\n📦 *Size:* ${sizeMB}MB`,
        mimetype: contentType
      });
    } else if (contentType.startsWith('audio/')) {
      await sock.sendMessage(sender, {
        audio: { url: filepath },
        mimetype: contentType,
        fileName: filename,
        caption: `🎵 *Audio Download*\n\n🔗 *Source:* ${url}\n📦 *Size:* ${sizeMB}MB`
      });
    } else {
      await sock.sendMessage(sender, {
        document: { url: filepath },
        mimetype: contentType,
        fileName: filename,
        caption: `📄 *File Downloaded*\n\n🔗 *Source:* ${url}\n📦 *Size:* ${sizeMB}MB\n📁 *Type:* ${contentType}`
      });
    }
    
    await fs.unlink(filepath);
    
  } catch (err) {
    await sock.sendMessage(sender, {
      text: `❌ *Download failed:* ${err.message}`
    });
  }
}
