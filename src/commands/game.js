const config = require('../../config');
const gameState = {
    tebakgambar: {}, tebakkata: {}, tebaklagu: {}, tebakangka: {},
    tebakkimia: {}, caklontong: {}, family100: {}, susunkata: {},
    siapakahaku: {}, tebaktebakan: {}, tebakjenaka: {}, tebakbendera: {},
    tebakanime: {}, asahotak: {}, tebaksurah: {}, math: {},
    truth: {}, dare: {}, tebakpahlawan: {}, tebakpenyanyi: {},
    tebakfilm: {}, tebakhardiknas: {}, tebakkerajaan: {}, tebakhewan: {},
    tebaktumbuhan: {}, tebakbuah: {}, tebakwarna: {}, tebaknegara: {},
    tebakibukota: {}, tebakbahasa: {}, tebakmakanan: {}, tebakminuman: {}
};

const games = {
    tebakgambar: [
        { gambar: "🍎", jawaban: "apel", hint: "Buah merah" },
        { gambar: "🐱", jawaban: "kucing", hint: "Hewan meong" },
        // ... sampai 50 soal
    ],
    tebakkata: [
        { clue: "Hewan yang bisa terbang", jawaban: "burung" },
        // ... sampai 100 soal
    ],
    tebaklagu: [
        { lirik: "Kucoba memahami... ku tak mengerti", jawaban: "saat kau pergi" },
        // ... sampai 50 soal
    ],
    tebakangka: { min: 1, max: 100 },
    tebakbendera: [
        { negara: "Indonesia", warna: "Merah Putih", jawaban: "indonesia" },
        // ... sampai 50 soal
    ],
    tebakanime: [
        { clue: "Ninja dari desa Konoha", jawaban: "naruto" },
        // ... sampai 50 soal
    ],
    caklontong: [
        { soal: "Apa yang lebih berat dari gajah?", jawaban: "bayangan" },
        // ... sampai 50 soal
    ],
    siapakahaku: [
        { clue: "Aku adalah presiden pertama Indonesia", jawaban: "soekarno" },
        // ... sampai 50 soal
    ],
    tebakpahlawan: [
        { clue: "Pahlawan Proklamator", jawaban: "soekarno" },
        // ... sampai 20 soal
    ],
    tebakpenyanyi: [
        { clue: "Penyanyi lagu 'Lathi'", jawaban: "weird genius" },
        // ... sampai 20 soal
    ],
    tebakfilm: [
        { clue: "Film tentang kapal tenggelam", jawaban: "titanic" },
        // ... sampai 30 soal
    ],
    tebakhewan: [
        { clue: "Hewan berkaki empat, suka menggonggong", jawaban: "anjing" },
        // ... sampai 50 soal
    ],
    tebaktumbuhan: [
        { clue: "Tumbuhan yang bisa fotosintesis", jawaban: "tumbuhan" },
        // ... sampai 30 soal
    ],
    tebakbuah: [
        { clue: "Buah berwarna kuning, bentuk bulan sabit", jawaban: "pisang" },
        // ... sampai 30 soal
    ],
    tebaknegara: [
        { clue: "Negara dengan julukan 'Negeri Paman Sam'", jawaban: "amerika" },
        // ... sampai 50 soal
    ],
    tebakibukota: [
        { clue: "Ibu kota Indonesia", jawaban: "jakarta" },
        // ... sampai 50 soal
    ]
};

