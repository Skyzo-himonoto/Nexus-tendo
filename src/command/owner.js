/**
 * ==============================================
 * NEXUS TENDO MD - OWNER COMMAND
 * ==============================================
 * Menampilkan informasi owner bot
 * ==============================================
 */

const config = require('../../config');

async function ownerCommand(sock, sender) {
    const ownerNumber = config.getOwnerNumber();
    
    const ownerText = `
╔══════════════════════════════════════╗
║            👑 *OWNER BOT*            ║
╠══════════════════════════════════════╣
║  👤 Nama     : ${config.ownerName}
║  📱 Kontak   : wa.me/${ownerNumber}
║  🤖 Bot      : ${config.botName}
║  📦 Version  : ${config.version}
║  🎯 Prefix   : ${config.prefix}
╠══════════════════════════════════════╣
║  📌 *Note:*                         ║
║  Bot ini dikembangkan oleh          ║
║  ${config.ownerName}.               ║
║                                     ║
║  💡 *Support:*                      ║
║  • Fitur lengkap 50+                ║
║  • Update rutin                     ║
║  • 24/7 online                      ║
╚══════════════════════════════════════╝

💝 *Dukung developer:* .donasi
    `;
    
    await sock.sendMessage(sender, { text: ownerText });
}

module.exports = { ownerCommand };
