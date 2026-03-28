import db from '../../../lib/database/index.js';

export default async function ban(context) {
  const { sock, sender, isOwner, args } = context;
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .ban 628xxxxx' });
  
  let number = args[0].replace(/[^0-9]/g, '');
  if (number.startsWith('0')) number = '62' + number.slice(1);
  const jid = number + '@s.whatsapp.net';
  
  await db.saveUser(jid, { banned: true });
  await sock.sendMessage(sender, { text: `✅ @${number} berhasil di-ban`, mentions: [jid] });
}

import db from '../../../lib/database/index.js';

export default async function unban(context) {
  const { sock, sender, isOwner, args } = context;
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .unban 628xxxxx' });
  
  let number = args[0].replace(/[^0-9]/g, '');
  if (number.startsWith('0')) number = '62' + number.slice(1);
  const jid = number + '@s.whatsapp.net';
  
  await db.saveUser(jid, { banned: false });
  await sock.sendMessage(sender, { text: `✅ @${number} berhasil di-unban`, mentions: [jid] });
}
