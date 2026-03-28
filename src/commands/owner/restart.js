import fs from 'fs-extra';
import path from 'path';
import config from '../../../config.js';

export default async function restart(context) {
  const { sock, sender, isOwner } = context;
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  
  await sock.sendMessage(sender, { text: '🔄 Restarting bot...' });
  const flag = path.join(config.tempPath, 'restart.json');
  await fs.writeJson(flag, { jid: sender, time: Date.now() });
  process.exit(0);
}
