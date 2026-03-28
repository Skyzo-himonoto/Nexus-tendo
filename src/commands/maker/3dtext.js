import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { randomString } from '../../../lib/utils.js';
import config from '../../../config.js';

export default async function threeDtext(context) {
  const { sock, sender, args } = context;
  
  if (args.length === 0) {
    return await sock.sendMessage(sender, { text: '📝 .3dtext <teks>\n\n🎨 Buat teks 3D keren!' });
  }
  
  const text = args.join(' ');
  await sock.sendMessage(sender, { text: '🎨 Membuat efek 3D...' });
  
  try {
    const response = await axios.get(`https://api.ryzendesu.vip/api/maker/3dtext?text=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer'
    });
    
    const outputPath = path.join(config.tempPath, `${randomString()}.png`);
    await fs.writeFile(outputPath, response.data);
    
    await sock.sendMessage(sender, {
      image: { url: outputPath },
      caption: `🎨 *3D Text Effect*\n\n📝 ${text}`
    });
    
    await fs.unlink(outputPath);
  } catch (err) {
    await sock.sendMessage(sender, { text: `❌ Error: ${err.message}` });
  }
}
