import axios from 'axios';
import { randomItem } from '../../lib/utils.js';

export default async function random(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `📝 *Cara penggunaan:*\n.random <jenis>\n\n📋 *Jenis random:*\n- random kata\n- random quotes\n- random fakta\n- random meme\n- random pantun\n- random cerpen\n- random cat\n- random dog\n\nContoh: .random quotes`
    });
  }
  
  const type = args[0].toLowerCase();
  
  await sock.sendMessage(sender, {
    text: '🎲 *Mengambil kata random...*'
  });
  
  try {
    let result;
    
    switch (type) {
      case 'quotes':
        const quoteRes = await axios.get('https://api.quotable.io/random');
        result = `💬 *Quote of the moment*\n\n"${quoteRes.data.content}"\n\n- ${quoteRes.data.author}`;
        break;
        
      case 'fakta':
        const faktaRes = await axios.get('https://api.ryzendesu.vip/api/random/faktaunik');
        result = `🔍 *Fakta Unik*\n\n${faktaRes.data.data}`;
        break;
        
      case 'pantun':
        const pantunRes = await axios.get('https://api.ryzendesu.vip/api/random/pantun');
        result = `🎭 *Pantun*\n\n${pantunRes.data.data}`;
        break;
        
      case 'meme':
        const memeRes = await axios.get('https://meme-api.com/gimme');
        await sock.sendMessage(sender, {
          image: { url: memeRes.data.url },
          caption: `😂 *Meme*\n\n📝 *Title:* ${memeRes.data.title}\n👍 *Upvotes:* ${memeRes.data.ups}`
        });
        return;
        
      case 'cat':
        const catRes = await axios.get('https://api.thecatapi.com/v1/images/search');
        await sock.sendMessage(sender, {
          image: { url: catRes.data[0].url },
          caption: '🐱 *Random Cat*'
        });
        return;
        
      case 'dog':
        const dogRes = await axios.get('https://dog.ceo/api/breeds/image/random');
        await sock.sendMessage(sender, {
          image: { url: dogRes.data.message },
          caption: '🐕 *Random Dog*'
        });
        return;
        
      case 'kata':
        const kataList = [
          'Jangan menyerah, karena kamu hebat!',
          'Setiap hari adalah kesempatan baru',
          'Kesuksesan dimulai dari mimpi',
          'Percayalah pada proses',
          'Jadilah versi terbaik dari dirimu'
        ];
        result = `💪 *Kata Motivasi*\n\n"${randomItem(kataList)}"`;
        break;
        
      default:
        return await sock.sendMessage(sender, {
          text: `❌ Jenis random *${type}* tidak dikenal!\n\nGunakan: quotes, fakta, pantun, meme, cat, dog, kata`
        });
    }
    
    await sock.sendMessage(sender, { text: result });
    
  } catch (err) {
    await sock.sendMessage(sender, {
      text: `❌ *Error:* ${err.message}`
    });
  }
}
