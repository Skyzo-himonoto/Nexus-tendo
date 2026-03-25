/**
 * ==============================================
 * NEXUS TENDO 
 * ==============================================
 * 
 * Fitur:
 * - Multi-prefix detection
 * - Command routing
 * - Owner-only command protection
 * - 160+ Fitur lengkap
 * ==============================================
 */

const chalk = require('chalk');
const config = require('../../config');

const { menuCommand } = require('../commands/menu');
const { allmenuCommand } = require('../commands/allmenu');
const { categoryCommand } = require('../commands/category');
const { recommendCommand } = require('../commands/recommend');
const { stickerCommand, stickerGifCommand } = require('../commands/sticker');
const { aiCommand } = require('../commands/ai');
const { pingCommand } = require('../commands/ping');
const { ownerCommand } = require('../commands/owner');
const { donasiCommand } = require('../commands/donasi');
const { downloadCommand } = require('../commands/download');
const { toolsCommand } = require('../commands/tools');
const { converterCommand } = require('../commands/converter');
const { groupCommand } = require('../commands/group');
const { gameCommand, answerHandler } = require('../commands/game');
const { animeCommand } = require('../commands/anime');
const { broadcastCommand } = require('../commands/broadcast');
const { settingCommand } = require('../commands/settings');
const { execCommand } = require('../commands/exec');
const { getCommand } = require('../commands/get');
const { randomCommand } = require('../commands/random');
const { islamCommand } = require('../commands/islam');
const { makerCommand } = require('../commands/maker');
const { searchCommand } = require('../commands/search');
const { playCommand } = require('../commands/play');

function getPrefixAndCommand(text) {
    for (let prefix of config.prefixes) {
        if (text.startsWith(prefix)) {
            const args = text.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            return { prefix, command, args };
        }
    }
    return null;
}

