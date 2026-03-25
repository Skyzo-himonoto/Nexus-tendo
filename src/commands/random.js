const axios = require('axios');
const config = require('../../config');

async function randomCommand(sock, sender, type) {
    const randoms = {
        waifu: 'https://api.waifu.pics/sfw/waifu',
        neko: 'https://api.waifu.pics/sfw/neko',
        shinobu: 'https://api.waifu.pics/sfw/shinobu',
        megumin: 'https://api.waifu.pics/sfw/megumin',
        bully: 'https://api.waifu.pics/sfw/bully',
        cuddle: 'https://api.waifu.pics/sfw/cuddle',
        cry: 'https://api.waifu.pics/sfw/cry',
        hug: 'https://api.waifu.pics/sfw/hug',
        awoo: 'https://api.waifu.pics/sfw/awoo',
        kiss: 'https://api.waifu.pics/sfw/kiss',
        pat: 'https://api.waifu.pics/sfw/pat',
        smug: 'https://api.waifu.pics/sfw/smug',
        bonk: 'https://api.waifu.pics/sfw/bonk',
        yeet: 'https://api.waifu.pics/sfw/yeet',
        blush: 'https://api.waifu.pics/sfw/blush',
        smile: 'https://api.waifu.pics/sfw/smile',
        wave: 'https://api.waifu.pics/sfw/wave',
        highfive: 'https://api.waifu.pics/sfw/highfive',
        handhold: 'https://api.waifu.pics/sfw/handhold',
        nom: 'https://api.waifu.pics/sfw/nom',
        meme: 'https://meme-api.com/gimme',
        memes: 'https://meme-api.com/gimme/50',
        quote: 'https://api.quotable.io/random',
        animequote: 'https://animechan.xyz/api/random',
        cat: 'https://api.thecatapi.com/v1/images/search',
        dog: 'https://api.thedogapi.com/v1/images/search',
        fox: 'https://randomfox.ca/floof/',
        panda: 'https://some-random-api.com/animal/panda',
        bird: 'https://some-random-api.com/animal/bird',
        catfact: 'https://catfact.ninja/fact',
        dogfact: 'https://dog-api.kinduff.com/api/facts',
        wallpaper: 'https://wall.alphacoders.com/api2.0/get.php',
        joke: 'https://v2.jokeapi.dev/joke/Any?type=single',
        dadjoke: 'https://icanhazdadjoke.com/',
        chucknorris: 'https://api.chucknorris.io/jokes/random',
        islamquote: 'https://api.islamic-api.com/api/quote',
        doa: 'https://api.islamic-api.com/api/doa',
        asmaulhusna: 'https://api.islamic-api.com/api/asmaulhusna'
    };
    
    const captions = {
        waifu: '🌸 *WAIFU RANDOM*', neko: '🐱 *NEKO RANDOM*',
        meme: '😂 *MEME RANDOM*', quote: '💬 *QUOTE RANDOM*',
        cat: '🐱 *CAT RANDOM*', dog: '🐶 *DOG RANDOM*',
        joke: '😄 *JOKE RANDOM*', dadjoke: '👨 *DAD JOKE*'
    };
    
    if (!randoms[type]) {
        const randomButtons = Object.keys(randoms).slice(0, 20).map((key, i) => ({
            index: i + 1,
            quickReplyButton: { displayText: key.toUpperCase(), id: `${config.prefix}random ${key}` }
        }));
        await sock.sendMessage(sender, {
            text: `🎲 *RANDOM GENERATOR*\n\nPilih kategori:\n${Object.keys(randoms).slice(0, 20).join(', ')}\n\nKlik tombol di bawah!`,
            templateButtons: randomButtons.slice(0, 10)
        });
        return;
    }
    
    await sock.sendMessage(sender, { text: `🔄 Mengambil random ${type}...` });
    
    try {
        const response = await axios.get(randoms[type]);
        let result;
        
        switch(type) {
            case 'meme':
                result = response.data;
                await sock.sendMessage(sender, { image: { url: result.url }, caption: `😂 *${result.title}*\n👍 ${result.ups} | 💬 ${result.comments}` });
                break;
            case 'quote':
                result = response.data;
                await sock.sendMessage(sender, { text: `💬 *QUOTE*\n\n"${result.content}"\n- ${result.author}` });
                break;
            case 'cat':
            case 'dog':
                result = response.data[0];
                await sock.sendMessage(sender, { image: { url: result.url }, caption: `${captions[type] || '✨ RANDOM'}` });
                break;
            case 'joke':
                result = response.data;
                await sock.sendMessage(sender, { text: `😄 *JOKE*\n\n${result.joke || result.setup + ' ' + result.delivery}` });
                break;
            default:
                await sock.sendMessage(sender, { image: { url: response.data.url || response.data.image || response.data.file }, caption: captions[type] || `✨ *${type.toUpperCase()} RANDOM*` });
        }
    } catch (error) {
        await sock.sendMessage(sender, { text: '❌ Gagal mengambil random!' });
    }
}

module.exports = { randomCommand };
