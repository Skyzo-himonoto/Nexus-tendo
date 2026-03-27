import ai from '../../lib/ai.js';
import db from '../../lib/database/index.js';

export default async function gpt(context) {
  const { sock, sender, args, isOwner } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.gpt <pesan>\n\nContoh: .gpt Jelaskan tentang AI'
    });
  }

  const isPremiumUser = await db.isPremium(sender);
  
  if (!isPremiumUser && !isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ *Fitur ChatGPT hanya untuk premium user!*\n\n💎 Daftar premium: .sewa atau hubungi owner'
    });
  }
  
  const prompt = args.join(' ');
  
  await sock.sendMessage(sender, {
    text: '🧠 *ChatGPT sedang berpikir...*'
  });
  
  const result = await ai.chatGPT(prompt);
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  await sock.sendMessage(sender, {
    text: `🤖 *ChatGPT:*\n\n${result.text}\n\n💡 *Powered by OpenAI*`
  });
}
