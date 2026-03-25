/**
 * ==============================================
 * NEXUS TENDO MD 
 * ==============================================
 * Hanya bisa digunakan oleh owner
 * 
 * Cara pakai: .get [nama file]
 * Contoh: .get config.js
 * ==============================================
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

async function getCommand(sock, sender, filename) {
    if (!filename) {
        await sock.sendMessage(sender, { 
            text: '❌ *Cara pakai:*\n.get [nama file]\n\nContoh:\n.get config.js\n.get sessions/creds.json' 
        });
        return;
    }
    
    const allowedFiles = ['config.js', 'package.json', '.env', 'sessions/creds.json'];
    const isAllowed = allowedFiles.some(f => filename.includes(f));
    
    if (!isAllowed && !filename.startsWith('src/commands/')) {
        await sock.sendMessage(sender, { text: '❌ Akses ditolak! File tidak diizinkan.' });
        return;
    }
    
    const filePath = path.join(__dirname, '../../', filename);
    
    if (!fs.existsSync(filePath)) {
        await sock.sendMessage(sender, { text: `❌ File tidak ditemukan: ${filename}` });
        return;
    }
    
    try {
        const fileContent = fs.readFileSync(filePath);
        const stats = fs.statSync(filePath);
        
        await sock.sendMessage(sender, {
            document: fileContent,
            mimetype: 'application/octet-stream',
            fileName: filename,
            caption: `📁 *File:* ${filename}\n📦 *Size:* ${(stats.size / 1024).toFixed(2)} KB`
        });
        
        console.log(chalk.blue(`\n📁 [GET] File ${filename} dikirim ke owner\n`));
        
    } catch (error) {
        console.error(chalk.red('Get file error:', error));
        await sock.sendMessage(sender, { text: `❌ Gagal mengambil file: ${error.message}` });
    }
}

module.exports = { getCommand };
