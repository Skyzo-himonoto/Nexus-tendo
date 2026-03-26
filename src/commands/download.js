const ytdl = require('ytdl-core');
const axios = require('axios');
const config = require('../../config');

async function downloadCommand(sock, sender, type, url) {
    if (!url) {
        await sock.sendMessage(sender, { 
            text: `❌ *Cara pakai:*\n.${type} [url]\n\n💡 Contoh:\n.${type} https://youtube.com/watch?v=xxx` 
        });
        return;
    }
    
    await sock.sendMessage(sender, { text: `🔄 Mendownload ${type.toUpperCase()}...` });
    
    try {
        // ========== YOUTUBE ==========
        if (type === 'ytmp3' || type === 'ytmp4' || type === 'yt') {
            if (!ytdl.validateURL(url)) {
                await sock.sendMessage(sender, { text: '❌ URL YouTube tidak valid!' });
                return;
            }
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
            
            if (type === 'ytmp3' || type === 'yt') {
                const stream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' });
                await sock.sendMessage(sender, {
                    audio: { stream: stream },
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`
                });
            } else {
                const stream = ytdl(url, { quality: '18', filter: 'videoandaudio' });
                await sock.sendMessage(sender, {
                    video: { stream: stream },
                    caption: `🎬 *${title}*`
                });
            }
            await sock.sendMessage(sender, { text: `✅ Download berhasil\n📌 ${title}` });
        }
        
        else if (type === 'ig' || type === 'instagram') {
            try {
                const response = await axios.get(`https://api.hikarime.my.id/api/download/ig?url=${encodeURIComponent(url)}`);
                const data = response.data;
                
                if (data.status && data.result) {
                    for (let media of data.result) {
                        if (media.type === 'image') {
                            await sock.sendMessage(sender, { image: { url: media.url }, caption: `📸 *INSTAGRAM*` });
                        } else if (media.type === 'video') {
                            await sock.sendMessage(sender, { video: { url: media.url }, caption: `📸 *INSTAGRAM REEL*` });
                        }
                    }
                    await sock.sendMessage(sender, { text: `✅ Download berhasil` });
                } else {
                    await sock.sendMessage(sender, { text: '❌ Gagal download Instagram' });
                }
            } catch (error) {
                await sock.sendMessage(sender, { text: '❌ Gagal download Instagram, Coba link lain.' });
            }
        }
        
        else if (type === 'tt' || type === 'tiktok') {
            try {
                const response = await axios.get(`https://api.hikarime.my.id/api/download/tt?url=${encodeURIComponent(url)}`);
                const data = response.data;
                
                if (data.status && data.result) {
                    await sock.sendMessage(sender, { 
                        video: { url: data.result.video }, 
                        caption: `🎵 *TIKTOK*\n\n👤 ${data.result.author || 'user'}\n📌 ${data.result.caption || ''}` 
                    });
                    await sock.sendMessage(sender, { text: `✅ Download berhasil` });
                } else {
                    await sock.sendMessage(sender, { text: '❌ Gagal download TikTok' });
                }
            } catch (error) {
                await sock.sendMessage(sender, { text: '❌ Gagal download TikTok' });
            }
        }
        
        else if (type === 'fb' || type === 'facebook') {
            try {
                const response = await axios.get(`https://api.hikarime.my.id/api/download/fb?url=${encodeURIComponent(url)}`);
                const data = response.data;
                
                if (data.status && data.result) {
                    await sock.sendMessage(sender, { 
                        video: { url: data.result.url }, 
                        caption: `📘 *FACEBOOK*\n\n✅ Download berhasil` 
                    });
                } else {
                    await sock.sendMessage(sender, { text: '❌ Gagal download Facebook!' });
                }
            } catch (error) {
                await sock.sendMessage(sender, { text: '❌ Gagal download Facebook!' });
            }
        }
        
        else if (type === 'twitter' || type === 'twt' || type === 'x') {
            try {
                const response = await axios.get(`https://api.hikarime.my.id/api/download/twitter?url=${encodeURIComponent(url)}`);
                const data = response.data;
                
                if (data.status && data.result) {
                    if (data.result.type === 'image') {
                        await sock.sendMessage(sender, { image: { url: data.result.url }, caption: `🐦 *TWITTER/X*` });
                    } else {
                        await sock.sendMessage(sender, { video: { url: data.result.url }, caption: `🐦 *TWITTER/X*` });
                    }
                    await sock.sendMessage(sender, { text: `✅ Download berhasil!` });
                } else {
                    await sock.sendMessage(sender, { text: '❌ Gagal download Twitter!' });
                }
            } catch (error) {
                await sock.sendMessage(sender, { text: '❌ Gagal download Twitter!' });
            }
        }
        
        else if (type === 'pinterest') {
            try {
                const response = await axios.get(`https://api.hikarime.my.id/api/search/pinterest?q=${encodeURIComponent(url)}`);
                const data = response.data;
                
                if (data.status && data.result) {
                    const images = data.result.slice(0, 5);
                    for (let img of images) {
                        await sock.sendMessage(sender, { image: { url: img }, caption: `📌 *PINTEREST*\nQuery: ${url}` });
                    }
                } else {
                    await sock.sendMessage(sender, { text: '❌ Gagal mencari gambar' });
                }
            } catch (error) {
                await sock.sendMessage(sender, { text: '❌ Gagal mencari gambar' });
            }
        }
        
    } catch (error) {
        console.error('Download error:', error);
        await sock.sendMessage(sender, { text: '❌ Gagal mendownload! Coba lagi.' });
    }
}

module.exports = { downloadCommand };
