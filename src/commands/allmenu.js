/**
 * ==============================================
 * NEXUS TENDO MD - ALL MENU
 * ==============================================
 * 
 * Total fitur: 50+ command
 * Kategori: Media, AI, Downloader, Tools, Converter,
 *           Group, Game, Anime, Owner, Lainnya
 * ==============================================
 */

const config = require('../../config');

async function allmenuCommand(sock, sender, prefix) {
    const usedPrefix = prefix || config.prefix;
    
    const categories = [
        {
            icon: "🎨",
            name: "MEDIA & STIKER",
            commands: [
                { cmd: "stiker", desc: "Buat stiker dari gambar/video", example: `${usedPrefix}stiker (balas gambar)` },
                { cmd: "toimg", desc: "Ubah stiker jadi gambar", example: `${usedPrefix}toimg (balas stiker)` },
                { cmd: "ttp", desc: "Text to picture (tulisan ke gambar)", example: `${usedPrefix}ttp halo dunia` },
                { cmd: "attp", desc: "Text to sticker (tulisan ke stiker)", example: `${usedPrefix}attp halo` },
                { cmd: "gif", desc: "Buat GIF dari video", example: `${usedPrefix}gif (balas video)` }
            ]
        },
        {
            icon: "🤖",
            name: "AI & CHAT",
            commands: [
                { cmd: "ai [text]", desc: "Chat dengan AI Gemini", example: `${usedPrefix}ai siapa pencipta bot ini?` },
                { cmd: "gpt [text]", desc: "Chat dengan GPT", example: `${usedPrefix}gpt jelaskan coding` },
                { cmd: "img [prompt]", desc: "Generate gambar dengan AI", example: `${usedPrefix}img kucing lucu` }
            ]
        },
        {
            icon: "📥",
            name: "DOWNLOADER",
            commands: [
                { cmd: "ytmp3 [url]", desc: "Download audio YouTube", example: `${usedPrefix}ytmp3 https://youtu.be/xxx` },
                { cmd: "ytmp4 [url]", desc: "Download video YouTube", example: `${usedPrefix}ytmp4 https://youtu.be/xxx` },
                { cmd: "ig [url]", desc: "Download Instagram (reel/foto/video)", example: `${usedPrefix}ig https://instagram.com/p/xxx` },
                { cmd: "tt [url]", desc: "Download TikTok (no watermark)", example: `${usedPrefix}tt https://tiktok.com/@xxx` },
                { cmd: "fb [url]", desc: "Download Facebook video", example: `${usedPrefix}fb https://fb.watch/xxx` },
                { cmd: "twitter [url]", desc: "Download Twitter/X video", example: `${usedPrefix}twitter https://twitter.com/xxx` },
                { cmd: "pinterest [query]", desc: "Cari gambar di Pinterest", example: `${usedPrefix}pinterest mobil sport` }
            ]
        },
        {
            icon: "🛠️",
            name: "TOOLS",
            commands: [
                { cmd: "qrcode [text]", desc: "Buat QR Code", example: `${usedPrefix}qrcode https://nexus.com` },
                { cmd: "readqr [image]", desc: "Baca QR Code dari gambar", example: `${usedPrefix}readqr (balas gambar QR)` },
                { cmd: "weather [kota]", desc: "Cek cuaca", example: `${usedPrefix}weather Jakarta` },
                { cmd: "translate [kode] [text]", desc: "Translate teks", example: `${usedPrefix}translate id hello` },
                { cmd: "shortlink [url]", desc: "Pendekin link", example: `${usedPrefix}shortlink https://panjang.com` },
                { cmd: "bin [bin]", desc: "Cek info BIN card", example: `${usedPrefix}bin 453997` },
                { cmd: "calc [angka]", desc: "Kalkulator", example: `${usedPrefix}calc 1+1` }
            ]
        },
        {
            icon: "🔄",
            name: "CONVERTER",
            commands: [
                { cmd: "toaudio", desc: "Ubah video jadi audio", example: `${usedPrefix}toaudio (balas video)` },
                { cmd: "tomp3", desc: "Ubah video jadi MP3", example: `${usedPrefix}tomp3 (balas video)` },
                { cmd: "togif", desc: "Ubah video jadi GIF", example: `${usedPrefix}togif (balas video)` },
                { cmd: "compress", desc: "Kompres gambar/video", example: `${usedPrefix}compress (balas media)` }
            ]
        },
        {
            icon: "👥",
            name: "GROUP (Owner Only)",
            commands: [
                { cmd: "tagall", desc: "Tag semua member", example: `${usedPrefix}tagall pesan penting` },
                { cmd: "kick @tag", desc: "Kick member", example: `${usedPrefix}kick @user` },
                { cmd: "promote @tag", desc: "Jadiin admin", example: `${usedPrefix}promote @user` },
                { cmd: "demote @tag", desc: "Turunin admin", example: `${usedPrefix}demote @user` },
                { cmd: "add 628xxx", desc: "Tambah member", example: `${usedPrefix}add 6281234567890` },
                { cmd: "groupinfo", desc: "Info grup", example: `${usedPrefix}groupinfo` },
                { cmd: "setname [name]", desc: "Ubah nama grup", example: `${usedPrefix}setname Nexus Group` },
                { cmd: "setdesc [desc]", desc: "Ubah deskripsi grup", example: `${usedPrefix}setdesc Grup bot Nexus` }
            ]
        },
        {
            icon: "🎮",
            name: "GAME",
            commands: [
                { cmd: "tebakgambar", desc: "Main tebak gambar", example: `${usedPrefix}tebakgambar` },
                { cmd: "tebakkata", desc: "Main tebak kata", example: `${usedPrefix}tebakkata` },
                { cmd: "suit [pilihan]", desc: "Main suit (batu/kertas/gunting)", example: `${usedPrefix}suit batu` },
                { cmd: "tictactoe @tag", desc: "Main tic tac toe", example: `${usedPrefix}tictactoe @user` },
                { cmd: "slot", desc: "Mesin slot", example: `${usedPrefix}slot 100` },
                { cmd: "tebakangka", desc: "Tebak angka", example: `${usedPrefix}tebakangka` }
            ]
        },
        {
            icon: "🎌",
            name: "ANIME",
            commands: [
                { cmd: "anime [query]", desc: "Cari info anime", example: `${usedPrefix}anime naruto` },
                { cmd: "manga [query]", desc: "Cari info manga", example: `${usedPrefix}manga one piece` },
                { cmd: "waifu", desc: "Random gambar waifu", example: `${usedPrefix}waifu` },
                { cmd: "neko", desc: "Random gambar neko", example: `${usedPrefix}neko` },
                { cmd: "character [name]", desc: "Cari karakter anime", example: `${usedPrefix}character luffy` }
            ]
        },
        {
            icon: "👑",
            name: "OWNER (Khusus Owner)",
            commands: [
                { cmd: "bc [pesan]", desc: "Broadcast ke semua chat", example: `${usedPrefix}bc Halo semua!` },
                { cmd: "setprefix [prefix]", desc: "Ubah prefix bot", example: `${usedPrefix}setprefix !` },
                { cmd: "setname [name]", desc: "Ubah nama bot", example: `${usedPrefix}setname NexusBot` },
                { cmd: "exec [kode]", desc: "Eksekusi kode (danger)", example: `${usedPrefix}exec console.log("test")` },
                { cmd: "join [link]", desc: "Join grup", example: `${usedPrefix}join https://chat.whatsapp.com/xxx` },
                { cmd: "leave", desc: "Keluar dari grup", example: `${usedPrefix}leave` },
                { cmd: "get [file]", desc: "Ambil file session", example: `${usedPrefix}get config.js` }
            ]
        },
        {
            icon: "📌",
            name: "LAINNYA",
            commands: [
                { cmd: "ping", desc: "Cek status bot", example: `${usedPrefix}ping` },
                { cmd: "owner", desc: "Info owner", example: `${usedPrefix}owner` },
                { cmd: "donasi", desc: "Support developer", example: `${usedPrefix}donasi` },
                { cmd: "speed", desc: "Cek kecepatan bot", example: `${usedPrefix}speed` },
                { cmd: "runtime", desc: "Uptime bot", example: `${usedPrefix}runtime` },
                { cmd: "infobot", desc: "Info lengkap bot", example: `${usedPrefix}infobot` }
            ]
        }
    ];
    
    let totalCommands = 0;
    for (const cat of categories) {
        totalCommands += cat.commands.length;
    }
    
    let menuText = `╔══════════════════════════════════════════════════════════╗\n`;
    menuText += `║     📋 *ALL MENU ${config.botName}*                       ║\n`;
    menuText += `║     Total ${totalCommands} Commands | ${categories.length} Categories   ║\n`;
    menuText += `╠══════════════════════════════════════════════════════════╣\n`;
    menuText += `║  🎯 Prefix: ${usedPrefix}                                      ║\n`;
    menuText += `║  👑 Owner: @${config.getOwnerNumber()}                             ║\n`;
    menuText += `╠══════════════════════════════════════════════════════════╣\n\n`;
    
    for (const cat of categories) {
        menuText += `┌─${cat.icon} *${cat.name}*\n`;
        menuText += `│  ─────────────────────────────────────────────────────\n`;
        for (const cmd of cat.commands) {
            menuText += `│  📌 ${usedPrefix}${cmd.cmd}\n`;
            menuText += `│     → ${cmd.desc}\n`;
            menuText += `│     💡 ${cmd.example}\n`;
            menuText += `│\n`;
        }
        menuText += `└────────────────────────────────────────────────────────\n\n`;
    }
    
    menuText += `╚══════════════════════════════════════════════════════════╝\n`;
    menuText += `\n💡 *Tips:* Ketik ${usedPrefix}recom untuk fitur rekomendasi!\n`;
    menuText += `📌 *Support:* Hubungi @${config.getOwnerNumber()} untuk info lebih lanjut`;
    
    const buttons = [
        { index: 1, quickReplyButton: { displayText: '🌟 Menu Rekomendasi', id: `${usedPrefix}recom` } },
        { index: 2, quickReplyButton: { displayText: '📌 Menu Utama', id: `${usedPrefix}menu` } },
        { index: 3, quickReplyButton: { displayText: '🎨 Bikin Stiker', id: `${usedPrefix}stiker` } },
        { index: 4, quickReplyButton: { displayText: '🤖 Coba AI', id: `${usedPrefix}ai` } }
    ];
    
    await sock.sendMessage(sender, {
        text: menuText,
        footer: `Nexus Tendo MD v${config.version} | Total ${totalCommands} Fitur`,
        templateButtons: buttons
    });
}

module.exports = { allmenuCommand };
