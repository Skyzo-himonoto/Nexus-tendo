import util from 'util';

export default async function evalCommand(context) {
  const { sock, sender, isOwner, args, m, store, prefix, commandName, messageText } = context;
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .eval <code>' });
  
  const code = args.join(' ');
  await sock.sendMessage(sender, { text: `🔮 Evaluating:\n\`\`\`js\n${code}\n\`\`\`` });
  
  try {
    const ctx = { sock, m, sender, store, prefix, commandName, messageText, require: (m) => import(m) };
    let result;
    if (code.includes('await')) result = await eval(`(async () => { ${code} })()`);
    else result = eval(code);
    let output = util.inspect(result, { depth: 5, maxArrayLength: 50, maxStringLength: 1000 });
    if (output.length > 4000) output = output.slice(0, 4000) + '...';
    await sock.sendMessage(sender, { text: `✅ Result:\n\`\`\`js\n${output}\n\`\`\`` });
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Error:\n\`\`\`js\n${err.message}\n\`\`\`` });
  }
}
