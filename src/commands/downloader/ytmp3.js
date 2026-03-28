import downloader from '../../../lib/downloader.js';
import { formatBytes } from '../../../lib/utils.js';
import fs from 'fs-extra';

export default async function ytmp3(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .ytmp3 <url>' });
  
  await sock.sendMessage(sender, { text: '🔄 Downloading audio...' });
  const result = await downloader.ytdl(args[0], 'audio');
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  
  const caption = `🎵 ${result.title}\n⏱️ ${Math.floor(result.duration / 60)}:${result.duration % 60}\n📦 ${formatBytes(result.size)}`;
  await sock.sendMessage(sender, { audio: { url: result.path }, mimetype: 'audio/mpeg', fileName: `${result.title}.mp3`, caption });
  await fs.unlink(result.path);
}
