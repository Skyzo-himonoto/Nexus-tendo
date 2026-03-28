import moment from 'moment-timezone';

export default async function runtime(context) {
  const { sock, sender } = context;
  
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  
  const text = `⏱️ *Bot Runtime*\n\n📅 Aktif selama:\n${days} hari ${hours} jam ${minutes} menit ${seconds} detik\n\n🕐 Server Time: ${moment().tz('Asia/Jakarta').format('HH:mm:ss')}\n📆 Tanggal: ${moment().tz('Asia/Jakarta').format('dddd, DD MMMM YYYY')}`;
  
  await sock.sendMessage(sender, { text });
}
