import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

class Uploader {
  async toTelegraph(filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      const response = await axios.post('https://telegra.ph/upload', form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });
      
      if (response.data && response.data[0]) {
        return `https://telegra.ph${response.data[0].src}`;
      }
      throw new Error('Upload failed');
    } catch (err) {
      throw new Error(`Telegraph upload failed: ${err.message}`);
    }
  }
  
  async toCatbox(filePath) {
    try {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', fs.createReadStream(filePath));
      
      const response = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });
      
      if (response.data && response.data.startsWith('https://')) {
        return response.data;
      }
      throw new Error('Upload failed');
    } catch (err) {
      throw new Error(`Catbox upload failed: ${err.message}`);
    }
  }
  
  async toFileIo(filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      const response = await axios.post('https://file.io/', form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });
      
      if (response.data && response.data.success) {
        return response.data.link;
      }
      throw new Error('Upload failed');
    } catch (err) {
      throw new Error(`File.io upload failed: ${err.message}`);
    }
  }
  
  async toPomf(filePath) {
    try {
      const form = new FormData();
      form.append('files[]', fs.createReadStream(filePath));
      
      const response = await axios.post('https://pomf2.lain.la/upload.php', form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });
      
      if (response.data && response.data.success) {
        return response.data.files[0].url;
      }
      throw new Error('Upload failed');
    } catch (err) {
      throw new Error(`Pomf upload failed: ${err.message}`);
    }
  }
  
  async toTmpNinja(filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      
      const response = await axios.post('https://tmp.ninja/api.php?upload', form, {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });
      
      if (response.data && response.data.url) {
        return response.data.url;
      }
      throw new Error('Upload failed');
    } catch (err) {
      throw new Error(`Tmp.ninja upload failed: ${err.message}`);
    }
  }
  
  async upload(filePath, provider = 'telegraph') {
    const providers = {
      telegraph: this.toTelegraph,
      catbox: this.toCatbox,
      fileio: this.toFileIo,
      pomf: this.toPomf,
      tmpninja: this.toTmpNinja
    };
    
    const uploader = providers[provider];
    if (!uploader) {
      throw new Error(`Provider ${provider} not found`);
    }
    
    return await uploader.call(this, filePath);
  }
  
  async autoUpload(filePath) {
    const providers = ['telegraph', 'catbox', 'pomf', 'tmpninja'];
    
    for (const provider of providers) {
      try {
        const url = await this.upload(filePath, provider);
        return { success: true, url, provider };
      } catch (err) {
        console.log(`Upload to ${provider} failed: ${err.message}`);
      }
    }
    
    throw new Error('upload fail');
  }
  
  async uploadBuffer(buffer, filename, provider = 'telegraph') {
    const tempPath = path.join(global.tempPath || './temp', `${Date.now()}_${filename}`);
    await fs.writeFile(tempPath, buffer);
    
    try {
      const url = await this.upload(tempPath, provider);
      await fs.unlink(tempPath);
      return url;
    } catch (err) {
      await fs.unlink(tempPath);
      throw err;
    }
  }
}

const uploader = new Uploader();
export default uploader;
