import downloader from '../../lib/downloader.js';
import { formatBytes } from '../../lib/utils.js';
import fs from 'fs-extra';

export default async function ytmp3(context) {
  const { sock, sender, args, messageText } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.ytmp3 <url_youtube>\n\nContoh: .ytmp3 https://youtu.be/xxxxx'
    });
  }
  
  const url = args[0];
  
  await sock.sendMessage(sender, {
    text: '🔄 *Sedang memproses...*\nMohon tunggu sebentar.'
  });
  
  const result = await downloader.ytdl(url, 'audio');
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  const caption = `🎵 *${result.title}*\n⏱️ *Durasi:* ${Math.floor(result.duration / 60)} menit ${result.duration % 60} detik\n📦 *Size:* ${formatBytes(result.size)}`;
  
  await sock.sendMessage(sender, {
    audio: { url: result.path },
    mimetype: 'audio/mpeg',
    fileName: `${result.title}.mp3`,
    caption: caption
  });

  await fs.unlink(result.path);
}
