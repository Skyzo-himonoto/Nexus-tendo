import axios from 'axios';
import ytdl from 'ytdl-core';
import { isValidUrl, downloadFile, randomString } from './utils.js';
import config from '../config.js';

class Downloader {
  constructor() {
    this.baseUrl = 'https://api.ryzendesu.vip';
  }
  
  async ytdl(url, type = 'audio') {
    try {
      if (!ytdl.validateURL(url)) {
        throw new Error('Invalid YouTube URL');
      }
      
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
      
      if (type === 'audio') {
        const audioStream = ytdl(url, {
          quality: 'highestaudio',
          filter: 'audioonly'
        });
        
        const filename = `${randomString()}.mp3`;
        const filepath = `${config.tempPath}/${filename}`;
        
        const writer = require('fs').createWriteStream(filepath);
        audioStream.pipe(writer);
        
        return new Promise((resolve, reject) => {
          writer.on('finish', () => {
            resolve({
              success: true,
              path: filepath,
              title: title,
              duration: info.videoDetails.lengthSeconds,
              size: require('fs').statSync(filepath).size
            });
          });
          writer.on('error', reject);
        });
      } else {
        const format = ytdl.chooseFormat(info.formats, { quality: '18' });
        const videoUrl = format.url;
        
        return {
          success: true,
          url: videoUrl,
          title: title,
          duration: info.videoDetails.lengthSeconds,
          quality: format.qualityLabel
        };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  async tiktok(url) {
    try {
      const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/tiktok?url=${encodeURIComponent(url)}`);
      const data = response.data;
      
      if (data.status === 200) {
        return {
          success: true,
          title: data.title || 'TikTok Video',
          video: data.video || data.nowatermark,
          audio: data.audio,
          author: data.author || {}
        };
      }
      throw new Error('Failed to fetch TikTok data');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async instagram(url) {
    try {
      const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/instagram?url=${encodeURIComponent(url)}`);
      const data = response.data;
      
      if (data.status === 200 && data.data) {
        const medias = data.data.map(item => ({
          type: item.type,
          url: item.url
        }));
        
        return {
          success: true,
          medias: medias,
          caption: data.caption || ''
        };
      }
      throw new Error('Failed to fetch Instagram data');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async facebook(url) {
    try {
      const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/facebook?url=${encodeURIComponent(url)}`);
      const data = response.data;
      
      if (data.status === 200 && data.data) {
        return {
          success: true,
          title: data.title || 'Facebook Video',
          hd: data.data.hd,
          sd: data.data.sd
        };
      }
      throw new Error('Failed to fetch Facebook data');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async twitter(url) {
    try {
      const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/twitter?url=${encodeURIComponent(url)}`);
      const data = response.data;
      
      if (data.status === 200 && data.data) {
        return {
          success: true,
          title: data.title || 'Twitter Video',
          medias: data.data.media || []
        };
      }
      throw new Error('Failed to fetch Twitter data');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async pinterest(url) {
    try {
      const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/pinterest?url=${encodeURIComponent(url)}`);
      const data = response.data;
      
      if (data.status === 200 && data.data) {
        return {
          success: true,
          media: data.data.url,
          type: data.data.type
        };
      }
      throw new Error('Failed to fetch Pinterest data');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  async mediafire(url) {
    try {
      const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/mediafire?url=${encodeURIComponent(url)}`);
      const data = response.data;
      
      if (data.status === 200 && data.data) {
        return {
          success: true,
          title: data.data.title,
          size: data.data.size,
          url: data.data.url
        };
      }
      throw new Error('Failed to fetch MediaFire data');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async spotify(url) {
    try {
      const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/spotify?url=${encodeURIComponent(url)}`);
      const data = response.data;
      
      if (data.status === 200 && data.data) {
        return {
          success: true,
          title: data.data.title,
          artist: data.data.artist,
          duration: data.data.duration,
          url: data.data.url
        };
      }
      throw new Error('Failed to fetch Spotify data');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  async pinterestSearch(query, limit = 10) {
    try {
      const response = await axios.get(`https://api.ryzendesu.vip/api/search/pinterest?query=${encodeURIComponent(query)}`);
      const data = response.data;
      
      if (data.status === 200 && data.data) {
        return {
          success: true,
          results: data.data.slice(0, limit)
        };
      }
      throw new Error('Failed to search Pinterest');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  
  async googleImage(query, limit = 10) {
    try {
      const response = await axios.get(`https://api.ryzendesu.vip/api/search/googleimage?query=${encodeURIComponent(query)}`);
      const data = response.data;
      
      if (data.status === 200 && data.data) {
        return {
          success: true,
          results: data.data.slice(0, limit)
        };
      }
      throw new Error('Failed to search Google Images');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

const downloader = new Downloader();
export default downloader;
