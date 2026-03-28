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
  const categories = await fs.readdir(commandsPath);
  
  for (const category of categories) {
    const categoryPath = path.join(commandsPath, category);
    const stat = await fs.stat(categoryPath);
    if (stat.isDirectory()) {
      const files = await fs.readdir(categoryPath);
      for (const file of files.filter(f => f.endsWith('.js'))) {
        try {
          const command = await import(`../commands/${category}/${file}`);
          const commandName = file.replace('.js', '');
          commands.set(commandName, command.default);
          console.log(`✅ Loaded: ${category}/${commandName}`);
        } catch (err) {
          console.error(`❌ Failed load ${category}/${file}:`, err.message);
        }
      }
    }
  }
}

function isOwner(number) {
  return config.ownerNumbers.includes(number);
}

async function getPrefix(message) {
  const savedPrefix = await db.getPrefix();
  const allPrefixes = [savedPrefix, ...config.allowedPrefixes, config.prefix];
  const unique = [...new Set(allPrefixes)];
  for (const p of unique) if (p && message.startsWith(p)) return p;
  return null;
}

function isDirectCommand(message) {
  return ['ping', 'menu', 'owner', 'help'].includes(message.toLowerCase());
}

export default async function messageHandler(sock, msg, store) {
  try {
    const m = msg.messages[0];
    if (!m.message || m.key.fromMe) return;
    
    const sender = m.key.remoteJid;
    const isGroup = sender.endsWith('@g.us');
    const senderNumber = isGroup ? m.key.participant : sender;
    const messageText = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || '';
    const user = await db.getUser(senderNumber);
        if (user.banned && !isOwner(senderNumber)) {
        return await sock.sendMessage(sender, { 
        text: '❌ *Kamu telah di-ban dari bot ini!*\nHubungi owner untuk informasi lebih lanjut.' 
     });
   }
    const settings = await db.getSettings();
    if (settings.autoRead) await sock.readMessages([m.key]);
    if (settings.autoTyping && messageText) await sock.sendPresenceUpdate('composing', sender);
    if (settings.autoRecording && messageText) await sock.sendPresenceUpdate('recording', sender);
    
    if (isGroup) {
      const isLinkDetected = await checkAntiLink(sock, m, sender, senderNumber);
      if (isLinkDetected) return;
    }
    
    let prefix = await getPrefix(messageText);
    let commandName = '', args = [];
    
    if (prefix) {
      args = messageText.slice(prefix.length).trim().split(/ +/);
      commandName = args.shift().toLowerCase();
    } else {
      if (isDirectCommand(messageText)) {
        commandName = messageText.toLowerCase();
        args = [];
        prefix = '';
      } else return;
    }
    
    if (commands.size === 0) await loadCommands();
    
    const command = commands.get(commandName);
    if (command) {
      const context = {
        sock, m, store, sender: senderNumber, isGroup,
        isOwner: isOwner(senderNumber), args, commandName,
        prefix: prefix || (await db.getPrefix()) || config.prefix,
        messageText
      };
      try { await command(context); } 
      catch (err) {
        console.error(`Error executing ${commandName}:`, err);
        await sock.sendMessage(sender, { text: `❌ Error: ${err.message}` });
      }
    }
  } catch (err) {
    console.error('Message error:', err);
  }
}
