/**
 * ==============================================
 * NEXUS TENDO MD - MAIN ENTRY POINT
 * ==============================================
 * WhatsApp Bot Multi-Device menggunakan Baileys
 * 
 * Fitur:
 * - Auto reconnect
 * - Session management
 * - QR Code scanner
 * - Multi-device support
 * ==============================================
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore } = require('@whiskeysockets/baileys');
const Pino = require('pino');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const fs = require('fs-extra');
const config = require('../config');
const { handleMessage } = require('./handlers/message');

// Buat folder sessions jika belum ada
if (!fs.existsSync('./sessions')) {
    fs.mkdirSync('./sessions');
}

// In-memory store untuk caching data
const store = makeInMemoryStore({ logger: Pino().child({ level: 'silent' }) });

/**
 * Fungsi utama untuk memulai bot
 * Handle koneksi, autentikasi, dan event
 */
async function startBot() {
    // Load atau buat session baru
    const { state, saveCreds } = await useMultiFileAuthState(`./sessions/${config.sessionName}`);
    
    // Konfigurasi socket WhatsApp
    const sock = makeWASocket({
        auth: state,
        logger: Pino({ level: 'silent' }), // Matikan log berlebihan
        printQRInTerminal: false, // Kita handle QR sendiri
        browser: [config.botName, 'Chrome', '120.0.0'], // User agent
        markOnlineOnConnect: true, // Tampilkan online
        syncFullHistory: false, // Jangan sync full history
        patchWhatsappMaxMsgs: 100 // Limit pesan
    });
    
    // Bind store ke event
    store.bind(sock.ev);
    
    /**
     * Handle event connection update
     * Menampilkan QR Code dan status koneksi
     */
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log(chalk.yellow('\n╔══════════════════════════════════════╗'));
            console.log(chalk.yellow('║     📱 SCAN QR CODE BERIKUT          ║'));
            console.log(chalk.yellow('╚══════════════════════════════════════╝\n'));
            qrcode.generate(qr, { small: true });
            console.log(chalk.cyan('\n📱 Atau scan melalui WhatsApp:\n'));
            console.log(chalk.white('1. Buka WhatsApp di HP'));
            console.log(chalk.white('2. Tap menu (⋮) > Perangkat Tertaut'));
            console.log(chalk.white('3. Tap "Tautkan Perangkat"'));
            console.log(chalk.white('4. Scan QR Code di atas\n'));
        }
        
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode === DisconnectReason.loggedOut) {
                console.log(chalk.red('\n❌ Session expired!'));
                console.log(chalk.yellow('📌 Hapus folder sessions dan scan ulang!\n'));
                fs.removeSync(`./sessions/${config.sessionName}`);
            } else {
                console.log(chalk.yellow('\n🔄 Koneksi terputus, mencoba reconnect...\n'));
                setTimeout(() => startBot(), 5000);
            }
        } 
        else if (connection === 'open') {
            console.log(chalk.green(`
╔══════════════════════════════════════════════════════════╗
║     ✅ ${config.botName} BOT AKTIF!                        ║
╠══════════════════════════════════════════════════════════╣
║  🤖 Bot Name : ${config.botName}
║  📌 Prefix   : ${config.prefix}
║  👑 Owner    : ${config.getOwnerNumber()}
║  📅 Version  : ${config.version}
║  🚀 Status   : Online
╚══════════════════════════════════════════════════════════╝
            `));
        }
    });
    
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        
        const msg = messages[0];
        if (!msg.message) return;
        if (msg.key.fromMe) return; 
        await handleMessage(sock, msg);
    });
    
    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        const actionText = {
            add: '➕ Bergabung',
            remove: '➖ keluar',
            promote: '⭐ promote jadi admin',
            demote: '📉 demote dari admin'
        };
        
        console.log(chalk.blue(`\n📢 [GROUP] ${id.split('@')[0]}`));
        console.log(chalk.blue(`   Action: ${actionText[action] || action}`));
        console.log(chalk.blue(`   Users: ${participants.join(', ')}\n`));
    });
}

// Jalankan bot
startBot().catch(err => {
    console.error(chalk.red('\n❌ Fatal Error:', err.message));
    console.log(chalk.yellow('📌 Restarting bot in 10 seconds...\n'));
    setTimeout(() => startBot(), 10000);
});
