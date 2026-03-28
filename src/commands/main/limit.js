import db from '../../../lib/database/index.js';

export default async function limit(context) {
  const { sock, sender } = context;
  
  const user = await db.getUser(sender);
  const isPremium = await db.isPremium(sender);
  
  const text = `╭━━━━━ *LIMIT INFO* ━━━━━╮
┃
┃ 👤 *User:* ${sender.split('@')[0]}
┃ 💎 *Premium:* ${isPremium ? '√' : '×'}
┃ 📊 *Limit Hari Ini:* ${user.limit} / 50
┃
┃ 💡 *Fitur Premium:*
┃ • ChatGPT Unlimited
┃ • Downloader Unlimited
┃ • Game Unlimited
┃
┃ 📞 *Upgrade:* .owner
╰━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(sender, { text });
}
