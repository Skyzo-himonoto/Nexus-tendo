export default async function broadcast(context) {
  const { sock, sender, isOwner, args, m } = context;
  if (!isOwner) return await sock.sendMessage(sender, { text: '❌ Owner only!' });
  if (args.length === 0) return await sock.sendMessage(sender, { text: '📝 .bc <pesan>' });
  
  const chats = sock.chats;
  const groups = await sock.groupFetchAllParticipating();
  const allJids = [...Object.keys(chats), ...Object.keys(groups)].filter((v,i,a) => a.indexOf(v) === i);
  const message = args.join(' ');
  const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  const hasMedia = quoted?.imageMessage || quoted?.videoMessage;
  
  await sock.sendMessage(sender, { text: `📢 Broadcast to ${allJids.length} chats...` });
  
  let success = 0, failed = 0;
  for (let i = 0; i < allJids.length; i++) {
    try {
      if (hasMedia && quoted) {
        const mediaType = Object.keys(quoted)[0];
        const stream = await sock.downloadMediaMessage({ key: m.key, message: quoted });
        await sock.sendMessage(allJids[i], { [mediaType.replace('Message', '')]: stream, caption: message });
      } else await sock.sendMessage(allJids[i], { text: message });
      success++;
      await new Promise(r => setTimeout(r, 3000));
    } catch (err) { failed++; }
  }
  await sock.sendMessage(sender, { text: `✅ Done\n✅ Success: ${success}\n❌ Failed: ${failed}` });
}
