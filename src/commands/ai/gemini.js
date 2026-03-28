import ai from '../../../lib/ai.js';

export default async function gemini(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .gemini <pesan>' });
  
  const prompt = args.join(' ');
  await sock.sendMessage(sender, { text: '🌟 Gemini berpikir...' });
  const result = await ai.gemini(prompt);
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  await sock.sendMessage(sender, { text: `✨ Gemini AI:\n\n${result.text}\n\n💡 Google Gemini` });
}
