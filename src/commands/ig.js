import downloader from '../../lib/downloader.js';
import { isValidUrl } from '../../lib/utils.js';

export default async function ig(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.ig <url_instagram>\n\nContoh: .ig https://www.instagram.com/p/xxxxx'
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
  
  const result = await downloader.instagram(url);
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  for (const media of result.medias) {
    if (media.type === 'image') {
      await sock.sendMessage(sender, {
        image: { url: media.url },
        caption: result.caption || 'Instagram Post'
      });
    } else if (media.type === 'video') {
      await sock.sendMessage(sender, {
        video: { url: media.url },
        caption: result.caption || 'Instagram Video',
        mimetype: 'video/mp4'
      });
    }
  }
}
