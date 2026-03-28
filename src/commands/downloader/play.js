import ytdl from 'ytdl-core';
import yts from 'yt-search';
import fs from 'fs-extra';
import path from 'path';
import { randomString, formatBytes } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function play(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `📝 *Cara penggunaan:*\n.play <judul lagu>\n\n📋 *Contoh:*\n.play lagu indonesia\n.play tak ingin usai\n.play dangdut koplo\n\n🎵 *Mencari dan memutar lagu*`
    });
  }
  
  const query = args.join(' ');
  await sock.sendMessage(sender, { text: `🎵 *Mencari:* ${query}...` });
  
  try {
    const searchResults = await yts(query);
    if (!searchResults.videos.length) {
      return await sock.sendMessage(sender, { text: '❌ Tidak ditemukan!' });
    }
    
    const video = searchResults.videos[0];
    const url = video.url;
    const title = video.title;
    const duration = video.duration.seconds;
    const views = video.views;
    const author = video.author.name;
    
    const durasiMenit = Math.floor(duration / 60);
    const durasiDetik = duration % 60;
    
    await sock.sendMessage(sender, {
      text: `🎵 *PLAYING MUSIC*\n\n` +
        `┌─────────────────────────────────┐\n` +
        `│  🎤 *Judul:* ${title}\n` +
        `│  👤 *Artist:* ${author}\n` +
        `│  ⏱️ *Durasi:* ${durasiMenit}:${durasiDetik.toString().padStart(2, '0')}\n` +
        `│  👁️ *Views:* ${views.toLocaleString()}\n` +
        `└─────────────────────────────────┘\n\n` +
        `🔄 *Mengirim audio...*`
    });
    
    // Download audio
    const info = await ytdl.getInfo(url);
    const audioStream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });
    const filename = `${randomString()}.mp3`;
    const filepath = path.join(config.tempPath, filename);
    const writer = fs.createWriteStream(filepath);
    audioStream.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    const stats = await fs.stat(filepath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    
    await sock.sendMessage(sender, {
      audio: { url: filepath },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      caption: `🎵 *${title}*\n👤 ${author}\n⏱️ ${durasiMenit}:${durasiDetik}\n📦 ${sizeMB} MB`
    });
    
    await fs.unlink(filepath);
    
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ *Error:* ${err.message}` });
  }
}
