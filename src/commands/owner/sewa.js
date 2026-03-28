import db from '../../../lib/database/index.js';
import config from '../../../config.js';
import path from 'path';

export default async function sewa(context) {
  const { sock, sender, isOwner, args } = context;
  const sewaData = await db.loadJSON(path.join(config.dataPath, 'sewa.json'));
  
  if (args.length === 0) {
    let text = `╭━━━━━ SEWA BOT ━━━━━╮
┃ 🤖 ${config.botName}
┃ 💎 Paket: 7hr 10k | 30hr 25k | 90hr 60k
┃ 🎁 Fitur Premium Unlimited
┃ 📝 .sewa <durasi> <group>
┃ 👑 Owner: ${config.ownerNumbers[0]}
╰━━━━━━━━━━━━━━━━━━━╯`;
    return await sock.sendMessage(sender, { text });
  }
  
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  
  const duration = parseInt(args[0]);
  let groupId = args[1];
  if (!duration || !groupId) return await sock.sendMessage(sender, { text: '📝 .sewa 30 628xxxxx' });
  if (!groupId.includes('@g.us')) groupId = groupId.replace(/[^0-9]/g, '') + '@g.us';
  
  const expired = new Date(); expired.setDate(expired.getDate() + duration);
  sewaData[groupId] = { id: groupId, expired: expired.toISOString(), duration, active: true, sewaDate: new Date().toISOString() };
  await db.saveJSON(path.join(config.dataPath, 'sewa.json'), sewaData);
  await sock.sendMessage(sender, { text: `✅ Sewa berhasil!\n👥 ${groupId}\n📅 ${duration} hari\n⏰ Expired: ${expired.toLocaleDateString()}` });
}
