import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  ownerNumbers: (process.env.OWNER_NUMBER || '').split(',').map(n => n.trim()),
  ownerName: process.env.OWNER_NAME || 'Nexus',
  botName: process.env.BOT_NAME || 'NexusMD',
  
  sessionName: process.env.SESSION_NAME || 'nexus-session', // jangan diubah
  prefix: process.env.PREFIX || '.',
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

  maxPremium: parseInt(process.env.MAX_PREMIUM) || 10,
  openaiKey: process.env.OPENAI_API_KEY || '',
  geminiKey: process.env.GEMINI_API_KEY || '',
  timezone: 'Asia/Jakarta'
};
