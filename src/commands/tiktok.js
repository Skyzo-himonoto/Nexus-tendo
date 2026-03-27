import downloader from '../../lib/downloader.js';
import { isValidUrl } from '../../lib/utils.js';

export default async function tiktok(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.tiktok <url_tiktok>\n\nContoh: .tiktok https://vt.tiktok.com/xxxxx'
    });
  }
  
  const url = args[0];
  
  if (!isValidUrl(url)) {
    return await sock.sendMessage(sender, {
      text: '❌ URL tidak valid!'
    });
  }
  
  await sock.sendMessage(sender, {
    text: '🔄 *Sedang mendownload...*\nMohon tunggu sebentar.'
  });
  
  const result = await downloader.tiktok(url);
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  const caption = `🎬 *TikTok Video*\n📝 *Title:* ${result.title}\n👤 *Author:* @${result.author.unique_id || 'unknown'}`;
  
  await sock.sendMessage(sender, {
    video: { url: result.video },
    caption: caption,
    mimetype: 'video/mp4'
  });
}
