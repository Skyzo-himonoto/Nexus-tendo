import fs from 'fs-extra';
import path from 'path';
import config from '../config.js';
import { loadJSON, saveJSON, randomItem, sleep } from './utils.js';

class GameManager {
  constructor() {
    this.gamesPath = path.join(config.databasePath, 'games');
    this.activeGames = new Map();
    this.init();
  }
  
  async init() { await fs.ensureDir(this.gamesPath); await this.ensureGameFiles(); }
  
  async ensureGameFiles() {
    const gameFiles = ['truth.json', 'dare.json', 'tebakkimia.json', 'tebaktebakan.json', 'tebakmakanan.json', 'bucin.json', 'caklontong.json', 'family100.json', 'tebakbendera2.json', 'tebakfilm.json', 'tebaklirik.json', 'tebaklagu.json', 'tekateki.json', 'tebakprofesi.json', 'tebaknegara.json', 'siapakahaku.json', 'susunkata.json', 'tebakkata.json', 'tebakkabupaten.json', 'tebakjkt48.json', 'riddle.json', 'renungan.json', 'kataacak.json', 'tebakhewan.json', 'tebakepep.json'];
    for (const file of gameFiles) {
      const filePath = path.join(this.gamesPath, file);
      if (!await fs.pathExists(filePath)) await saveJSON(filePath, []);
    }
  }

  async loadGameData(gameName) { return await loadJSON(path.join(this.gamesPath, `${gameName}.json`)); }
  async saveGameData(gameName, data) { return await saveJSON(path.join(this.gamesPath, `${gameName}.json`), data); }
  async addQuestion(gameName, question, answer, options = {}) {
    const data = await this.loadGameData(gameName);
    data.push({ id: Date.now(), question, answer, ...options, createdAt: new Date().toISOString() });
    await this.saveGameData(gameName, data);
    return true;
  }
  async getRandomQuestion(gameName) {
    const data = await this.loadGameData(gameName);
    return data.length === 0 ? null : randomItem(data);
  }
  
  startGame(groupId, gameType, player, duration = 30) {
    if (this.activeGames.has(groupId)) return { success: false, message: 'Masih ada game yang berlangsung di grup ini!' };
    const session = { id: Date.now(), groupId, gameType, player, startTime: Date.now(), duration, score: 0, questionsAsked: 0, currentQuestion: null, status: 'active' };
    this.activeGames.set(groupId, session);
    return { success: true, session };
  }
  
  endGame(groupId) {
    const session = this.activeGames.get(groupId);
    if (session) { this.activeGames.delete(groupId); return session; }
    return null;
  }
  getActiveGame(groupId) { return this.activeGames.get(groupId); }
  updateScore(groupId, points = 20) {
    const session = this.activeGames.get(groupId);
    if (session) { session.score += points; session.questionsAsked++; return session.score; }
    return null;
  }
  async checkAnswer(groupId, answer, player) {
    const session = this.activeGames.get(groupId);
    if (!session) return { success: false, message: 'Tidak ada game yang sedang berlangsung!' };
    if (session.player !== player) return { success: false, message: 'Ini bukan game kamu!' };
    const currentQuestion = session.currentQuestion;
    if (!currentQuestion) return { success: false, message: 'Tidak ada pertanyaan aktif!' };
    const isCorrect = answer.toLowerCase() === currentQuestion.answer.toLowerCase();
    if (isCorrect) {
      this.updateScore(groupId);
      return { success: true, correct: true, message: `✅ Benar! +20 poin\nSkor: ${session.score + 20}`, score: session.score + 20 };
    } else {
      return { success: true, correct: false, message: `❌ Salah! Jawaban yang benar adalah: *${currentQuestion.answer}*`, score: session.score };
    }
  }
  async setQuestion(groupId, questionData) {
    const session = this.activeGames.get(groupId);
    if (session) { session.currentQuestion = questionData; return true; }
    return false;
  }
  async getGameStats(gameName) {
    const data = await this.loadGameData(gameName);
    return { name: gameName, totalQuestions: data.length, lastUpdated: data[data.length - 1]?.createdAt || null };
  }
  async getAllGamesStats() {
    const games = ['truth', 'dare', 'tebakkimia', 'tebaktebakan', 'tebakmakanan', 'bucin', 'caklontong', 'family100', 'tebakbendera2', 'tebakfilm', 'tebaklirik', 'tebaklagu', 'tekateki', 'tebakprofesi', 'tebaknegara', 'siapakahaku', 'susunkata', 'tebakkata', 'tebakkabupaten', 'tebakjkt48', 'riddle', 'renungan', 'kataacak', 'tebakhewan', 'tebakepep'];
    const stats = {};
    for (const game of games) stats[game] = await this.getGameStats(game);
    return stats;
  }
}

const gameManager = new GameManager();
export default gameManager;
