const axios = require('axios');
const config = require('../../config');

async function aiCommand(sock, sender, prompt) {
    if (!prompt) {
        await sock.sendMessage(sender, { text: '❌ Cara pakai: .ai [pertanyaan]' });
        return;
    }
    
    if (!config.geminiApiKey) {
        await sock.sendMessage(sender, { text: '❌ API Key Gemini belum diisi!\n\nDapatkan di: https://makersuite.google.com/app/apikey' });
        return;
    }
    
    await sock.sendMessage(sender, { text: '🤖 Sedang berpikir...' });
    
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.geminiApiKey}`,
             { contents: [{ parts: [{ text: prompt }] }] },
             { timeout: 30000 } 
         );
        
        let reply = response.data.candidates[0].content.parts[0].text;
        if (reply.length > 4000) reply = reply.substring(0, 4000) + '\n\n... (dipotong)';
        
        await sock.sendMessage(sender, { text: `🤖 *AI:*\n\n${reply}` });
    } catch (error) {
        await sock.sendMessage(sender, { text: '❌ AI error!' });
    }
}

module.exports = { aiCommand };

