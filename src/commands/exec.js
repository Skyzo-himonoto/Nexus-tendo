import { exec as execAsync } from 'child_process';
import util from 'util';

const exec = util.promisify(execAsync);

export default async function execCommand(context) {
  const { sock, sender, isOwner, args } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.exec <command>\n\n📋 *Contoh:*\n.exec ls -la\n.exec node -v\n.exec pm2 list'
    });
  }
  
  const command = args.join(' ');
  
  await sock.sendMessage(sender, {
    text: `⚙️ *Executing:* ${command}\n\n⏳ Sedang memproses...`
  });
  
  try {
    const { stdout, stderr } = await exec(command, {
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024 // 10MB
    });
    
    let output = '';
    if (stdout) {
      output += `📤 *STDOUT:*\n\`\`\`\n${stdout.slice(0, 4000)}\n\`\`\`\n`;
    }
    if (stderr) {
      output += `⚠️ *STDERR:*\n\`\`\`\n${stderr.slice(0, 4000)}\n\`\`\`\n`;
    }
    if (!stdout && !stderr) {
      output = '✅ *Command executed successfully (no output)*';
    }
    
    await sock.sendMessage(sender, {
      text: output.slice(0, 65535) 
    });
    
  } catch (err) {
    await sock.sendMessage(sender, {
      text: `❌ *Error:*\n\`\`\`\n${err.message.slice(0, 4000)}\n\`\`\``
    });
  }
}
