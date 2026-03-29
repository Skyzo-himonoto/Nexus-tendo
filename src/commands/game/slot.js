export default async function slot(context) {
  const { sock, sender } = context;
  
  const emojis = ['🍒', '🍊', '🍋', '🍉', '⭐', '💎', '7️⃣', '🎰'];
  const hasil = [emojis[Math.floor(Math.random() * emojis.length)], emojis[Math.floor(Math.random() * emojis.length)], emojis[Math.floor(Math.random() * emojis.length)]];
  
  let hadiah = 0, pesan = '';
  if (hasil[0] === hasil[1] && hasil[1] === hasil[2]) {
    if (hasil[0] === '7️⃣') hadiah = 100;
    else if (hasil[0] === '💎') hadiah = 75;
    else if (hasil[0] === '⭐') hadiah = 50;
    else hadiah = 25;
    pesan = `🎉 JACKPOT! +${hadiah} poin! 🎉`;
  } else if (hasil[0] === hasil[1] || hasil[1] === hasil[2] || hasil[0] === hasil[2]) { hadiah = 10; pesan = `✨ SELAMAT! +10 poin ✨`; }
  else pesan = `😭 Coba lagi`;
  
  await sock.sendMessage(sender, { text: `╭━━━━━ 🎰 SLOT MACHINE ━━━━━╮\n┃\n┃     ${hasil[0]} | ${hasil[1]} | ${hasil[2]}\n┃\n┃ ${pesan}\n┃\n╰━━━━━━━━━━━━━━━━━━━╯` });
}
