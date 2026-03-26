require('dotenv').config();

module.exports = {
    owner: "6288225879928",
    ownerName: "Mustofa",
    botName: "Nexus tendo MD",
    version: "5.0.0",
    prefix: ".",
    prefixes: [".", "/", "!", "#", "?", "$"],
    timezone: "Asia/Jakarta",
    sessionName: "nexus_session",
    
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    weatherApiKey: process.env.WEATHER_API_KEY || "",
    
    enableGame: true,
    enableAnime: true,
    enableDownloader: true,
    enableNSFW: false,
    autoRead: true,
    autoSaveContact: true,
    
    stickerMsg: {
        processing: "🔄 *nexus* lagi bikin stiker...",
        success: "✅ *Stiker jadi!*",
        failed: "❌ *Gagal bikin stiker!*",
        noMedia: "❌ *Balas gambar/video pake command .stiker*"
    },
    
    aiMsg: {
        processing: "🤖 *nexus AI* mikir dulu...",
        noPrompt: "❌ *Cara:* .ai [pertanyaan]",
        error: "❌ *AI error!* Coba lagi",
        noApiKey: "❌ *API Key kosong!* Isi di .env"
    },
    
    downloadMsg: {
        processing: "🔄 *Mendownload* {type}...",
        success: "✅ *Download berhasil!*\n📌 *{title}*",
        failed: "❌ *Gagal mendownload.*",
        noUrl: "❌ *Cara pakai:*\n.{command} [url]",
        notFound: "❌ *Media tidak ditemukan!*"
    },
    
    groupMsg: {
        kickSuccess: "✅ *dadah {count} user*",
        promoteSuccess: "✅ *Berhasil promote {count} user*",
        demoteSuccess: "✅ *Berhasil demote {count} user*",
        addSuccess: "✅ *Berhasil menambahkan {count} user*",
        noMention: "❌ *Tag user yang ingin di-{action}!*",
        notOwner: "❌ *Command ini hanya untuk owner bot!*",
        notAdmin: "❌ *Command ini hanya untuk admin grup!*"
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
