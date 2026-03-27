import config from '../../config.js';
import db from '../../lib/database/index.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkAntiLink } from './group.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commands = new Map();

async function loadCommands() {
  const commandsPath = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  
  for (const file of commandFiles) {
    try {
      const command = await import(`../commands/${file}`);
      const commandName = file.replace('.js', '');
      commands.set(commandName, command.default);
      console.log(`✅ Perintah berhasil: ${commandName}`);
    } catch (err) {
      console.error(`❌ perintah gagal ${file}:`, err);
    }
  }
}

function isOwner(number) {
  return config.ownerNumbers.includes(number);
}

async function getPrefix(message) {
  const savedPrefix = await db.getPrefix();
  const prefixes = [savedPrefix, '.', '#', '!', '/', '?'];
  
  for (const p of prefixes) {
    if (message.startsWith(p)) return p;
  }
  return null;
}

export default async function messageHandler(sock, msg, store) {
  try {
    const m = msg.messages[0];
    if (!m.message || m.key.fromMe) return;
    
    const sender = m.key.remoteJid;
    const isGroup = sender.endsWith('@g.us');
    const senderNumber = isGroup ? m.key.participant : sender;
    const messageText = m.message.conversation || 
                        m.message.extendedTextMessage?.text || 
                        m.message.imageMessage?.caption ||
                        '';
    
    const settings = await db.getSettings();
    if (settings.autoRead) {
      await sock.readMessages([m.key]);
    }
    
    if (settings.autoTyping && messageText) {
      await sock.sendPresenceUpdate('composing', sender);
    }
    
    if (settings.autoRecording && messageText) {
      await sock.sendPresenceUpdate('recording', sender);
    }

    if (isGroup) {
      const isLinkDetected = await checkAntiLink(sock, m, sender, senderNumber);
      if (isLinkDetected) return;
    }
    
    const prefix = await getPrefix(messageText);
    if (!prefix) return;
    const args = messageText.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
    if (commands.size === 0) {
      await loadCommands();
    }
    
    const command = commands.get(commandName);
    if (command) {
      const context = {
        sock,
        m,
        store,
        sender: senderNumber,
        isGroup,
        isOwner: isOwner(senderNumber),
        args,
        commandName,
        prefix,
        messageText
      };
      
      try {
        await command(context);
      } catch (err) {
        console.error(`Error executing ${commandName}:`, err);
        await sock.sendMessage(sender, {
          text: `❌ Error: ${err.message}`
        });
      }
    }
  } catch (err) {
    console.error('Message handler error:', err);
  }
}
