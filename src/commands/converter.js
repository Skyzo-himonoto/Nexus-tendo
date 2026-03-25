const sharp = require('sharp');
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
            text: `❌ *Cara pakai:*\n.${command} (balas media yang ingin dikonversi)\n\nContoh:\n.toaudio (balas video)\n.toimg (balas stiker)` 
        });
        return;
    }
    
    const processingMsg = config.converterMsg.processing.replace(/{type}/g, command);
    await sock.sendMessage(sender, { text: processingMsg });
    
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
                await sock.sendMessage(sender, { text: '❌ Balas video untuk konversi ke audio!' });
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
                await sock.sendMessage(sender, { text: '❌ Balas stiker untuk konversi ke gambar!' });
                return;
            }
            
            const imageBuffer = await sharp(mediaBuffer)
                .png()
                .toBuffer();
            
            await sock.sendMessage(sender, {
                image: imageBuffer,
                caption: '✅ *Konversi stiker ke gambar berhasil*'
            });
        }
        
        else if (command === 'togif') {
            if (mediaType !== 'video') {
                await sock.sendMessage(sender, { text: '❌ Balas video untuk konversi ke GIF' });
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
                caption: '✅ *GIF berhasil dibuat*'
            });
            
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        }
        
        else if (command === 'compress') {
            if (mediaType === 'image') {
                const compressed = await sharp(mediaBuffer)
                    .resize(800, 800, { fit: 'inside' })
                    .jpeg({ quality: 70 })
                    .toBuffer();
                
                await sock.sendMessage(sender, {
                    image: compressed,
                    caption: '✅ *Gambar berhasil dikompres*'
                });
            } else if (mediaType === 'video') {
                const inputPath = path.join(tempPath, `input_${Date.now()}.mp4`);
                const outputPath = path.join(tempPath, `output_${Date.now()}_compressed.mp4`);
                
                fs.writeFileSync(inputPath, mediaBuffer);
                
                await new Promise((resolve, reject) => {
                    exec(`ffmpeg -i ${inputPath} -vf "scale=640:-2" -c:v libx264 -crf 28 -preset fast ${outputPath}`, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                
                const compressedBuffer = fs.readFileSync(outputPath);
                await sock.sendMessage(sender, {
                    video: compressedBuffer,
                    caption: '✅ *Video berhasil dikompres!*'
                });
                
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            } else {
                await sock.sendMessage(sender, { text: '❌ Balas gambar atau video untuk kompres!' });
                return;
            }
        }
        
        await sock.sendMessage(sender, { text: config.converterMsg.success });
        
    } catch (error) {
        console.error('Converter error:', error);
        await sock.sendMessage(sender, { text: config.converterMsg.failed });
    }
}

module.exports = { converterCommand };
