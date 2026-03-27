import db from '../../lib/database/index.js';
import config from '../../config.js';

export default async function sewa(context) {
  const { sock, sender, isOwner, args } = context;
  
  const sewaData = await db.loadJSON(path.join(config.dataPath, 'sewa.json'));
  
  if (args.length === 0) {
    let text = `╭━━━━━ *SEWA BOT* ━━━━━╮
┃
┃ 🤖 *Bot Name:* ${config.botName}
┃ 
┃ 💎 *Paket Sewa:*
┃ ✦ 7 hari - Rp 10.000
┃ ✦ 30 hari - Rp 25.000
┃ ✦ 90 hari - Rp 60.000
┃ ✦ Lifetime - Rp 150.000
┃
┃ 🎁 *Fitur Premium:*
┃ ✦ Akses semua fitur
┃ ✦ ChatGPT Unlimited
┃ ✦ Downloader Unlimited
┃ ✦ Priority support
┃
┃ 📝 *Cara Sewa:*
┃ .sewa <durasi> <nomor_group>
┃
┃ 📌 *Contoh:* .sewa 30 6285715818953
┃
┃ 👑 *Owner:* ${config.ownerName}
┃ 📞 *Contact:* ${config.ownerNumbers[0]}
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
    
    return await sock.sendMessage(sender, { text });
  }
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command sewa hanya untuk owner!'
    });
  }
  
  const duration = parseInt(args[0]);
  let groupId = args[1];
  
  if (!duration || !groupId) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.sewa <durasi> <nomor_group>\n\nContoh: .sewa 30 6285715818953'
    });
  }
  
  if (!groupId.includes('@g.us')) {
    groupId = groupId.replace(/[^0-9]/g, '') + '@g.us';
  }
  
  const expired = new Date();
  expired.setDate(expired.getDate() + duration);
  
  sewaData[groupId] = {
    id: groupId,
    expired: expired.toISOString(),
    duration: duration,
    active: true,
    sewaDate: new Date().toISOString()
  };
  
  await db.saveJSON(path.join(config.dataPath, 'sewa.json'), sewaData);
  
  await sock.sendMessage(sender, {
    text: `✅ *Sewa berhasil!*\n\n👥 *Group:* ${groupId}\n📅 *Durasi:* ${duration} hari\n⏰ *Expired:* ${expired.toLocaleDateString('id-ID')}\n\nBot akan otomatis keluar dari grup jika expired.`
  });
}￼Enter
