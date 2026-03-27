import config from '../../config.js';
import fs from 'fs-extra';
import path from 'path';

export default async function owner(context) {
  const { sock, m, sender, isOwner, args, prefix } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  if (args.length === 0) {
    const text = `╭━━━━━━━ *OWNER MENU* ━━━━━━━╮
┃
┃ ✦ ${prefix}exec <code>
┃ ✦ ${prefix}eval <code>
┃ ✦ ${prefix}setprefix <prefix>
┃ ✦ ${prefix}bc <pesan>
┃ ✦ ${prefix}addprem <nomor>
┃ ✦ ${prefix}delprem <nomor>
┃ ✦ ${prefix}listprem
┃ ✦ ${prefix}restart
┃ ✦ ${prefix}cleartmp
┃ ✦ ${prefix}getsession
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`;
    
    return await sock.sendMessage(sender, { text });
  }
  
  const command = args[0].toLowerCase(); 
  switch (command) {
    case 'setprefix':
      const newPrefix = args[1];
      if (!newPrefix) {
        return await sock.sendMessage(sender, { text: '❌ Masukkan prefix baru!' });
      }

      const prefixPath = path.join(config.dataPath, 'prefix.json');
      await fs.writeJson(prefixPath, { prefix: newPrefix });
      return await sock.sendMessage(sender, { text: `✅ Prefix berhasil diubah menjadi: *${newPrefix}*` });
      
    case 'cleartmp':
      const tempPath = config.tempPath;
      await fs.emptyDir(tempPath);
      return await sock.sendMessage(sender, { text: '✅ Folder temp berhasil dibersihkan!' });
      
    case 'restart':
      await sock.sendMessage(sender, { text: '🔄 Restarting bot...' });
      process.exit(0);
      
    default:
      return await sock.sendMessage(sender, { text: `❌ Command owner tidak dikenal: ${command}` });
  }
}
