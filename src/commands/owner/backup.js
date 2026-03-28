import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import config from '../../../config.js';
import { formatDate } from '../../../lib/utils.js';

export default async function backup(context) {
  const { sock, sender, isOwner } = context;
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  
  await sock.sendMessage(sender, { text: '💾 Creating backup...' });
  try {
    const backupName = `backup_${formatDate().replace(/[/: ]/g, '-')}.zip`;
    const backupPath = path.join(config.tempPath, backupName);
    const output = fs.createWriteStream(backupPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', async () => {
      const size = (await fs.stat(backupPath)).size / 1024 / 1024;
      await sock.sendMessage(sender, {
        document: { url: backupPath },
        fileName: backupName,
        caption: `💾 Backup\n📦 Size: ${size.toFixed(2)} MB`
      });
      await fs.unlink(backupPath);
    });
    archive.on('error', (err) => { throw err; });
    archive.pipe(output);
    archive.directory(config.databasePath, 'database');
    archive.directory(config.dataPath, 'data');
    archive.file('config.js', { name: 'config.js' });
    archive.file('package.json', { name: 'package.json' });
    await archive.finalize();
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Backup failed: ${err.message}` });
  }
      }
