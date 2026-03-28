import downloader from '../../../lib/downloader.js';

export default async function ytmp4(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .ytmp4 <url>' });
  
  await sock.sendMessage(sender, { text: '🔄 Downloading video...' });
  const result = await downloader.ytdl(args[0], 'video');
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  
  await sock.sendMessage(sender, { video: { url: result.url }, caption: `🎬 ${result.title}\n📺 ${result.quality}` });
}
