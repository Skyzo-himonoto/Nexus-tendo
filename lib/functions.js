import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import config from '../config.js';

export const formatRupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600), minutes = Math.floor((seconds % 3600) / 60), secs = seconds % 60;
  if (hours > 0) return `${hours}j ${minutes}m ${secs}d`;
  if (minutes > 0) return `${minutes}m ${secs}d`;
  return `${secs}d`;
};
export const isPremium = async (userId, db) => await db.isPremium(userId);
export const getUserLimit = async (userId, db) => (await db.getUser(userId)).limit;
export const reduceLimit = async (userId, db, amount = 1) => await db.reduceLimit(userId, amount);
export const uploadToTelegraph = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    const res = await axios.post('https://telegra.ph/upload', formData, { headers: formData.getHeaders() });
    return res.data?.[0] ? `https://telegra.ph${res.data[0].src}` : null;
  } catch (err) { console.error('Upload error:', err); return null; }
};
export const randomUserAgent = () => ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'][Math.floor(Math.random() * 4)];
export const isBlocked = async (sock, jid) => (await sock.fetchBlocklist()).includes(jid);
export const getProfilePicture = async (sock, jid) => { try { return await sock.profilePictureUrl(jid, 'image'); } catch { return null; } };
export const shortId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};
export const parseTime = (timeStr) => {
  const match = timeStr.match(/^(\d+)([dhms])$/);
  if (!match) return null;
  const units = { d: 86400, h: 3600, m: 60, s: 1 };
  return parseInt(match[1]) * units[match[2]];
};
export const commandExists = async (commandName, commandsPath) => { try { return await fs.pathExists(path.join(commandsPath, `${commandName}.js`)); } catch { return false; } };
export const loadCommands = async (commandsPath) => {
  const commands = new Map();
  const files = await fs.readdir(commandsPath);
  for (const file of files.filter(f => f.endsWith('.js'))) {
    const name = file.replace('.js', '');
    const command = await import(path.join(commandsPath, file));
    commands.set(name, command.default);
  }
  return commands;
};
export default { formatRupiah, formatTime, isPremium, getUserLimit, reduceLimit, uploadToTelegraph, randomUserAgent, isBlocked, getProfilePicture, shortId, parseTime, commandExists, loadCommands };
