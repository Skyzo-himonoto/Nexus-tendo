import fs from 'fs-extra';
import path from 'path';
import config from '../config.js';
import axios from 'axios';

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const formatNumber = (n) => new Intl.NumberFormat('id-ID').format(n);
export const formatDate = (date = new Date()) => new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeStyle: 'medium' }).format(date);
export const randomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};
export const downloadFile = async (url, filename = null) => {
  try {
    const response = await axios({ method: 'GET', url, responseType: 'stream' });
    const fileName = filename || randomString() + path.extname(url).split('?')[0];
    const filePath = path.join(config.tempPath, fileName);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => { writer.on('finish', () => resolve(filePath)); writer.on('error', reject); });
  } catch (err) { throw new Error(`Download failed: ${err.message}`); }
};
export const isValidUrl = (url) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url);
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024, dm = decimals < 0 ? 0 : decimals, sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
export const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const loadJSON = async (filePath) => {
  try { if (await fs.pathExists(filePath)) return await fs.readJson(filePath); return {}; } 
  catch (err) { console.error(`Error loading JSON: ${filePath}`, err); return {}; }
};
export const saveJSON = async (filePath, data) => {
  try { await fs.ensureDir(path.dirname(filePath)); await fs.writeJson(filePath, data, { spaces: 2 }); return true; } 
  catch (err) { console.error(`Error saving JSON: ${filePath}`, err); return false; }
};
export const isValidJid = (jid) => jid && (jid.includes('@s.whatsapp.net') || jid.includes('@g.us'));
export const parseJid = (number) => number.includes('@') ? number : number + '@s.whatsapp.net';
