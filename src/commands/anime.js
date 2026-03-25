const axios = require('axios');
const config = require('../../config');

async function animeCommand(sock, sender, command, query) {
    if (!query && command !== 'waifu' && command !== 'neko') {
        await sock.sendMessage(sender, { 
            text: `❌ Masukkan judul\nContoh: .${command} naruto` 
        });
        return;
    }
    
    await sock.sendMessage(sender, { text: `🎌 Mencari info ${command}...` });
    
    try {
        if (command === 'anime') {
            const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
            const anime = response.data.data[0];
            
            if (anime) {
                const info = `🎌 *${anime.title}*\n\n` +
                    `📝 *Sinopsis:* ${anime.synopsis?.substring(0, 500) || '-'}\n\n` +
                    `⭐ *Skor:* ${anime.score || '-'}\n` +
                    `📅 *Rilis:* ${anime.aired?.from?.split('T')[0] || '-'}\n` +
                    `🎬 *Episode:* ${anime.episodes || '-'}\n` +
                    `🏷️ *Genre:* ${anime.genres?.map(g => g.name).join(', ') || '-'}\n` +
                    `🔗 *Link:* ${anime.url}`;
                await sock.sendMessage(sender, { text: info });
            } else {
                await sock.sendMessage(sender, { text: '❌ Anime tidak ditemukan!' });
            }
        }
        
        else if (command === 'manga') {
            const response = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=1`);
            const manga = response.data.data[0];
            
            if (manga) {
                const info = `📚 *${manga.title}*\n\n` +
                    `📝 *Sinopsis:* ${manga.synopsis?.substring(0, 500) || '-'}\n\n` +
                    `⭐ *Skor:* ${manga.score || '-'}\n` +
                    `📅 *Rilis:* ${manga.published?.from?.split('T')[0] || '-'}\n` +
                    `📖 *Chapter:* ${manga.chapters || '-'}\n` +
                    `🔗 *Link:* ${manga.url}`;
                await sock.sendMessage(sender, { text: info });
            } else {
                await sock.sendMessage(sender, { text: '❌ Manga tidak ditemukan!' });
            }
        }
        
        else if (command === 'waifu') {
            const response = await axios.get('https://api.waifu.pics/sfw/waifu');
            await sock.sendMessage(sender, { 
                image: { url: response.data.url }, 
                caption: '🌸 *Waifu Random*\n\nNikmati gambar waifu sayang' 
            });
        }        

        else if (command === 'neko') {
            const response = await axios.get('https://api.waifu.pics/sfw/neko');
            await sock.sendMessage(sender, { 
                image: { url: response.data.url }, 
                caption: '🐱 *Neko Random*\n\nKucing imut untukmu' 
            });
        }
        
    } catch (error) {
        console.error('Anime error:', error);
        await sock.sendMessage(sender, { text: '❌ Gagal mencari info anime, Coba lagi nanti.' });
    }
}

module.exports = { animeCommand };
