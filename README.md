# 🚀 Nexus-tendo-MD

> Hybrid WhatsApp Bot - Gabungan Terbaik dari Nexus tendo

/* 
credit : Oura MD
*/

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/Baileys-MultiDevice-blue?style=for-the-badge&logo=whatsapp">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
  <img src="https://img.shields.io/badge/Version-2.0.0-red?style=for-the-badge">
</div>

## 📌 Nexus-tendo 

Nexus-tendo-MD menggabungkan struktur dari **Nexus Tendo** dengan fitur dari **Oura MD**. Hasilnya adalah bot yang:

- ✅ **Struktur modular & clean** - Mudah dikembangkan
- ✅ **Fitur super lengkap** - 40+ command, 25+ game
- ✅ **Database terintegrasi** - User, premium, group settings
- ✅ **Tanpa obfuscation** - Kode bersih, bebas modifikasi

## ✨ Fitur Unggulan

### 🎮 **Game System** (25+ Game)
- Truth & Dare
- Tebak Gambar, Tebak Kata, Tebak Lagu
- Family 100, Cak Lontong
- Susun Kata, Teka Teki
- Dan 20+ game lainnya!

### 📥 **Downloader**
- YouTube (Audio & Video)
- TikTok (No Watermark)
- Instagram (Post, Reel, Story)
- Facebook, Twitter/X
- MediaFire, Spotify

### 🤖 **AI & Chat**
- ChatGPT (OpenAI)
- Google Gemini
- Blackbox AI (Free)
- Text to Speech
- Translator

### 🖼️ **Sticker & Media**
- Buat sticker dari gambar/video
- Sticker dengan watermark
- Konversi sticker ke gambar
- Video ke Audio, Audio ke Video

### 👥 **Group Tools**
- Welcome/Leave message
- Anti Link
- Anti Spam
- Add, Kick, Promote, Demote
- Tag All
- Group Info

### 🛠️ **Tools Lainnya**
- QR Code Generator
- Short URL
- Weather Info
- Calculator
- Font Generator (Style Text)
- WhoIs (Cek nomor WA)

### 🕌 **Islamic Features**
- Al-Quran (baca ayat)
- Jadwal Sholat
- Doa Harian
- Asmaul Husna

### 🎌 **Anime & Random**
- Info Anime (MyAnimeList)
- Random Waifu/Anime Images
- Quotes, Fakta, Pantun
- Random Cat & Dog Images

### ⚙️ **Owner Tools**
- Exec & Eval
- Broadcast
- Premium Management
- Backup Database
- Restart Bot
- Clear Temp Files

## 📋 Daftar Command

| Kategori | Command |
|----------|---------|
| **Utama** | menu, allmenu, ping, owner, donasi, settings |
| **Sticker** | sticker, stickerwm, toimg |
| **AI** | ai, gpt, gemini, blackbox |
| **Downloader** | ytmp3, ytmp4, tiktok, ig, fb, twitter, mediafire, spotify |
| **Game** | game, jawab, gamelist |
| **Group** | group, add, kick, promote, demote, setpp, tagall |
| **Tools** | qrcode, tts, translate, styletext, calc, shorturl, weather, whois |
| **Anime** | anime, waifu |
| **Islam** | quran, jadwalsholat, doa, asmaulhusna |
| **Random** | random, quotes, fakta, pantun, meme, cat, dog |
| **Converter** | toimg, tomp3, tomp4, togiv, towebp |
| **Maker** | carbon, neon, glitch, burn, wanted, rip |
| **Search** | google, image, pinterest, github, npm |
| **Owner** | exec, eval, bc, addprem, delprem, listprem, restart, cleartmp, backup, get, sewa |

## 🚀 Cara Install

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/quantum-md.git
cd quantum-md
```

2. Install Dependencies
```bash
npm install
```

3. Setup Environment

```bash
cp .env.example .env
# Edit .env dengan data kamu
```

4. Jalankan Bot

```bash
# Development mode
npm run dev

