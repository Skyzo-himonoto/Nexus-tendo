import downloader from '../../lib/downloader.js';
import { isValidUrl, formatBytes } from '../../lib/utils.js';

export default async function mediafire(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.mediafire <url_mediafire>\n\nContoh: .mediafire https://www.mediafire.com/file/xxxxx'
    });
  }
  
  const url = args[0];
  
  if (!isValidUrl(url)) {
    return await sock.sendMessage(sender, {
      text: '❌ URL tidak valid!'
    });
  }
  
  await sock.sendMessage(sender, {
    text: '🔄 *Sedang memproses...*\nMohon tunggu sebentar.'
  });
  
  const result = await downloader.mediafire(url);
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  const caption = `📦 *MediaFire File*\n📝 *Nama:* ${result.title}\n📊 *Size:* ${result.size}\n\n🔗 *Link:* ${result.url}`;
  
  await sock.sendMessage(sender, {
    text: caption
  });
}
