const config = require('../../config');
async function groupCommand(sock, msg, command, args) {
    const chat = msg.key.remoteJid;
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const text = args.join(' ');
    
    switch(command) {
        case 'tagall':
            const groupMeta = await sock.groupMetadata(chat);
            const participants = groupMeta.participants;
            const mentions = participants.map(p => p.id);
            const tagText = text || '📢 *TAG ALL*';
            let tagMessage = `${tagText}\n\n`;
            for (let p of participants) {
                tagMessage += `@${p.id.split('@')[0]}\n`;
            }
            await sock.sendMessage(chat, { text: tagMessage, mentions });
            break;

        case 'kick':
            if (mentioned.length === 0) {
                await sock.sendMessage(chat, { text: config.groupMsg.noMention.replace(/{action}/g, 'kick') });
                return;
            }
            for (let user of mentioned) {
                await sock.groupParticipantsUpdate(chat, [user], 'remove');
            }
            const kickMsg = config.groupMsg.kickSuccess.replace(/{count}/g, mentioned.length);
            await sock.sendMessage(chat, { text: kickMsg });
            break;

        case 'promote':
            if (mentioned.length === 0) {
                await sock.sendMessage(chat, { text: config.groupMsg.noMention.replace(/{action}/g, 'promote') });
                return;
            }
            for (let user of mentioned) {
                await sock.groupParticipantsUpdate(chat, [user], 'promote');
            }
            const promoteMsg = config.groupMsg.promoteSuccess.replace(/{count}/g, mentioned.length);
            await sock.sendMessage(chat, { text: promoteMsg });
            break;

        case 'demote':
            if (mentioned.length === 0) {
                await sock.sendMessage(chat, { text: config.groupMsg.noMention.replace(/{action}/g, 'demote') });
                return;
            }
            for (let user of mentioned) {
                await sock.groupParticipantsUpdate(chat, [user], 'demote');
            }
            const demoteMsg = config.groupMsg.demoteSuccess.replace(/{count}/g, mentioned.length);
            await sock.sendMessage(chat, { text: demoteMsg });
            break;

        case 'add':
            const numbers = args.filter(a => a.match(/^62\d+$/));
            if (numbers.length === 0) {
                await sock.sendMessage(chat, { text: '❌ Masukkan nomor!\nContoh: .add 6281234567890' });
                return;
            }
            for (let num of numbers) {
                try {
                    await sock.groupParticipantsUpdate(chat, [`${num}@s.whatsapp.net`], 'add');
                } catch (e) {
                    await sock.sendMessage(chat, { text: `❌ Gagal menambah @${num}` });
                }
            }
            const addMsg = config.groupMsg.addSuccess.replace(/{count}/g, numbers.length);
            await sock.sendMessage(chat, { text: addMsg });
            break;

        case 'groupinfo':
            const meta = await sock.groupMetadata(chat);
            const info = `📋 *INFO GRUP*\n\n` +
                `📛 *Nama:* ${meta.subject}\n` +
                `👥 *Member:* ${meta.participants.length}\n` +
                `👑 *Owner:* @${meta.owner?.split('@')[0] || '-'}\n` +
                `📅 *Dibuat:* ${new Date(meta.creation * 1000).toLocaleDateString('id-ID')}\n` +
                `🔗 *Link:* ${meta.inviteCode ? `https://chat.whatsapp.com/${meta.inviteCode}` : 'Tidak tersedia'}\n` +
                `📝 *Deskripsi:* ${meta.desc?.toString() || '-'}`;
            await sock.sendMessage(chat, { text: info });
            break;

        case 'setname':
            if (!text) {
                await sock.sendMessage(chat, { text: '❌ Masukkan nama grup baru!\nContoh: .setname Nexus Group' });
                return;
            }
            await sock.groupUpdateSubject(chat, text);
            await sock.sendMessage(chat, { text: `✅ Nama grup berhasil diubah menjadi: ${text}` });
            break;

        case 'setdesc':
            if (!text) {
                await sock.sendMessage(chat, { text: '❌ Masukkan deskripsi grup baru!' });
                return;
            }
            await sock.groupUpdateDescription(chat, text);
            await sock.sendMessage(chat, { text: `✅ Deskripsi grup berhasil diubah!` });
            break;
            
        default:
            break;
    }
}

module.exports = { groupCommand };
