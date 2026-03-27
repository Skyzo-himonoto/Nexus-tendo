import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  makeInMemoryStore,
  jidDecode
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import config from '../config.js';
import messageHandler from './handlers/message.js';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent' }) });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionsPath);
  
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: pino({ level: 'silent' }),
    browser: ['Nexus tendo MD', 'Chrome', '1.0.0'],
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
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log(chalk.yellow('Scan QR Code dengan WhatsApp mu:'));
    }
    
    if (connection === 'open') {
      const authInfo = await state;
      const botNumber = sock.user.id.split(':')[0];
      config.setBotNumber(botNumber);
      
      console.log(chalk.green(`✅ Bot berhasil terhubung!`));
      console.log(chalk.cyan(`🤖 Bot Number: ${config.getBotNumber()}`));
      console.log(chalk.cyan(`👑 Owner Number: ${config.getOwnerNumber()}`));
      console.log(chalk.gray('────────────────────────────────────────'));
    }
    
    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      console.log(chalk.red(`Koneksi terputus: ${statusCode}`));
      
      if (shouldReconnect) {
        console.log(chalk.green('Mencoba reconnect...'));
        startBot();
      } else {
        console.log(chalk.red('Session expired, hapus folder sessions dan scan ulang!'));
      }
    }
  });
  
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('messages.upsert', async (msg) => {
    try {
      await messageHandler(sock, msg, store);
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  sock.ev.on('groups.update', async (updates) => {
    console.log('Group update:', updates);
  });
  
  return sock;
}

startBot().catch(console.error);
