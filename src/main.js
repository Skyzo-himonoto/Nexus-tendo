const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers } = require('@whiskeysockets/baileys');
const Pino = require('pino');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const { handleMessage } = require('./handlers/message');

const sessionDir = path.join(__dirname, '../sessions', config.sessionName);
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

let reconnectAttempts = 0;

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    
    const sock = makeWASocket({
        auth: state,
        logger: Pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS('Desktop'),
        markOnlineOnConnect: true,
        syncFullHistory: false,
        patchWhatsappMaxMsgs: 100
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode === DisconnectReason.loggedOut) {
                console.log(chalk.red('\n❌ Session expired, Hapus folder sessions dan restart\n'));
                fs.removeSync(sessionDir);
                process.exit(0);
            } else {
                reconnectAttempts++;
                const delay = Math.min(5000 * reconnectAttempts, 30000);
                console.log(chalk.yellow(`\n🔄 Koneksi putus, reconnect in ${delay/1000}s (Attempt ${reconnectAttempts})\n`));
                setTimeout(() => startBot(), delay);
            }
        } 
        else if (connection === 'open') {
            reconnectAttempts = 0;
            console.log(chalk.green(`
╔══════════════════════════════════════════════════════════╗
║     ✅ ${config.botName} - NEXUS TENDO ACTIVE            ║
╠══════════════════════════════════════════════════════════╣
║  🤖 Bot    : ${config.botName}
║  📌 Prefix : ${config.prefix}
║  👑 Owner  : ${config.getOwnerNumber()}
║  📦 Version: ${config.version}
║  🚀 Status : ONLINE 
╚══════════════════════════════════════════════════════════╝
            `));
        }
    });
    
    const ownerNumber = config.getOwnerNumber();
    console.log(chalk.yellow('\n🔑 [PAIRING MODE] Menghubungkan ke:', ownerNumber));
    
    setTimeout(async () => {
        try {
            const code = await sock.requestPairingCode(ownerNumber);
            console.log(chalk.green(`
╔══════════════════════════════════════════════════════════╗
║  🔐 *PAIRING CODE*                                       ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║     KODE: ${chalk.cyan.bold(code)}                       ║
║                                                          ║
║  📌 CARA PAKAI:                                          ║
║  1. Buka WhatsApp di HP                                  ║
║  2. Settings > Perangkat Tertaut                         ║
║  3. Tautkan Perangkat                                    ║
║  4. Masukkan kode di atas                                ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
            `));
        } catch (err) {
            console.log(chalk.red('\n❌ Gagal generate pairing code:', err.message));
        }
    }, 3000);
    
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const msg = messages[0];
        if (!msg.message) return;
        if (msg.key.fromMe) return;
        
        await handleMessage(sock, msg);
    });
    
    sock.ev.on('call', async (calls) => {
        for (let call of calls) {
            if (call.isGroup) continue;
            await sock.rejectCall(call.id, call.from);
            await sock.sendMessage(call.from, { text: '📞 *Auto Reject*\n\nBot tidak menerima panggilan' });
        }
    });
}

startBot().catch(err => {
    console.error(chalk.red('\n❌ Fatal Error:', err.message));
    setTimeout(() => startBot(), 10000);
});

process.on('uncaughtException', (err) => {
    console.error(chalk.red('Uncaught Exception:', err.message));
});

process.on('unhandledRejection', (reason) => {
    console.error(chalk.red('Unhandled Rejection:', reason));
});
