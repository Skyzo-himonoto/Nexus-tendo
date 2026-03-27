import fs from 'fs-extra';
import path from 'path';
import config from '../../config.js';
import { loadJSON, saveJSON } from '../utils.js';

class Database {
  constructor() {
    this.dataPath = config.dataPath;
    this.init();
  }
  
  async init() {
    await fs.ensureDir(this.dataPath);
    const defaultFiles = {
      'users.json': {},
      'groups.json': {},
      'premium.json': { users: [] },
      'owner.json': { owners: config.ownerNumbers },
      'settings.json': { prefix: config.prefix, autoRead: config.autoRead },
      'sewa.json': {},
      'partner.json': {},
      'prefix.json': { prefix: config.prefix },
      'autobackup.json': { lastBackup: null, enabled: false }
    };
    
    for (const [file, defaultData] of Object.entries(defaultFiles)) {
      const filePath = path.join(this.dataPath, file);
      if (!await fs.pathExists(filePath)) {
        await saveJSON(filePath, defaultData);
      }
    }
  }

  async getUser(userId) {
    const users = await loadJSON(path.join(this.dataPath, 'users.json'));
    if (!users[userId]) {
      users[userId] = {
        id: userId,
        limit: 50,
        expired: null,
        isPremium: false,
        registeredAt: new Date().toISOString()
      };
      await this.saveUser(userId, users[userId]);
    }
    return users[userId];
  }
  
  async saveUser(userId, data) {
    const users = await loadJSON(path.join(this.dataPath, 'users.json'));
    users[userId] = { ...users[userId], ...data };
    await saveJSON(path.join(this.dataPath, 'users.json'), users);
    return true;
  }
  
  async updateUserLimit(userId, limit) {
    const user = await this.getUser(userId);
    user.limit = limit;
    await this.saveUser(userId, user);
    return user.limit;
  }
  
  async reduceLimit(userId, amount = 1) {
    const user = await this.getUser(userId);
    if (user.limit < amount) return false;
    user.limit -= amount;
    await this.saveUser(userId, user);
    return true;
  }

  async addPremium(userId, days = 30) {
    const premium = await loadJSON(path.join(this.dataPath, 'premium.json'));
    const expired = new Date();
    expired.setDate(expired.getDate() + days);
    
    if (!premium.users.includes(userId)) {
      premium.users.push(userId);
      await saveJSON(path.join(this.dataPath, 'premium.json'), premium);
    }
    
    const user = await this.getUser(userId);
    user.isPremium = true;
    user.expired = expired.toISOString();
    await this.saveUser(userId, user);
    
    return true;
  }
  
  async removePremium(userId) {
    const premium = await loadJSON(path.join(this.dataPath, 'premium.json'));
    premium.users = premium.users.filter(id => id !== userId);
    await saveJSON(path.join(this.dataPath, 'premium.json'), premium);
    
    const user = await this.getUser(userId);
    user.isPremium = false;
    user.expired = null;
    await this.saveUser(userId, user);
    
    return true;
  }
  
  async isPremium(userId) {
    const user = await this.getUser(userId);
    if (!user.isPremium) return false;
    if (user.expired && new Date(user.expired) < new Date()) {
      await this.removePremium(userId);
      return false;
    }
    
    return true;
  }
  
  async getPremiumList() {
    const premium = await loadJSON(path.join(this.dataPath, 'premium.json'));
    return premium.users;
  }
  
  async getGroup(groupId) {
    const groups = await loadJSON(path.join(this.dataPath, 'groups.json'));
    if (!groups[groupId]) {
      groups[groupId] = {
        id: groupId,
        welcome: false,
        antiLink: false,
        antiSpam: false,
        nsfw: false,
        lang: 'id'
      };
      await saveJSON(path.join(this.dataPath, 'groups.json'), groups);
    }
    return groups[groupId];
  }
  
  async saveGroup(groupId, data) {
    const groups = await loadJSON(path.join(this.dataPath, 'groups.json'));
    groups[groupId] = { ...groups[groupId], ...data };
    await saveJSON(path.join(this.dataPath, 'groups.json'), groups);
    return true;
  }

  async getSettings() {
    return await loadJSON(path.join(this.dataPath, 'settings.json'));
  }
  
  async updateSettings(data) {
    const settings = await this.getSettings();
    const newSettings = { ...settings, ...data };
    await saveJSON(path.join(this.dataPath, 'settings.json'), newSettings);
    return newSettings;
  }
  
  async getPrefix() {
    const prefixData = await loadJSON(path.join(this.dataPath, 'prefix.json'));
    return prefixData.prefix || config.prefix;
  }
  
  async setPrefix(newPrefix) {
    await saveJSON(path.join(this.dataPath, 'prefix.json'), { prefix: newPrefix });
    return newPrefix;
  }
}

const db = new Database();
export default db;
