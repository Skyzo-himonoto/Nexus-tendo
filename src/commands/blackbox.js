import ai from '../../lib/ai.js';

export default async function blackbox(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.blackbox <pesan>\n\nContoh: .blackbox Code Python untuk menghitung faktorial'
    });
  }
  
  const prompt = args.join(' ');
  
  await sock.sendMessage(sender, {
    text: '📦 *Blackbox AI sedang memproses...*'
  });
  
  const result = await ai.blackbox(prompt);
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  await sock.sendMessage(sender, {
    text: `⚫ *Blackbox AI:*\n\n${result.text}\n\n💡 *Powered by Blackbox AI*`
  });
}
