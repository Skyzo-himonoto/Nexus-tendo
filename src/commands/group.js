const config = require('../../config');

async function groupCommand(sock, msg, command, args) {
    const chat = msg.key.remoteJid;
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const text = args.join(' ');
    const prefix = config.prefix;
    
    switch(command) {
        case 'tagall':
            const groupMeta = await sock.groupMetadata(chat);
            const participants = groupMeta.participants;
            const mentions = participants.map(p => p.id);
            const tagMessage = `📢 *TAG ALL*\n\n${text || 'bangun woi'}\n\n` + participants.map(p => `@${p.id.split('@')[0]}`).join('\n');
            await sock.sendMessage(chat, { text: tagMessage, mentions });
            break;
            
        case 'kick':
            if (mentioned.length === 0) {
                await sock.sendMessage(chat, { text: '❌ Tag user yang mau di-kick' });
                return;
            }
            for (let user of mentioned) {
                await sock.groupParticipantsUpdate(chat, [user], 'remove');
            }
            await sock.sendMessage(chat, { text: `✅ Berhasil kick ${mentioned.length} user` });
            break;
            
        case 'promote':
            if (mentioned.length === 0) {
                await sock.sendMessage(chat, { text: '❌ Tag user yang mau di-promote' });
                return;
            }
            for (let user of mentioned) {
                await sock.groupParticipantsUpdate(chat, [user], 'promote');
            }
            await sock.sendMessage(chat, { text: `✅ Berhasil promote ${mentioned.length} user` });
            break;
            
        case 'demote':
            if (mentioned.length === 0) {
                await sock.sendMessage(chat, { text: '❌ Tag user yang mau di-demote' });
                return;
            }
            for (let user of mentioned) {
                await sock.groupParticipantsUpdate(chat, [user], 'demote');
            }
            await sock.sendMessage(chat, { text: `✅ Berhasil demote ${mentioned.length} user` });
            break;
            
        case 'add':
            const numbers = args.filter(a => a.match(/^62\d+$/));
            if (numbers.length === 0) {
                await sock.sendMessage(chat, { text: '❌ Masukkan nomor\nContoh: .add 6288225879928' });
                return;
            }
            for (let num of numbers) {
                try {
                    await sock.groupParticipantsUpdate(chat, [`${num}@s.whatsapp.net`], 'add');
                } catch (e) {
                    await sock.sendMessage(chat, { text: `❌ Gagal menambah @${num}` });
                }
            }
            await sock.sendMessage(chat, { text: `✅ Berhasil menambah ${numbers.length} user` });
            break;
            
        case 'groupinfo':
            const meta = await sock.groupMetadata(chat);
            const info = `📋 *INFO GRUP*\n\n📛 Nama: ${meta.subject}\n👥 Member: ${meta.participants.length}\n👑 Owner: @${meta.owner?.split('@')[0] || '-'}\n📅 Dibuat: ${new Date(meta.creation * 1000).toLocaleDateString('id-ID')}\n🔗 Link: ${meta.inviteCode ? `https://chat.whatsapp.com/${meta.inviteCode}` : 'Tidak tersedia'}\n📝 Deskripsi: ${meta.desc?.toString() || '-'}`;
            await sock.sendMessage(chat, { text: info, mentions: meta.owner ? [meta.owner] : [] });
            break;
            
        case 'setname':
            if (!text) {
                await sock.sendMessage(chat, { text: '❌ Masukkan nama grup baru' });
                return;
            }
            await sock.groupUpdateSubject(chat, text);
            await sock.sendMessage(chat, { text: `✅ Nama grup diubah: ${text}` });
            break;
            
        case 'setdesc':
            if (!text) {
                await sock.sendMessage(chat, { text: '❌ Masukkan deskripsi baru' });
                return;
            }
            await sock.groupUpdateDescription(chat, text);
            await sock.sendMessage(chat, { text: '✅ Deskripsi grup diubah' });
            break;
            
        case 'setpp':
        case 'setphoto':
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            let mediaMsg = null;
            if (quoted?.imageMessage) mediaMsg = quoted.imageMessage;
            else if (msg.message?.imageMessage) mediaMsg = msg.message.imageMessage;
            
            if (!mediaMsg) {
                await sock.sendMessage(chat, { text: '❌ Balas gambar dengan command .setpp' });
                return;
            }
            
            const mediaBuffer = await sock.downloadMediaMessage({
                message: { imageMessage: mediaMsg },
                type: 'buffer'
            });
            await sock.updateProfilePicture(chat, mediaBuffer);
            await sock.sendMessage(chat, { text: '✅ Foto grup diubah' });
            break;
            
        case 'link':
        case 'getlink':
            const code = await sock.groupInviteCode(chat);
            await sock.sendMessage(chat, { text: `🔗 *LINK GRUP*\n\nhttps://chat.whatsapp.com/${code}` });
            break;
            
        case 'resetlink':
            await sock.groupRevokeInvite(chat);
            await sock.sendMessage(chat, { text: '✅ Link grup direset' });
            break;
            
        case 'close':
            await sock.groupSettingUpdate(chat, 'announcement');
            await sock.sendMessage(chat, { text: '✅ Grup ditutup (hanya admin yang bisa chat)' });
            break;
            
        case 'open':
            await sock.groupSettingUpdate(chat, 'not_announcement');
            await sock.sendMessage(chat, { text: '✅ Grup dibuka (semua bisa chat)' });
            break;
            
        case 'delete':
        case 'del':
            const keys = [{
                remoteJid: chat,
                fromMe: true,
                id: msg.message?.extendedTextMessage?.contextInfo?.stanzaId
            }];
            await sock.sendMessage(chat, { delete: keys });
            break;
            
        default:
            await sock.sendMessage(chat, { text: `❌ Command grup tidak dikenal\nKetik ${prefix}allmenu` });
            break;
    }
}

module.exports = { groupCommand };
