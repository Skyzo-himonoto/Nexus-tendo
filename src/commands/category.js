const config = require('../../config');

async function categoryCommand(sock, sender, category, prefix) {
    const usedPrefix = prefix || config.prefix;
    
    const categories = {
        sticker: {
            title: "🎨 *STIKER & MEDIA*",
            commands: [
                { cmd: "stiker", desc: "Buat stiker dari gambar/video", example: "Balas gambar/video" },
                { cmd: "toimg", desc: "Ubah stiker jadi gambar", example: "Balas stiker" },
                { cmd: "stikergif", desc: "Buat stiker GIF dari video", example: "Balas video" },
                { cmd: "ttp", desc: "Text to sticker", example: `${usedPrefix}ttp halo` }
            ]
        },
        ai: {
            title: "🤖 *AI & CHAT*",
            commands: [
                { cmd: "ai [text]", desc: "Chat dengan AI Gemini", example: `${usedPrefix}ai siapa kamu?` }
            ]
        },
        downloader: {
            title: "📥 *DOWNLOADER*",
            commands: [
                { cmd: "ytmp3 [url]", desc: "Download audio YouTube", example: `${usedPrefix}ytmp3 url` },
                { cmd: "ytmp4 [url]", desc: "Download video YouTube", example: `${usedPrefix}ytmp4 url` },
                { cmd: "ig [url]", desc: "Download Instagram", example: `${usedPrefix}ig url` },
                { cmd: "tt [url]", desc: "Download TikTok", example: `${usedPrefix}tt url` }
            ]
        },
        tools: {
            title: "🛠️ *TOOLS*",
            commands: [
                { cmd: "qrcode [text]", desc: "Buat QR Code", example: `${usedPrefix}qrcode teks` },
                { cmd: "weather [kota]", desc: "Cek cuaca", example: `${usedPrefix}weather Jakarta` },
                { cmd: "translate [kode] [text]", desc: "Translate", example: `${usedPrefix}translate id hello` },
                { cmd: "calc [angka]", desc: "Kalkulator", example: `${usedPrefix}calc 1+1` }
            ]
        },
        game: {
            title: "🎮 *GAME*",
            commands: [
                { cmd: "suit", desc: "Main suit", example: `${usedPrefix}suit batu` },
                { cmd: "tebakgambar", desc: "Tebak gambar", example: `${usedPrefix}tebakgambar` },
                { cmd: "slot", desc: "Mesin slot", example: `${usedPrefix}slot 100` },
                { cmd: "math", desc: "Math game", example: `${usedPrefix}math` }
            ]
        },
        group: {
            title: "👥 *GROUP*",
            commands: [
                { cmd: "tagall", desc: "Tag semua member", example: `${usedPrefix}tagall pesan` },
                { cmd: "kick @tag", desc: "Kick member", example: `${usedPrefix}kick @user` },
                { cmd: "promote @tag", desc: "Jadiin admin", example: `${usedPrefix}promote @user` },
                { cmd: "groupinfo", desc: "Info grup", example: `${usedPrefix}groupinfo` }
            ]
        },
        info: {
            title: "📌 *INFO*",
            commands: [
                { cmd: "ping", desc: "Cek status bot", example: `${usedPrefix}ping` },
                { cmd: "owner", desc: "Info owner", example: `${usedPrefix}owner` },
                { cmd: "donasi", desc: "Support developer", example: `${usedPrefix}donasi` }
            ]
        }
    };
    
    const cat = categories[category];
    if (!cat) {
        await sock.sendMessage(sender, { text: '❌ Kategori tidak ditemukan!' });
        return;
    }
    
    let text = `╔══════════════════════════════════════════════════════════╗
║  ${cat.title}                         ║
╠══════════════════════════════════════════════════════════════╣\n`;
    
    for (const cmd of cat.commands) {
        text += `║  📌 *${usedPrefix}${cmd.cmd}*\n`;
        text += `║     → ${cmd.desc}\n`;
        text += `║     💡 ${cmd.example}\n`;
        text += `║\n`;
    }
    
    text += `╚══════════════════════════════════════════════════════════╝\n`;
    text += `\n💡 Ketik ${usedPrefix}allmenu untuk kembali ke semua kategori`;
    
    const buttons = [
        { index: 1, quickReplyButton: { displayText: '📋 ALL MENU', id: `${usedPrefix}allmenu` } },
        { index: 2, quickReplyButton: { displayText: '🌟 MENU UTAMA', id: `${usedPrefix}menu` } }
    ];
    
    await sock.sendMessage(sender, {
        text: text,
        footer: `⚡ ${config.botName} v${config.version}`,
        templateButtons: buttons
    });
}

module.exports = { categoryCommand };￼Enter
