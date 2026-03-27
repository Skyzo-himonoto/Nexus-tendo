import db from '../../lib/database/index.js';
import config from '../../config.js';

export default async function settings(context) {
  const { sock, sender, isOwner, args, prefix } = context;
  
  const currentSettings = await db.getSettings();
  const currentPrefix = await db.getPrefix();
  
  if (args.length === 0) {
    let text = `╔══════════════════════════════════════╗
║            *BOT SETTINGS*               ║
╠══════════════════════════════════════╣
║  🤖 *Bot Name:* ${currentSettings.botName || config.botName}
║  🔧 *Default Prefix:* ${currentPrefix}
║  📌 *Supported Prefixes:* 
║     ${config.allowedPrefixes.join(', ')}
║
║  📖 *Auto Read:* ${currentSettings.autoRead ? '✅' : '❌'}
║  ⌨️ *Auto Typing:* ${currentSettings.autoTyping ? '✅' : '❌'}
║  🎙️ *Auto Recording:* ${currentSettings.autoRecording ? '✅' : '❌'}
║  👁️ *Auto Status View:* ${currentSettings.autoStatusView ? '✅' : '❌'}
║
╠══════════════════════════════════════╣
║  📝 *Commands:*
║  ✦ ${prefix}settings prefix <new_prefix>
║  ✦ ${prefix}settings autoRead on/off
║  ✦ ${prefix}settings autoTyping on/off
║  ✦ ${prefix}settings autoRecording on/off
║  ✦ ${prefix}settings autoStatusView on/off
║
║  💡 *Multi Prefix:* Bisa pake ${config.allowedPrefixes.slice(0, 5).join(', ')} dll
╚══════════════════════════════════════╝`;
    
    return await sock.sendMessage(sender, { text });
  }
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  const command = args[0].toLowerCase();
  const value = args[1];
  
  switch (command) {
    case 'prefix':
      if (!value) {
        return await sock.sendMessage(sender, { 
          text: `📝 *Contoh:* ${prefix}settings prefix .\n\n📌 *Supported prefixes:* ${config.allowedPrefixes.join(', ')}` 
        });
      }
      
      if (!config.allowedPrefixes.includes(value) && value !== '') {
        return await sock.sendMessage(sender, {
          text: `❌ Prefix *${value}* tidak didukung!\n\n📌 *Supported prefixes:* ${config.allowedPrefixes.join(', ')}`
        });
      }
      
      await db.setPrefix(value);
      await sock.sendMessage(sender, { 
        text: `✅ *Default prefix changed to:* ${value}\n\n📌 *Multi prefix masih aktif:* ${config.allowedPrefixes.join(', ')}`
      });
      break;
      
    case 'autoread':
      if (!value || !['on', 'off'].includes(value)) {
        return await sock.sendMessage(sender, { text: '📝 *Contoh:* .settings autoread on/off' });
      }
      const autoRead = value === 'on';
      await db.updateSettings({ autoRead });
      await sock.sendMessage(sender, { text: `✅ *Auto Read:* ${autoRead ? 'Enabled' : 'Disabled'}` });
      break;
      
    case 'autotyping':
      if (!value || !['on', 'off'].includes(value)) {
        return await sock.sendMessage(sender, { text: '📝 *Contoh:* .settings autotyping on/off' });
      }
      const autoTyping = value === 'on';
      await db.updateSettings({ autoTyping });
      await sock.sendMessage(sender, { text: `✅ *Auto Typing:* ${autoTyping ? 'Enabled' : 'Disabled'}` });
      break;
      
    case 'autorecording':
      if (!value || !['on', 'off'].includes(value)) {
        return await sock.sendMessage(sender, { text: '📝 *Contoh:* .settings autorecording on/off' });
      }
      const autoRecording = value === 'on';
      await db.updateSettings({ autoRecording });
      await sock.sendMessage(sender, { text: `✅ *Auto Recording:* ${autoRecording ? 'Enabled' : 'Disabled'}` });
      break;
      
    case 'autostatusview':
      if (!value || !['on', 'off'].includes(value)) {
        return await sock.sendMessage(sender, { text: '📝 *Contoh:* .settings autostatusview on/off' });
      }
      const autoStatusView = value === 'on';
      await db.updateSettings({ autoStatusView });
      await sock.sendMessage(sender, { text: `✅ *Auto Status View:* ${autoStatusView ? 'Enabled' : 'Disabled'}` });
      break;
      
    default:
      await sock.sendMessage(sender, {
        text: `❌ Setting *${command}* tidak dikenal!\n\nGunakan .settings untuk melihat daftar setting.`
      });
  }
}
