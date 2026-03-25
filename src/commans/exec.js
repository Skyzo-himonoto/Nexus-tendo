/**
 * ==============================================
 * NEXUS TENDO MD - EXEC COMMAND
 * ==============================================
 * Hanya bisa digunakan oleh owner
 * 
 * ⚠️ PERINGATAN: Fiturnya bahaya bung hati-hati kalo make
 * Hanya digunakan untuk debugging/testing
 * 
 * Cara pakai: .exec [kode javascript]
 * ==============================================
 */

const { exec } = require('child_process');
const util = require('util');
const chalk = require('chalk');

const execPromise = util.promisify(exec);
async function execCommand(sock, sender, code) {
    if (!code) {
        await sock.sendMessage(sender, { 
            text: '❌ *Cara pakai:*\n.exec [kode]\n\nContoh:\n.exec console.log("test")' 
        });
        return;
    }
    
    await sock.sendMessage(sender, { text: '🔄 *Mengeksekusi kode...*' });
    
    try {
        let output;
        if (code.startsWith('$')) {
            const command = code.slice(1);
            const { stdout, stderr } = await execPromise(command);
            output = stdout || stderr || 'No output';
        } else {
            let result = eval(code);
            output = util.inspect(result, { depth: null, colors: false });
        }
        
        if (output.length > 4000) {
            output = output.substring(0, 4000) + '\n\n... (output dipotong)';
        }
        
        await sock.sendMessage(sender, { 
            text: `✅ *Hasil eksekusi:*\n\`\`\`\n${output}\n\`\`\`` 
        });
        
        console.log(chalk.blue(`\n🔧 [EXEC] Kode dieksekusi oleh owner\n`));
        
    } catch (error) {
        console.error(chalk.red('Exec error:', error));
        await sock.sendMessage(sender, { 
            text: `❌ *Error:*\n\`\`\`\n${error.message}\n\`\`\`` 
        });
    }
}

module.exports = { execCommand };
