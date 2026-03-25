const axios = require('axios');
const config = require('../../config');

async function searchCommand(sock, sender, type, query) {
    const prefix = config.prefix;
    
    if (!query) {
        await sock.sendMessage(sender, { text: `❌ Masukkan pencarian\nContoh: ${prefix}${type} kucing` });
        return;
    }
    
    switch(type) {
        case 'google':
        case 'g':
            try {
                const response = await axios.get(`https://api.popcat.xyz/search?q=${encodeURIComponent(query)}`);
                const results = response.data.slice(0, 5);
                let text = `🔍 *HASIL PENCARIAN GOOGLE*\n\n`;
                results.forEach((r, i) => {
                    text += `${i+1}. *${r.title}*\n   ${r.description}\n   🔗 ${r.url}\n\n`;
                });
                await sock.sendMessage(sender, { text });
            } catch {
                await sock.sendMessage(sender, { text: '❌ Gagal mencari!' });
            }
            break;
            
        case 'wiki':
        case 'wikipedia':
            try {
                const response = await axios.get(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
                const data = response.data;
                await sock.sendMessage(sender, { text: `📚 *WIKIPEDIA*\n\n${data.title}\n\n${data.extract}\n\n🔗 ${data.content_urls.desktop.page}` });
            } catch {
                await sock.sendMessage(sender, { text: '❌ Tidak ditemukan!' });
            }
            break;
            
        case 'youtube':
        case 'yt':
            try {
                const response = await axios.get(`https://api.popcat.xyz/ytsearch?q=${encodeURIComponent(query)}`);
                const result = response.data[0];
                await sock.sendMessage(sender, { text: `🎬 *YOUTUBE SEARCH*\n\n*${result.title}*\n📺 Channel: ${result.uploaderName}\n👁️ Views: ${result.views}\n⏱️ Duration: ${result.duration}\n🔗 ${result.url}` });
            } catch {
                await sock.sendMessage(sender, { text: '❌ Tidak ditemukan!' });
            }
            break;
            
        case 'pinterest':
            try {
                const response = await axios.get(`https://api.popcat.xyz/pinterest?q=${encodeURIComponent(query)}`);
                const images = response.data.slice(0, 5);
                for (let img of images) {
                    await sock.sendMessage(sender, { image: { url: img }, caption: `📌 *PINTEREST*\nQuery: ${query}` });
                }
            } catch {
                await sock.sendMessage(sender, { text: '❌ Gagal mencari gambar!' });
            }
            break;
            
        case 'npm':
            try {
                const response = await axios.get(`https://api.popcat.xyz/npm?q=${encodeURIComponent(query)}`);
                const data = response.data;
                await sock.sendMessage(sender, { text: `📦 *NPM PACKAGE*\n\n*${data.name}* v${data.version}\n\n${data.description}\n\n📥 Weekly: ${data.weeklyDownloads}\n🔗 ${data.links.npm}` });
            } catch {
                await sock.sendMessage(sender, { text: '❌ Package tidak ditemukan!' });
            }
            break;
            
        case 'github':
            try {
                const response = await axios.get(`https://api.github.com/repos/${query}`);
                const data = response.data;
                await sock.sendMessage(sender, { text: `🐙 *GITHUB REPO*\n\n*${data.full_name}*\n\n${data.description || 'No description'}\n\n⭐ Stars: ${data.stargazers_count}\n🍴 Forks: ${data.forks_count}\n🔗 ${data.html_url}` });
            } catch {
                await sock.sendMessage(sender, { text: '❌ Repo tidak ditemukan!' });
            }
            break;
            
        case 'tts':
        case 'texttospeech':
            await sock.sendMessage(sender, { text: `🔊 *TTS*\n\n${query}` });
            break;
            
        default:
            const searchButtons = [
                { index: 1, quickReplyButton: { displayText: '🔍 GOOGLE', id: `${prefix}google` } },
                { index: 2, quickReplyButton: { displayText: '📚 WIKIPEDIA', id: `${prefix}wiki` } },
                { index: 3, quickReplyButton: { displayText: '🎬 YOUTUBE', id: `${prefix}yt` } },
                { index: 4, quickReplyButton: { displayText: '📌 PINTEREST', id: `${prefix}pinterest` } },
                { index: 5, quickReplyButton: { displayText: '🐙 GITHUB', id: `${prefix}github` } }
            ];
            await sock.sendMessage(sender, {
                text: `🔍 *SEARCH MENU*\n\n` +
                    `┌─────────────────────────────────┐\n` +
                    `│  🔍 .google [query]\n` +
                    `│  📚 .wiki [query]\n` +
                    `│  🎬 .yt [query]\n` +
                    `│  📌 .pinterest [query]\n` +
                    `│  📦 .npm [package]\n` +
                    `│  🐙 .github [user/repo]\n` +
                    `└─────────────────────────────────┘`,
                templateButtons: searchButtons
            });
            break;
    }
}

module.exports = { searchCommand };
