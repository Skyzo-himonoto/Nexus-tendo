import axios from 'axios';
import { randomItem } from '../../../lib/utils.js';

export default async function random(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `📝 *Cara penggunaan:*\n.random <jenis>\n\n📋 *Jenis random:*\n- random kata\n- random quotes\n- random fakta\n- random meme\n- random pantun\n- random cat\n- random dog\n\nContoh: .random quotes`
    });
  }
  
  const type = args[0].toLowerCase();
  await sock.sendMessage(sender, { text: '🎲 *Mengambil data random...*' });
  
  try {
    let result;
    
    if (type === 'quotes') {
      const res = await axios.get('https://api.quotable.io/random');
      result = `💬 *Quote of the moment*\n\n"${res.data.content}"\n\n- ${res.data.author}`;
    }
    
    else if (type === 'fakta') {
      const res = await axios.get('https://api.ryzendesu.vip/api/random/faktaunik');
      result = `🔍 *Fakta Unik*\n\n${res.data.data}`;
    }
    
    else if (type === 'pantun') {
      const res = await axios.get('https://api.ryzendesu.vip/api/random/pantun');
      result = `🎭 *Pantun*\n\n${res.data.data}`;
    }
    
    else if (type === 'meme') {
      const res = await axios.get('https://meme-api.com/gimme');
      await sock.sendMessage(sender, {
        image: { url: res.data.url },
        caption: `😂 *Meme*\n\n📝 *Title:* ${res.data.title}\n👍 *Upvotes:* ${res.data.ups}`
      });
      return;
    }
    
    else if (type === 'cat') {
      const res = await axios.get('https://api.thecatapi.com/v1/images/search');
      await sock.sendMessage(sender, {
        image: { url: res.data[0].url },
        caption: '🐱 *Random Cat*'
      });
      return;
    }
    
    else if (type === 'dog') {
      const res = await axios.get('https://dog.ceo/api/breeds/image/random');
      await sock.sendMessage(sender, {
        image: { url: res.data.message },
        caption: '🐕 *Random Dog*'
      });
      return;
    }
    
    else if (type === 'kata') {
      const kataList = [
        'Jangan menyerah, karena kamu hebat!',
        'Setiap hari adalah kesempatan baru',
        'Kesuksesan dimulai dari mimpi',
        'Percayalah pada proses',
        'Jadilah versi terbaik dari dirimu',
        'Hari ini lebih baik dari kemarin',
        'Kegagalan adalah awal dari kesuksesan'
      ];
      result = `💪 *Kata Motivasi*\n\n"${randomItem(kataList)}"`;
    }
    
    else {
      return await sock.sendMessage(sender, {
        text: `❌ Jenis random *${type}* tidak dikenal!\n\nGunakan: quotes, fakta, pantun, meme, cat, dog, kata`
      });
    }
    
    await sock.sendMessage(sender, { text: result });
    
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ *Error:* ${err.message}` });
  }
}￼Enter
