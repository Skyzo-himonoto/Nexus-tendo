import downloader from '../../../lib/downloader.js';
import { isValidUrl } from '../../../lib/utils.js';

export default async function mediafire(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .mediafire <url>' });
  if (!isValidUrl(args[0])) return await sock.sendMessage(sender, { text: '❌ URL tidak valid!' });
  
  await sock.sendMessage(sender, { text: '🔄 Processing...' });
  const result = await downloader.mediafire(args[0]);
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  
  await sock.sendMessage(sender, { text: `📦 MediaFire\n📝 ${result.title}\n📊 ${result.size}\n🔗 ${result.url}` });
}
