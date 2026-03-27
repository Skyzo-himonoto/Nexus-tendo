import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { randomString } from '../../lib/utils.js';
import config from '../../config.js';

export default async function converter(context) {
  const { sock, sender, m, args, prefix } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `╭━━━━━ *CONVERTER MENU* ━━━━━╮
┃
┃ 🔄 *Fitur Converter:*
┃
┃ ✦ ${prefix}toimg - Sticker ke Gambar
┃ ✦ ${prefix}tomp3 - Video ke Audio
┃ ✦ ${prefix}tomp4 - Audio ke Video
┃ ✦ ${prefix}togif - Video ke GIF
┃ ✦ ${prefix}towebp - Gambar ke Sticker
┃
┃ 📌 *Cara Penggunaan:*
┃ Reply media dengan command di atas
┃
╰━━━━━━━━━━━━━━━━━━━╯`
    });
  }
  
  const command = args[0].toLowerCase();
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  
  if (command === 'toimg') {
    const toimg = await import('./toimg.js');
    return toimg.default(context);
  }
  
  else if (command === 'tomp3') {
    const isVideo = quoted?.videoMessage || m.message?.videoMessage;
    
    if (!isVideo) {
      return await sock.sendMessage(sender, {
        text: '📝 *Cara penggunaan:* Reply video dengan .tomp3'
      });
    }
    
    await sock.sendMessage(sender, { text: '🔄 *Converting video to audio...*' });
    
    const stream = await sock.downloadMediaMessage({
      key: m.key,
      message: quoted || m.message
    });
    
    const inputPath = path.join(config.tempPath, `${randomString()}.mp4`);
    const outputPath = path.join(config.tempPath, `${randomString()}.mp3`);
    
    await fs.writeFile(inputPath, stream);
    
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('mp3')
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });
    
    await sock.sendMessage(sender, {
      audio: { url: outputPath },
      mimetype: 'audio/mpeg',
      fileName: `${randomString()}.mp3`,
      caption: '🎵 *Audio extracted successfully!*'
    });
    
    await fs.unlink(inputPath);
    await fs.unlink(outputPath);
  }
  
  else if (command === 'tomp4') {
    const isAudio = quoted?.audioMessage || m.message?.audioMessage;
    
    if (!isAudio) {
      return await sock.sendMessage(sender, {
        text: '📝 *Cara penggunaan:* Reply audio dengan .tomp4'
      });
    }
    
    await sock.sendMessage(sender, { text: '🔄 *Converting audio to video...*' });
    
    const stream = await sock.downloadMediaMessage({
      key: m.key,
      message: quoted || m.message
    });
    
    const inputPath = path.join(config.tempPath, `${randomString()}.mp3`);
    const outputPath = path.join(config.tempPath, `${randomString()}.mp4`);
    const thumbPath = path.join(config.assetsPath, 'thumbnail.jpg');
    
    await fs.writeFile(inputPath, stream);
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input('color=black:s=1280x720:d=30')
        .input(inputPath)
        .outputOptions(['-c:v libx264', '-c:a aac', '-shortest'])
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });
    
    await sock.sendMessage(sender, {
      video: { url: outputPath },
      caption: '🎬 *Video created from audio!*',
      mimetype: 'video/mp4'
    });
    
    await fs.unlink(inputPath);
    await fs.unlink(outputPath);
  }
  
  else if (command === 'togif') {
    const isVideo = quoted?.videoMessage || m.message?.videoMessage;
    
    if (!isVideo) {
      return await sock.sendMessage(sender, {
        text: '📝 *Cara penggunaan:* Reply video dengan .togif'
      });
    }
    
    await sock.sendMessage(sender, { text: '🔄 *Converting video to GIF...*' });
    
    const stream = await sock.downloadMediaMessage({
      key: m.key,
      message: quoted || m.message
    });
    
    const inputPath = path.join(config.tempPath, `${randomString()}.mp4`);
    const outputPath = path.join(config.tempPath, `${randomString()}.gif`);
    
    await fs.writeFile(inputPath, stream);
    
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions(['-vf', 'fps=10,scale=320:-1'])
        .toFormat('gif')
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });
    
    await sock.sendMessage(sender, {
      image: { url: outputPath },
      caption: '🎪 *GIF created successfully!*',
      mimetype: 'image/gif'
    });
    
    await fs.unlink(inputPath);
    await fs.unlink(outputPath);
  }
  
  else if (command === 'towebp') {
    const isImage = quoted?.imageMessage || m.message?.imageMessage;
    
    if (!isImage) {
      return await sock.sendMessage(sender, {
        text: '📝 *Cara penggunaan:* Reply gambar dengan .towebp'
      });
    }
    
    const stream = await sock.downloadMediaMessage({
      key: m.key,
      message: quoted || m.message
    });
    
    const inputPath = path.join(config.tempPath, `${randomString()}.jpg`);
    const outputPath = path.join(config.tempPath, `${randomString()}.webp`);
    
    await fs.writeFile(inputPath, stream);
    
    await sharp(inputPath)
      .resize(512, 512, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    await sock.sendMessage(sender, {
      sticker: { url: outputPath },
      mimetype: 'image/webp'
    });
    
    await fs.unlink(inputPath);
    await fs.unlink(outputPath);
  }
  
  else {
    await sock.sendMessage(sender, {
      text: `❌ Converter *${command}* tidak dikenal!\n\nGunakan .converter untuk melihat daftar.`
    });
  }
}    
    const inputPath = path.join(config.tempPath, `${randomString()}.jpg`);
    const outputPath = path.join(config.tempPath, `${randomString()}.webp`);
    
    await fs.writeFile(inputPath, stream);
    
    await sharp(inputPath)
      .resize(512, 512, { fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    await sock.sendMessage(sender, {
      sticker: { url: outputPath },
      mimetype: 'image/webp'
    });
    
    await fs.unlink(inputPath);
    await fs.unlink(outputPath);
  }
  
  else {
    await sock.sendMessage(sender, {
      text: `❌ Converter *${command}* tidak dikenal!\n\nGunakan .converter untuk melihat daftar.`
    });
  }
 }
