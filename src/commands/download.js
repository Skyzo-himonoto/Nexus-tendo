const ytdl = require('ytdl-core');
const axios = require('axios');
const config = require('../../config');

async function downloadCommand(sock, sender, type, url) {
    if (!url) {
        const msg = config.downloadMsg.noUrl.replace(/{command}/g, type);
        await sock.sendMessage(sender, { text: msg });
        return;
    }
    
    const processingMsg = config.downloadMsg.processing.replace(/{type}/g, type);
    await sock.sendMessage(sender, { text: processingMsg });
    
    try {
        if (type === 'ytmp3' || type === 'ytmp4' || type === 'yt') {
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title;
            
            if (type === 'ytmp3' || type === 'yt') {
                const stream = ytdl(url, { quality: 'highestaudio' });
                await sock.sendMessage(sender, {
                    audio: stream,
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`
                });
            } else {
                const stream = ytdl(url, { quality: '18' });
                await sock.sendMessage(sender, {
                    video: stream,
                    caption: `🎬 *${title}*`
                });
            }
            
            const successMsg = config.downloadMsg.success
                .replace(/{title}/g, title);
            await sock.sendMessage(sender, { text: successMsg });
        }

        else if (type === 'ig' || type === 'instagram') {
            await sock.sendMessage(sender, { text: '📸 Fitur Instagram dalam pengembangan!' });
        }
        
        else if (type === 'tt' || type === 'tiktok') {
            await sock.sendMessage(sender, { text: '🎵 Fitur TikTok dalam pengembangan!' });
        }
        
        else if (type === 'fb' || type === 'facebook') {
            await sock.sendMessage(sender, { text: '📘 Fitur Facebook dalam pengembangan!' });
        }

        else if (type === 'twitter' || type === 'twt' || type === 'x') {
            await sock.sendMessage(sender, { text: '🐦 Fitur Twitter dalam pengembangan!' });
        }
        
    } catch (error) {
        console.error('Download error:', error);
        await sock.sendMessage(sender, { text: config.downloadMsg.failed });
    }
}

module.exports = { downloadCommand };
