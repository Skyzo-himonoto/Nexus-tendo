import ai from '../../../lib/ai.js';
import db from '../../../lib/database/index.js';

export default async function gpt(context) {
  const { sock, sender, args, isOwner } = context;
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .gpt <pesan>' });
  
  const isPremium = await db.isPremium(sender);
  if (!isPremium && !isOwner) return await sock.sendMessage(sender, { text: '❌ ChatGPT hanya untuk premium user!' });
  
  const prompt = args.join(' ');
  await sock.sendMessage(sender, { text: '🧠 ChatGPT berpikir...' });
  const result = await ai.chatGPT(prompt);
  if (!result.success) return await sock.sendMessage(sender, { text: `❌ ${result.error}` });
  await sock.sendMessage(sender, { text: `🤖 ChatGPT:\n\n${result.text}\n\n💡 OpenAI` });
}
