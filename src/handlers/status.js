import config from '../../config.js';
import fs from 'fs-extra';
import path from 'path';

export default async function statusHandler(sock, statusUpdate) {
  try {
    const autoStatusView = config.autoStatusView;
    
    if (!autoStatusView) return;
    
    const statuses = statusUpdate.statuses || [];
    
    for (const status of statuses) {
      const statusJid = status.userJid;
      const statusId = status.id;
      
      await sock.readMessages([{
        remoteJid: 'status@broadcast',
        id: statusId,
        participant: statusJid
      }]);
      
      console.log(`✅ berhasil terkirim ke: ${statusJid}`);
    }
    
  } catch (err) {
    console.error('Status handler error:', err);
  }
}