async function gameCommand(sock, sender, msg, command, args) {
    const prefix = config.prefix;
    
    switch(command) {
        case 'suit':
            const pilihan = args[0]?.toLowerCase();
            if (!pilihan || !['batu', 'kertas', 'gunting'].includes(pilihan)) {
                await sock.sendMessage(sender, { 
                    text: `🎮 *SUIT GAME*\n\nPilih batu/kertas/gunting dengan menekan tombol di bawah!`,
                    templateButtons: [
                        { index: 1, quickReplyButton: { displayText: '🪨 BATU', id: `${prefix}suit batu` } },
                        { index: 2, quickReplyButton: { displayText: '📄 KERTAS', id: `${prefix}suit kertas` } },
                        { index: 3, quickReplyButton: { displayText: '✂️ GUNTING', id: `${prefix}suit gunting` } }
                    ]
                });
                return;
            }
            const botChoice = ['batu', 'kertas', 'gunting'][Math.floor(Math.random() * 3)];
            let result;
            if (pilihan === botChoice) result = 'SERI! 🤝';
            else if ((pilihan === 'batu' && botChoice === 'gunting') ||
                     (pilihan === 'kertas' && botChoice === 'batu') ||
                     (pilihan === 'gunting' && botChoice === 'kertas')) result = 'KAMU MENANG 🏆';
            else result = 'KAMU KALAH 💀';
            await sock.sendMessage(sender, { text: `🪨📄✂️ *SUIT*\nKamu: ${pilihan}\nBot: ${botChoice}\n\n${result}` });
            break;
            
        case 'tebakgambar':
            const soalGambar = games.tebakgambar[Math.floor(Math.random() * games.tebakgambar.length)];
            gameState.tebakgambar[sender] = soalGambar.jawaban;
            await sock.sendMessage(sender, { text: `🎨 *TEBAK GAMBAR*\n\n${soalGambar.gambar}\nHint: ${soalGambar.hint}\n\nKetik: ${prefix}jawab [jawaban]` });
            break;
            
        case 'tebakkata':
            const soalKata = games.tebakkata[Math.floor(Math.random() * games.tebakkata.length)];
            gameState.tebakkata[sender] = soalKata.jawaban;
            await sock.sendMessage(sender, { text: `📝 *TEBAK KATA*\n\nClue: ${soalKata.clue}\n\nKetik: ${prefix}jawabkata [jawaban]` });
            break;
            
        case 'tebaklagu':
            const soalLagu = games.tebaklagu[Math.floor(Math.random() * games.tebaklagu.length)];
            gameState.tebaklagu[sender] = soalLagu.jawaban;
            await sock.sendMessage(sender, { text: `🎵 *TEBAK LAGU*\n\nLirik: "${soalLagu.lirik}"\n\nKetik: ${prefix}jawablagu [jawaban]` });
            break;
            
        case 'tebakangka':
            const target = Math.floor(Math.random() * 100) + 1;
            gameState.tebakangka[sender] = target;
            await sock.sendMessage(sender, { text: `🔢 *TEBAK ANGKA*\n\nTebak angka 1-100!\n\nKetik: ${prefix}jawabangka [angka]` });
            break;
           
        case 'tebakbendera':
            const soalBendera = games.tebakbendera[Math.floor(Math.random() * games.tebakbendera.length)];
            gameState.tebakbendera[sender] = soalBendera.jawaban;
            await sock.sendMessage(sender, { text: `🏳️ *TEBAK BENDERA*\n\nWarna: ${soalBendera.warna}\n\nKetik: ${prefix}jawabbendera [jawaban]` });
            break;
            
        case 'tebakanime':
            const soalAnime = games.tebakanime[Math.floor(Math.random() * games.tebakanime.length)];
            gameState.tebakanime[sender] = soalAnime.jawaban;
            await sock.sendMessage(sender, { text: `🎌 *TEBAK ANIME*\n\nClue: ${soalAnime.clue}\n\nKetik: ${prefix}jawabanime [jawaban]` });
            break;
            
        case 'caklontong':
            const soalCak = games.caklontong[Math.floor(Math.random() * games.caklontong.length)];
            gameState.caklontong[sender] = soalCak.jawaban;
            await sock.sendMessage(sender, { text: `🎭 *CAKLONTONG*\n\n${soalCak.soal}\n\nKetik: ${prefix}jawabcak [jawaban]` });
            break;
            
        case 'siapakahaku':
            const soalSiapa = games.siapakahaku[Math.floor(Math.random() * games.siapakahaku.length)];
            gameState.siapakahaku[sender] = soalSiapa.jawaban;
            await sock.sendMessage(sender, { text: `🕵️ *SIAPAKAH AKU*\n\n${soalSiapa.clue}\n\nKetik: ${prefix}jawabsiapa [jawaban]` });
            break;
            
        case 'tebakpahlawan':
            const soalPahlawan = games.tebakpahlawan[Math.floor(Math.random() * games.tebakpahlawan.length)];
            gameState.tebakpahlawan[sender] = soalPahlawan.jawaban;
            await sock.sendMessage(sender, { text: `🦸 *TEBAK PAHLAWAN*\n\nClue: ${soalPahlawan.clue}\n\nKetik: ${prefix}jawabpahlawan [jawaban]` });
            break;
            
        case 'tebakpenyanyi':
            const soalPenyanyi = games.tebakpenyanyi[Math.floor(Math.random() * games.tebakpenyanyi.length)];
            gameState.tebakpenyanyi[sender] = soalPenyanyi.jawaban;
            await sock.sendMessage(sender, { text: `🎤 *TEBAK PENYANYI*\n\nClue: ${soalPenyanyi.clue}\n\nKetik: ${prefix}jawabpenyanyi [jawaban]` });
            break;
            
        case 'tebakfilm':
            const soalFilm = games.tebakfilm[Math.floor(Math.random() * games.tebakfilm.length)];
            gameState.tebakfilm[sender] = soalFilm.jawaban;
            await sock.sendMessage(sender, { text: `🎬 *TEBAK FILM*\n\nClue: ${soalFilm.clue}\n\nKetik: ${prefix}jawabfilm [jawaban]` });
            break;
            
        case 'tebakhewan':
            const soalHewan = games.tebakhewan[Math.floor(Math.random() * games.tebakhewan.length)];
            gameState.tebakhewan[sender] = soalHewan.jawaban;
            await sock.sendMessage(sender, { text: `🐾 *TEBAK HEWAN*\n\nClue: ${soalHewan.clue}\n\nKetik: ${prefix}jawabhewan [jawaban]` });
            break;
            
        case 'tebakbuah':
            const soalBuah = games.tebakbuah[Math.floor(Math.random() * games.tebakbuah.length)];
            gameState.tebakbuah[sender] = soalBuah.jawaban;
            await sock.sendMessage(sender, { text: `🍎 *TEBAK BUAH*\n\nClue: ${soalBuah.clue}\n\nKetik: ${prefix}jawabbauh [jawaban]` });
            break;
            
        case 'tebaknegara':
            const soalNegara = games.tebaknegara[Math.floor(Math.random() * games.tebaknegara.length)];
            gameState.tebaknegara[sender] = soalNegara.jawaban;
            await sock.sendMessage(sender, { text: `🌍 *TEBAK NEGARA*\n\nClue: ${soalNegara.clue}\n\nKetik: ${prefix}jawabnegara [jawaban]` });
            break;
            
        case 'tebakibukota':
            const soalIbukota = games.tebakibukota[Math.floor(Math.random() * games.tebakibukota.length)];
            gameState.tebakibukota[sender] = soalIbukota.jawaban;
            await sock.sendMessage(sender, { text: `🏛️ *TEBAK IBUKOTA*\n\nNegara: ${soalIbukota.clue}\n\nKetik: ${prefix}jawabibukota [jawaban]` });
            break;
            
        case 'math':
            const num1 = Math.floor(Math.random() * 100);
            const num2 = Math.floor(Math.random() * 100);
            const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
            let hasil;
            if (operator === '+') hasil = num1 + num2;
            else if (operator === '-') hasil = num1 - num2;
            else hasil = num1 * num2;
            gameState.math[sender] = hasil;
            await sock.sendMessage(sender, { text: `🧮 *MATH GAME*\n\n${num1} ${operator} ${num2} = ?\n\nKetik: ${prefix}jawabmath [angka]` });
            break;
            
        case 'truth':
            const truths = [
                "Kapan terakhir kali kamu menangis?",
                "Apa hal termahal yang pernah kamu curi?",
                "Siapa yang paling kamu benci?",
                "Pernahkah kamu berbohong hari ini?",
                "Apa mimpi terburukmu?",
                "Siapa crush kamu sekarang?",
                "Pernahkah kamu jatuh cinta?",
                "Apa hal yang paling kamu sesali?",
                "Kapan terakhir kali kamu berbohong?",
                "Apa rahasia terbesarmu?"
                "Apa pernah kamu di sakiti?"
            ];
            await sock.sendMessage(sender, { text: `💬 *TRUTH*\n\n${truths[Math.floor(Math.random() * truths.length)]}` });
            break;
            
        case 'dare':
            const dares = [
                "Kirim pesan ke mantan",
                "Ucapkan hal paling memalukan di grup",
                "Kirim voice note bernyanyi",
                "Chat crush kamu sekarang",
                "Post story dengan wajah kucing",
                "Telepon orang random",
                "Kirim voice note tertawa terbahak-bahak",
                "Ucapkan 'aku ganteng' di grup",
                "Kirim sticker aneh ke grup"
                "pasang wajahmu sambil bilang, aku jelek"
            ];
            await sock.sendMessage(sender, { text: `⚡ *DARE*\n\n${dares[Math.floor(Math.random() * dares.length)]}` });
            break;
            
        case 'slot':
            const bet = parseInt(args[0]) || 100;
            const slots = ['🍒', '🍊', '🍋', '🍉', '⭐', '7️⃣', '💎', '🎰'];
            const slotResult = [
                slots[Math.floor(Math.random() * slots.length)],
                slots[Math.floor(Math.random() * slots.length)],
                slots[Math.floor(Math.random() * slots.length)]
            ];
            let win = false;
            let multiplier = 1;
            if (slotResult[0] === slotResult[1] && slotResult[1] === slotResult[2]) {
                win = true;
                if (slotResult[0] === '7️⃣') multiplier = 10;
                else if (slotResult[0] === '💎') multiplier = 8;
                else if (slotResult[0] === '⭐') multiplier = 5;
                else multiplier = 3;
            } else if (slotResult[0] === slotResult[1] || slotResult[1] === slotResult[2] || slotResult[0] === slotResult[2]) {
                win = true;
                multiplier = 1.5;
            }
            const winAmount = win ? bet * multiplier : 0;
            await sock.sendMessage(sender, { text: `🎰 *SLOT MACHINE*\n\n[ ${slotResult[0]} ] [ ${slotResult[1]} ] [ ${slotResult[2]} ]\n\nTaruhan: ${bet}\nHasil: ${win ? `MENANG! +${winAmount}` : 'KALAH!'}\n${win ? `💰 Hadiah: ${winAmount}` : ''}` });
            break;
            
        case 'game':
        default:
            const gameButtons = [
                { index: 1, quickReplyButton: { displayText: '🪨 SUIT', id: `${prefix}suit` } },
                { index: 2, quickReplyButton: { displayText: '🎨 TEBAK GAMBAR', id: `${prefix}tebakgambar` } },
                { index: 3, quickReplyButton: { displayText: '📝 TEBAK KATA', id: `${prefix}tebakkata` } },
                { index: 4, quickReplyButton: { displayText: '🎵 TEBAK LAGU', id: `${prefix}tebaklagu` } },
                { index: 5, quickReplyButton: { displayText: '🔢 TEBAK ANGKA', id: `${prefix}tebakangka` } },
                { index: 6, quickReplyButton: { displayText: '🏳️ TEBAK BENDERA', id: `${prefix}tebakbendera` } },
                { index: 7, quickReplyButton: { displayText: '🎌 TEBAK ANIME', id: `${prefix}tebakanime` } },
                { index: 8, quickReplyButton: { displayText: '🎭 CAKLONTONG', id: `${prefix}caklontong` } },
                { index: 9, quickReplyButton: { displayText: '🕵️ SIAPAKAH AKU', id: `${prefix}siapakahaku` } },
                { index: 10, quickReplyButton: { displayText: '🧮 MATH', id: `${prefix}math` } }
            ];
            await sock.sendMessage(sender, {
                text: `🎮 *GAME MENU - 20+ GAMES*\n\n` +
                    `┌─────────────────────────────────┐\n` +
                    `│  🪨 suit          | 🎨 tebakgambar\n` +
                    `│  📝 tebakkata     | 🎵 tebaklagu\n` +
                    `│  🔢 tebakangka    | 🏳️ tebakbendera\n` +
                    `│  🎌 tebakanime    | 🎭 caklontong\n` +
                    `│  🕵️ siapakahaku   | 🧮 math\n` +
                    `│  🦸 tebakpahlawan | 🎤 tebakpenyanyi\n` +
                    `│  🎬 tebakfilm     | 🐾 tebakhewan\n` +
                    `│  🍎 tebakbuah     | 🌍 tebaknegara\n` +
                    `│  💬 truth         | ⚡ dare\n` +
                    `│  🎰 slot          | 🧠 asahotak\n` +
                    `└─────────────────────────────────┘\n\n` +
                    `💡 *Klik tombol di bawah untuk main*`,
                templateButtons: gameButtons.slice(0, 10)
            });
            break;
    }
}

