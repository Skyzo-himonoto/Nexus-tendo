import downloader from '../../../lib/downloader.js';
import { isValidUrl } from '../../../lib/utils.js';

export default async function twitter(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .twitter <url>' });
  if (!isValidUrl(args[0])) return await sock.sendMessage(sender, { text: '❌ URL tidak valid!' });
  
  await sock.sendMessage(sender, { text: '🔄 Downloading Twitter/X...' });
  const result = await downloader.twitter(args[0]);
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  
  for (const media of result.medias) {
    if (media.type === 'photo') await sock.sendMessage(sender, { image: { url: media.url }, caption: result.title || 'Twitter' });
    else await sock.sendMessage(sender, { video: { url: media.url }, caption: result.title || 'Twitter Video' });
  }
}
