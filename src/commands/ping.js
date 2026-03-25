const moment = require('moment-timezone');
const config = require('../../config');

async function pingCommand(sock, sender) {
    const start = Date.now();
    await sock.sendMessage(sender, { text: '😂 pingpong...' });
    const end = Date.now();
    const ping = end - start;
    const time = moment().tz(config.timezone).format('HH:mm:ss');
    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = Math.floor(uptime % 60);
    
    await sock.sendMessage(sender, { 
        text: `🏓 *ping*\n\n` +
            `📡 *Latensi:* ${ping}ms\n` +
            `⏰ *Waktu:* ${time}\n` +
            `🤖 *Bot:* ${config.botName}\n` +
            `📦 *Versi:* ${config.version}\n` +
            `🕐 *Uptime:* ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s\n` +
            `✅ *Status:* Online\n` +
            `🎯 *Prefix:* ${config.prefix}`
    });
}

module.exports = { pingCommand };
