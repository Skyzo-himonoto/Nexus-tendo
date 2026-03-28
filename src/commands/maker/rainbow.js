import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function rainbow(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, { text: '📝 .rainbow <teks>\n\n🌈 Buat teks dengan efek rainbow' });
  }
  
  const text = args.join(' ');
  await sock.sendMessage(sender, { text: '🌈 Membuat efek rainbow...' });
  
  try {
    const response = await axios.get(`https://api.ryzendesu.vip/api/maker/rainbow?text=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer'
    });
    
    const outputPath = path.join(config.tempPath, `${randomString()}.png`);
    await fs.writeFile(outputPath, response.data);
    
    await sock.sendMessage(sender, {
      image: { url: outputPath },
      caption: `🌈 *Rainbow Text*\n\n📝 ${text}`
    });
    
    await fs.unlink(outputPath);
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Error: ${err.message}` });
  }
}
