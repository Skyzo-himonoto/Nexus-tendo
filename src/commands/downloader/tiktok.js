import downloader from '../../../lib/downloader.js';
import { isValidUrl } from '../../../lib/utils.js';

export default async function tiktok(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .tiktok <url>' });
  if (!isValidUrl(args[0])) return await sock.sendMessage(sender, { text: '❌ URL tidak valid!' });
  
  await sock.sendMessage(sender, { text: '🔄 Downloading TikTok...' });
  const result = await downloader.tiktok(args[0]);
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  
  await sock.sendMessage(sender, { video: { url: result.video }, caption: `🎬 TikTok\n📝 ${result.title}\n👤 @${result.author?.unique_id || 'unknown'}` });
}
