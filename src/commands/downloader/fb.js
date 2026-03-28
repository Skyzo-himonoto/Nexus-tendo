import downloader from '../../../lib/downloader.js';
import { isValidUrl } from '../../../lib/utils.js';

export default async function fb(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .fb <url>' });
  if (!isValidUrl(args[0])) return await sock.sendMessage(sender, { text: '❌ URL tidak valid!' });
  
  await sock.sendMessage(sender, { text: '🔄 Downloading Facebook...' });
  const result = await downloader.facebook(args[0]);
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  
  await sock.sendMessage(sender, { video: { url: result.hd || result.sd }, caption: `🎬 Facebook\n📝 ${result.title}` });
}
