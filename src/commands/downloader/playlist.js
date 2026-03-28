import yts from 'yt-search';
import ytdl from 'ytdl-core';
import fs from 'fs-extra';
import path from 'path';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function playlist(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `📝 *Cara penggunaan:*\n.playlist <judul playlist>\n\n📋 *Contoh:*\n.playlist lagu santai\n.playlist dangdut terbaru\n\n🎵 *Mencari dan memutar 5 lagu pertama dari playlist!*`
    });
  }
  
  const query = args.join(' ');
  await sock.sendMessage(sender, { text: `🎵 *Mencari playlist:* ${query}...` });
  
  try {
    const searchResults = await yts(query);
    if (!searchResults.videos.length) {
      return await sock.sendMessage(sender, { text: '❌ Tidak ditemukan!' });
    }
    
    const videos = searchResults.videos.slice(0, 5); 
    await sock.sendMessage(sender, {
      text: `🎵 *PLAYLIST SONGS*\n\n${videos.map((v, i) => `${i+1}. ${v.title} (${v.duration.timestamp})`).join('\n')}\n\n🔄 *Mengirim audio...*`
    });
    
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      const url = video.url;
      const title = video.title;
      
      const audioStream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });
      const filename = `${randomString()}.mp3`;
      const filepath = path.join(config.tempPath, filename);
      const writer = fs.createWriteStream(filepath);
      audioStream.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      
      await sock.sendMessage(sender, {
        audio: { url: filepath },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`,
        caption: `🎵 *${i+1}. ${title}*`
      });
      
      await fs.unlink(filepath);
      await new Promise(r => setTimeout(r, 1000)); // delay 1 detik antar lagu, biar ga error 
    }
    
    await sock.sendMessage(sender, { text: '✅ *Playlist selesai diputar!*' });
    
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ *Error:* ${err.message}` });
  }
}
