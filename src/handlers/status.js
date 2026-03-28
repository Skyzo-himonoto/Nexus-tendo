import config from '../../config.js';

export default async function statusHandler(sock, statusUpdate) {
  try {
    if (!config.autoStatusView) return;
    const statuses = statusUpdate.statuses || [];
    for (const status of statuses) {
      await sock.readMessages([{
        remoteJid: 'status@broadcast',
        id: status.id,
        participant: status.userJid
      }]);
      console.log(`✅ Auto status from: ${status.userJid}`);
    }
  } catch (err) {
    console.error('Status error:', err);
  }
}