# Production mode (with PM2)
npm run pm2
```

⚙️ Konfigurasi .env

```env
# Bot Configuration
OWNER_NUMBER=628xxxxxxxxxx
OWNER_NAME=YourName
BOT_NAME=QuantumMD
SESSION_NAME=quantum-session
PREFIX=.
AUTO_READ=false
AUTO_TYPING=false
AUTO_RECORDING=false
AUTO_STATUS_VIEW=true

# API Keys (Optional)
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

📁 Struktur Folder

```
Nexus-tendo-MD/
├── .env                    # Konfigurasi bot
├── package.json           
├── config.js              
├── index.js               
├── ecosystem.config.js    
│
├── src/
│   ├── main.js            # Main bot 
│   ├── handlers/          
│   │   ├── message.js
│   │   ├── group.js
│   │   ├── call.js
│   │   └── status.js
│   └── commands/          # fitur lengkap (40+ files)
│
├── lib/                   # Perpustakaan inti
│   ├── database/          # Basis data
│   ├── gameManager.js     # fitur games
│   ├── downloader.js      # Downloads 
│   ├── ai.js              # terintegrasi AI
│   ├── utils.js           # Utilitas 
│   ├── functions.js       # Fungsi pembantu
│   └── uploader.js        # upload dokumen
│
├── database/
│   └── games/            # 25+ base game
│
├── data/                 # base json
│   ├── users.json
│   ├── groups.json
│   ├── premium.json
│   └── ...
│
├── assets/               # Aset statis
├── sessions/             # versi WhatsApp 
├── temp/                 # File sementara
└── logs/                 # File log
```

🎮 Cara Main Game

1. Mulai game: .game tebakgambar
2. Jawab: .jawab <jawaban>
3. Lihat daftar game: .gamelist
4. Tambah soal (owner): .gameadd <game> <soal>|<jawaban>

💎 Premium Feature

Premium user mendapatkan akses:

· ChatGPT Unlimited
· Downloader Unlimited
· Priority support

Cara add premium (owner):

```
.addprem 628xxxxx 30
```

🛠️ Troubleshooting

QR Code tidak muncul?

· Pastikan terminal support QR display
· Coba jalankan ulang bot

Session expired?

```bash
rm -rf sessions/
npm start
```

Error lagi install?

```bash
rm -rf node_modules package-lock.json
npm install
```

📝 License

MIT License - Bebas digunakan, develop, dan dikembangkan!

✉️ Credits

· Nexus Tendo - Struktur & database system
· Oura MD - Game system & fitur lengkap
· Baileys - WhatsApp Multi-Device library

📞 Contact

· Owner: 628xxxxxxxxxx
· Bot Name: Nexu-tendo-MD

<div align="center">
  Made with ❤️ by Nexus
</div>

===============================================================
.env.example

```env
# Bot Configuration
OWNER_NUMBER=6281234567890
OWNER_NAME=YourName
BOT_NAME=QuantumMD
SESSION_NAME=quantum-session
PREFIX=.
AUTO_READ=false
AUTO_TYPING=false
AUTO_RECORDING=false
AUTO_STATUS_VIEW=true
MAX_PREMIUM=10

# apikey (gemini,openai / opsional - untuk fitur ai)
OPENAI_API_KEY=
GEMINI_API_KEY=

# Timezone
TIMEZONE=Asia/Jakarta
```
===============================================================
.gitignore

```gitignore
# Dependencies
node_modules/
package-lock.json

# Session & Temp
sessions/
temp/
logs/
*.session
*.json.tmp

# Environment
.env
.env.local
.env.production

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Backup
*.zip
*.tar.gz
backup-*.zip

# Uploaded files
assets/uploads/
```
==============================================================
ecosystem.config.js (Update)

```javascript
export default {
  apps: [{
    name: 'quantum-md',
    script: 'index.js',
    cwd: './',
    watch: false,
    autorestart: true,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      NODE_OPTIONS: '--max-old-space-size=512'
    },
    env_dev: {
      NODE_ENV: 'development',
      NODE_OPTIONS: '--max-old-space-size=256'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    instances: 1,
    exec_mode: 'fork'
  }]
};
```
