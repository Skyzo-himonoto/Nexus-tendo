const ytdl = require('ytdl-core');
const yts = require('yt-search');
const config = require('../../config');

async function playCommand(sock, sender, query) {
    if (!query) {
        await sock.sendMessage(sender, { 
            text: `❌ *Cara pakai:*\n.play [judul lagu/url]\n\n💡 Contoh:\n.play lagu indonesia\n.play https://youtu.be/xxx` 
        });
        return;
    }
    
    await sock.sendMessage(sender, { text: `🎵 *Mencari:* ${query}...` });
    
    try {
        let url;
        if (ytdl.validateURL(query)) {
            url = query;
        } else {
          
            const searchResults = await yts(query);
            if (!searchResults.videos.length) {
                await sock.sendMessage(sender, { text: '❌ Tidak ditemukan!' });
                return;
            }
            url = searchResults.videos[0].url;
        }
        
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;
        const duration = info.videoDetails.lengthSeconds;
        const views = info.videoDetails.viewCount;
        const uploadDate = info.videoDetails.uploadDate;
        
        const durasiMenit = Math.floor(duration / 60);
        const durasiDetik = duration % 60;
        
        await sock.sendMessage(sender, { 
            text: `🎵 *PLAYING MUSIC*\n\n` +
                `┌─────────────────────────────────┐\n` +
                `│  🎤 *Judul:* ${title}\n` +
                `│  ⏱️ *Durasi:* ${durasiMenit}:${durasiDetik.toString().padStart(2, '0')}\n` +
                `│  👁️ *Views:* ${Number(views).toLocaleString()}\n` +
                `│  📅 *Rilis:* ${uploadDate}\n` +
                `└─────────────────────────────────┘\n\n` +
                `🔄 *Mengirim audio...*`
        });
        
        const stream = ytdl(url, { 
            quality: 'highestaudio',
            filter: 'audioonly'
        });
        
        await sock.sendMessage(sender, {
            audio: { stream: stream },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            ptt: false
        });
        
    } catch (error) {
        console.error('Play error:', error);
        await sock.sendMessage(sender, { text: '❌ Gagal memutar lagu, Coba lagi.' });
    }
}

module.exports = { playCommand };
