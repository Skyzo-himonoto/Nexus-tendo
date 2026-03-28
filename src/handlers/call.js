import config from '../../config.js';

export default async function callHandler(sock, callUpdate) {
  try {
    const call = callUpdate[0];
    const callerId = call.from;
    if (callerId.includes('@g.us')) return;
    
    await sock.rejectCall(call.id, callerId);
    await sock.sendMessage(callerId, {
      text: `📞 *Maaf, bot tidak bisa menerima panggilan.*\n\n kirim untuk pesan teks. Jangan telepon bot ya!\n\nHubungi owner: ${config.ownerNumbers[0]}`
    });
  } catch (err) {
    console.error('Call error:', err);
  }
}
