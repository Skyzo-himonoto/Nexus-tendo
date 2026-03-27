import downloader from '../../lib/downloader.js';

export default async function ytmp4(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.ytmp4 <url_youtube>\n\nContoh: .ytmp4 https://youtu.be/xxxxx'
    });
  }
  
  const url = args[0];
  
  await sock.sendMessage(sender, {
    text: '🔄 *Sedang memproses...*\nMohon tunggu sebentar.'
  });
  
  const result = await downloader.ytdl(url, 'video');
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  const caption = `🎬 *${result.title}*\n⏱️ *Durasi:* ${Math.floor(result.duration / 60)} menit ${result.duration % 60} detik\n📺 *Kualitas:* ${result.quality}`;
  
  await sock.sendMessage(sender, {
    video: { url: result.url },
    caption: caption,
    mimetype: 'video/mp4'
  });
}
