import gameManager from '../../../lib/gameManager.js';

export default async function suit(context) {
  const { sock, sender, args, isGroup, m } = context;
  
  const choices = ['batu', 'gunting', 'kertas'];
  const emoji = { batu: '🪨', gunting: '✂️', kertas: '📄' };
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: `🎮 *SUIT (Batu-Gunting-Kertas)*\n\n📝 Cara: .suit <batu/gunting/kertas>\n\nContoh: .suit batu\n\n🎯 Main melawan bot!`
    });
  }
  
  const playerChoice = args[0].toLowerCase();
  if (!choices.includes(playerChoice)) {
    return await sock.sendMessage(sender, { text: `❌ Pilih: batu, gunting, atau kertas!` });
  }
  
  const botChoice = choices[Math.floor(Math.random() * 3)];
  
  let result = '';
  if (playerChoice === botChoice) result = '🤝 SERI!';
  else if (
    (playerChoice === 'batu' && botChoice === 'gunting') ||
    (playerChoice === 'gunting' && botChoice === 'kertas') ||
    (playerChoice === 'kertas' && botChoice === 'batu')
  ) {
    result = '🎉 KAMU MENANG';
  } else {
    result = '💀 BOT MENANG';
  }
  
  const text = `╭━━━━━ *SUIT GAME* ━━━━━╮
┃
┃ 👤 Kamu: ${emoji[playerChoice]} ${playerChoice}
┃ 🤖 Bot: ${emoji[botChoice]} ${botChoice}
┃
┃ 🏆 Hasil: ${result}
┃
╰━━━━━━━━━━━━━━━━━━━╯`;
  
  await sock.sendMessage(sender, { text });
}
