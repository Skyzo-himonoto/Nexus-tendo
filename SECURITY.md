```
# 🔒 NEXUS-TENDO-MD SECURITY 

## Daftar Isi
1. [Owner & Admin Security](#owner--admin-security)
2. [Anti Spam & Anti Link](#anti-spam--anti-link)
3. [Database Security](#database-security)
4. [Session Security](#session-security)
5. [API Key Security](#api-key-security)
6. [Command Restrictions](#command-restrictions)
7. [Rate Limiting](#rate-limiting)
8. [Best Practices](#best-practices)

## 👑 Owner & Admin Security

### Owner Configuration
.env
OWNER_NUMBER=6285715818953,6285715818953  # Bisa multiple owner
OWNER_NAME=Nexus 
```

Owner Commands (Hanya bisa diakses owner)

Command Fungsi Pembatasan

.exec Execute terminal command ✅ Owner Only

.eval Evaluate JavaScript ✅ Owner Only

.bc Broadcast ke semua chat ✅ Owner Only

.addprem Tambah premium user ✅ Owner Only

.delprem Hapus premium user ✅ Owner Only

.restart Restart bot ✅ Owner Only

.backup Backup database ✅ Owner Only

.get Download file dari URL ✅ Owner Only

.sewa Manage sewa bot ✅ Owner Only


.settings Ubah pengaturan bot ✅ Owner Only

Multi Owner Support

```javascript
// config.js
ownerNumbers: (process.env.OWNER_NUMBER || '').split(',').map(n => n.trim())

// Cek owner
function isOwner(number) {
  return config.ownerNumbers.includes(number);
}
```

---

🛡️ Anti Spam & Anti Link

Anti Link Protection

```javascript
// Aktifkan di grup
.setantilink on

// Link yang terdeteksi
- https?:\/\/
- whatsapp\.com
- chat\.whatsapp\.com
- youtube\.com
- instagram\.com
- facebook\.com
- tiktok\.com
- twitter\.com
- telegram\.org
```

Anti Spam Protection

```javascript
// Aktifkan di grup
.setantispam on

// Fitur:
- Batas 5 pesan per 10 detik
- Auto mute jika spam
- Auto kick jika berulang
```

Rate Limiting

```javascript
// Setiap user punya limit
- Limit harian: 50 command
- Premium: Unlimited
- Owner: Unlimited

// Cek limit
.limit
```

---

💾 Database Security

Data yang Disimpan

```
data/
├── users.json       # Data user (limit, expired, premium)
├── groups.json      # Pengaturan grup (welcome, anti link, dll)
├── premium.json     # Daftar premium user
├── owner.json       # Daftar owner
├── settings.json    # Pengaturan bot
├── sewa.json        # Data sewa bot
└── prefix.json      # Prefix default
```

Auto Backup

```javascript
// Backup manual
.backup

// Auto backup (setiap 24 jam)
.autobackup on

// Restore backup
.restore <file>
```

Database Encryption (Opsional)

```javascript
// Enkripsi data sensitif
const crypto = require('crypto');

function encryptData(data, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  return cipher.update(JSON.stringify(data), 'utf8', 'hex');
}

function decryptData(encrypted, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  return JSON.parse(decipher.update(encrypted, 'hex', 'utf8'));
}
```

---

🔐 Session Security

Session Files

```
sessions/
├── creds.json       # Kredensial WhatsApp (SENSITIF!)
└── app-state-*.json # State aplikasi
```

Session Protection

```bash
# Jangan share folder sessions/
# Jangan commit sessions/ ke GitHub
# Backup sessions/ secara rutin

# Di .gitignore
sessions/
*.session
*.json.tmp
```

Session Backup

```javascript
// Backup session
.backup session

// Restore session
.restore session <file>
```

Session Expired Handler

```javascript
// Auto reconnect jika session expired
if (statusCode === DisconnectReason.loggedOut) {
  console.log('Session expired, please scan QR again');
  // Hapus folder sessions/
  // Restart bot
}
```

---

🔑 API Key Security

API Keys di .env

```env
# JANGAN SHARE .env FILE!
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
GEMINI_API_KEY=xxxxxxxxxxxxx
```

API Key Protection

```javascript
// Validasi API key sebelum digunakan
if (!config.openaiKey) {
  console.log('OpenAI API key not configured');
  // Fallback ke AI lain
}

// Jangan expose API key ke user
// Jangan log API key ke console
```

API Rate Limiting

API Limit Handling
OpenAI 20 req/menit Queue system
Gemini 60 req/menit Queue system
Blackbox Unlimited -

---

🚫 Command Restrictions

User Restrictions

Fitur Non-Premium Premium Owner
Command Limit 50/hari Unlimited Unlimited

