const axios = require('axios');
const config = require('../../config');

async function toolsCommand(sock, sender, command, args) {
    const text = args.join(' ');
    
    switch(command) {
        case 'qrcode':
            if (!text) {
                await sock.sendMessage(sender, { 
                    text: '❌ Masukkan teks/link untuk QR Code!\nContoh: .qrcode https://nexus.com' 
                });
                return;
            }
            await sock.sendMessage(sender, { text: `🔄 Membuat QR Code untuk: ${text}` });
            await sock.sendMessage(sender, {
                image: { url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}` },
                caption: `📱 *QR Code*\n\nData: ${text}\nScan untuk akses langsung.`
            });
            break;
            
        case 'weather':
            if (!text) {
                await sock.sendMessage(sender, { 
                    text: '❌ Masukkan nama kota!\nContoh: .weather Jakarta' 
                });
                return;
            }
            
            if (!config.weatherApiKey) {
                await sock.sendMessage(sender, { 
                    text: '❌ API Key weather belum diisi! Dapatkan di https://openweathermap.org/api' 
                });
                return;
            }
            
            await sock.sendMessage(sender, { text: `🌤️ Mencari cuaca di ${text}...` });
            
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(text)}&appid=${config.weatherApiKey}&units=metric&lang=id`
                );
                
                const data = response.data;
                const weatherText = `🌤️ *Cuaca di ${data.name}*\n\n` +
                    `🌡️ *Suhu:* ${data.main.temp}°C\n` +
                    `🌡️ *Terasa:* ${data.main.feels_like}°C\n` +
                    `💧 *Kelembapan:* ${data.main.humidity}%\n` +
                    `🌬️ *Angin:* ${data.wind.speed} m/s\n` +
                    `☁️ *Kondisi:* ${data.weather[0].description}\n` +
                    `🔆 *Tekanan:* ${data.main.pressure} hPa`;
                
                await sock.sendMessage(sender, { text: weatherText });
            } catch (error) {
                await sock.sendMessage(sender, { text: '❌ Kota tidak ditemukan! Coba lagi.' });
            }
            break;
            
        case 'translate':
            if (!text) {
                await sock.sendMessage(sender, { 
                    text: '❌ Cara pakai:\n.translate [kode] [teks]\n\nContoh:\n.translate id Hello World\n\nKode: id, en, jp, etc' 
                });
                return;
            }
            
            const parts = text.split(' ');
            const targetLang = parts[0];
            const textToTranslate = parts.slice(1).join(' ');
            
            if (!targetLang || !textToTranslate) {
                await sock.sendMessage(sender, { text: '❌ Format salah! Contoh: .translate id Hello World' });
                return;
            }
            
            try {
                const response = await axios.get(
                    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`
                );
                
                const translated = response.data[0][0][0];
                await sock.sendMessage(sender, { 
                    text: `🌍 *Terjemahan*\n\n` +
                        `📝 *Asli:* ${textToTranslate}\n` +
                        `🔄 *Hasil:* ${translated}\n` +
                        `🎯 *Bahasa:* ${targetLang.toUpperCase()}` 
                });
            } catch (error) {
                await sock.sendMessage(sender, { text: '❌ Gagal menerjemahkan! Coba lagi.' });
            }
            break;
            
        case 'shortlink':
            if (!text) {
                await sock.sendMessage(sender, { 
                    text: '❌ Masukkan link yang ingin dipendekkan!\nContoh: .shortlink https://panjang.com' 
                });
                return;
            }
            
            await sock.sendMessage(sender, { text: `🔄 Memendekkan link...` });
            
            try {
                const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(text)}`);
                const shortUrl = response.data;
                await sock.sendMessage(sender, { 
                    text: `🔗 *Short Link*\n\n📌 *Asli:* ${text}\n📌 *Pendek:* ${shortUrl}` 
                });
            } catch (error) {
                await sock.sendMessage(sender, { text: '❌ Gagal memendekkan link!' });
            }
            break;
            
        case 'bin':
            if (!text) {
                await sock.sendMessage(sender, { 
                    text: '❌ Masukkan BIN!\nContoh: .bin 453997' 
                });
                return;
            }
            
            try {
                const response = await axios.get(`https://lookup.binlist.net/${text}`);
                const data = response.data;
                
                const binText = `💳 *BIN CHECKER*\n\n` +
                    `🔢 *BIN:* ${text}\n` +
                    `🏦 *Bank:* ${data.bank?.name || '-'}\n` +
                    `🌍 *Negara:* ${data.country?.name || '-'}\n` +
                    `💳 *Tipe:* ${data.scheme || '-'}\n` +
                    `🏷️ *Brand:* ${data.brand || '-'}`;
                
                await sock.sendMessage(sender, { text: binText });
            } catch (error) {
                await sock.sendMessage(sender, { text: '❌ BIN tidak valid atau tidak ditemukan!' });
            }
            break;
            
        case 'calc':
            if (!text) {
                await sock.sendMessage(sender, { 
                    text: '❌ Masukkan perhitungan!\nContoh: .calc 1+1\n.calc 10*5' 
                });
                return;
            }
            
            try {
                const allowedChars = /^[0-9+\-*/%.() ]+$/;
                if (!allowedChars.test(text)) {
                    await sock.sendMessage(sender, { text: '❌ Ekspresi tidak valid! Hanya angka dan operator (+ - * / %).' });
                    return;
                }
                
                const result = eval(text);
                await sock.sendMessage(sender, { 
                    text: `🧮 *KALKULATOR*\n\n📌 *Input:* ${text}\n📌 *Hasil:* ${result}` 
                });
            } catch (error) {
                await sock.sendMessage(sender, { text: '❌ Perhitungan tidak valid!' });
            }
            break;
            
        default:
            await sock.sendMessage(sender, { text: '❌ Fitur tools dalam pengembangan!' });
            break;
    }
}

module.exports = { toolsCommand };
