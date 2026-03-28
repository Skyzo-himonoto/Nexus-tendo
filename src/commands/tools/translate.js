import ai from '../../../lib/ai.js';

export default async function translate(context) {
  const { sock, sender, args } = context;
  
  const languages = {
    id: 'Indonesia', en: 'English', ja: 'Jepang', ko: 'Korea',
    zh: 'Mandarin', ar: 'Arab', hi: 'Hindi', es: 'Spanyol',
    fr: 'Perancis', de: 'Jerman', ru: 'Rusia', pt: 'Portugis'
  };
  
  if (args.length < 2) {
    return await sock.sendMessage(sender, {
      text: `📝 *Translate*\n\n.translate <kode> <teks>\n\n🌍 Kode bahasa:\n${Object.entries(languages).map(([k, v]) => `${k}=${v}`).join(', ')}\n\n📌 Contoh: .translate en Halo dunia`
    });
  }
  
  const targetLang = args[0];
  const text = args.slice(1).join(' ');
  
  if (!languages[targetLang]) {
    return await sock.sendMessage(sender, { text: `❌ Kode ${targetLang} tidak dikenal!` });
  }
  
  await sock.sendMessage(sender, { text: `🌐 Menerjemahkan ke ${languages[targetLang]}...` });
  
  const result = await ai.translate(text, targetLang);
  
  if (result.success) {
    await sock.sendMessage(sender, {
      text: `🌐 *TRANSLATE*\n\n📝 Original: ${result.original}\n🌍 Target: ${languages[targetLang]}\n✨ Result: ${result.text}`
    });
  } else {
    await sock.sendMessage(sender, { text: `❌ Error: ${result.error}` });
  }
}