async function answerHandler(sock, sender, command, args) {
    const prefix = config.prefix;
    const jawaban = args.join(' ').toLowerCase();
    
    const answerMap = {
        'jawab': 'tebakgambar', 'jawabkata': 'tebakkata', 'jawablagu': 'tebaklagu',
        'jawabangka': 'tebakangka', 'jawabbendera': 'tebakbendera', 'jawabanime': 'tebakanime',
        'jawabcak': 'caklontong', 'jawabsiapa': 'siapakahaku', 'jawabpahlawan': 'tebakpahlawan',
        'jawabpenyanyi': 'tebakpenyanyi', 'jawabfilm': 'tebakfilm', 'jawabhewan': 'tebakhewan',
        'jawabbauh': 'tebakbuah', 'jawabnegara': 'tebaknegara', 'jawabibukota': 'tebakibukota',
        'jawabmath': 'math'
    };
    
    const gameKey = answerMap[command];
    if (gameKey && gameState[gameKey] && gameState[gameKey][sender]) {
        if (jawaban === gameState[gameKey][sender]) {
            await sock.sendMessage(sender, { text: '✅ *BENAR!* 🎉' });
        } else {
            await sock.sendMessage(sender, { text: `❌ *SALAH*\nJawaban: ${gameState[gameKey][sender]}` });
        }
        delete gameState[gameKey][sender];
    } else {
        await sock.sendMessage(sender, { text: '❌ Tidak ada game aktif Ketik .game dulu' });
    }
}

module.exports = { gameCommand, answerHandler };
