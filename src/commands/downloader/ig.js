import downloader from '../../../lib/downloader.js';
import { isValidUrl } from '../../../lib/utils.js';

export default async function ig(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .ig <url>' });
  if (!isValidUrl(args[0])) return await sock.sendMessage(sender, { text: '❌ URL tidak valid!' });
  
  await sock.sendMessage(sender, { text: '🔄 Downloading Instagram...' });
  const result = await downloader.instagram(args[0]);
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  
  for (const media of result.medias) {
    if (media.type === 'image') await sock.sendMessage(sender, { image: { url: media.url }, caption: result.caption || 'Instagram' });
    else await sock.sendMessage(sender, { video: { url: media.url }, caption: result.caption || 'Instagram Reel' });
  }
}
