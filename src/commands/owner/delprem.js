import db from '../../../lib/database/index.js';

export default async function delprem(context) {
  const { sock, sender, isOwner, args } = context;
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .delprem 628xxxxx' });
  
  let target = args[0];
  if (!target.includes('@')) {
    target = target.replace(/[^0-9]/g, '');
    if (target.startsWith('0')) target = '62' + target.slice(1);
    target = target + '@s.whatsapp.net';
  }
  
  const isPrem = await db.isPremium(target);
  if (!isPrem) return await sock.sendMessage(sender, { text: `❌ @${target.split('@')[0]} not premium!` });
  
  await db.removePremium(target);
  await sock.sendMessage(sender, { text: `✅ Premium removed!\n📱 User: ${target}` });
}
