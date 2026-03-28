import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import fs from 'fs-extra';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folders = [
  config.sessionsPath, config.tempPath, config.logsPath,
  config.databasePath, path.join(config.databasePath, 'games'),
  config.dataPath, config.assetsPath
];

for (const folder of folders) fs.ensureDirSync(folder);

console.log(chalk.cyan(`
╔═══════════════════════════════════════╗
║     ${chalk.white('Nexus Tendo MD')}         ║
║     ${chalk.gray(config.credit)}           ║
║     Starting up...                       ║
╚═══════════════════════════════════════╝
`));

import('./src/main.js').catch(console.error);
