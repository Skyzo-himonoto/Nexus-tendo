import axios from 'axios';
import downloader from '../../../lib/downloader.js';

export default async function search(context) {
  const { sock, sender, args, prefix } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `╭━━━━━ *SEARCH MENU* ━━━━━╮
┃
┃ 🔍 *Search Features:*
┃
┃ ✦ ${prefix}google <query> - Google Search
┃ ✦ ${prefix}image <query> - Google Images
┃ ✦ ${prefix}pinterest <query> - Pinterest Search
┃ ✦ ${prefix}wiki <query> - Wikipedia
┃ ✦ ${prefix}github <user/repo> - GitHub Search
┃ ✦ ${prefix}npm <package> - NPM Package Search
┃
┃ 📌 *Contoh:*
┃ ${prefix}google apa itu AI
┃ ${prefix}image kucing lucu
┃ ${prefix}pinterest anime wallpaper
┃
╰━━━━━━━━━━━━━━━━━━━╯`
    });
  }
  
  const command = args[0].toLowerCase();
  const query = args.slice(1).join(' ');
  
  if (!query) {
    return await sock.sendMessage(sender, {
      text: `📝 *Contoh:* ${prefix}${command} <query>`
    });
  }
  
  await sock.sendMessage(sender, { text: `🔍 *Searching for:* ${query}...` });
  
  try {
    if (command === 'google') {
      const response = await axios.get(`https://api.ryzendesu.vip/api/search/google?query=${encodeURIComponent(query)}`);
      const results = response.data.data || [];
      
      if (results.length === 0) {
        return await sock.sendMessage(sender, { text: `❌ Tidak ada hasil untuk *${query}*` });
      }
      
      let text = `╭━━━━━ *GOOGLE SEARCH* ━━━━━╮\n┃\n🔍 *Query:* ${query}\n┃\n`;
      for (let i = 0; i < Math.min(results.length, 5); i++) {
        const r = results[i];
        text += `┃ ${i+1}. *${r.title}*\n┃ 📝 ${r.snippet?.slice(0, 100)}...\n┃ 🔗 ${r.url}\n┃\n`;
      }
      text += `╰━━━━━━━━━━━━━━━━━━━╯`;
      await sock.sendMessage(sender, { text });
    }
    
    else if (command === 'image') {
      const results = await downloader.googleImage(query, 5);
      if (!results.success || results.results.length === 0) {
        return await sock.sendMessage(sender, { text: `❌ Tidak ada gambar untuk *${query}*` });
      }
      for (const img of results.results) {
        await sock.sendMessage(sender, { image: { url: img }, caption: `🖼️ *${query}*` });
      }
    }
    
    else if (command === 'pinterest') {
      const results = await downloader.pinterestSearch(query, 5);
      if (!results.success || results.results.length === 0) {
        return await sock.sendMessage(sender, { text: `❌ Tidak ada hasil untuk *${query}*` });
      }
      for (const img of results.results) {
        await sock.sendMessage(sender, { image: { url: img }, caption: `📌 *Pinterest: ${query}*` });
      }
    }
    
    else if (command === 'wiki' || command === 'wikimedia' || command === 'wikipedia') {
      const response = await axios.get(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      const data = response.data;
      
      if (!data.title) {
        return await sock.sendMessage(sender, { text: `❌ Halaman *${query}* tidak ditemukan di Wikipedia!` });
      }
      
      const text = `╭━━━━━ *WIKIPEDIA* ━━━━━╮
┃
┃ 📚 *Title:* ${data.title}
┃
┃ 📝 *Summary:*
┃ ${data.extract?.slice(0, 1500)}${data.extract?.length > 1500 ? '...' : ''}
┃
┃ 🔗 *Link:* ${data.content_urls?.desktop?.page}
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
      await sock.sendMessage(sender, { text });
    }
    
    else if (command === 'github') {
      const response = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`);
      const repos = response.data.items || [];
      
      if (repos.length === 0) {
        return await sock.sendMessage(sender, { text: `❌ Repository *${query}* tidak ditemukan!` });
      }
      
      let text = `╭━━━━━ *GITHUB SEARCH* ━━━━━╮\n┃\n🔍 *Query:* ${query}\n┃\n`;
      for (let i = 0; i < repos.length; i++) {
        const repo = repos[i];
        text += `┃ ${i+1}. *${repo.full_name}*\n┃ ⭐ Stars: ${repo.stargazers_count}\n┃ 🍴 Forks: ${repo.forks_count}\n┃ 📝 ${repo.description?.slice(0, 80)}...\n┃ 🔗 ${repo.html_url}\n┃\n`;
      }
      text += `╰━━━━━━━━━━━━━━━━━━━╯`;
      await sock.sendMessage(sender, { text });
    }
    
    else if (command === 'npm') {
      const response = await axios.get(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=5`);
      const packages = response.data.objects || [];
      
      if (packages.length === 0) {
        return await sock.sendMessage(sender, { text: `❌ Package *${query}* tidak ditemukan!` });
      }
      
      let text = `╭━━━━━ *NPM SEARCH* ━━━━━╮\n┃\n📦 *Query:* ${query}\n┃\n`;
      for (let i = 0; i < packages.length; i++) {
        const pkg = packages[i].package;
        text += `┃ ${i+1}. *${pkg.name}*\n┃ 📦 Version: ${pkg.version}\n┃ 📝 ${pkg.description?.slice(0, 80)}...\n┃ 🔗 ${pkg.links?.npm}\n┃\n`;
      }
      text += `╰━━━━━━━━━━━━━━━━━━━╯`;
      await sock.sendMessage(sender, { text });
    }
    
    else {
      await sock.sendMessage(sender, {
        text: `❌ Search *${command}* tidak dikenal!\n\nGunakan .search untuk melihat daftar.`
      });
    }
    
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ *Error:* ${err.message}` });
  }
}
