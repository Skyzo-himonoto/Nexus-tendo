/**
 * ==============================================
 * NEXUS TENDO MD 
 * ==============================================
 * Mengirim pesan broadcast ke semua chat
 * Hanya bisa digunakan oleh owner
 * 
 * Cara pakai: .bc [pesan]
 * ==============================================
 */

const chalk = require('chalk');
async function broadcastCommand(sock, message) {
    if (!message) {
        return; 
    }
    
    console.log(chalk.yellow('\n📢 [BROADCAST] Memulai broadcast...'));
    
    try {
        const chats = sock.chats;
        let success = 0;
        let failed = 0;
        
        for (const chat of Object.values(chats)) {
            if (chat.id && !chat.id.endsWith('@newsletter')) {
                try {
                    await sock.sendMessage(chat.id, { 
                        text: `📢 *BROADCAST*\n\n${message}\n\n_📌 Dikirim dari owner bot_` 
                    });
                    success++;
                    console.log(chalk.green(`   ✓ Terkirim ke: ${chat.id}`));
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (e) {
                    failed++;
                    console.log(chalk.red(`   ✗ Gagal ke: ${chat.id}`));
                }
            }
        }
        
        console.log(chalk.green(`\n✅ Broadcast selesai!`));
        console.log(chalk.green(`   Terkirim: ${success} chat`));
        console.log(chalk.red(`   Gagal: ${failed} chat\n`));
        
    } catch (error) {
        console.error(chalk.red('Broadcast error:', error));
    }
}

module.exports = { broadcastCommand };
