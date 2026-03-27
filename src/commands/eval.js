import util from 'util';

export default async function evalCommand(context) {
  const { sock, sender, m, isOwner, args, store, prefix, commandName, messageText } = context;
  
  if (!isOwner) {
    return await sock.sendMessage(sender, {
      text: '❌ Maaf, command ini hanya untuk owner bot!'
    });
  }
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, {
      text: '📝 *Cara penggunaan:*\n.eval <code>\n\n📋 *Contoh:*\n.eval 1 + 1\n.eval await sock.user.id'
    });
  }
  
  const code = args.join(' ');
  
  await sock.sendMessage(sender, {
    text: `🔮 *Evaluating code...*\n\n\`\`\`js\n${code}\n\`\`\``
  });
  
  try {
    const ctx = {
      sock,
      m,
      sender,
      store,
      prefix,
      commandName,
      messageText,
      require: (module) => import(module),
      console: {
        log: (...args) => args.join(' ')
      }
    };

    let result;
    if (code.includes('await')) {
      result = await eval(`(async () => { ${code} })()`);
    } else {
      result = eval(code);
    }
    
    let output = util.inspect(result, {
      showHidden: false,
      depth: 5,
      colors: false,
      maxArrayLength: 50,
      maxStringLength: 1000
    });
    
    if (output.length > 4000) {
      output = output.slice(0, 4000) + '... (truncated)';
    }
    
    await sock.sendMessage(sender, {
      text: `✅ *Result:*\n\`\`\`js\n${output}\n\`\`\``
    });
    
  } catch (err) {
    await sock.sendMessage(sender, {
      text: `❌ *Error:*\n\`\`\`js\n${err.message.slice(0, 4000)}\n\`\`\``
    });
  }
}
