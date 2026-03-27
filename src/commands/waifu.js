import axios from 'axios';

export default async function waifu(context) {
  const { sock, sender, args } = context;
  
  const categories = [
    'waifu', 'neko', 'shinobu', 'megumin', 'bully',
    'cuddle', 'cry', 'hug', 'awoo', 'kiss', 'lick',
    'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile',
    'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp',
    'slap', 'kill', 'kick', 'happy', 'wink', 'poke',
    'dance', 'cringe'
  ];
  
  let category = 'waifu';
  
  if (args.length > 0 && categories.includes(args[0].toLowerCase())) {
    category = args[0].toLowerCase();
  }
  
  await sock.sendMessage(sender, {
    text: '🖼️ *Mengambil gambar waifu...*'
  });
  
  try {
    const response = await axios.get(`https://api.waifu.pics/sfw/${category}`);
    const imageUrl = response.data.url;
    
    await sock.sendMessage(sender, {
      image: { url: imageUrl },
      caption: `✨ *Waifu ${category}*\n\n🎀 *Category:* ${category}\n🖼️ *Powered by waifu.pics*`
    });
    
  } catch (err) {
    await sock.sendMessage(sender, {
      text: `❌ *Error:* ${err.message}\n\n📋 *Category tersedia:*\n${categories.join(', ')}`
    });
  }
}
