const axios = require('axios');
const config = require('../../config');

async function islamCommand(sock, sender, type, query) {
    const prefix = config.prefix;
    
    switch(type) {
        case 'quran':
            if (!query) {
                await sock.sendMessage(sender, { text: `❌ *Cara:* ${prefix}quran [surah]:[ayat]\nContoh: ${prefix}quran 1:1` });
                return;
            }
            const [surah, ayat] = query.split(':');
            try {
                const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${surah}:${ayat}/id.indonesian`);
                const data = response.data.data;
                await sock.sendMessage(sender, { text: `📖 *QS. ${data.surah.name} : ${data.numberInSurah}*\n\n${data.text}\n\n— ${data.surah.name} (${data.surah.englishName})` });
            } catch {
                await sock.sendMessage(sender, { text: '❌ Surah/ayat tidak ditemukan' });
            }
            break;
            
        case 'doa':
            try {
                const response = await axios.get('https://api.islamic-api.com/api/doa/random');
                const data = response.data;
                await sock.sendMessage(sender, { text: `🕌 *DOA HARIAN*\n\n${data.title}\n\n${data.arabic}\n\nArtinya:\n${data.translation}` });
            } catch {
                await sock.sendMessage(sender, { text: '❌ Gagal mengambil doa' });
            }
            break;
            
        case 'asmaulhusna':
            const no = query || Math.floor(Math.random() * 99) + 1;
            try {
                const response = await axios.get(`https://api.islamic-api.com/api/asmaulhusna/${no}`);
                const data = response.data;
                await sock.sendMessage(sender, { text: `🕋 *ASMAUL HUSNA*\n\n${data.number}. ${data.name}\n${data.latin}\n\nArtinya:\n${data.meaning}` });
            } catch {
                await sock.sendMessage(sender, { text: '❌ Gagal mengambil Asmaul Husna' });
            }
            break;
            
        case 'jadwalsholat':
            if (!query) {
                await sock.sendMessage(sender, { text: `❌ Masukkan kota!\nContoh: ${prefix}jadwalsholat jakarta` });
                return;
            }
            try {
                const response = await axios.get(`https://api.myquran.com/v1/sholat/jadwal/${query}/2025/03/25`);
                const data = response.data.data.jadwal;
                await sock.sendMessage(sender, { text: `🕌 *JADWAL SHOLAT ${query.toUpperCase()}*\n\nImsak : ${data.imsak}\nSubuh : ${data.subuh}\nDzuhur : ${data.dzuhur}\nAshar : ${data.ashar}\nMaghrib : ${data.maghrib}\nIsya : ${data.isya}` });
            } catch {
                await sock.sendMessage(sender, { text: '❌ Kota tidak ditemukan' });
            }
            break;
            
        case 'kiblat':
            await sock.sendMessage(sender, { text: `🕋 *ARAH KIBLAT*\n\nArah kiblat tergantung lokasi. Gunakan aplikasi compass di HP untuk menentukan arah kiblat (sekitar 295° dari utara untuk Indonesia).` });
            break;
            
        default:
            const islamButtons = [
                { index: 1, quickReplyButton: { displayText: '📖 QURAN', id: `${prefix}quran` } },
                { index: 2, quickReplyButton: { displayText: '🕌 DOA', id: `${prefix}doa` } },
                { index: 3, quickReplyButton: { displayText: '🕋 ASMAUL HUSNA', id: `${prefix}asmaulhusna` } },
                { index: 4, quickReplyButton: { displayText: '🕌 JADWAL SHOLAT', id: `${prefix}jadwalsholat` } }
            ];
            await sock.sendMessage(sender, {
                text: `🕋 *ISLAMIC FEATURES*\n\n` +
                    `┌─────────────────────────────────┐\n` +
                    `│  📖 .quran [surah]:[ayat]\n` +
                    `│  🕌 .doa - Doa harian random\n` +
                    `│  🕋 .asmaulhusna [nomor]\n` +
                    `│  🕌 .jadwalsholat [kota]\n` +
                    `│  🕋 .kiblat - Info arah kiblat\n` +
                    `└─────────────────────────────────┘\n\n` +
                    `💡 *Klik tombol di bawah*`,
                templateButtons: islamButtons
            });
            break;
    }
}

module.exports = { islamCommand };
