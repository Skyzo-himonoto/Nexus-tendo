import ai from '../../../lib/ai.js';

export default async function blackbox(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .blackbox <pesan>' });
  
  const prompt = args.join(' ');
  await sock.sendMessage(sender, { text: '📦 Blackbox memproses...' });
  const result = await ai.blackbox(prompt);
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  await sock.sendMessage(sender, { text: `⚫ Blackbox AI:\n\n${result.text}\n\n💡 Blackbox AI` });
}
