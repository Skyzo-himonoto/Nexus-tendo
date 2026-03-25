/**
 * ==============================================
 * NEXUS TENDO MD 
 * ============================================
 * Hanya bisa digunakan oleh owner
 * 
 * Cara pakai: 
 * .bc [pesan] - Broadcast ke semua chat
 * .bcgrup [pesan] - Broadcast ke semua grup
 * .bcprivate [pesan] - Broadcast ke semua private chat
 * ==============================================
 */

const chalk = require('chalk');
async function broadcastCommand(sock, message, type = 'all') {
    if (!message) {
        console.log(chalk.red('[BROADCAST] Pesan kosong!'));
        return;
    }

    console.log(chalk.yellow(`\n📢 [BROADCAST] Memulai broadcast (${type})...`));
    console.log(chalk.cyan(`   Pesan: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}\n`));

    try {
        const chats = sock.chats || {};
        let success = 0;
        let failed = 0;
        let skipped = 0;

        for (const chatId in chats) {
            const chat = chats[chatId];
            
            if (!chat.id) {
                skipped++;
                continue;
            }
           
            if (type === 'group' && !chat.id.endsWith('@g.us')) {
                skipped++;
                continue;
            }
            if (type === 'private' && chat.id.endsWith('@g.us')) {
                skipped++;
                continue;
            }
            if (chat.id.endsWith('@newsletter')) {
                skipped++;
                continue;
            }

            try {
                await sock.sendMessage(chat.id, { 
                    text: `📢 *BROADCAST ${type.toUpperCase()}*\n\n${message}\n\n_📌 Dikirim dari owner bot_` 
                });
                success++;
                console.log(chalk.green(`   ✓ Terkirim ke: ${chat.id}`));
                
                // Delay 2 detik biar gak kena spam
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (e) {
                failed++;
                console.log(chalk.red(`   ✗ Gagal ke: ${chat.id} - ${e.message}`));
            }
        }

        console.log(chalk.green(`\n✅ [BROADCAST] Selesai!`));
        console.log(chalk.green(`   ✓ Terkirim: ${success} chat`));
        console.log(chalk.red(`   ✗ Gagal: ${failed} chat`));
        console.log(chalk.yellow(`   ⏭️ Skip: ${skipped} chat\n`));
        
        return { success, failed, skipped };
        
    } catch (error) {
        console.error(chalk.red('[BROADCAST] Error:', error.message));
        return { success: 0, failed: 0, skipped: 0, error: error.message };
    }
}

module.exports = { broadcastCommand };
