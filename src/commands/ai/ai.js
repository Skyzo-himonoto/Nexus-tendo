import ai from '../../../lib/ai.js';

export default async function aiCommand(context) {
  const { sock, sender, args } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .ai <pesan>\n\nGunakan: .gpt, .gemini, .blackbox untuk AI spesifik' });
  
  const prompt = args.join(' ');
  await sock.sendMessage(sender, { text: '🤔 AI berpikir...' });
  const result = await ai.blackbox(prompt);
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}\n\nCoba .gpt atau .gemini` });
  await sock.sendMessage(sender, { text: `🤖 AI:\n\n${result.text}\n\n💡 Blackbox AI` });
}
