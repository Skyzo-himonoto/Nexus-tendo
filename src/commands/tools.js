import axios from 'axios';
import qrcode from 'qrcode';
import fs from 'fs-extra';
import path from 'path';
import { randomString, isValidUrl } from '../../lib/utils.js';
import config from '../../config.js';
import ai from '../../lib/ai.js';

export default async function tools(context) {
  const { sock, sender, args, prefix } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `╭━━━━━ *TOOLS MENU* ━━━━━╮
┃
┃ 🛠️ *Fitur Tools:*
┃
┃ ✦ ${prefix}qrcode <teks/link>
┃ ✦ ${prefix}tts <kode_bahasa> <teks>
┃ ✦ ${prefix}translate <kode_bahasa> <teks>
┃ ✦ ${prefix}styletext <teks>
┃ ✦ ${prefix}calc <angka> <operator> <angka>
┃ ✦ ${prefix}shorturl <link>
┃ ✦ ${prefix}weather <kota>
┃ ✦ ${prefix}whois <nomor>
┃
┃ 📌 *Contoh:*
┃ ${prefix}qrcode https://example.com
┃ ${prefix}tts id Halo dunia
┃ ${prefix}translate en Hello world
┃ ${prefix}calc 10 + 5
┃
╰━━━━━━━━━━━━━━━━━━━╯`
    });
  }
  
  const command = args[0].toLowerCase();
  const params = args.slice(1);
  if (command === 'qrcode') {
    if (params.length === 0) {
      return await sock.sendMessage(sender, { text: '📝 *Contoh:* .qrcode https://example.com' });
    }
    
    const text = params.join(' ');
    const qrPath = path.join(config.tempPath, `${randomString()}.png`);
    
    await qrcode.toFile(qrPath, text, { width: 500 });
    
    await sock.sendMessage(sender, {
      image: { url: qrPath },
      caption: `📱 *QR Code*\n\n🔗 *Content:* ${text}`
    });
    
    await fs.unlink(qrPath);
  }

  else if (command === 'tts') {
    if (params.length < 2) {
      return await sock.sendMessage(sender, { text: '📝 *Contoh:* .tts id Halo dunia\n\n🌍 *Kode bahasa:* id, en, ja, ko, etc' });
    }
    
    const lang = params[0];
    const text = params.slice(1).join(' ');
    
    const result = await ai.textToSpeech(text, lang);
    
    if (result.success) {
      await sock.sendMessage(sender, {
        audio: { url: result.url },
        mimetype: 'audio/mpeg',
        fileName: `tts_${lang}.mp3`,
        caption: `🔊 *Text to Speech*\n🌍 *Language:* ${lang}\n📝 *Text:* ${text}`
      });
    } else {
      await sock.sendMessage(sender, { text: `❌ *Error:* ${result.error}` });
    }
  }
  
  else if (command === 'translate') {
    if (params.length < 2) {
      return await sock.sendMessage(sender, { text: '📝 *Contoh:* .translate en Halo dunia\n\n🌍 *Kode bahasa:* id, en, ja, ko, etc' });
    }
    
    const targetLang = params[0];
    const text = params.slice(1).join(' ');
    
    const result = await ai.translate(text, targetLang);
    
    if (result.success) {
      await sock.sendMessage(sender, {
        text: `🌐 *Translator*\n\n📝 *Original:* ${result.original}\n🌍 *Target:* ${targetLang}\n✨ *Result:* ${result.text}`
      });
    } else {
      await sock.sendMessage(sender, { text: `❌ *Error:* ${result.error}` });
    }
  }
  
  else if (command === 'styletext') {
    if (params.length === 0) {
      return await sock.sendMessage(sender, { text: '📝 *Contoh:* .styletext Hello World' });
    }
    
    const text = params.join(' ');
    
    const styles = {
      'bold': text.split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 120356)).join(''),
      'italic': text.split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 120328)).join(''),
      'script': text.split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 120224)).join(''),
      'fraktur': text.split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 120148)).join(''),
      'double': text.split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 120120)).join('')
    };
    
    let result = `✨ *Style Text*\n\n📝 *Original:* ${text}\n\n`;
    result += `🔤 *Bold:* ${styles.bold}\n`;
    result += `📖 *Italic:* ${styles.italic}\n`;
    result += `✍️ *Script:* ${styles.script}\n`;
    result += `🖋️ *Fraktur:* ${styles.fraktur}\n`;
    result += `🔲 *Double:* ${styles.double}\n`;
    
    await sock.sendMessage(sender, { text: result });
  }
  
  else if (command === 'calc') {
    if (params.length < 3) {
      return await sock.sendMessage(sender, { text: '📝 *Contoh:* .calc 10 + 5\n\n🔢 *Operator:* +, -, *, /, %' });
    }
    
    const num1 = parseFloat(params[0]);
    const operator = params[1];
    const num2 = parseFloat(params[2]);
    
    let result;
    switch (operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': result = num1 / num2; break;
      case '%': result = num1 % num2; break;
      default: return await sock.sendMessage(sender, { text: '❌ Operator tidak valid!' });
    }
    
    await sock.sendMessage(sender, {
      text: `🧮 *Calculator*\n\n${num1} ${operator} ${num2} = *${result}*`
    });
  }
  
  else if (command === 'shorturl') {
    if (params.length === 0) {
      return await sock.sendMessage(sender, { text: '📝 *Contoh:* .shorturl https://example.com' });
    }
    
    const url = params[0];
    
    if (!isValidUrl(url)) {
      return await sock.sendMessage(sender, { text: '❌ URL tidak valid!' });
    }
    
    try {
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const shortUrl = response.data;
      
      await sock.sendMessage(sender, {
        text: `🔗 *Short URL*\n\n📝 *Original:* ${url}\n✨ *Short:* ${shortUrl}`
      });
    } catch (err) {
      await sock.sendMessage(sender, { text: `❌ *Error:* ${err.message}` });
    }
  }
  
  else if (command === 'weather') {
    if (params.length === 0) {
      return await sock.sendMessage(sender, { text: '📝 *Contoh:* .weather jakarta' });
    }
    
    const city = params.join(' ');
    
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=YOUR_API_KEY&units=metric&lang=id`);
      const data = response.data;
      
      const text = `╭━━━━━ *WEATHER INFO* ━━━━━╮
┃
┃ 🌍 *Kota:* ${data.name}, ${data.sys.country}
┃ 🌡️ *Suhu:* ${data.main.temp}°C
┃ 🔥 *Feels Like:* ${data.main.feels_like}°C
┃ 💧 *Kelembapan:* ${data.main.humidity}%
┃ 🌬️ *Angin:* ${data.wind.speed} m/s
┃ ☁️ *Cuaca:* ${data.weather[0].description}
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
      
      await sock.sendMessage(sender, { text });
    } catch (err) {
      await sock.sendMessage(sender, { text: `❌ Kota *${city}* tidak ditemukan!` });
    }
  }

  else if (command === 'whois') {
    if (params.length === 0) {
      return await sock.sendMessage(sender, { text: '📝 *Contoh:* .whois 6285715818953' });
    }
    
    let number = params[0].replace(/[^0-9]/g, '');
    if (number.startsWith('0')) number = '62' + number.slice(1);
    const jid = number + '@s.whatsapp.net';
    
    try {
      const presence = await sock.presenceSubscribe(jid);
      const status = await sock.getStatus(jid);
      
      const text = `👤 *User Info*\n\n📱 *Number:* ${number}\n🟢 *Status:* ${presence ? 'Online' : 'Offline'}\n📝 *Bio:* ${status?.status || 'Tidak ada bio'}`;
      
      await sock.sendMessage(sender, { text });
    } catch (err) {
      await sock.sendMessage(sender, { text: `❌ Tidak dapat mengambil info user: ${err.message}` });
    }
  }
  
  else {
    await sock.sendMessage(sender, { text: `❌ Tools *${command}* tidak dikenal!\n\nGunakan .tools untuk melihat daftar command.` });
  }
}
