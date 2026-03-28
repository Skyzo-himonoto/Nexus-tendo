import axios from 'axios';

export default async function islam(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `📝 *Cara penggunaan:*\n.islam <jenis>\n\n📋 *Jenis:*\n- islam quran <surah>[:ayat]\n- islam jadwal <kota>\n- islam doa <nama_doa>\n- islam asmaulhusna\n\n📌 *Contoh:*\n.islam quran 1:1\n.islam jadwal jakarta\n.islam doa sebelum makan`
    });
  }
  
  const subCommand = args[0].toLowerCase();
  const params = args.slice(1);
  
  await sock.sendMessage(sender, { text: '🕌 *Mengambil data...*' });
  
  try {
    if (subCommand === 'quran') {
      if (params.length === 0) return await sock.sendMessage(sender, { text: '📝 *Contoh:* .islam quran 1:1' });
      
      const [surah, ayat] = params[0].split(':');
      const response = await axios.get(`https://api.quran.sutanlab.id/surah/${surah}`);
      const data = response.data.data;
      
      let text = `╭━━━━━ *AL-QURAN* ━━━━━╮\n┃\n┃ 📖 *${data.name.transliteration.id}*\n┃ 🌍 *${data.name.translation.id}*\n┃ 📍 *${data.revelation.id}*\n┃ 📊 *Total Ayat:* ${data.numberOfVerses}\n`;
      
      if (ayat) {
        const verse = data.verses[parseInt(ayat) - 1];
        text += `┃\n┃ *Ayat ${ayat}:*\n┃ ${verse.text.arab}\n┃\n┃ *Artinya:*\n┃ ${verse.translation.id}\n`;
      }
      
      text += `┃\n╰━━━━━━━━━━━━━━━━━━━╯`;
      await sock.sendMessage(sender, { text });
    }
    
    else if (subCommand === 'jadwal') {
      if (params.length === 0) return await sock.sendMessage(sender, { text: '📝 *Contoh:* .islam jadwal jakarta' });
      
      const city = params[0].toLowerCase();
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${city}/${today.replace(/-/g, '/')}`);
      const data = response.data.data;
      
      if (data.jadwal) {
        const text = `╭━━━━━ *JADWAL SHOLAT* ━━━━━╮
┃
┃ 📍 *Kota:* ${data.lokasi}
┃ 📅 *Tanggal:* ${data.jadwal.tanggal}
┃
┃ ⏰ *Imsak:* ${data.jadwal.imsak}
┃ ⏰ *Subuh:* ${data.jadwal.subuh}
┃ ⏰ *Terbit:* ${data.jadwal.terbit}
┃ ⏰ *Dhuha:* ${data.jadwal.dhuha}
┃ ⏰ *Dzuhur:* ${data.jadwal.dzuhur}
┃ ⏰ *Ashar:* ${data.jadwal.ashar}
┃ ⏰ *Maghrib:* ${data.jadwal.maghrib}
┃ ⏰ *Isya:* ${data.jadwal.isya}
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
        await sock.sendMessage(sender, { text });
      } else {
        await sock.sendMessage(sender, { text: `❌ Kota *${city}* tidak ditemukan!` });
      }
    }
    
    else if (subCommand === 'doa') {
      if (params.length === 0) return await sock.sendMessage(sender, { text: '📝 *Contoh:* .islam doa sebelum makan' });
      
      const doaName = params.join(' ');
      const response = await axios.get(`https://api.myquran.com/v2/doa/search?q=${encodeURIComponent(doaName)}`);
      
      if (response.data.data && response.data.data.length > 0) {
        const doa = response.data.data[0];
        const text = `╭━━━━━ *DOA* ━━━━━╮
┃
┃ 📖 *${doa.judul}*
┃
┃ ${doa.arab}
┃
┃ *Artinya:*
┃ ${doa.indo}
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
        await sock.sendMessage(sender, { text });
      } else {
        await sock.sendMessage(sender, { text: `❌ Doa *${doaName}* tidak ditemukan!` });
      }
    }
    
    else if (subCommand === 'asmaulhusna') {
      const response = await axios.get('https://api.myquran.com/v2/asmaulhusna');
      const data = response.data.data;
      
      let text = `╭━━━━━ *ASMAUL HUSNA* ━━━━━╮\n┃\n`;
      for (let i = 0; i < Math.min(data.length, 15); i++) {
        const asma = data[i];
        text += `┃ ${asma.nomor}. ${asma.latin} - ${asma.arti}\n`;
      }
      text += `┃\n┃ *Total:* ${data.length} Nama Allah\n╰━━━━━━━━━━━━━━━━━━━╯`;
      await sock.sendMessage(sender, { text });
    }
    
    else {
      await sock.sendMessage(sender, { text: `❌ Sub command *${subCommand}* tidak dikenal!\n\nGunakan: quran, jadwal, doa, asmaulhusna` });
    }
    
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ *Error:* ${err.message}` });
  }
}
