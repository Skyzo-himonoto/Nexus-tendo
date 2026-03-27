export default async function donasi(context) {
  const { sock, sender } = context;
  
  const text = `╭━━━━━ *SUPPORT DEVELOPMENT* ━━━━━╮
┃
┃ 💰 *Donasi / Support*
┃ 
┃ 🏦 *Bank BCA*
┃   // isi nomor rekening a.n (nama)
┃
┃ 🏦 *Bank Mandiri*
┃   // isi nomor rekening a.n (nama)
┃
┃ 💳 *DANA / OVO*
┃   085715818953
┃
┃ 🌟 *Saweria*
┃   https://saweria.co/username
┃
┃ 💝 *Trakteer*
┃   https://trakteer.id/username
┃
┃ 🤝 *Terima kasih atas dukungannya!*
┃   Setiap donasi membantu bot tetap aktif
┃   dan pengembangan fitur baru.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(sender, { text });
}
