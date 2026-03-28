import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { randomString, isValidUrl } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function url2img(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, { text: '📝 .url2img <url>\n\n📸 Ambil screenshot website!' });
  }
  
  const url = args[0];
  if (!isValidUrl(url)) return await sock.sendMessage(sender, { text: '❌ URL tidak valid!' });
  
  await sock.sendMessage(sender, { text: '📸 Mengambil screenshot...' });
  
  try {
    const response = await axios.get(`https://api.ryzendesu.vip/api/tools/screenshot?url=${encodeURIComponent(url)}`, {
      responseType: 'arraybuffer'
    });
    
    const outputPath = path.join(config.tempPath, `${randomString()}.png`);
    await fs.writeFile(outputPath, response.data);
    
    await sock.sendMessage(sender, {
      image: { url: outputPath },
      caption: `📸 *Screenshot*\n🔗 ${url}`
    });
    
    await fs.unlink(outputPath);
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Error: ${err.message}` });
  }
}
