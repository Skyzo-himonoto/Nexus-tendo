import db from '../../../lib/database/index.js';

export default async function afk(context) {
  const { sock, sender, args, m } = context;
  
  const reason = args.join(' ') || 'Tidak ada alasan';
  const afkData = { active: true, reason, time: Date.now() };
  await db.saveUser(sender, { afk: afkData });
  
  await sock.sendMessage(sender, { text: `😴 *Lagi afk*\n\n📝 Alasan: ${reason}\n\n⚠️ pesan terbuka kalau kamu chat.` });
}
