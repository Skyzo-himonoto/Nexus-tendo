import ai from '../../lib/ai.js';

export default async function gemini(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.gemini <pesan>\n\nContoh: .gemini Buatkan puisi tentang alam'
    });
  }
  
  const prompt = args.join(' ');
  
  await sock.sendMessage(sender, {
    text: '🌟 *Gemini AI sedang berpikir...*'
  });
  
  const result = await ai.gemini(prompt);
  
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}`
    });
  }
  
  await sock.sendMessage(sender, {
    text: `✨ *Gemini AI:*\n\n${result.text}\n\n💡 *Powered by Google Gemini*`
  });
}
