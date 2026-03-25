const config = require('../../config');
const gameState = {};

async function gameCommand(sock, sender, msg, command, args) {
    switch(command) {
        
        case 'suit':
            const pilihan = args[0]?.toLowerCase();
            if (!pilihan || !['batu', 'kertas', 'gunting'].includes(pilihan)) {
                await sock.sendMessage(sender, { 
                    text: '❌ *Cara main:*\n.suit [batu/kertas/gunting]\n\nContoh: .suit batu' 
                });
                return;
            }
            
            const botChoice = ['batu', 'kertas', 'gunting'][Math.floor(Math.random() * 3)];
            let result;
            let emoji;
            
            if (pilihan === botChoice) {
                result = '🤝 Seri!';
                emoji = '🤝';
            } else if (
                (pilihan === 'batu' && botChoice === 'gunting') ||
                (pilihan === 'kertas' && botChoice === 'batu') ||
                (pilihan === 'gunting' && botChoice === 'kertas')
            ) {
                result = '🎉 Kamu menang!';
                emoji = '🏆';
            } else {
                result = '💀 Kamu kalah!';
                emoji = '😭';
            }
            
            await sock.sendMessage(sender, { 
                text: `🪨📄✂️ *SUIT GAME*\n\n` +
                    `┌─────────────────────┐\n` +
                    `│  Kamu   : ${pilihan}\n` +
                    `│  Bot    : ${botChoice}\n` +
                    `├─────────────────────┤\n` +
                    `│  ${emoji}  ${result}\n` +
                    `└─────────────────────┘` 
            });
            break;
           
        case 'tebakgambar':
            await sock.sendMessage(sender, { 
                text: '🎮 *Game Tebak Gambar*\n\nFitur dalam pengembangan!\n\nAkan segera hadir dengan 100+ soal.' 
            });
            break;
           
        case 'tebakkata':
            await sock.sendMessage(sender, { 
                text: '📝 *Game Tebak Kata*\n\nFitur dalam pengembangan!\n\nAkan segera hadir dengan 500+ kata.' 
            });
            break;
            
        case 'slot':
            const bet = parseInt(args[0]) || 100;
            const slots = ['🍒', '🍊', '🍋', '🍉', '⭐', '7️⃣'];
            const result1 = slots[Math.floor(Math.random() * slots.length)];
            const result2 = slots[Math.floor(Math.random() * slots.length)];
            const result3 = slots[Math.floor(Math.random() * slots.length)];
            
            let win = false;
            let multiplier = 1;
            
            if (result1 === result2 && result2 === result3) {
                win = true;
                if (result1 === '7️⃣') multiplier = 10;
                else if (result1 === '⭐') multiplier = 5;
                else multiplier = 2;
            } else if (result1 === result2 || result2 === result3 || result1 === result3) {
                win = true;
                multiplier = 1.5;
            }
            
            const winAmount = win ? bet * multiplier : 0;
            
            await sock.sendMessage(sender, { 
                text: `🎰 *SLOT MACHINE*\n\n` +
                    `┌─────────────────────┐\n` +
                    `│  [ ${result1} ] [ ${result2} ] [ ${result3} ]\n` +
                    `├─────────────────────┤\n` +
                    `│  Taruhan : ${bet}\n` +
                    `│  Hasil   : ${win ? 'MENANG 🎉' : 'KALAH 😭'}\n` +
                    `│  Hadiah  : ${winAmount}\n` +
                    `└─────────────────────┘` 
            });
            break;
            
        case 'tictactoe':
            await sock.sendMessage(sender, { 
                text: '❌⭕ *Game Tic Tac Toe*\n\nFitur dalam pengembangan!\n\nAkan segera hadir dengan multiplayer mode.' 
            });
            break;
            
        default:
            await sock.sendMessage(sender, { 
                text: '🎮 *Game Menu*\n\n' +
                    `┌─────────────────────┐\n` +
                    `│  🪨 .suit [pilihan]\n` +
                    `│  🎨 .tebakgambar\n` +
                    `│  📝 .tebakkata\n` +
                    `│  🎰 .slot [taruhan]\n` +
                    `│  ❌ .tictactoe @tag\n` +
                    `└─────────────────────┘\n\n` +
                    `💡 *Coba main suit dulu:* .suit batu` 
            });
            break;
    }
}

module.exports = { gameCommand };
