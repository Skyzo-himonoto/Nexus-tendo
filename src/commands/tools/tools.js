import axios from 'axios';
import qrcode from 'qrcode';
import fs from 'fs-extra';
import path from 'path';
import { randomString, isValidUrl } from '../../../lib/utils.js';
import config from '../../../config.js';
import ai from '../../../lib/ai.js';

export default async function tools(context) {
  const { sock, sender, args, prefix } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `╭━━━━━ TOOLS MENU ━━━━━╮
┃
┃ 🛠️ Fitur Tools:
┃ ✦ ${prefix}qrcode <teks>
┃ ✦ ${prefix}tts <kode> <teks>
┃ ✦ ${prefix}translate <kode> <teks>
┃ ✦ ${prefix}styletext <teks>
┃ ✦ ${prefix}calc <angka> <+-> <angka>
┃ ✦ ${prefix}shorturl <link>
┃ ✦ ${prefix}weather <kota>
┃ ✦ ${prefix}whois <nomor>
┃
┃ 📌 Contoh:
┃ ${prefix}qrcode https://example.com
┃ ${prefix}tts id Halo dunia
╰━━━━━━━━━━━━━━━━━━━╯`
    });
  }
  
  const command = args[0].toLowerCase();
  const params = args.slice(1);
  
  if (command === 'qrcode') {
    if (params.length === 0) return await sock.sendMessage(sender, { text: '📝 .qrcode <teks>' });
    const text = params.join(' ');
    const qrPath = path.join(config.tempPath, `${randomString()}.png`);
    await qrcode.toFile(qrPath, text, { width: 500 });
    await sock.sendMessage(sender, { image: { url: qrPath }, caption: `📱 QR Code\n🔗 ${text}` });
    await fs.unlink(qrPath);
  }
  
  else if (command === 'tts') {
    if (params.length < 2) return await sock.sendMessage(sender, { text: '📝 .tts id Halo dunia' });
    const lang = params[0];
    const text = params.slice(1).join(' ');
    const result = await ai.textToSpeech(text, lang);
    if (result.success) {
      await sock.sendMessage(sender, { audio: { url: result.url }, mimetype: 'audio/mpeg', fileName: `tts_${lang}.mp3` });
    } else {
      await sock.sendMessage(sender, { text: `❌ ${result.error}` });
    }
  }
  
  else if (command === 'translate') {
    if (params.length < 2) return await sock.sendMessage(sender, { text: '📝 .translate en Hello world' });
    const targetLang = params[0];
    const text = params.slice(1).join(' ');
    const result = await ai.translate(text, targetLang);
    if (result.success) {
      await sock.sendMessage(sender, { text: `🌐 Translator\n\n📝 Original: ${result.original}\n🌍 Target: ${targetLang}\n✨ Result: ${result.text}` });
    } else {
      await sock.sendMessage(sender, { text: `❌ ${result.error}` });
    }
  }

  else if (command === 'styletext') {
    if (params.length === 0) return await sock.sendMessage(sender, { text: '📝 .styletext Hello' });
    const text = params.join(' ');
    const styles = {
      'bold': text.split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 120356)).join(''),
      'italic': text.split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 120328)).join(''),
      'script': text.split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 120224)).join(''),
      'fraktur': text.split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 120148)).join(''),
      'double': text.split('').map(c => String.fromCodePoint(c.charCodeAt(0) + 120120)).join('')
    };
    let result = `✨ Style Text\n\n📝 Original: ${text}\n\n🔤 Bold: ${styles.bold}\n📖 Italic: ${styles.italic}\n✍️ Script: ${styles.script}\n🖋️ Fraktur: ${styles.fraktur}\n🔲 Double: ${styles.double}`;
    await sock.sendMessage(sender, { text: result });
  }
  
  else if (command === 'calc') {
    if (params.length < 3) return await sock.sendMessage(sender, { text: '📝 .calc 10 + 5' });
    const num1 = parseFloat(params[0]);
    const operator = params[1];
    const num2 = parseFloat(params[2]);
    let result;
    switch (operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': result = num1 / num2; break;
      default: return await sock.sendMessage(sender, { text: '❌ Operator: + - * /' });
    }
    await sock.sendMessage(sender, { text: `🧮 Calculator\n\n${num1} ${operator} ${num2} = ${result}` });
  }
 
  else if (command === 'shorturl') {
    if (params.length === 0) return await sock.sendMessage(sender, { text: '📝 .shorturl https://example.com' });
    const url = params[0];
    if (!isValidUrl(url)) return await sock.sendMessage(sender, { text: '❌ URL tidak valid!' });
    try {
      const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      await sock.sendMessage(sender, { text: `🔗 Short URL\n\n📝 Original: ${url}\n✨ Short: ${res.data}` });
    } catch (err) {
      await sock.sendMessage(sender, { text: `❌ ${err.message}` });
    }
  }
  
  else if (command === 'weather') {
    if (params.length === 0) return await sock.sendMessage(sender, { text: '📝 .weather jakarta' });
    const city = params.join(' ');
    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=YOUR_API_KEY&units=metric&lang=id`);
      const data = res.data;
      await sock.sendMessage(sender, { text: `🌍 Weather ${data.name}, ${data.sys.country}\n🌡️ Suhu: ${data.main.temp}°C\n💧 Kelembapan: ${data.main.humidity}%\n🌬️ Angin: ${data.wind.speed} m/s\n☁️ Cuaca: ${data.weather[0].description}` });
    } catch {
      await sock.sendMessage(sender, { text: `❌ Kota ${city} tidak ditemukan!` });
    }
  }
  
  else if (command === 'whois') {
    if (params.length === 0) return await sock.sendMessage(sender, { text: '📝 .whois 628xxxxx' });
    let number = params[0].replace(/[^0-9]/g, '');
    if (number.startsWith('0')) number = '62' + number.slice(1);
    const jid = number + '@s.whatsapp.net';
    try {
      const status = await sock.getStatus(jid);
      await sock.sendMessage(sender, { text: `👤 User Info\n📱 Number: ${number}\n📝 Bio: ${status?.status || 'Tidak ada bio'}` });
    } catch {
      await sock.sendMessage(sender, { text: `❌ Tidak dapat mengambil info user` });
    }
  }
  
  else {
    await sock.sendMessage(sender, { text: `❌ Tools ${command} tidak dikenal!` });
  }
}
