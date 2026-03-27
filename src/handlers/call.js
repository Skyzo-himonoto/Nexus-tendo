import config from '../../config.js';

export default async function callHandler(sock, callUpdate) {
  try {
    const call = callUpdate[0];
    const callerId = call.from;
    const isGroup = callerId.includes('@g.us');
    
    if (isGroup) return;
    
    await sock.rejectCall(call.id, callerId);
    await sock.sendMessage(callerId, {
      text: `📞 *sorry bro, gw bisa nerima panggilan.*\n\nBot hanya nerima pesan teks. tolong, jangan menelepon bot.\n\nJika ada keperluan, silahkan hubungi owner:\n${config.ownerNumbers[0]}`
    });
    
  } catch (err) {
    console.error('Call handler error:', err);
  }
}
