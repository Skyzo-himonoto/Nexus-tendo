async function stickerCommand(sock, msg) {
    const sender = msg.key.remoteJid;
    const isQuoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    let mediaMsg = null;
    if (msg.message?.imageMessage) mediaMsg = msg.message.imageMessage;
    else if (msg.message?.videoMessage) mediaMsg = msg.message.videoMessage;
    else if (isQuoted?.imageMessage) mediaMsg = isQuoted.imageMessage;
    else if (isQuoted?.videoMessage) mediaMsg = isQuoted.videoMessage;
    
    if (!mediaMsg) {
        await sock.sendMessage(sender, { text: '❌ Balas gambar/video dengan .stiker' });
        return;
    }
    
    await sock.sendMessage(sender, { text: '🚀 Membuat stiker...' });
    
    try {
        const media = await sock.downloadMediaMessage({
            message: { [mediaMsg.type === 'imageMessage' ? 'imageMessage' : 'videoMessage']: mediaMsg },
            type: 'buffer'
        });
        
        await sock.sendMessage(sender, { sticker: media });
        
    } catch (error) {
        console.error('Sticker error:', error);
        await sock.sendMessage(sender, { text: '❌ Gagal membuat stiker!' });
    }
}

module.exports = { stickerCommand };