ChatGPT ❌ ✅ ✅

Downloader 5x/hari Unlimited Unlimited

Game 10x/hari Unlimited Unlimited

Group Tools ✅ ✅ ✅

Premium Check

```javascript
async function isPremium(userId) {
  const user = await db.getUser(userId);
  if (!user.isPremium) return false;
  
  // Check expired
  if (user.expired && new Date(user.expired) < new Date()) {
    await db.removePremium(userId);
    return false;
  }
  
  return true;
}
```

Group Admin Check

```javascript
// Cek apakah user admin grup
const isAdmin = groupMetadata.participants.find(
  p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin')
);

// Cek apakah bot admin
const isBotAdmin = groupMetadata.participants.find(
  p => p.id === botId && (p.admin === 'admin' || p.admin === 'superadmin')
);
```

---

⏱️ Rate Limiting System

User Rate Limit

```javascript
class RateLimiter {
  constructor() {
    this.limits = new Map();
  }
  
  checkLimit(userId, maxRequests = 50, timeWindow = 86400000) {
    const now = Date.now();
    const userLimit = this.limits.get(userId) || [];
    
    // Filter requests in time window
    const recentRequests = userLimit.filter(time => now - time < timeWindow);
    
    if (recentRequests.length >= maxRequests) {
      return false; // Limit exceeded
    }
    
    recentRequests.push(now);
    this.limits.set(userId, recentRequests);
    return true;
  }
}
```

Group Rate Limit

```javascript
// Anti spam per grup
const groupSpam = new Map();

function checkGroupSpam(groupId, userId) {
  const group = groupSpam.get(groupId) || new Map();
  const userMessages = group.get(userId) || [];
  
  const now = Date.now();
  const recent = userMessages.filter(t => now - t < 10000); // 10 detik
  
  if (recent.length >= 5) {
    return false; // Spam detected
  }
  
  recent.push(now);
  group.set(userId, recent);
  groupSpam.set(groupId, group);
  return true;
}
```

---

📁 File Security

Temporary Files

```javascript
// Auto cleanup temp files
.cleartmp

// Files deleted:
- Files older than 1 hour
- Downloaded media
- Converted files
```

Upload Security

```javascript
// Validasi file sebelum upload
function validateFile(filePath) {
  const stats = fs.statSync(filePath);
  
  // Max size 50MB
  if (stats.size > 50 * 1024 * 1024) {
    throw new Error('File too large');
  }
  
  // Validasi ekstensi
  const allowedExt = ['.jpg', '.png', '.mp4', '.mp3', '.webp'];
  const ext = path.extname(filePath);
  if (!allowedExt.includes(ext)) {
    throw new Error('File type not allowed');
  }
  
  return true;
}
```

---

🚨 Security Checklist

Sebelum Deploy

· Ganti semua default password
· Setup OWNER_NUMBER di .env
· Jangan commit .env ke GitHub
· Jangan commit sessions/ ke GitHub
· Setup rate limiting
· Backup database teratur
· Gunakan HTTPS untuk API

Saat Running

· Monitor log untuk aktivitas mencurigakan
· Cek limit user secara rutin
· Update dependencies secara berkala
· Backup session setiap hari

Jika Terjadi Masalah

1. Session dicuri → Hapus sessions/ dan scan ulang
2. API key bocor → Regenerate API key
3. Bot di-spam → Aktifkan anti spam
4. Data bocor → Restore dari backup

---

📞 Report Security Issue

Jika menemukan vulnerability:

1. Hubungi owner: wa.me/{OWNER_NUMBER}
2. Jangan exploitasi
3. Berikan detail lengkap

---

📜 Security Updates

Date Version Update
2024-01-01 2.0.0 Initial security implementation
- - Anti link & anti spam
- - Rate limiting
- - Premium system

---

⚠️ PENTING:

· Jangan pernah share file sessions/creds.json
· Jangan pernah commit .env ke repository publik
· Gunakan password yang kuat untuk VPS/panel
· Backup database secara rutin

---

Made with 🔒 by Nexus tendo - nexus core

```

---

Udah bang! `security.md` ini mencakup:

| Section | Isi |
|---------|-----|
| Owner Security | Multi owner, command restrictions |
| Anti Spam/Link | Proteksi spam dan link berbahaya |
| Database Security | Backup, enkripsi, struktur data |
| Session Security | Proteksi session, backup |
| API Key Security | Cara simpan API key, rate limiting |
| Command Restrictions | Premium system, admin check |
| Rate Limiting | Limit per user dan grup |
| File Security | Validasi upload, auto cleanup |
| Checklist | Langkah sebelum dan saat deploy |
