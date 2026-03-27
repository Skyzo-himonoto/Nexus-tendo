import downloader from '../../lib/downloader.js';
import { isValidUrl } from '../../lib/utils.js';

export default async function fb(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.fb <url_facebook>\n\nContoh: .fb https://www.facebook.com/watch/?v=xxxxx'
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
  
  const result = await downloader.facebook(url);
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  const caption = `🎬 *Facebook Video*\n📝 *Title:* ${result.title}`;
  const videoUrl = result.hd || result.sd;
  
  await sock.sendMessage(sender, {
    video: { url: videoUrl },
    caption: caption,
    mimetype: 'video/mp4'
  });
}
