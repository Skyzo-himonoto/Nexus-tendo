import config from '../../../config.js';

export default async function report(context) {
  const { sock, sender, args, m } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, { text: '📝 .report <pesan laporan>\n\nContoh: .report fitur download error' });
  }
  
  const reportText = args.join(' ');
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const hasMedia = quoted?.imageMessage || quoted?.videoMessage;
  
  const ownerJids = config.getOwnerJids();
  const reportMsg = `📢 *LAPORAN BARU*\n\n👤 Dari: @${sender.split('@')[0]}\n📝 Pesan: ${reportText}\n⏰ Waktu: ${new Date().toLocaleString('id-ID')}`;
  
  for (const owner of ownerJids) {
    try {
      if (hasMedia && quoted) {
        const mediaType = Object.keys(quoted)[0];
        const stream = await sock.downloadMediaMessage({ key: m.key, message: quoted });
        await sock.sendMessage(owner, {
          [mediaType.replace('Message', '')]: stream,
          caption: reportMsg,
          mentions: [sender]
        });
      } else {
        await sock.sendMessage(owner, { text: reportMsg, mentions: [sender] });
      }
    } catch (err) {
      console.error('Gagal kirim laporan ke owner:', err);
    }
  }
  
  await sock.sendMessage(sender, { text: '✅ Laporan terkirim ke owner 😇 Terima kasih atas masukannya.' });
}
