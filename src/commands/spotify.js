import downloader from '../../lib/downloader.js';
import { isValidUrl } from '../../lib/utils.js';

export default async function spotify(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.spotify <url_spotify>\n\nContoh: .spotify https://open.spotify.com/track/xxxxx'
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
  
  const result = await downloader.spotify(url);
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  const caption = `🎵 *Spotify Track*\n📝 *Title:* ${result.title}\n🎤 *Artist:* ${result.artist}\n⏱️ *Duration:* ${result.duration}`;
  
  await sock.sendMessage(sender, {
    audio: { url: result.url },
    mimetype: 'audio/mpeg',
    fileName: `${result.title}.mp3`,
    caption: caption
  });
}
