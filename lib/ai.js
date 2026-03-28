import axios from 'axios';

class AI {
  constructor() { this.apiKeys = { openai: process.env.OPENAI_API_KEY || '', gemini: process.env.GEMINI_API_KEY || '' }; }
  
  async chatGPT(prompt, model = 'gpt-3.5-turbo') {
    try {
      if (!this.apiKeys.openai) throw new Error('OpenAI API key not configured');
      const res = await axios.post('https://api.openai.com/v1/chat/completions', 
        { model, messages: [{ role: 'user', content: prompt }], temperature: 0.7 },
        { headers: { 'Authorization': `Bearer ${this.apiKeys.openai}`, 'Content-Type': 'application/json' } });
      return { success: true, text: res.data.choices[0].message.content };
    } catch (err) { return { success: false, error: err.message }; }
  }

  async gemini(prompt) {
    try {
      if (!this.apiKeys.gemini) throw new Error('Gemini API key not configured');
      const res = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKeys.gemini}`,
        { contents: [{ parts: [{ text: prompt }] }] });
      return { success: true, text: res.data.candidates[0].content.parts[0].text };
    } catch (err) { return { success: false, error: err.message }; }
  }

  async blackbox(prompt) {
    try {
      const res = await axios.post('https://api.blackbox.ai/api/chat',
        { messages: [{ role: 'user', content: prompt }], model: 'blackbox', max_tokens: 1000 });
      return { success: true, text: res.data.response || res.data.message };
    } catch (err) { return { success: false, error: err.message }; }
  }
  
  async textToSpeech(text, lang = 'id') {
    try { return { success: true, url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob` }; } 
    catch (err) { return { success: false, error: err.message }; }
  }

  async translate(text, targetLang = 'id') {
    try {
      const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      return { success: true, text: res.data[0].map(item => item[0]).join(''), original: text };
    } catch (err) { return { success: false, error: err.message }; }
  }
}

const ai = new AI();
export default ai;
