import db from '../../../lib/database/index.js';
import config from '../../../config.js';

export default async function settings(context) {
  const { sock, sender, isOwner, args, prefix } = context;
  
  const current = await db.getSettings();
  const currentPrefix = await db.getPrefix();
  
  if (args.length === 0) {
    let text = `╔══════════════════════════════════════╗
║            *BOT SETTINGS*               ║
╠══════════════════════════════════════╣
║  🤖 *Bot:* ${config.botName}
║  🔧 *Prefix:* ${currentPrefix}
║  📌 *Support:* ${config.allowedPrefixes.join(', ')}
║  📖 *Auto Read:* ${current.autoRead ? '✅' : '❌'}
║  ⌨️ *Auto Typing:* ${current.autoTyping ? '✅' : '❌'}
║  🎙️ *Auto Recording:* ${current.autoRecording ? '✅' : '❌'}
║  👁️ *Auto Status:* ${current.autoStatusView ? '✅' : '❌'}
║
║  📝 *Commands:*
║  ✦ ${prefix}settings prefix <new>
║  ✦ ${prefix}settings autoRead on/off
║  ✦ ${prefix}settings autoTyping on/off
║  ✦ ${prefix}settings autoRecording on/off
║  ✦ ${prefix}settings autoStatusView on/off
╚══════════════════════════════════════╝`;
    return await sock.sendMessage(sender, { text });
  }
  
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  
  const cmd = args[0].toLowerCase();
  const val = args[1];
  
  switch (cmd) {
    case 'prefix':
      if (!val) return await sock.sendMessage(sender, { text: `📝 Example: ${prefix}settings prefix .` });
      if (!config.allowedPrefixes.includes(val)) return await sock.sendMessage(sender, { text: `❌ Prefix ${val} not supported!` });
      await db.setPrefix(val);
      await sock.sendMessage(sender, { text: `✅ Prefix changed to: ${val}` });
      break;
    case 'autoread':
      if (!val) return await sock.sendMessage(sender, { text: '📝 Example: .settings autoread on/off' });
      await db.updateSettings({ autoRead: val === 'on' });
      await sock.sendMessage(sender, { text: `✅ Auto Read: ${val === 'on' ? 'ON' : 'OFF'}` });
      break;
    case 'autotyping':
      if (!val) return await sock.sendMessage(sender, { text: '📝 Example: .settings autotyping on/off' });
      await db.updateSettings({ autoTyping: val === 'on' });
      await sock.sendMessage(sender, { text: `✅ Auto Typing: ${val === 'on' ? 'ON' : 'OFF'}` });
      break;
    case 'autorecording':
      if (!val) return await sock.sendMessage(sender, { text: '📝 Example: .settings autorecording on/off' });
      await db.updateSettings({ autoRecording: val === 'on' });
      await sock.sendMessage(sender, { text: `✅ Auto Recording: ${val === 'on' ? 'ON' : 'OFF'}` });
      break;
    case 'autostatusview':
      if (!val) return await sock.sendMessage(sender, { text: '📝 Example: .settings autostatusview on/off' });
      await db.updateSettings({ autoStatusView: val === 'on' });
      await sock.sendMessage(sender, { text: `✅ Auto Status View: ${val === 'on' ? 'ON' : 'OFF'}` });
      break;
    default:
      await sock.sendMessage(sender, { text: `❌ Setting ${cmd} not found!` });
  }
}
