/**
 * ==============================================
 * NEXUS TENDO MD 
 * ==============================================
 * cuman owner yang bisa 
 * 
 * Cara pakai:
 * .setprefix [prefix] - Mengubah prefix
 * .setname [nama] - Mengubah nama bot
 * ==============================================
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const config = require('../../config');

async function settingCommand(sock, sender, setting, value) {
    if (!value) {
        await sock.sendMessage(sender, { 
            text: `❌ *Cara pakai:*\n.set${setting} [value]\n\nContoh:\n.setprefix !\n.setname NexusBot` 
        });
        return;
    }
    
    const configPath = path.join(__dirname, '../../config.js');
    let configContent = fs.readFileSync(configPath, 'utf-8');
    
    switch(setting) {
        case 'prefix':
            configContent = configContent.replace(
                /prefix: ".*",/,
                `prefix: "${value}",`
            );
            configContent = configContent.replace(
                /prefixes: \[.*\],/,
                `prefixes: ["${value}", "/", "!", "#", "?", "$"],`
            );
            
            fs.writeFileSync(configPath, configContent);
            
            await sock.sendMessage(sender, { 
                text: `✅ *Prefix berhasil diubah*\n\nPrefix baru: ${value}\n\n⚠️ Restart bot agar perubahan生效.` 
            });
            break;
            
        case 'botname':
            configContent = configContent.replace(
                /botName: ".*",/,
                `botName: "${value}",`
            );
            
            fs.writeFileSync(configPath, configContent);
            
            await sock.sendMessage(sender, { 
                text: `✅ *Nama bot berhasil diubah*\n\nNama baru: ${value}\n\n⚠️ Restart bot agar perubahan生效.` 
            });
            break;
            
        default:
            await sock.sendMessage(sender, { text: '❌ Pengaturan tidak ditemukan!' });
            break;
    }
    
    console.log(chalk.yellow(`\n⚙️ [SETTING] ${setting} diubah menjadi: ${value}\n`));
}

module.exports = { settingCommand };
