import { exec as execAsync } from 'child_process';
import util from 'util';
const exec = util.promisify(execAsync);

export default async function execCommand(context) {
  const { sock, sender, isOwner, args } = context;
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .exec <command>' });
  
  const command = args.join(' ');
  await sock.sendMessage(sender, { text: `⚙️ Executing: ${command}` });
  
  try {
    const { stdout, stderr } = await exec(command, { timeout: 30000 });
    let output = '';
    if (stdout) output += `📤 STDOUT:\n\`\`\`\n${stdout.slice(0, 4000)}\n\`\`\`\n`;
    if (stderr) output += `⚠️ STDERR:\n\`\`\`\n${stderr.slice(0, 4000)}\n\`\`\`\n`;
    if (!stdout && !stderr) output = '✅ Done (no output)';
    await sock.sendMessage(sender, { text: output.slice(0, 65535) });
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Error:\n\`\`\`\n${err.message}\n\`\`\`` });
  }
}
