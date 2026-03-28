import downloader from '../../../lib/downloader.js';
import { isValidUrl } from '../../../lib/utils.js';

export default async function spotify(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .spotify <url>' });
  if (!isValidUrl(args[0])) return await sock.sendMessage(sender, { text: '❌ URL tidak valid!' });
  
  await sock.sendMessage(sender, { text: '🔄 Download Spotify...' });
  const result = await downloader.spotify(args[0]);
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  
  await sock.sendMessage(sender, { audio: { url: result.url }, mimetype: 'audio/mpeg', fileName: `${result.title}.mp3`, caption: `🎵 Spotify\n📝 ${result.title}\n🎤 ${result.artist}` });
}
