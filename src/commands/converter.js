const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const config = require('../../config');

async function converterCommand(sock, msg, command) {
    const sender = msg.key.remoteJid;
    const isQuoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    let mediaMsg = null;
    let mediaType = null;
    
    if (msg.message?.videoMessage) {
        mediaMsg = msg.message.videoMessage;
        mediaType = 'video';
    } else if (msg.message?.imageMessage) {
        mediaMsg = msg.message.imageMessage;
        mediaType = 'image';
    } else if (msg.message?.stickerMessage) {
        mediaMsg = msg.message.stickerMessage;
        mediaType = 'sticker';
    } else if (isQuoted) {
        if (isQuoted.videoMessage) {
            mediaMsg = isQuoted.videoMessage;
            mediaType = 'video';
        } else if (isQuoted.imageMessage) {
            mediaMsg = isQuoted.imageMessage;
            mediaType = 'image';
        } else if (isQuoted.stickerMessage) {
            mediaMsg = isQuoted.stickerMessage;
            mediaType = 'sticker';
        }
    }
    
    if (!mediaMsg) {
        await sock.sendMessage(sender, { 
            text: `❌ *Cara pakai:*\n.${command} (balas media)\n\nContoh:\n.toaudio (balas video)\n.toimg (balas stiker)` 
        });
        return;
    }
    
    await sock.sendMessage(sender, { text: `🔄 Mengkonversi ${command}...` });
    
    try {
        const mediaBuffer = await sock.downloadMediaMessage({
            message: { 
                [mediaMsg.type === 'imageMessage' ? 'imageMessage' : 
                 mediaMsg.type === 'videoMessage' ? 'videoMessage' : 'stickerMessage']: mediaMsg 
            },
            type: 'buffer'
        });
        
        const tempPath = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);
        
        if (command === 'toaudio' || command === 'tomp3') {
            if (mediaType !== 'video') {
                await sock.sendMessage(sender, { text: '❌ Balas video' });
                return;
            }
            
            const inputPath = path.join(tempPath, `input_${Date.now()}.mp4`);
            const outputPath = path.join(tempPath, `output_${Date.now()}.mp3`);
            
            fs.writeFileSync(inputPath, mediaBuffer);
            
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${inputPath} -q:a 0 -map a ${outputPath}`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            const audioBuffer = fs.readFileSync(outputPath);
            await sock.sendMessage(sender, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `audio_${Date.now()}.mp3`
            });
            
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        }
        
        else if (command === 'toimg' || command === 'toimage') {
            if (mediaType !== 'sticker') {
                await sock.sendMessage(sender, { text: '❌ Balas stiker' });
                return;
            }
            
            await sock.sendMessage(sender, {
                image: mediaBuffer,
                caption: '✅ *Konversi berhasil*'
            });
        }
        
        else if (command === 'togif') {
            if (mediaType !== 'video') {
                await sock.sendMessage(sender, { text: '❌ Balas video!' });
                return;
            }
            
            const inputPath = path.join(tempPath, `input_${Date.now()}.mp4`);
            const outputPath = path.join(tempPath, `output_${Date.now()}.gif`);
            
            fs.writeFileSync(inputPath, mediaBuffer);
            
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${inputPath} -vf "fps=10,scale=320:-1:flags=lanczos" -loop 0 ${outputPath}`, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            
            const gifBuffer = fs.readFileSync(outputPath);
            await sock.sendMessage(sender, {
                video: gifBuffer,
                gifPlayback: true,
                caption: '✅ *GIF berhasi*'
            });
            
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        }
        
        else {
            await sock.sendMessage(sender, { text: `⚠️ Fitur ${command} dalam pengembangan` });
        }
        
        await sock.sendMessage(sender, { text: '✅ Selesai' });
        
    } catch (error) {
        console.error('Converter error:', error);
        await sock.sendMessage(sender, { text: '❌ Gagal konversi' });
    }
}

module.exports = { converterCommand };
