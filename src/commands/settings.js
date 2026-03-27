import db from '../../lib/database/index.js';

export default async function settings(context) {
  const { sock, sender, isOwner, args, prefix } = context;
  
  const currentSettings = await db.getSettings();
  const currentPrefix = await db.getPrefix();
  
  if (args.length === 0) {
    let text = `╭━━━━━ *BOT SETTINGS* ━━━━━╮
┃
┃ 🤖 *Bot Name:* ${currentSettings.botName || 'Quantum-MD'}
┃ 🔧 *Prefix:* ${currentPrefix}
┃ 📖 *Auto Read:* ${currentSettings.autoRead ? '✅' : '❌'}
┃ ⌨️ *Auto Typing:* ${currentSettings.autoTyping ? '✅' : '❌'}
┃ 🎙️ *Auto Recording:* ${currentSettings.autoRecording ? '✅' : '❌'}
┃ 👁️ *Auto Status View:* ${currentSettings.autoStatusView ? '✅' : '❌'}
┃
┃ 📝 *Commands:*
┃ ✦ ${prefix}settings prefix <new_prefix>
┃ ✦ ${prefix}settings autoRead on/off
┃ ✦ ${prefix}settings autoTyping on/off
┃ ✦ ${prefix}settings autoRecording on/off
┃ ✦ ${prefix}settings autoStatusView on/off
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
    
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
        return await sock.sendMessage(sender, { text: '📝 *Contoh:* .settings prefix .' });
      }
      await db.setPrefix(value);
      await sock.sendMessage(sender, { text: `✅ *Prefix changed to:* ${value}` });
      break;
      
    case 'autoread':
      if (!value) {
        return await sock.sendMessage(sender, { text: '📝 *Contoh:* .settings autoread on/off' });
      }
      const autoRead = value === 'on';
      await db.updateSettings({ autoRead });
      await sock.sendMessage(sender, { text: `✅ *Auto Read:* ${autoRead ? 'Enabled' : 'Disabled'}` });
      break;
      
    case 'autotyping':
      if (!value) {
        return await sock.sendMessage(sender, { text: '📝 *Contoh:* .settings autotyping on/off' });
      }
      const autoTyping = value === 'on';
      await db.updateSettings({ autoTyping });
      await sock.sendMessage(sender, { text: `✅ *Auto Typing:* ${autoTyping ? 'Enabled' : 'Disabled'}` });
      break;
      
    case 'autorecording':
      if (!value) {
        return await sock.sendMessage(sender, { text: '📝 *Contoh:* .settings autorecording on/off' });
      }
      const autoRecording = value === 'on';
      await db.updateSettings({ autoRecording });
      await sock.sendMessage(sender, { text: `✅ *Auto Recording:* ${autoRecording ? 'Enabled' : 'Disabled'}` });
      break;
      
    case 'autostatusview':
      if (!value) {
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
