import axios from 'axios';

export default async function anime(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `📝 *Cara penggunaan:*\n.anime <query>\n\n📋 *Contoh:*\n.anime naruto\n.anime one piece\n.anime jujutsu kaisen\n\n🎌 *Info:*\n- Sinopsis, rating, episode\n- Karakter, rekomendasi`
    });
  }
  
  const query = args.join(' ');
  await sock.sendMessage(sender, { text: '🔍 *Mencari anime...*' });
  
  try {
    const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
    const data = response.data;
    
    if (data.data.length === 0) {
      return await sock.sendMessage(sender, { text: `❌ Anime *${query}* tidak ditemukan!` });
    }
    
    const anime = data.data[0];
    
    const text = `╭━━━━━ *ANIME INFO* ━━━━━╮
┃
┃ 📛 *Title:* ${anime.title}
┃ 🎌 *Title Jepang:* ${anime.title_japanese || '-'}
┃ ⭐ *Rating:* ${anime.score || 'N/A'} / 10
┃ 📊 *Rank:* #${anime.rank || 'N/A'}
┃ 🎬 *Episode:* ${anime.episodes || 'N/A'}
┃ 📅 *Rilis:* ${anime.aired?.from?.split('T')[0] || 'N/A'}
┃
┃ 📝 *Sinopsis:*
┃ ${anime.synopsis?.substring(0, 300)}${anime.synopsis?.length > 300 ? '...' : ''}
┃
┃ 🔗 *Link:* ${anime.url}
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    await sock.sendMessage(sender, {
      image: { url: anime.images.jpg.image_url },
      caption: text
    });
    
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ *Error:* ${err.message}` });
  }
}
