import db from '../../../lib/database/index.js';
import moment from 'moment-timezone';

export default async function profile(context) {
  const { sock, sender, args } = context;
  
  let target = sender;
  if (args.length > 0) {
    let number = args[0].replace(/[^0-9]/g, '');
    if (number.startsWith('0')) number = '62' + number.slice(1);
    target = number + '@s.whatsapp.net';
  }
  
  const user = await db.getUser(target);
  const isPremium = await db.isPremium(target);
  const pp = await sock.profilePictureUrl(target, 'image').catch(() => null);
  
  const text = `╭━━━━━ *PROFILE USER* ━━━━━╮
┃
┃ 👤 *User:* @${target.split('@')[0]}
┃ 💎 *Premium:* ${isPremium ? '√' : '×'}
┃ 📊 *Limit:* ${user.limit} / 50
┃ 📅 *Bergabung:* ${moment(user.registeredAt).format('DD/MM/YYYY')}
┃ ⏰ *Expired:* ${user.expired ? moment(user.expired).format('DD/MM/YYYY') : '-'}
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
  
  if (pp) {
    await sock.sendMessage(sender, { image: { url: pp }, caption: text, mentions: [target] });
  } else {
    await sock.sendMessage(sender, { text, mentions: [target] });
  }
}
