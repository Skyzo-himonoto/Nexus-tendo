const axios = require('axios');
const config = require('../../config');

async function makerCommand(sock, sender, type, text) {
    const prefix = config.prefix;
    
    if (!text) {
        await sock.sendMessage(sender, { text: `❌ Masukkan teks!\nContoh: ${prefix}${type} halo dunia` });
        return;
    }
    
    const makers = {
        'thunder': `https://api.popcat.xyz/thunder?text=${encodeURIComponent(text)}`,
        'biden': `https://api.popcat.xyz/biden?text=${encodeURIComponent(text)}`,
        'trump': `https://api.popcat.xyz/trump?text=${encodeURIComponent(text)}`,
        'jail': `https://api.popcat.xyz/jail?text=${encodeURIComponent(text)}`,
        'wanted': `https://api.popcat.xyz/wanted?text=${encodeURIComponent(text)}`,
        'meme': `https://api.popcat.xyz/meme?text=${encodeURIComponent(text)}`,
        'quote': `https://api.popcat.xyz/quote?text=${encodeURIComponent(text)}`,
        'drake': `https://api.popcat.xyz/drake?text=${encodeURIComponent(text)}`,
        'pixel': `https://api.popcat.xyz/pixel?text=${encodeURIComponent(text)}`,
        'glitch': `https://api.popcat.xyz/glitch?text=${encodeURIComponent(text)}`,
        'welcome': `https://api.popcat.xyz/welcome?text=${encodeURIComponent(text)}`,
        'fakenews': `https://api.popcat.xyz/fakenews?text=${encodeURIComponent(text)}`,
        'emoji': `https://api.popcat.xyz/emoji?text=${encodeURIComponent(text)}`,
        'stickermaker': `https://api.popcat.xyz/stickermaker?text=${encodeURIComponent(text)}`
    };
    
    if (!makers[type]) {
        await sock.sendMessage(sender, { text: `❌ Maker tidak ditemukan\nTersedia: ${Object.keys(makers).join(', ')}` });
        return;
    }
    
    await sock.sendMessage(sender, { text: `🎨 Membuat ${type}...` });
    
    try {
        await sock.sendMessage(sender, { image: { url: makers[type] }, caption: `✨ *${type.toUpperCase()}*\n\nTeks: ${text}` });
    } catch {
        await sock.sendMessage(sender, { text: '❌ Gagal membuat image' });
    }
}

module.exports = { makerCommand };
