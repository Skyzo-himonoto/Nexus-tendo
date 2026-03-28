import os from 'os';
import moment from 'moment-timezone';
import config from '../../../config.js';

export default async function stats(context) {
  const { sock, sender } = context;
  
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  const totalMem = os.totalmem() / 1024 / 1024 / 1024;
  const freeMem = os.freemem() / 1024 / 1024 / 1024;
  const usedMem = totalMem - freeMem;
  
  const cpuUsage = os.loadavg()[0];
  
  const text = `╭━━━━━ *BOT STATISTICS* ━━━━━╮
┃
┃ 🤖 *Bot:* ${config.botName}
┃ 📱 *Number:* ${config.getBotNumber()}
┃ ⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s
┃
┃ 💻 *System:*
┃ 🖥️ OS: ${os.type()} ${os.release()}
┃ 🧠 CPU: ${cpuUsage.toFixed(2)}%
┃ 💾 RAM: ${usedMem.toFixed(2)}GB / ${totalMem.toFixed(2)}GB
┃
┃ 📊 *Node.js:*
┃ 🔢 Version: ${process.version}
┃ 📦 Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(sender, { text });
}
