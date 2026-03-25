/**
 * ==============================================
 * NEXUS TENDO MD 
 * ==============================================
 * Script ini dikembangkan oleh Nexus 
 * credit by Nexus omni - tendo
 * 
 * Cara custom:
 * 1. Ganti ownerNumber dengan nomor WhatsApp lo
 * 2. Ganti botName sesuai keinginan
 * 3. Sesuaikan prefix yang lo mau
 * 4. Isi API Key di .env
 * ==============================================
 */

require('dotenv').config();

module.exports = {
    /** 
     * Nomor owner bot (bisa lebih dari 1)
     * Format: 628xxxxxxxxx (tanpa tanda + atau 0)
     * Contoh: owner: "62xxx" atau "62xxx,62xxx"
     */
    owner: "6288225879928",  // GANTI DENGAN NOMOR WHATSAPP LU
    
    ownerName: "Nexus",  // GANTI DENGAN NAMA LU
    
    botName: "Nexus Tendo",  // GANTI DENGAN NAMA BOT LU
    
    /** Versi bot */
    version: "3.0.0",
    
    prefix: ".",  // GANTI PREFIX SESUAIKAN 
    
    prefixes: [".", "/", "!", "#", "?", "$", ">", "<"],
    
    timezone: "Asia/Jakarta",
    
    sessionName: "nexus_session",
    
    /** API Key untuk Google Gemini (dapatkan di https://makersuite.google.com/app/apikey) */
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    
    /** API Key untuk OpenWeatherMap (dapatkan di https://openweathermap.org/api) */
    weatherApiKey: process.env.WEATHER_API_KEY || "",
    
    /** Aktifkan fitur game */
    enableGame: true,
    
    /** Aktifkan fitur anime */
    enableAnime: true,
    
    /** Aktifkan fitur downloader */
    enableDownloader: true,
    
    /** Aktifkan fitur NSFW (18+) - default false */
    enableNSFW: false,
    
    /** Auto read message */
    autoRead: true,
    
    /** Auto save contact */
    autoSaveContact: true,

    stickerMsg: {
        processing: "🔄 *Nexus Tendo* sedang membuat stiker...",
        success: "✅ *Stiker berhasil dibuat!*",
        failed: "❌ *Gagal membuat stiker.*\nPastikan gambar/video valid!",
        noMedia: "❌ *Cara pakai:*\nBalas gambar/video dengan command .stiker",
        videoGuide: "🎥 *Video ke Stiker:*\nDurasi maksimal 10 detik"
    },
    
    aiMsg: {
        processing: "🤖 *Nexus AI* sedang berpikir...",
        noPrompt: "❌ *Cara pakai:*\n.ai [pertanyaan]\n\nContoh:\n.ai siapa pencipta bot ini?",
        error: "❌ Maaf, AI sedang bermasalah. Coba lagi nanti.",
        noApiKey: "❌ API Key belum diisi! Dapatkan gratis di https://makersuite.google.com/app/apikey"
    },
    
    downloadMsg: {
        processing: "🔄 *Mendownload* {type}...",
        success: "✅ *Download berhasil!*\n📌 *{title}*",
        failed: "❌ *Gagal mendownload.*\nPastikan URL valid!",
        noUrl: "❌ *Cara pakai:*\n.{command} [url]\n\nContoh:\n.{command} https://youtube.com/watch?v=xxx",
        notFound: "❌ *Media tidak ditemukan!*"
    },
    
    groupMsg: {
        kickSuccess: "✅ *dadah {count} user*",
        promoteSuccess: "✅ *Berhasil promote {count} user*",
        demoteSuccess: "✅ *Berhasil demote {count} user*",
        addSuccess: "✅ *Berhasil menambahkan {count} user*",
        noMention: "❌ *Tag user yang ingin di-{action}!*",
        notOwner: "❌ *Command ini hanya untuk owner bot!*",
        notAdmin: "❌ *Command ini hanya untuk admin grup!*",
        alreadyAdmin: "⚠️ *User sudah menjadi admin!*",
        notAdminUser: "⚠️ *User bukan admin!*"
    },
    
    converterMsg: {
        processing: "🔄 *Mengkonversi* {type}...",
        success: "✅ *Konversi berhasil*",
        failed: "❌ *Gagal mengkonversi*",
        noMedia: "❌ *Balas media yang ingin dikonversi*"
    }
};

module.exports.isOwner = (number) => {
    const owners = module.exports.owner.split(",").map(n => n.trim());
    const cleanNumber = number.split("@")[0];
    return owners.includes(cleanNumber);
};

module.exports.getOwnerNumber = () => {
    return module.exports.owner.split(",")[0];
};

module.exports.getAllOwners = () => {
    return module.exports.owner.split(",").map(n => n.trim());
};
