import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function maker(context) {
  const { sock, sender, args, prefix } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `╭━━━━━ *MAKER MENU* ━━━━━╮
┃
┃ 🎨 *Photo Maker Effects:*
┃
┃ ✦ ${prefix}carbon <code> - Code screenshot
┃ ✦ ${prefix}neon <text> - Neon text effect
┃ ✦ ${prefix}glitch <text> - Glitch text effect
┃ ✦ ${prefix}burn <text> - Burn text effect
┃ ✦ ${prefix}wanted <reply image> - Wanted poster
┃ ✦ ${prefix}rip <reply image> - RIP tombstone
┃
┃ 📌 *Contoh:*
┃ ${prefix}carbon console.log('Hello')
┃ ${prefix}neon Nexus MD
┃ ${prefix}wanted (reply gambar)
┃
╰━━━━━━━━━━━━━━━━━━━╯`
    });
  }
  
  const command = args[0].toLowerCase();
  const text = args.slice(1).join(' ');
  
  await sock.sendMessage(sender, { text: '🎨 *Creating image...*' });
  
  try {
    if (command === 'carbon') {
      if (!text) return await sock.sendMessage(sender, { text: '📝 .carbon console.log("Hello")' });
      
      const response = await axios.post('https://carbonara.solopov.dev/api/cook', {
        code: text,
        language: 'javascript',
        theme: 'seti',
        background: '#1E1E1E',
        windowControls: true,
        width: 800,
        paddingVertical: 40,
        paddingHorizontal: 40,
        fontFamily: 'Fira Code',
        fontSize: 16
      }, { responseType: 'arraybuffer' });
      
      const outputPath = path.join(config.tempPath, `${randomString()}.png`);
      await fs.writeFile(outputPath, response.data);
      await sock.sendMessage(sender, { image: { url: outputPath }, caption: `💻 *Carbon Code*\n\n${text.slice(0, 100)}${text.length > 100 ? '...' : ''}` });
      await fs.unlink(outputPath);
    }
    
    else if (command === 'neon') {
      if (!text) return await sock.sendMessage(sender, { text: '📝 .neon Nexus MD' });
      
      const response = await axios.get(`https://api.ryzendesu.vip/api/maker/neon?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
      const outputPath = path.join(config.tempPath, `${randomString()}.png`);
      await fs.writeFile(outputPath, response.data);
      await sock.sendMessage(sender, { image: { url: outputPath }, caption: `✨ *Neon Text*\n\n${text}` });
      await fs.unlink(outputPath);
    }
    
    else if (command === 'glitch') {
      if (!text) return await sock.sendMessage(sender, { text: '📝 .glitch Nexus MD' });
      
      const response = await axios.get(`https://api.ryzendesu.vip/api/maker/glitch?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
      const outputPath = path.join(config.tempPath, `${randomString()}.png`);
      await fs.writeFile(outputPath, response.data);
      await sock.sendMessage(sender, { image: { url: outputPath }, caption: `🌪️ *Glitch Text*\n\n${text}` });
      await fs.unlink(outputPath);
    }
    
    else if (command === 'burn') {
      if (!text) return await sock.sendMessage(sender, { text: '📝 .burn Nexus MD' });
    
      const response = await axios.get(`https://api.ryzendesu.vip/api/maker/burn?text=${encodeURIComponent(text)}`, { responseType: 'arraybuffer' });
      const outputPath = path.join(config.tempPath, `${randomString()}.png`);
      await fs.writeFile(outputPath, response.data);
      await sock.sendMessage(sender, { image: { url: outputPath }, caption: `🔥 *Burn Text*\n\n${text}` });
      await fs.unlink(outputPath);
    }
    
    else if (command === 'wanted') {
      const quoted = context.m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const isImage = quoted?.imageMessage || context.m.message?.imageMessage;
      if (!isImage) return await sock.sendMessage(sender, { text: '📝 Reply gambar dengan .wanted' });
      
      const stream = await sock.downloadMediaMessage({ key: context.m.key, message: quoted || context.m.message });
      const inputPath = path.join(config.tempPath, `${randomString()}.jpg`);
      await fs.writeFile(inputPath, stream);
      
      const formData = new FormData();
      formData.append('image', fs.createReadStream(inputPath));
      const response = await axios.post('https://api.ryzendesu.vip/api/maker/wanted', formData, { headers: formData.getHeaders(), responseType: 'arraybuffer' });
      
      const outputPath = path.join(config.tempPath, `${randomString()}.png`);
      await fs.writeFile(outputPath, response.data);
      await sock.sendMessage(sender, { image: { url: outputPath }, caption: '👮 *WANTED POSTER*' });
      await fs.unlink(inputPath);
      await fs.unlink(outputPath);
    }
    
    else if (command === 'rip') {
      const quoted = context.m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const isImage = quoted?.imageMessage || context.m.message?.imageMessage;
      if (!isImage) return await sock.sendMessage(sender, { text: '📝 Reply gambar dengan .rip' });
      
      const stream = await sock.downloadMediaMessage({ key: context.m.key, message: quoted || context.m.message });
      const inputPath = path.join(config.tempPath, `${randomString()}.jpg`);
      await fs.writeFile(inputPath, stream);
      
      const formData = new FormData();
      formData.append('image', fs.createReadStream(inputPath));
      const response = await axios.post('https://api.ryzendesu.vip/api/maker/rip', formData, { headers: formData.getHeaders(), responseType: 'arraybuffer' });
      
      const outputPath = path.join(config.tempPath, `${randomString()}.png`);
      await fs.writeFile(outputPath, response.data);
      await sock.sendMessage(sender, { image: { url: outputPath }, caption: '🪦 *REST IN PEACE*' });
      await fs.unlink(inputPath);
      await fs.unlink(outputPath);
    }
    
    else {
      await sock.sendMessage(sender, { text: `❌ Maker effect *${command}* tidak dikenal!` });
    }
    
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ *Error:* ${err.message}` });
  }
}
