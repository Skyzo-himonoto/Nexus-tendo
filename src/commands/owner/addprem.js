import db from '../../../lib/database/index.js';

export default async function addprem(context) {
  const { sock, sender, isOwner, args } = context;
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .addprem 628xxxxx 30' });
  
  let target = args[0];
  let days = parseInt(args[1]) || 30;
  if (!target.includes('@')) {
    target = target.replace(/[^0-9]/g, '');
    if (target.startsWith('0')) target = '62' + target.slice(1);
    target = target + '@s.whatsapp.net';
  }
  
  await db.addPremium(target, days);
  await sock.sendMessage(sender, { text: `✅ Premium added!\n📱 User: ${target}\n📅 Durasi: ${days} hari` });
}
