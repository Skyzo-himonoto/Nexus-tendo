const config = require('../../config');
async function donasiCommand(sock, sender) {
    const ownerNumber = config.getOwnerNumber();
    
    await sock.sendMessage(sender, { 
        text: `💝 *Dukung Developer buat makan ${config.botName}*

Bot ini gratis dan akan terus dikembangkan. 
Dukunganmu membuat bot ini tetap hidup!

💰 *Donasi via:*
• Dana: ${ownerNumber}
• Ovo: ${ownerNumber}
• Gopay: ${ownerNumber}
• QRIS: Hubungi owner

📌 *I Love you yang udah donasi 😘*
Setiap donasi akan digunakan untuk:
✅ Maintain server 24/7
✅ Update fitur terbaru
✅ Menambah database

💪 *Makin giat buat update *

Kontak owner: wa.me/${ownerNumber}`
    });
}

module.exports = { donasiCommand };
