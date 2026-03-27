import ai from '../../lib/ai.js';

export default async function aiCommand(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.ai <pesan>\n\nContoh: .ai Siapa presiden Indonesia?\n\n🤖 *AI yang tersedia:*\n- ChatGPT (OpenAI)\n- Gemini AI\n- Blackbox AI\n\nGunakan: .gpt, .gemini, .blackbox untuk AI spesifik'
    });
  }
  
  const prompt = args.join(' ');
  
  await sock.sendMessage(sender, {
    text: '🤔 *AI sedang berpikir...*'
  });

  const result = await ai.blackbox(prompt); 
  if (!result.success) {
    return await sock.sendMessage(sender, {
      text: `❌ *Error:* ${result.error}\n\nCoba gunakan AI lain: .gpt atau .gemini`
    });
  }
  
  await sock.sendMessage(sender, {
    text: `🤖 *AI Response:*\n\n${result.text}\n\n💡 *Powered by Blackbox AI*`
  });
}
