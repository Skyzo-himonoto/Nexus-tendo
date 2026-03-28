import fs from 'fs-extra';
import config from '../../../config.js';

export default async function cleartmp(context) {
  const { sock, sender, isOwner } = context;
  
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  
  await sock.sendMessage(sender, { text: '🗑️ Cleaning temp folder...' });
  
  const tempPath = config.tempPath;
  try {
    const files = await fs.readdir(tempPath);
    let deleted = 0;
    for (const file of files) {
      const filePath = path.join(tempPath, file);
      const stats = await fs.stat(filePath);
      if (Date.now() - stats.mtimeMs > 3600000) {
        await fs.unlink(filePath);
        deleted++;
      }
    }
    await sock.sendMessage(sender, { text: `✅ berhasil dihapus: ${deleted} files` });
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Error: ${err.message}` });
  }
}