async function handleMessage(sock, msg) {
    try {
        const sender = msg.key.remoteJid;
        const isGroup = sender.endsWith('@g.us');
        const senderNumber = isGroup ? msg.key.participant : sender;
        const cleanNumber = senderNumber.split('@')[0];
      
        let text = '';
        if (msg.message?.conversation) text = msg.message.conversation;
        else if (msg.message?.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text;
        else if (msg.message?.imageMessage?.caption) text = msg.message.imageMessage.caption;
        else if (msg.message?.videoMessage?.caption) text = msg.message.videoMessage.caption;
        else if (msg.message?.documentMessage?.caption) text = msg.message.documentMessage.caption;
        
        if (!text) return;
       
        const parsed = getPrefixAndCommand(text);
        if (!parsed) return;
        
        const { prefix, command, args } = parsed;
        
        console.log(chalk.cyan(`\n📨 [${command.toUpperCase()}]`));
        console.log(chalk.cyan(`   From: ${cleanNumber}`));
        console.log(chalk.cyan(`   Group: ${isGroup ? 'Yes' : 'No'}`));
        console.log(chalk.cyan(`   Args: ${args.length ? args.join(' ') : 'None'}\n`));
       
        const isOwner = config.isOwner(senderNumber);
        if (command.startsWith('cat_')) {
            const category = command.replace('cat_', '');
            await categoryCommand(sock, sender, category, prefix);
            return;
        }
        
        switch(command) {
            case 'menu':
            case 'help':
                await menuCommand(sock, sender, prefix);
                break;
                
            case 'allmenu':
            case 'all':
                await allmenuCommand(sock, sender, prefix);
                break;
                
            case 'recom':
            case 'recommend':
                await recommendCommand(sock, sender, prefix);
                break;

            case 'stiker':
            case 'sticker':
            case 's':
                await stickerCommand(sock, msg);
                break;
            
            case 'stikergif':
            case 'sgif':
                await stickerGifCommand(sock, msg);
                break;
            
            case 'ttp':
            case 'attp':
                await stickerCommand(sock, msg, 'ttp');
                break;

            case 'ai':
            case 'ask':
            case 'gpt':
                await aiCommand(sock, sender, args.join(' '));
                break;

            case 'ytmp3':
            case 'ytmp4':
            case 'yt':
            case 'ig':
            case 'instagram':
            case 'tt':
            case 'tiktok':
            case 'fb':
            case 'facebook':
            case 'twt':
            case 'twitter':
            case 'x':
            case 'pinterest':
                if (config.enableDownloader) {
                    await downloadCommand(sock, sender, command, args[0]);
                }
                break;

            case 'qrcode':
            case 'weather':
            case 'translate':
            case 'shortlink':
            case 'bin':
            case 'calc':
                await toolsCommand(sock, sender, command, args);
                break;
            
            case 'toaudio':
            case 'tomp3':
            case 'togif':
            case 'compress':
            case 'toimage':
            case 'toimg':
                await converterCommand(sock, msg, command);
                break;
            
            case 'suit':
            case 'tebakgambar':
            case 'tebakkata':
            case 'tebaklagu':
            case 'tebakangka':
            case 'tebakbendera':
            case 'tebakanime':
            case 'caklontong':
            case 'siapakahaku':
            case 'tebakpahlawan':
            case 'tebakpenyanyi':
            case 'tebakfilm':
            case 'tebakhewan':
            case 'tebakbuah':
            case 'tebaknegara':
            case 'tebakibukota':
            case 'math':
            case 'truth':
            case 'dare':
            case 'slot':
            case 'game':
                if (config.enableGame) {
                    await gameCommand(sock, sender, msg, command, args);
                }
                break;
            
            case 'jawab':
            case 'jawabkata':
            case 'jawablagu':
            case 'jawabangka':
            case 'jawabbendera':
            case 'jawabanime':
            case 'jawabcak':
            case 'jawabsiapa':
            case 'jawabpahlawan':
            case 'jawabpenyanyi':
            case 'jawabfilm':
            case 'jawabhewan':
            case 'jawabbauh':
            case 'jawabnegara':
            case 'jawabibukota':
            case 'jawabmath':
                await answerHandler(sock, sender, command, args);
                break;
            
            case 'anime':
            case 'manga':
            case 'waifu':
            case 'neko':
            case 'random':
                if (config.enableAnime) {
                    await animeCommand(sock, sender, command, args.join(' '));
                }
                break;
            
            case 'rand':
                await randomCommand(sock, sender, args[0]);
                break;
           
            case 'quran':
            case 'doa':
            case 'asmaulhusna':
            case 'jadwalsholat':
            case 'kiblat':
                await islamCommand(sock, sender, command, args.join(' '));
                break;
            
            case 'thunder':
            case 'biden':
            case 'trump':
            case 'jail':
            case 'wanted':
            case 'meme':
            case 'quote':
            case 'drake':
            case 'pixel':
            case 'glitch':
            case 'welcome':
            case 'fakenews':
            case 'emoji':
            case 'stickermaker':
                await makerCommand(sock, sender, command, args.join(' '));
                break;
            
            case 'google':
            case 'g':
            case 'wiki':
            case 'wikipedia':
            case 'ytsearch':
            case 'youtubesearch':
            case 'pins':
            case 'pinterestsearch':
            case 'npm':
            case 'githubsearch':
                await searchCommand(sock, sender, command, args.join(' '));
                break;
            
            case 'play':
            case 'song':
            case 'music':
                await playCommand(sock, sender, args.join(' '));
                break;
            
            case 'ping':
                await pingCommand(sock, sender);
                break;
                
            case 'owner':
                await ownerCommand(sock, sender);
                break;
                
            case 'donasi':
            case 'donate':
                await donasiCommand(sock, sender);
                break;
            
            case 'bc':
            case 'broadcast':
                if (isOwner) {
                    await broadcastCommand(sock, args.join(' '));
                } else {
                    await sock.sendMessage(sender, { text: `❌ Command ini hanya untuk owner bot!` });
                }
                break;
                
            case 'setprefix':
                if (isOwner) {
                    await settingCommand(sock, sender, 'prefix', args[0]);
                } else {
                    await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk owner bot!' });
                }
                break;
                
            case 'setname':
                if (isOwner) {
                    await settingCommand(sock, sender, 'botname', args.join(' '));
                } else {
                    await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk owner bot!' });
                }
                break;
                
            case 'exec':
            case '>':
                if (isOwner) {
                    await execCommand(sock, sender, args.join(' '));
                } else {
                    await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk owner bot' });
                }
                break;
                
            case 'get':
                if (isOwner) {
                    await getCommand(sock, sender, args[0]);
                } else {
                    await sock.sendMessage(sender, { text: '❌ Command ini hanya untuk owner bot' });
                }
                break;
                
            case 'join':
                if (isOwner) {
                    const link = args[0];
                    if (link) {
                        try {
                            const code = link.split('https://chat.whatsapp.com/')[1];
                            await sock.groupAcceptInvite(code);
                            await sock.sendMessage(sender, { text: `✅ Berhasil join grup` });
                        } catch (e) {
                            await sock.sendMessage(sender, { text: `❌ Gagal join grup: ${e.message}` });
                        }
                    } else {
                        await sock.sendMessage(sender, { text: '❌ Masukkan link grup!\nContoh: .join https://chat.whatsapp.com/xxx' });
                    }
                }
                break;
                
            case 'leave':
                if (isOwner && isGroup) {
                    await sock.groupLeave(sender);
                }
                break;
            
            case 'tagall': 
            case 'kick':
            case 'promote':
            case 'demote':
            case 'add':
            case 'groupinfo':
            case 'setdesc':
            case 'setpp':
            case 'setphoto':
            case 'link':
            case 'getlink':
            case 'resetlink':
            case 'close':
            case 'open':
            case 'delete':
            case 'del':
                if (isGroup) {
                    await groupCommand(sock, msg, command, args);
                }
                break;
           
            default:
                await sock.sendMessage(sender, { 
                    text: `❌ *Command "${command}" tidak dikenal!*\n\nKetik ${prefix}menu untuk melihat daftar command.`
                });
                break;
        }
        
    } catch (error) {
        console.error(chalk.red('\n❌ Error handling message:'));
        console.error(chalk.red(error.stack));
        try {
            await sock.sendMessage(sender, { 
                text: `❌ *Terjadi kesalahan!*\n\n${error.message}`
            });
        } catch (e) {
            console.error('Gagal mengirim pesan error:', e);
        }
    }
}

module.exports = { handleMessage };
