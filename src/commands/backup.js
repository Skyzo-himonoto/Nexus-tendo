import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import config from '../../config.js';
import { formatDate } from '../../lib/utils.js';

export default async function backup(context) {
  const { sock, sender, isOwner } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  await sock.sendMessage(sender, {
    text: '💾 *Creating backup...*\n\nMohon tunggu sebentar.'
  });
  
  try {
    const date = formatDate().replace(/[/: ]/g, '-');
    const backupName = `backup_${date}.zip`;
    const backupPath = path.join(config.tempPath, backupName);
    const output = fs.createWriteStream(backupPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', async () => {
      const stats = await fs.stat(backupPath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      
      await sock.sendMessage(sender, {
        document: { url: backupPath },
        mimetype: 'application/zip',
        fileName: backupName,
        caption: `💾 *Database Backup*\n\n📅 *Date:* ${formatDate()}\n📦 *Size:* ${sizeMB} MB\n\n✅ Backup created successfully!`
      });
  
      await fs.unlink(backupPath);
    });
    
    archive.on('error', (err) => {
      throw err;
    });
    
    archive.pipe(output);
    
    archive.directory(config.databasePath, 'database');
    archive.directory(config.dataPath, 'data');
    archive.file('config.js', { name: 'config.js' });
    archive.file('package.json', { name: 'package.json' });
    archive.file('.env', { name: '.env' });
    
    await archive.finalize();
    
  } catch (err) {
    await sock.sendMessage(sender, {
      text: `❌ *Backup failed:* ${err.message}`
    });
  }
}
