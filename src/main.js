import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  makeInMemoryStore
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import config from '../config.js';
import messageHandler from './handlers/message.js';
import fs from 'fs-extra';
import chalk from 'chalk';

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent' }) });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionsPath);
  
  const AUTH_MODE = process.env.AUTH_MODE || 'qr';
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: AUTH_MODE === 'qr',
    pairingCode: AUTH_MODE === 'pairing',
    logger: pino({ level: 'silent' }),
    browser: ['Nexus Tendo MD', 'Chrome', '2.0.0'],
    syncFullHistory: false,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      let msg = await store.loadMessage(key.remoteJid, key.id);
      return msg?.message || undefined;
    }
  });
  
  store.bind(sock.ev);
  
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr, pairingCode } = update;
    
    if (qr && AUTH_MODE === 'qr') {
      console.log(chalk.yellow('\n📱 Scan QR Code dengan WhatsApp mu:\n'));
    }
    
    if (pairingCode && AUTH_MODE === 'pairing') {
      console.log(chalk.green(`\n Pairing Code: ${pairingCode}`));
      console.log(chalk.yellow('Masukkan kode di WhatsApp > Perangkat Tertaut > Tautkan dengan kode 8 digit\n'));
    }
    
    if (connection === 'open') {
      const botNumber = sock.user.id.split(':')[0];
      config.setBotNumber(botNumber);
      console.log(chalk.green('\n✅ Bot berhasil terhubung'));
      console.log(chalk.cyan(`🤖 Bot Number: ${config.getBotNumber()}`));
      console.log(chalk.cyan(`👑 Owner Number: ${config.getOwnerNumber()}`));
      console.log(chalk.gray('────────────────────────────────────────\n'));
    }
    
    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(chalk.red(`\n❌ Koneksi terputus: ${statusCode}`));
      if (shouldReconnect) {
        console.log(chalk.green('🔄 Mencoba reconnect dalam 5 detik...'));
        setTimeout(() => startBot(), 5000);
      } else {
        console.log(chalk.red('⚠️ Hapus folder sessions/ lalu restart bot'));
      }
    }
  });
  
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('messages.upsert', async (msg) => {
    try { await messageHandler(sock, msg, store); } 
    catch (err) { console.error('Error handling message:', err); }
  });
  
  return sock;
}

process.on('SIGINT', () => { console.log(chalk.yellow('\n🛑 Bot dihentikan...')); process.exit(0); });

startBot().catch(console.error);
