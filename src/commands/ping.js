export default async function ping(context) {
  const { sock, m, sender, isOwner, args } = context;
  
  const start = Date.now();
  await sock.sendMessage(sender, { text: '🚀 up speed...' });
  const end = Date.now();
  const pingTime = end - start;
  
  await sock.sendMessage(sender, {
    text: `💥 *PONG!*\n\n📡 *Latensi:* ${pingTime}ms\n⏱️ *Timestamp:* ${new Date().toLocaleString('id-ID')}\n🤖 *Bot:* nexus MD`
  });
}
