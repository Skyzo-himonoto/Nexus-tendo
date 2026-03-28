import db from '../../../lib/database/index.js';

const mentionedJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
for (const jid of mentionedJids) {
  const user = await db.getUser(jid);
  if (user.afk?.active) {
    const duration = Math.floor((Date.now() - user.afk.time) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    await sock.sendMessage(sender, {
      text: `😴 *@${jid.split('@')[0]} sedang AFK*\n\n📝 Alasan: ${user.afk.reason}\n⏱️ Sejak: ${minutes}m ${seconds}d yang lalu`,
      mentions: [jid]
    });
  }
}

const selfAfk = await db.getUser(senderNumber);
if (selfAfk.afk?.active) {
  await db.saveUser(senderNumber, { afk: null });
  await sock.sendMessage(sender, {
    text: `👋 Selamat datang kembali @${senderNumber.split('@')[0]}!\nKamu sudah keluar dari mode AFK.`,
    mentions: [senderNumber]
  });
}
