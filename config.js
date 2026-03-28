import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base64 encoded (jangan diubah kalo gak mau error)
const credit = Buffer.from('TmV4dXMgVGVhbSB8IEdpdEh1YjogaHR0cHM6Ly9naXRodWIuY29tL1NreXpvLWhpbW9ub3RvL05leHVzLXRlbmRv', 'base64').toString('utf-8');

export default {
  botName: process.env.BOT_NAME || 'NexusMD',
  version: '2.0.0',
  credit: credit,
  
  ownerNumbers: (process.env.OWNER_NUMBER || '').split(',').map(n => n.trim()),
  ownerName: process.env.OWNER_NAME || 'Nexus',
  
  getOwnerNumber: () => {
    const owner = process.env.OWNER_NUMBER || '';
    let number = owner.split(',')[0];
    number = number.replace('@s.whatsapp.net', '').replace(/[^0-9]/g, '');
    return number || '628xxx';
  },
  
  getOwnerNumbers: () => {
    const owners = process.env.OWNER_NUMBER || '';
    return owners.split(',').map(n => n.replace('@s.whatsapp.net', '').replace(/[^0-9]/g, ''));
  },
  
  getOwnerJids: () => {
    const owners = process.env.OWNER_NUMBER || '';
    return owners.split(',').map(n => {
      let number = n.replace(/[^0-9]/g, '');
      if (number.startsWith('0')) number = '62' + number.slice(1);
      return number + '@s.whatsapp.net';
    });
  },
  
  prefix: process.env.PREFIX || '.',
  allowedPrefixes: ['.', '!', '/', '#', '?', '$', '&', '@', '+', '-', '=', ';', ':', '~', '`', '|', '^', '%'],
  
  sessionName: process.env.SESSION_NAME || 'nexus-session',
  
  autoRead: process.env.AUTO_READ === 'true',
  autoTyping: process.env.AUTO_TYPING === 'true',
  autoRecording: process.env.AUTO_RECORDING === 'true',
  autoStatusView: process.env.AUTO_STATUS_VIEW === 'true',
  
  __dirname,
  sessionsPath: join(__dirname, 'sessions'),
  tempPath: join(__dirname, 'temp'),
  logsPath: join(__dirname, 'logs'),
  databasePath: join(__dirname, 'database'),
  dataPath: join(__dirname, 'data'),
  assetsPath: join(__dirname, 'assets'),
  
  maxPremium: parseInt(process.env.MAX_PREMIUM) || 50,
  openaiKey: process.env.OPENAI_API_KEY || '',
  geminiKey: process.env.GEMINI_API_KEY || '',
  
  timezone: process.env.TIMEZONE || 'Asia/Jakarta',
  
  botNumber: null,
  botJid: null,
  
  setBotNumber: (number) => {
    config.botNumber = number;
    config.botJid = number + '@s.whatsapp.net';
  },
  
  getBotNumber: () => config.botNumber || 'Belum terhubung',
  getBotJid: () => config.botJid || null
};
