const fs = require('fs-extra');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

async function stickerCommand(sock, msg, type = 'sticker') {
    const sender = msg.key.remoteJid;
    const isQuoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    
    let mediaMsg = null;
    let mediaType = null;
    
    if (msg.message?.imageMessage) {
        mediaMsg = msg.message.imageMessage;
        mediaType = 'image';
    } else if (msg.message?.videoMessage) {
        mediaMsg = msg.message.videoMessage;
        mediaType = 'video';
    } else if (msg.message?.stickerMessage) {
        mediaMsg = msg.message.stickerMessage;
        mediaType = 'sticker';
    } else if (isQuoted?.imageMessage) {
        mediaMsg = isQuoted.imageMessage;
        mediaType = 'image';
    } else if (isQuoted?.videoMessage) {
        mediaMsg = isQuoted.videoMessage;
        mediaType = 'video';
    } else if (isQuoted?.stickerMessage) {
        mediaMsg = isQuoted.stickerMessage;
        mediaType = 'sticker';
    }
   
    if (type === 'ttp' && text && !mediaMsg) {
        const ttpText = text.replace('.ttp ', '');
        if (ttpText) {
            await sock.sendMessage(sender, { text: `🔄 Membuat text sticker...` });
            await sock.sendMessage(sender, {
                sticker: { url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(ttpText)}` }
            });
            return;
        }
    }
    
    if (!mediaMsg) {
        await sock.sendMessage(sender, { 
            text: `❌ *Cara pakai:*\n\n1. Balas gambar/video dengan .stiker\n2. Ketik .ttp [teks] untuk text sticker\n3. Balas video max 10 detik untuk sticker GIF` 
        });
        return;
    }
    
    await sock.sendMessage(sender, { text: `🎨 Membuat sticker...` });
    
    try {
        const mediaBuffer = await sock.downloadMediaMessage({
            message: { 
                [mediaType === 'image' ? 'imageMessage' : 
                 mediaType === 'video' ? 'videoMessage' : 'stickerMessage']: mediaMsg 
            },
            type: 'buffer'
        });
        
        const tempPath = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath, { recursive: true });
        
        if (mediaType === 'video') {
            const inputPath = path.join(tempPath, `input_${Date.now()}.mp4`);
            const outputPath = path.join(tempPath, `output_${Date.now()}.webp`);
            
            fs.writeFileSync(inputPath, mediaBuffer);
            
            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .videoFilters('fps=15,scale=512:512:flags=lanczos')
                    .outputOptions('-loop', '0')
                    .toFormat('webp')
                    .on('end', resolve)
                    .on('error', reject)
                    .save(outputPath);
            });
            
            const stickerBuffer = fs.readFileSync(outputPath);
            await sock.sendMessage(sender, { sticker: stickerBuffer });
            
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        } else {
            await sock.sendMessage(sender, { sticker: mediaBuffer });
        }
        
    } catch (error) {
        console.error('Sticker error:', error);
        await sock.sendMessage(sender, { text: '❌ Gagal membuat stiker' });
    }
}

async function stickerGifCommand(sock, msg) {
    await stickerCommand(sock, msg, 'gif');
}

module.exports = { stickerCommand, stickerGifCommand };
