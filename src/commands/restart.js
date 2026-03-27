import fs from 'fs-extra';
import path from 'path';
import config from '../../config.js';

export default async function restart(context) {
  const { sock, sender, isOwner } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  await sock.sendMessage(sender, {
    text: '🔄 *Restarting bot...*\n\nMohon tunggu beberapa saat.'
  });

  const restartFlag = path.join(config.tempPath, 'restart.json');
  await fs.writeJson(restartFlag, {
    jid: sender,
    time: Date.now()
  });
  
  process.exit(0);
}
