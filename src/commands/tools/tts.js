import ai from '../../../lib/ai.js';

export default async function ttsCmd(context) {
  const { sock, sender, args } = context;
  
  if (args.length < 2) return await sock.sendMessage(sender, { text: '📝 .tts id Halo dunia' });
  
  const lang = args[0];
  const text = args.slice(1).join(' ');
  const result = await ai.textToSpeech(text, lang);
  
  if (result.success) {
    await sock.sendMessage(sender, { audio: { url: result.url }, mimetype: 'audio/mpeg', fileName: `tts_${lang}.mp3` });
  } else {
    await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  }
}
