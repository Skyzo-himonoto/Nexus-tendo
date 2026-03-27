import axios from 'axios';

class AI {
  constructor() {
    this.apiKeys = {
      openai: process.env.OPENAI_API_KEY || '',
      gemini: process.env.GEMINI_API_KEY || ''
    };
  }
  
  async chatGPT(prompt, model = 'gpt-3.5-turbo') {
    try {
      if (!this.apiKeys.openai) {
        throw new Error('OpenAI API key not configured');
      }
      
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.openai}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        success: true,
        text: response.data.choices[0].message.content
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async gemini(prompt) {
    try {
      if (!this.apiKeys.gemini) {
        throw new Error('Gemini API key not configured');
      }
      
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKeys.gemini}`, {
        contents: [{
          parts: [{ text: prompt }]
        }]
      });
      
      const text = response.data.candidates[0].content.parts[0].text;
      
      return {
        success: true,
        text: text
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async blackbox(prompt) {
    try {
      const response = await axios.post('https://api.blackbox.ai/api/chat', {
        messages: [{ role: 'user', content: prompt }],
        model: 'blackbox',
        max_tokens: 1000
      });
      
      return {
        success: true,
        text: response.data.response || response.data.message
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  async generateImage(prompt, size = '512x512') {
    try {
      if (!this.apiKeys.openai) {
        throw new Error('OpenAI API key not configured');
      }
      
      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        prompt: prompt,
        n: 1,
        size: size
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.openai}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        success: true,
        url: response.data.data[0].url
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async textToSpeech(text, lang = 'id') {
    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;  
      return {
        success: true,
        url: url
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async translate(text, targetLang = 'id') {
    try {
      const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      
      const translated = response.data[0].map(item => item[0]).join('');
      
      return {
        success: true,
        text: translated,
        original: text
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

const ai = new AI();
export default ai;
