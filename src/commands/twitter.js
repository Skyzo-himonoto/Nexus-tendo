import downloader from '../../lib/downloader.js';
import { isValidUrl } from '../../lib/utils.js';

export default async function twitter(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.twitter <url_twitter>\n\nContoh: .twitter https://twitter.com/user/status/xxxxx'
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
  
  const result = await downloader.twitter(url);
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  for (const media of result.medias) {
    if (media.type === 'photo') {
      await sock.sendMessage(sender, {
        image: { url: media.url },
        caption: result.title || 'Twitter Post'
      });
    } else if (media.type === 'video') {
      await sock.sendMessage(sender, {
        video: { url: media.url },
        caption: result.title || 'Twitter Video',
        mimetype: 'video/mp4'
      });
    }
  }
}
