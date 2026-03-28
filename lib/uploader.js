import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

class Uploader {
  async toTelegraph(filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      const res = await axios.post('https://telegra.ph/upload', form, { headers: form.getHeaders() });
      if (res.data?.[0]) return `https://telegra.ph${res.data[0].src}`;
      throw new Error('Upload failed');
    } catch (err) { throw new Error(`Telegraph upload failed: ${err.message}`); }
  }
  
  async toCatbox(filePath) {
    try {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', fs.createReadStream(filePath));
      const res = await axios.post('https://catbox.moe/user/api.php', form, { headers: form.getHeaders() });
      if (res.data?.startsWith('https://')) return res.data;
      throw new Error('Upload failed');
    } catch (err) { throw new Error(`Catbox upload failed: ${err.message}`); }
  }
  
  async upload(filePath, provider = 'telegraph') {
    const providers = { telegraph: this.toTelegraph, catbox: this.toCatbox };
    const uploader = providers[provider];
    if (!uploader) throw new Error(`Provider ${provider} not found`);
    return await uploader.call(this, filePath);
  }
  
  async autoUpload(filePath) {
    const providers = ['telegraph', 'catbox'];
    for (const provider of providers) {
      try { const url = await this.upload(filePath, provider); return { success: true, url, provider }; } 
      catch (err) { console.log(`Upload to ${provider} failed: ${err.message}`); }
    }
    throw new Error('error');
  }
}

const uploader = new Uploader();
export default uploader;
