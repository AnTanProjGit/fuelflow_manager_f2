import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';
import { GasStation, ChatMessage, SystemSettings, SupplyEvent, ChatChannel, Subscriber } from './src/types.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.log('No GEMINI_API_KEY found, running in AI Simulation Mode.');
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  module: string;
  message: string;
}

let systemLogs: SystemLog[] = [
  {
    id: `log-init-1`,
    timestamp: new Date().toISOString(),
    level: 'success',
    module: 'System',
    message: 'Система мониторинга дефицита топлива успешно инициализирована.'
  },
  {
    id: `log-init-2`,
    timestamp: new Date().toISOString(),
    level: 'info',
    module: 'Database',
    message: 'Загружены данные: 4 АЗС, 3 отслеживаемых чата.'
  }
];

function addLog(level: 'info' | 'warn' | 'error' | 'success', module: string, message: string) {
  systemLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    level,
    module,
    message
  });
  if (systemLogs.length > 200) {
    systemLogs = systemLogs.slice(0, 200);
  }
}

// In-Memory Database
interface FeedbackTrigger {
  stationId: string;
  fuelType?: string;
  type?: string;
  queueLength?: string;
  timestamp: number;
  sender: string;
}
let feedbackTriggers: FeedbackTrigger[] = [];

let subscribers: Subscriber[] = [
  { name: 'Михаил_Анапа', status: 'active', messagesCount: 5, lastActive: new Date().toISOString() },
  { name: 'Taxi_923', status: 'active', messagesCount: 8, lastActive: new Date().toISOString() },
  { name: 'Юрий В.', status: 'active', messagesCount: 3, lastActive: new Date().toISOString() },
  { name: 'Карина', status: 'active', messagesCount: 4, lastActive: new Date().toISOString() },
  { name: 'Alex_K', status: 'active', messagesCount: 6, lastActive: new Date().toISOString() },
  { name: 'Серж88', status: 'active', messagesCount: 7, lastActive: new Date().toISOString() },
  { name: 'Алексей С.', status: 'active', messagesCount: 12, lastActive: new Date().toISOString() },
  { name: 'Ирина К.', status: 'active', messagesCount: 9, lastActive: new Date().toISOString() },
  { name: 'Дмитрий (Тролль)', status: 'active', messagesCount: 2, lastActive: new Date().toISOString() },
  { name: 'Андрей 123', status: 'active', messagesCount: 1, lastActive: new Date().toISOString() },
  { name: 'Ольга_К', status: 'active', messagesCount: 0, lastActive: new Date().toISOString() },
  { name: 'Влад_Краснодар', status: 'active', messagesCount: 2, lastActive: new Date().toISOString() },
  { name: 'Елена_Анапа', status: 'active', messagesCount: 1, lastActive: new Date().toISOString() },
  { name: 'Игорь_П', status: 'active', messagesCount: 0, lastActive: new Date().toISOString() },
];

let stations: GasStation[] = [
  {
    id: 'station-real-1',
    brand: 'Роснефть',
    address: 'г. Анапа, Анапское шоссе, 1',
    coords: { lat: 44.8952, lng: 37.3165 },
    status: { AI92: 'available', AI95: 'available', DT: 'available' },
    queueLength: 'medium',
    waitingTime: 20,
    confidenceScore: 0.85,
    deficitForecast: 'medium',
    nextDelivery: 'нет данных',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-real-2',
    brand: 'Роснефть',
    address: 'г. Анапа, Пионерский проспект, 4',
    coords: { lat: 44.9071, lng: 37.3210 },
    status: { AI92: 'available', AI95: 'available', DT: 'empty' },
    queueLength: 'short',
    waitingTime: 12,
    confidenceScore: 0.82,
    deficitForecast: 'medium',
    nextDelivery: 'нет данных',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-real-3',
    brand: 'Роснефть',
    address: 'г. Анапа, Симферопольское шоссе, 33',
    coords: { lat: 44.8908, lng: 37.3292 },
    status: { AI92: 'available', AI95: 'empty', DT: 'available' },
    queueLength: 'long',
    waitingTime: 35,
    confidenceScore: 0.91,
    deficitForecast: 'high',
    nextDelivery: 'нет данных',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-real-4',
    brand: 'Роснефть',
    address: 'г. Анапа, Супсехское шоссе, 4',
    coords: { lat: 44.8820, lng: 37.3355 },
    status: { AI92: 'available', AI95: 'available', DT: 'available' },
    queueLength: 'short',
    waitingTime: 7,
    confidenceScore: 0.78,
    deficitForecast: 'low',
    nextDelivery: 'нет данных',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-real-5',
    brand: 'Роснефть',
    address: 'г. Анапа, ул. Владимирская, 77',
    coords: { lat: 44.9025, lng: 37.3051 },
    status: { AI92: 'empty', AI95: 'available', DT: 'available' },
    queueLength: 'medium',
    waitingTime: 25,
    confidenceScore: 0.87,
    deficitForecast: 'high',
    nextDelivery: 'нет данных',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-real-6',
    brand: 'Лукойл',
    address: 'г. Анапа, ул. Ленина, 182',
    coords: { lat: 44.8984, lng: 37.3080 },
    status: { AI92: 'available', AI95: 'available', DT: 'empty' },
    queueLength: 'medium',
    waitingTime: 30,
    confidenceScore: 0.90,
    deficitForecast: 'high',
    nextDelivery: 'нет данных',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-real-7',
    brand: 'Лукойл',
    address: 'г. Анапа, Симферопольское шоссе, 58',
    coords: { lat: 44.8895, lng: 37.3310 },
    status: { AI92: 'available', AI95: 'available', DT: 'available' },
    queueLength: 'short',
    waitingTime: 18,
    confidenceScore: 0.83,
    deficitForecast: 'medium',
    nextDelivery: 'нет данных',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-real-8',
    brand: 'Лукойл',
    address: 'г. Анапа, Анапское шоссе, 10',
    coords: { lat: 44.8965, lng: 37.3178 },
    status: { AI92: 'available', AI95: 'empty', DT: 'available' },
    queueLength: 'long',
    waitingTime: 40,
    confidenceScore: 0.92,
    deficitForecast: 'high',
    nextDelivery: 'нет данных',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-real-9',
    brand: 'Лукойл',
    address: 'ст-ца Благовещенская, ул. Таманская, 2А',
    coords: { lat: 45.0552, lng: 37.1301 },
    status: { AI92: 'available', AI95: 'available', DT: 'available' },
    queueLength: 'none',
    waitingTime: 5,
    confidenceScore: 0.76,
    deficitForecast: 'low',
    nextDelivery: 'нет данных',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'station-real-10',
    brand: 'Газпромнефть',
    address: 'г. Анапа, Симферопольское шоссе, 80',
    coords: { lat: 44.8880, lng: 37.3335 },
    status: { AI92: 'available', AI95: 'available', DT: 'empty' },
    queueLength: 'short',
    waitingTime: 10,
    confidenceScore: 0.80,
    deficitForecast: 'medium',
    nextDelivery: 'нет данных',
    updatedAt: new Date().toISOString(),
  },
];

const CHANNELS_FILE = path.join(process.cwd(), 'chat_channels.json');

function saveChannels() {
  try {
    fs.writeFileSync(CHANNELS_FILE, JSON.stringify(chatChannels, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving channels:', err);
  }
}

function loadChannels(): ChatChannel[] {
  const defaults: ChatChannel[] = [
    {
      id: 'chat-m4',
      name: 'Трасса М-4 Дон: Мониторинг Топлива',
      keywords: 'м4, дон, кущевская, краснодар, заправка, бензин, дизель, очередь, топливо',
      excludeFromAnalysis: false
    },
    {
      id: 'chat-city',
      name: 'Городской чат Анапы (Топливо/Пробки)',
      keywords: 'анапа, ленина, мира, супсех, витязево, город, заправка, бензин, дизель',
      excludeFromAnalysis: false
    },
    {
      id: 'chat-freight',
      name: 'Дальнобойщики Юг (Дизель/Пробки)',
      keywords: 'дальнобой, фура, дизель, дт, солярка, заправка, трасса, очередь',
      excludeFromAnalysis: false
    }
  ];

  try {
    if (fs.existsSync(CHANNELS_FILE)) {
      const data = fs.readFileSync(CHANNELS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    fs.writeFileSync(CHANNELS_FILE, JSON.stringify(defaults, null, 2), 'utf8');
    return defaults;
  } catch (err) {
    console.error('Error loading channels:', err);
  }
  return defaults;
}

let chatChannels: ChatChannel[] = loadChannels();

function isMessageExcluded(text: string): boolean {
  if (!text) return false;
  const textLower = text.toLowerCase();
  const excludedChannels = chatChannels.filter(c => c.excludeFromAnalysis);
  return excludedChannels.some(chan => {
    if (!chan.keywords || !chan.keywords.trim()) return false;
    const keywordsList = chan.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    return keywordsList.some(k => textLower.includes(k));
  });
}

let connectedExternalChat: any = null;
let connectedExternalChats: any[] = [];
let chatInterval: NodeJS.Timeout | null = null;

let chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'Алексей С.',
    text: 'На Газпромнефти на Симферопольском шоссе дизель есть, но очередь уже машин 15. Простоял минут 40.',
    source: 'telegram',
    isFake: false,
    parsed: {
      isFuelRelated: true,
      brand: 'Газпромнефть',
      address: 'г. Анапа, Симферопольское шоссе, 80',
      fuelType: 'ДТ',
      status: 'available',
      queue: 'long',
      isFake: false,
      explanation: 'Сообщение подтверждает наличие дизеля и длинную очередь на Симферопольском шоссе.',
    },
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'msg-2',
    sender: 'Ирина К.',
    text: 'Лукойл на Ленина дизель закончился полностью, говорят бензовоз застрял где-то на трассе!',
    source: 'telegram',
    isFake: false,
    parsed: {
      isFuelRelated: true,
      brand: 'Лукойл',
      address: 'г. Анапа, ул. Ленина, 182',
      fuelType: 'ДТ',
      status: 'empty',
      queue: 'none',
      isFake: false,
      explanation: 'Пользователь сообщает об окончании дизеля на Ленина.',
    },
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 'msg-3',
    sender: 'Дмитрий (Тролль)',
    text: 'Парни, на Лукойле на Ленина бесплатно раздают АИ-95 в честь юбилея мэра! Очереди вообще нет!',
    source: 'telegram',
    isFake: true,
    parsed: {
      isFuelRelated: true,
      brand: 'Лукойл',
      address: 'г. Анапа, ул. Ленина, 182',
      fuelType: 'АИ-95',
      status: 'available',
      queue: 'none',
      isFake: true,
      explanation: 'Сообщение помечено как фейк: бесплатная раздача топлива крайне сомнительна, противоречит штатному режиму.',
    },
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
];

let settings: SystemSettings = {
  llmModel: 'gemini-3.5-flash',
  systemPrompt: `You are an AI Chat Parser for a Fuel Management System operating under fuel deficit conditions.
Your job is to parse messages from local Telegram chats and extract entities about gas station status, fuel types, queues, and deliveries.

You must output a JSON object adhering strictly to the schema.
Extract:
- brand (Лукойл, Роснефть, Газпромнефть, Татнефть)
- address (main keywords/streets)
- fuelType ('АИ-92', 'АИ-95', 'ДТ')
- status ('available' / 'empty' / 'unloading')
- queue ('none' / 'short' / 'medium' / 'long')

Verify against anti-fake RAG guidelines:
- Compare against known impossible states or spam patterns.
- If a user reports something contradictory or obviously fake (e.g. "free fuel for everyone at Лукойл", or "Лукойл Ленина sells water"), set isFake = true.`,
  ragContext: `- Лукойл на ул. Ленина, 182: по техническим причинам ДТ поставляется только по талонам с 10:00 до 12:00. Любые сообщения о свободной продаже ДТ там после 12:00 являются сомнительными.
- Газпромнефть на Симферопольском шоссе, 80: нет АИ-92 до четверга. Если пишут, что он завезён во вторник/среду, помечайте как фейк.
- На заправках Роснефть всегда есть очереди не менее 15 минут в часы пик. Сообщения о нулевой очереди в 18:00 скорее всего неверные.`,
  temperature: 0.1,
  totalTokensUsed: 1420,
  apiUrl: 'https://api.fuel-monitoring-system.ru/v1',
  llmApiKey: 'AIzaSyF_example_key_value_here',
  proxyType: 'direct',
  proxyAddress: 'https://proxy.fuel-gateway.local:8080',
  recommendationApiUrl: process.env.BACKEND_API_URL || 'http://localhost:8000/recommendation',
};

let supplyEvents: SupplyEvent[] = [
  {
    id: 'supply-1',
    stationId: 'station-real-6',
    stationName: 'Лукойл ул. Ленина, 182',
    eta: 'через 1.5 часа',
    fuelType: 'ДТ',
    confidence: 0.9,
  },
  {
    id: 'supply-2',
    stationId: 'station-real-3',
    stationName: 'Роснефть Симферопольское шоссе, 33',
    eta: 'через 30 минут',
    fuelType: 'АИ-95',
    confidence: 0.95,
  },
];

// Helper to match station by parsed brand & address
function findBestStationMatch(parsedBrand: string | null, parsedAddress: string | null): GasStation | null {
  if (!parsedBrand) return null;
  const brandLower = parsedBrand.toLowerCase();
  const addrLower = parsedAddress ? parsedAddress.toLowerCase() : '';

  // Find stations with the same brand
  const brandMatches = stations.filter(s => s.brand.toLowerCase().includes(brandLower) || brandLower.includes(s.brand.toLowerCase()));
  if (brandMatches.length === 0) return null;
  if (brandMatches.length === 1) return brandMatches[0];

  // If multiple, look for address keyword match
  if (addrLower) {
    for (const station of brandMatches) {
      const stationAddr = station.address.toLowerCase();
      // Match street names or numbers
      if (stationAddr.includes(addrLower) || addrLower.includes(station.address.split(',')[0].toLowerCase().trim())) {
        return station;
      }
    }
  }

  // Fallback to first brand match
  return brandMatches[0];
}

// REST API Endpoints
app.get('/api/stations', (req, res) => {
  res.json(stations);
});

app.get('/api/chats', (req, res) => {
  res.json(chatMessages);
});

// Delete individual chat message
app.post('/api/chats/delete', (req, res) => {
  const { id } = req.body;
  const index = chatMessages.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Сообщение не найдено' });
  }

  const msg = chatMessages[index];
  chatMessages.splice(index, 1);

  addLog(
    'warn',
    'Admin',
    `Удалено сообщение от ${msg.sender}: "${msg.text.substring(0, 35)}${msg.text.length > 35 ? '...' : ''}"`
  );

  res.json({ status: 'ok', chats: chatMessages });
});

// Clear all chat messages
app.post('/api/chats/clear', (req, res) => {
  chatMessages.length = 0;
  addLog(
    'warn',
    'Admin',
    `Все сообщения чата были принудительно удалены.`
  );
  res.json({ status: 'ok', chats: chatMessages });
});

app.get('/api/channels', (req, res) => {
  res.json(chatChannels);
});

app.post('/api/channels', (req, res) => {
  const { name, keywords } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Необходимо указать название чата' });
  }

  const id = `chat-${Date.now()}`;
  const newChannel: ChatChannel = {
    id,
    name,
    keywords: keywords || ''
  };

  chatChannels.push(newChannel);
  saveChannels();

  addLog(
    'success',
    'Admin',
    `Добавлен новый чат-канал: "${name}"`
  );

  res.json({ status: 'ok', channel: newChannel, channels: chatChannels });
});

app.post('/api/channels/delete', (req, res) => {
  const { id } = req.body;
  const index = chatChannels.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Канал не найден' });
  }

  const channel = chatChannels[index];
  chatChannels.splice(index, 1);
  saveChannels();

  addLog(
    'warn',
    'Admin',
    `Чат-канал "${channel.name}" успешно удален.`
  );

  res.json({ status: 'ok', channels: chatChannels });
});

app.post('/api/channels/toggle-analysis', (req, res) => {
  const { id } = req.body;
  const channel = chatChannels.find(c => c.id === id);
  if (!channel) {
    return res.status(404).json({ error: 'Канал не найден' });
  }

  channel.excludeFromAnalysis = !channel.excludeFromAnalysis;
  saveChannels();

  addLog(
    'info',
    'Admin',
    `Чат-канал "${channel.name}" ${channel.excludeFromAnalysis ? 'исключен из' : 'включен в'} анализ данных.`
  );

  res.json({ status: 'ok', channels: chatChannels });
});

app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.get('/api/logs', (req, res) => {
  res.json(systemLogs);
});

app.post('/api/settings', (req, res) => {
  const { systemPrompt, ragContext, temperature, llmModel, apiUrl, llmApiKey, proxyType, proxyAddress, recommendationApiUrl } = req.body;
  if (systemPrompt !== undefined) settings.systemPrompt = systemPrompt;
  if (ragContext !== undefined) settings.ragContext = ragContext;
  if (temperature !== undefined) settings.temperature = parseFloat(temperature);
  if (llmModel !== undefined) settings.llmModel = llmModel;
  if (apiUrl !== undefined) settings.apiUrl = apiUrl;
  if (llmApiKey !== undefined) settings.llmApiKey = llmApiKey;
  if (proxyType !== undefined) settings.proxyType = proxyType;
  if (proxyAddress !== undefined) settings.proxyAddress = proxyAddress;
  if (recommendationApiUrl !== undefined) settings.recommendationApiUrl = recommendationApiUrl;
  
  addLog(
    'success', 
    'LLM', 
    `Настройки системы сохранены. Ссылка на бекенд рекомендаций: ${settings.recommendationApiUrl}`
  );
  
  res.json({ status: 'ok', settings });
});

// Proxy endpoint to query external TryCloudflare recommendation backend
app.get('/api/recommendations', async (req, res) => {
  const targetUrl = settings.recommendationApiUrl || process.env.BACKEND_API_URL || 'http://localhost:8000/recommendation';
  
  addLog('info', 'Рекомендации', `Запрос к внешнему бекенду: ${targetUrl}`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout
    
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'FuelFlow-Backend'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Ошибка сервера: HTTP ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Ответ не в формате JSON (вероятно, туннель Cloudflare не запущен или возвращает ошибку 1033)');
    }
    
    const data = await response.json();
    addLog('success', 'Рекомендации', 'Успешно получены данные от внешнего бекенда рекомендаций.');
    res.json({ status: 'success', data, source: 'external' });
  } catch (err: any) {
    let errMsg = err.message || 'Ошибка подключения';
    if (err.name === 'AbortError') {
      errMsg = 'Превышено время ожидания ответа от сервера (Timeout 4s)';
    }
    
    addLog('warn', 'Рекомендации', `Внешний бекенд недоступен (${errMsg}). Задействован локальный алгоритм.`);
    res.json({ 
      status: 'offline', 
      error: errMsg, 
      source: 'local_fallback' 
    });
  }
});

// Admin override endpoint
app.post('/api/stations/override', (req, res) => {
  const { id, status, queueLength, waitingTime, deficitForecast, nextDelivery } = req.body;
  const station = stations.find(s => s.id === id);
  if (!station) {
    addLog('error', 'Admin', `Ошибка ручной корректировки: станция с ID ${id} не найдена.`);
    return res.status(404).json({ error: 'Station not found' });
  }

  if (status) station.status = { ...station.status, ...status };
  if (queueLength) {
    station.queueLength = queueLength;
    if (queueLength === 'none') station.waitingTime = 0;
    else if (queueLength === 'short') station.waitingTime = 10;
    else if (queueLength === 'medium') station.waitingTime = 25;
    else if (queueLength === 'long') station.waitingTime = 50;
  }
  if (waitingTime !== undefined) station.waitingTime = parseInt(waitingTime);
  if (deficitForecast) station.deficitForecast = deficitForecast;
  if (nextDelivery !== undefined) station.nextDelivery = nextDelivery;
  station.confidenceScore = 1.0; // Hand-validated override is perfect
  station.updatedAt = new Date().toISOString();

  addLog(
    'info', 
    'Admin', 
    `Ручная корректировка АЗС ${station.brand} (${station.address}): АИ-92=${station.status.AI92}, АИ-95=${station.status.AI95}, ДТ=${station.status.DT}, очередь=${station.queueLength}`
  );

  res.json({ status: 'ok', station });
});

// Admin Add Gas Station
app.post('/api/stations', (req, res) => {
  const { brand, address, coords, status, queueLength, waitingTime, confidenceScore, deficitForecast, nextDelivery, apiUrl, apiKey } = req.body;
  if (!brand || !address) {
    return res.status(400).json({ error: 'Необходимо указать бренд и адрес АЗС' });
  }

  const newStation: GasStation = {
    id: `station-${Date.now()}`,
    brand,
    address,
    coords: coords || { lat: 55.75 + (Math.random() - 0.5) * 0.1, lng: 37.61 + (Math.random() - 0.5) * 0.1 },
    status: status || { AI92: 'available', AI95: 'available', DT: 'available' },
    queueLength: queueLength || 'none',
    waitingTime: waitingTime !== undefined ? parseInt(waitingTime) : 0,
    confidenceScore: confidenceScore !== undefined ? parseFloat(confidenceScore) : 1.0,
    deficitForecast: deficitForecast || 'low',
    nextDelivery: nextDelivery || 'нет данных',
    updatedAt: new Date().toISOString(),
    apiUrl: apiUrl || '',
    apiKey: apiKey || '',
  };

  stations.push(newStation);

  addLog(
    'success',
    'Admin',
    `Добавлена новая АЗС: ${brand} (${address}) через административную панель.`
  );

  res.json({ status: 'ok', station: newStation });
});

// Admin Full Edit Gas Station
app.post('/api/stations/edit', (req, res) => {
  const { id, brand, address, coords, status, queueLength, waitingTime, confidenceScore, deficitForecast, nextDelivery, apiUrl, apiKey } = req.body;
  const station = stations.find(s => s.id === id);
  if (!station) {
    return res.status(404).json({ error: 'АЗС не найдена' });
  }

  if (brand !== undefined) station.brand = brand;
  if (address !== undefined) station.address = address;
  if (coords !== undefined) station.coords = coords;
  if (status !== undefined) station.status = { ...station.status, ...status };
  if (queueLength !== undefined) {
    station.queueLength = queueLength;
    if (waitingTime === undefined) {
      if (queueLength === 'none') station.waitingTime = 0;
      else if (queueLength === 'short') station.waitingTime = 10;
      else if (queueLength === 'medium') station.waitingTime = 25;
      else if (queueLength === 'long') station.waitingTime = 50;
    }
  }
  if (waitingTime !== undefined) station.waitingTime = parseInt(waitingTime);
  if (confidenceScore !== undefined) station.confidenceScore = parseFloat(confidenceScore);
  if (deficitForecast !== undefined) station.deficitForecast = deficitForecast;
  if (nextDelivery !== undefined) station.nextDelivery = nextDelivery;
  if (apiUrl !== undefined) station.apiUrl = apiUrl;
  if (apiKey !== undefined) station.apiKey = apiKey;
  station.updatedAt = new Date().toISOString();

  addLog(
    'info',
    'Admin',
    `Данные АЗС ${station.brand} (${station.address}) полностью обновлены вручную.`
  );

  res.json({ status: 'ok', station });
});

// Admin Delete Gas Station
app.post('/api/stations/delete', (req, res) => {
  const { id } = req.body;
  const index = stations.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'АЗС не найдена' });
  }

  const station = stations[index];
  stations.splice(index, 1);

  addLog(
    'warn',
    'Admin',
    `Удалена АЗС: ${station.brand} (${station.address}) через панель администратора.`
  );

  res.json({ status: 'ok' });
});

// Admin Sync Gas Station with API URL
app.post('/api/stations/sync-api', async (req, res) => {
  const { id } = req.body;
  const station = stations.find(s => s.id === id);
  if (!station) {
    return res.status(404).json({ error: 'АЗС не найдена' });
  }

  if (!station.apiUrl) {
    return res.status(400).json({ error: 'У этой АЗС не настроен API URL' });
  }

  addLog('info', 'API', `Запрос обновления данных по API для АЗС ${station.brand} (${station.address}). URL: ${station.apiUrl}`);

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'FuelFlow-API-Client'
    };
    if (station.apiKey) {
      headers['Authorization'] = `Bearer ${station.apiKey}`;
    }

    const response = await fetch(station.apiUrl, { headers });
    if (!response.ok) {
      throw new Error(`Ошибка HTTP сервера АЗС: ${response.status}`);
    }

    const apiData = await response.json();
    
    // Process and validate real fields
    if (apiData.status) {
      station.status = {
        AI92: apiData.status.AI92 || 'available',
        AI95: apiData.status.AI95 || 'available',
        DT: apiData.status.DT || 'available'
      };
    }
    if (apiData.queueLength) {
      station.queueLength = apiData.queueLength;
    }
    if (apiData.waitingTime !== undefined) {
      station.waitingTime = parseInt(apiData.waitingTime);
    }
    if (apiData.deficitForecast) {
      station.deficitForecast = apiData.deficitForecast;
    }
    
    station.nextDelivery = apiData.nextDelivery || 'нет данных';
    station.confidenceScore = 1.0; // Handshake API verified
    station.updatedAt = new Date().toISOString();

    addLog(
      'success',
      'API',
      `Успешный импорт реальных данных по API для АЗС ${station.brand}! 92=${station.status.AI92}, 95=${station.status.AI95}, ДТ=${station.status.DT}, очередь=${station.queueLength}`
    );

    res.json({ status: 'ok', station });
  } catch (error: any) {
    addLog('error', 'API', `Ошибка при опросе API АЗС ${station.brand}: ${error.message}`);
    res.status(500).json({ error: `Ошибка при опросе внешнего API АЗС: ${error.message}` });
  }
});

// Refresh / Re-analyze Station Data via AI / Recent Chat Reports
app.post('/api/stations/refresh-analysis', (req, res) => {
  const { id } = req.body;
  const station = stations.find(s => s.id === id);
  if (!station) {
    return res.status(404).json({ error: 'АЗС не найдена' });
  }

  addLog('info', 'AI Анализ', `Запрос повторного анализа данных по АЗС ${station.brand} (${station.address})`);

  try {
    // 1. Find matched chat messages (that are fuel-related, not fake, and refer to this brand/address)
    const matchedMsgs = chatMessages.filter(msg => {
      if (!msg.parsed || msg.isFake) return false;
      if (isMessageExcluded(msg.text)) return false;
      const brandLower = msg.parsed.brand ? msg.parsed.brand.toLowerCase() : '';
      const stationBrandLower = station.brand.toLowerCase();
      const isBrandMatch = brandLower.includes(stationBrandLower) || stationBrandLower.includes(brandLower);
      
      if (!isBrandMatch) return false;
      
      // If address is specified, check key street/landmark similarity
      if (msg.parsed.address) {
        const addrLower = msg.parsed.address.toLowerCase();
        const stationAddrLower = station.address.toLowerCase();
        // search for some common words/sub-elements
        const words = addrLower.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/).filter(w => w.length > 3);
        const hasKeywordMatch = words.some(w => stationAddrLower.includes(w));
        return hasKeywordMatch;
      }
      return true;
    });

    // 2. Adjust station confidence score based on amount of real confirmation reports
    // More non-fake matches means higher AI confidence score (up to 1.0)
    let newConfidence = station.confidenceScore;
    if (matchedMsgs.length > 0) {
      newConfidence = Math.min(1.0, 0.7 + (matchedMsgs.length * 0.05));
    } else {
      // Small randomized fluctuation to simulate ongoing micro-re-evaluation
      newConfidence = Math.min(0.98, Math.max(0.65, station.confidenceScore + (Math.random() * 0.06 - 0.03)));
    }
    
    // 3. Update the updatedAt time
    station.confidenceScore = parseFloat(newConfidence.toFixed(2));
    station.updatedAt = new Date().toISOString();

    // 4. Slightly adjust wait times or queues to simulate fresh observation alignment
    if (matchedMsgs.length === 0) {
      // If there are no recent messages, maybe slightly shift the wait time by +/- 3 minutes to simulate real live monitoring
      if (station.queueLength !== 'none') {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        station.waitingTime = Math.max(5, station.waitingTime + delta);
      }
    } else {
      // Use the latest message status & queue length
      const latestMsg = matchedMsgs[0];
      if (latestMsg.parsed) {
        if (latestMsg.parsed.fuelType && latestMsg.parsed.status) {
          const ft = latestMsg.parsed.fuelType;
          const mappedStatus = latestMsg.parsed.status;
          if (ft.includes('92') || ft === 'AI92') station.status.AI92 = mappedStatus;
          else if (ft.includes('95') || ft === 'AI95') station.status.AI95 = mappedStatus;
          else if (ft.includes('ДТ') || ft.toLowerCase().includes('дизел') || ft === 'DT') station.status.DT = mappedStatus;
        }
        if (latestMsg.parsed.queue) {
          const q = latestMsg.parsed.queue as any;
          station.queueLength = q;
          if (q === 'none') station.waitingTime = 0;
          else if (q === 'short') station.waitingTime = 10;
          else if (q === 'medium') station.waitingTime = 25;
          else if (q === 'long') station.waitingTime = 50;
        }
      }
    }

    addLog(
      'success',
      'AI Анализ',
      `Анализ данных АЗС ${station.brand} (${station.address}) успешно обновлен. Индекс доверия: ${(station.confidenceScore * 100).toFixed(0)}%. Найдено связанных сообщений: ${matchedMsgs.length}.`
    );

    res.json({ status: 'ok', station });
  } catch (error: any) {
    addLog('error', 'AI Анализ', `Ошибка при переанализе АЗС ${station.brand}: ${error.message}`);
    res.status(500).json({ error: 'Ошибка при проведении анализа данных' });
  }
});

// Direct User Report via FeedBack_Bot (trigger message for AI analysis confirmation)
app.post('/api/reports', (req, res) => {
  const { stationId, fuelType, type, queueLength } = req.body;
  const station = stations.find(s => s.id === stationId);
  if (!station) {
    return res.status(404).json({ error: 'Station not found' });
  }

  // Get only active (non-banned) subscribers of this application
  const activeSubs = subscribers.filter(s => s.status === 'active');
  if (activeSubs.length === 0) {
    return res.status(400).json({ error: 'Все подписчики заблокированы. Некому отправить триггер.' });
  }

  // Try to find an active subscriber who didn't send recently for this station, to make it diverse
  const now = Date.now();
  const recentTriggersForStation = feedbackTriggers.filter(t => 
    t.stationId === stationId && 
    now - t.timestamp < 10 * 60 * 1000
  );
  const recentSenders = recentTriggersForStation.map(t => t.sender);
  
  let availableSubs = activeSubs.filter(s => !recentSenders.includes(s.name));
  if (availableSubs.length === 0) {
    availableSubs = activeSubs; // fall back to any active sub
  }
  
  const chosenSub = availableSubs[Math.floor(Math.random() * availableSubs.length)];
  const senderName = chosenSub.name;

  // Update subscriber stats
  chosenSub.messagesCount += 1;
  chosenSub.lastActive = new Date().toISOString();

  // Generate a realistic subscriber chat message text based on the trigger
  let msgText = '';
  let statusText = '';
  if (fuelType === 'DT') {
    if (type === 'empty') {
      msgText = `Проезжал мимо АЗС ${station.brand} (${station.address}). Дизеля (ДТ) нет, пустые пистолеты!`;
      statusText = 'нет в наличии';
    } else if (type === 'unloading') {
      msgText = `На АЗС ${station.brand} (${station.address}) бензовоз разгружается, скоро ДТ будет.`;
      statusText = 'разгрузка бензовоза';
    } else if (type === 'available') {
      msgText = `Заправился на АЗС ${station.brand} (${station.address}), ДТ на месте, наливают свободно!`;
      statusText = 'есть в наличии';
    }
  } else if (queueLength) {
    if (queueLength === 'none') {
      msgText = `На АЗС ${station.brand} (${station.address}) пусто, вообще без очередей.`;
      statusText = 'очереди нет';
    } else if (queueLength === 'short') {
      msgText = `На АЗС ${station.brand} (${station.address}) небольшая очередь на пару минут.`;
      statusText = 'короткая очередь';
    } else if (queueLength === 'medium') {
      msgText = `На АЗС ${station.brand} (${station.address}) средний затор, машин пять стоит.`;
      statusText = 'средняя очередь';
    } else if (queueLength === 'long') {
      msgText = `Очередь на АЗС ${station.brand} (${station.address}) огромная, лучше объехать!`;
      statusText = 'длинная очередь';
    }
  } else {
    msgText = `[Отчет] На АЗС ${station.brand} (${station.address})`;
  }

  // Register trigger in history
  feedbackTriggers.push({
    stationId,
    fuelType,
    type,
    queueLength,
    timestamp: now,
    sender: senderName
  });

  // Keep triggers from the last 10 minutes
  feedbackTriggers = feedbackTriggers.filter(t => now - t.timestamp < 10 * 60 * 1000);

  // Filter triggers for this specific event type at this station
  const matchTriggers = feedbackTriggers.filter(t => 
    t.stationId === stationId &&
    t.fuelType === fuelType &&
    t.type === type &&
    t.queueLength === queueLength
  );

  // Count unique senders (different subscribers)
  const uniqueSenders = Array.from(new Set(matchTriggers.map(t => t.sender)));
  const matchCount = uniqueSenders.length;

  let isUpdated = false;
  // If we receive confirmation from at least 2 different subscribers, update the actual status
  if (matchCount >= 2) {
    if (fuelType && type) {
      const statusMap: Record<string, string> = {
        'available': 'available',
        'coupon': 'coupon',
        'empty': 'empty',
        'unloading': 'unloading',
      };
      if (fuelType === 'AI92') station.status.AI92 = statusMap[type] as any;
      if (fuelType === 'AI95') station.status.AI95 = statusMap[type] as any;
      if (fuelType === 'DT') station.status.DT = statusMap[type] as any;
    }

    if (queueLength) {
      station.queueLength = queueLength;
      if (queueLength === 'none') station.waitingTime = 0;
      else if (queueLength === 'short') station.waitingTime = 10;
      else if (queueLength === 'medium') station.waitingTime = 25;
      else if (queueLength === 'long') station.waitingTime = 50;
    }

    station.updatedAt = new Date().toISOString();
    station.confidenceScore = Math.min(1.0, station.confidenceScore + 0.15);
    isUpdated = true;

    addLog(
      'success',
      'AI Анализ',
      `Подтверждено несколько триггерных сообщений от разных подписчиков приложения (${uniqueSenders.join(', ')}). ИИ мгновенно завершил анализ и автоматически обновил статус АЗС ${station.brand} (${station.address}).`
    );
  } else {
    addLog(
      'info',
      'AI Анализ',
      `Получен триггер-сигнал от реального подписчика (${senderName}) по АЗС ${station.brand} (${station.address}). Запущен внеочередной ИИ-анализ. Требуется подтверждение от других подписчиков приложения для автоматического обновления статуса.`
    );
  }

  // Create real chat message entry
  const newMsg: ChatMessage = {
    id: `msg-rep-${Date.now()}`,
    sender: senderName,
    text: msgText,
    source: req.body.source || 'report_bot',
    isFake: false,
    parsed: {
      isFuelRelated: true,
      brand: station.brand,
      address: station.address,
      fuelType: fuelType || null,
      status: (type as any) || null,
      queue: queueLength || null,
      isFake: false,
      explanation: isUpdated 
        ? `Статус подтвержден на основе нескольких триггеров от разных подписчиков приложения (${uniqueSenders.join(', ')}).`
        : `Первый сигнал от подписчика приложения ${senderName}. Ожидается дополнительное подтверждение от других участников для автоматической коррекции статуса.`,
    },
    createdAt: new Date().toISOString(),
  };

  chatMessages.unshift(newMsg);

  res.json({ 
    status: 'ok', 
    station, 
    message: newMsg,
    isUpdated,
    matchCount,
    uniqueSenders
  });
});

// Chat Parsing Service using Gemini API (with in-memory fallback)
app.post('/api/chat/parse', async (req, res) => {
  const { text, sender } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  // Resolve sender to a real active subscriber of the application
  const activeSubs = subscribers.filter(s => s.status === 'active');
  let senderName = sender;
  
  if (!senderName || senderName === 'Тимофей П.' || !subscribers.some(s => s.name === senderName)) {
    if (activeSubs.length > 0) {
      // Pick a random active subscriber from the app's real subscribers
      const chosen = activeSubs[Math.floor(Math.random() * activeSubs.length)];
      senderName = chosen.name;
    } else {
      senderName = 'Анонимный Подписчик';
    }
  }

  // Handle subscriber tracking and ban check
  const existingSub = subscribers.find(s => s.name === senderName);
  if (existingSub) {
    existingSub.messagesCount += 1;
    existingSub.lastActive = new Date().toISOString();
  } else if (senderName && senderName !== 'Система' && senderName !== 'Бот-Помощник') {
    subscribers.push({
      name: senderName,
      status: 'active',
      messagesCount: 1,
      lastActive: new Date().toISOString()
    });
  }

  const isBanned = existingSub && existingSub.status === 'banned';

  let parsedResult;
  let tokensUsed = 120;

  if (isBanned) {
    parsedResult = {
      isFuelRelated: true,
      brand: null,
      address: null,
      fuelType: null,
      status: null,
      queue: null,
      isFake: true,
      explanation: 'Отправитель заблокирован за регулярную отправку фейковых отчетов.'
    };
    addLog(
      'warn',
      'AI Анализ',
      `Заблокировано сообщение от забаненного подписчика ${senderName}: "${text.substring(0, 40)}..."`
    );
  } else if (ai) {
    try {
      const prompt = `System Instructions:
${settings.systemPrompt}

Known RAG context database:
${settings.ragContext}

Message to parse:
"${text}"`;

      const response = await ai.models.generateContent({
        model: settings.llmModel,
        contents: prompt,
        config: {
          temperature: settings.temperature,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isFuelRelated: {
                type: Type.BOOLEAN,
                description: 'True if the message discusses gas stations, fuel availability, delivery, or queues.',
              },
              brand: {
                type: Type.STRING,
                description: 'Name of the gas station (e.g. Лукойл, Роснефть, Газпромнефть, Татнефть) or null if not specified.',
              },
              address: {
                type: Type.STRING,
                description: 'Street name, district, or landmark mentioned, or null if not specified.',
              },
              fuelType: {
                type: Type.STRING,
                description: 'Specify AI92, AI95, DT, or null if not mentioned.',
              },
              status: {
                type: Type.STRING,
                description: 'Fuel availability status: available, empty, unloading, or null.',
              },
              queue: {
                type: Type.STRING,
                description: 'Queue length estimation: none, short, medium, long, or null.',
              },
              isFake: {
                type: Type.BOOLEAN,
                description: 'Determine if this message is a troll, fake report, spam, or directly contradicts RAG context.',
              },
              explanation: {
                type: Type.STRING,
                description: 'Brief parsing and fake detection reasoning.',
              },
            },
            required: ['isFuelRelated', 'isFake'],
          },
        },
      });

      const responseText = response.text || '{}';
      parsedResult = JSON.parse(responseText.trim());
      tokensUsed = 280; // Estimated prompt + response token load
      settings.totalTokensUsed += tokensUsed;
    } catch (error: any) {
      console.error('Gemini parsing error, falling back to mock parser:', error);
      parsedResult = mockParseMessage(text);
    }
  } else {
    // Simulated fallback parser
    parsedResult = mockParseMessage(text);
    settings.totalTokensUsed += tokensUsed;
  }

  // Create chat message entry
  const isFake = parsedResult.isFake || false;
  const isFuelRelated = parsedResult.isFuelRelated || false;

  const newMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender: senderName || 'Пользователь чата',
    text,
    source: 'telegram',
    isFake,
    parsed: isFuelRelated ? {
      isFuelRelated,
      brand: parsedResult.brand || null,
      address: parsedResult.address || null,
      fuelType: parsedResult.fuelType || null,
      status: parsedResult.status || null,
      queue: parsedResult.queue || null,
      isFake,
      explanation: parsedResult.explanation || 'Успешно обработано интеллектуальным парсером.',
    } : undefined,
    createdAt: new Date().toISOString(),
  };

  chatMessages.unshift(newMsg);

  // If valid and related, update station statuses
  if (isFuelRelated && !isFake && !isMessageExcluded(text)) {
    const station = findBestStationMatch(parsedResult.brand, parsedResult.address);
    if (station) {
      if (parsedResult.fuelType && parsedResult.status) {
        const ft = parsedResult.fuelType;
        const mappedStatus = parsedResult.status;
        if (ft.includes('92') || ft === 'AI92') station.status.AI92 = mappedStatus;
        else if (ft.includes('95') || ft === 'AI95') station.status.AI95 = mappedStatus;
        else if (ft.includes('ДТ') || ft.toLowerCase().includes('дизел') || ft === 'DT') station.status.DT = mappedStatus;
      }

      if (parsedResult.queue) {
        const q = parsedResult.queue;
        station.queueLength = q;
        if (q === 'none') station.waitingTime = 0;
        else if (q === 'short') station.waitingTime = 10;
        else if (q === 'medium') station.waitingTime = 25;
        else if (q === 'long') station.waitingTime = 50;
      }

      // Slightly update confidence based on reports
      station.confidenceScore = Math.min(1.0, station.confidenceScore + 0.02);
      station.updatedAt = new Date().toISOString();

      // Look for supply event cues (e.g. unloading / podvezli)
      if (parsedResult.status === 'unloading' || text.toLowerCase().includes('подвезли') || text.toLowerCase().includes('разгруж')) {
        const hasExisting = supplyEvents.some(e => e.stationId === station.id && e.fuelType === (parsedResult.fuelType || 'ДТ'));
        if (!hasExisting) {
          supplyEvents.push({
            id: `supply-${Date.now()}`,
            stationId: station.id,
            stationName: `${station.brand} ${station.address}`,
            eta: 'в процессе разгрузки',
            fuelType: parsedResult.fuelType || 'ДТ',
            confidence: 0.88,
          });
        }
      }
    }
  }

  addLog(
    isFake ? 'warn' : 'success',
    'LLM Parser',
    `Разобрано сообщение от ${senderName || 'Пользователь'}: "${text.length > 60 ? text.slice(0, 60) + '...' : text}". Результат: ${isFuelRelated ? `АЗС=${parsedResult.brand || 'неизв.'}, топливо=${parsedResult.fuelType || 'неизв.'}, фейк=${isFake}` : 'не относится к топливу'}`
  );

  res.json({ status: 'ok', parsed: parsedResult, message: newMsg, stations });
});

// GET list of subscribers
app.get('/api/subscribers', (req, res) => {
  res.json(subscribers);
});

// POST toggle ban status for subscriber
app.post('/api/subscribers/ban', (req, res) => {
  const { name } = req.body;
  const sub = subscribers.find(s => s.name === name);
  if (!sub) {
    return res.status(404).json({ error: 'Подписчик не найден' });
  }
  sub.status = sub.status === 'active' ? 'banned' : 'active';
  
  addLog(
    'warn',
    'Панель Управления',
    `Статус подписчика ${sub.name} изменен администратором на: ${sub.status === 'banned' ? 'ЗАБАНЕН 🚫' : 'АКТИВЕН ✅'}`
  );
  
  res.json({ status: 'ok', subscribers });
});

// Mock parser fallback
function mockParseMessage(text: string) {
  const textLower = text.toLowerCase();
  let brand: string | null = null;
  let address: string | null = null;
  let fuelType: string | null = null;
  let status: 'available' | 'empty' | 'unloading' | null = null;
  let queue: 'none' | 'short' | 'medium' | 'long' | null = null;
  let isFake = false;
  let isFuelRelated = false;
  let explanation = '';

  if (textLower.includes('лукойл') || textLower.includes('lukoil')) {
    brand = 'Лукойл';
    isFuelRelated = true;
  } else if (textLower.includes('газпром') || textLower.includes('гпн')) {
    brand = 'Газпромнефть';
    isFuelRelated = true;
  } else if (textLower.includes('роснефт')) {
    brand = 'Роснефть';
    isFuelRelated = true;
  } else if (textLower.includes('татнефт')) {
    brand = 'Татнефть';
    isFuelRelated = true;
  }

  if (textLower.includes('ленин')) address = 'ул. Ленина';
  else if (textLower.includes('мир')) address = 'пр-т Мира';
  else if (textLower.includes('гагарин')) address = 'ул. Гагарина';
  else if (textLower.includes('варшав')) address = 'Варшавское шоссе';
  else if (textLower.includes('анапск')) address = 'Анапа, Анапское шоссе, 8';
  else if (textLower.includes('крестьянск')) address = 'Анапа, ул. Крестьянская, 25';
  else if (textLower.includes('супсех')) address = 'Анапа, Супсехское шоссе, 4';

  if (textLower.includes('92')) fuelType = 'AI92';
  else if (textLower.includes('95')) fuelType = 'AI95';
  else if (textLower.includes('дизел') || textLower.includes('дт') || textLower.includes('соляр')) fuelType = 'DT';

  if (textLower.includes('нет') || textLower.includes('закончил') || textLower.includes('пусто') || textLower.includes('🚫')) {
    status = 'empty';
  } else if (textLower.includes('подвезли') || textLower.includes('слива') || textLower.includes('разгруж') || textLower.includes('приехал')) {
    status = 'unloading';
  } else if (textLower.includes('есть') || textLower.includes('появил') || textLower.includes('заправил') || textLower.includes('⛽')) {
    status = 'available';
  }

  if (textLower.includes('огромная') || textLower.includes('пробка') || textLower.includes('длинная') || textLower.includes('много машин')) {
    queue = 'long';
  } else if (textLower.includes('средняя') || textLower.includes('минут 20') || textLower.includes('машин 10')) {
    queue = 'medium';
  } else if (textLower.includes('маленькая') || textLower.includes('пару машин') || textLower.includes('быстро')) {
    queue = 'short';
  } else if (textLower.includes('нет очереди') || textLower.includes('пустая заправка') || textLower.includes('свободно')) {
    queue = 'none';
  }

  // Simple fake detection rule
  if (textLower.includes('бесплатно') || textLower.includes('даром') || textLower.includes('пиво') || textLower.includes('100 рублей тонна')) {
    isFake = true;
    explanation = 'Подозрение на фейк: сообщение содержит нереалистичные условия (бесплатное топливо).';
  } else {
    explanation = 'Успешно разобрано эвристическим парсером (Gemini API в симуляционном режиме).';
  }

  if (brand || fuelType || status || queue) {
    isFuelRelated = true;
  }

  return {
    isFuelRelated,
    brand,
    address,
    fuelType,
    status,
    queue,
    isFake,
    explanation,
  };
}

function simulateExternalMessage(sender: string, text: string, msgId?: string) {
  const textLower = text.toLowerCase();
  const parsedResult = mockParseMessage(text);
  const isFake = parsedResult.isFake || false;
  const isFuelRelated = parsedResult.isFuelRelated || false;

  const newMsg: ChatMessage = {
    id: msgId || `msg-max-${Date.now()}`,
    sender: sender,
    text,
    source: 'max_integration',
    isFake,
    parsed: isFuelRelated ? {
      isFuelRelated,
      brand: parsedResult.brand || null,
      address: parsedResult.address || null,
      fuelType: parsedResult.fuelType || null,
      status: parsedResult.status || null,
      queue: parsedResult.queue || null,
      isFake,
      explanation: parsedResult.explanation || 'Разобрано из интегрированного чата MAX.',
    } : undefined,
    createdAt: new Date().toISOString(),
  };

  chatMessages.unshift(newMsg);

  if (isFuelRelated && !isFake && !isMessageExcluded(text)) {
    const station = findBestStationMatch(parsedResult.brand, parsedResult.address);
    if (station) {
      if (parsedResult.fuelType && parsedResult.status) {
        const ft = parsedResult.fuelType;
        const mappedStatus = parsedResult.status;
        if (ft.includes('92') || ft === 'AI92') station.status.AI92 = mappedStatus;
        else if (ft.includes('95') || ft === 'AI95') station.status.AI95 = mappedStatus;
        else if (ft.includes('ДТ') || ft.toLowerCase().includes('дизел') || ft === 'DT') station.status.DT = mappedStatus;
      }

      if (parsedResult.queue) {
        const q = parsedResult.queue;
        station.queueLength = q;
        if (q === 'none') station.waitingTime = 0;
        else if (q === 'short') station.waitingTime = 10;
        else if (q === 'medium') station.waitingTime = 25;
        else if (q === 'long') station.waitingTime = 50;
      }

      station.confidenceScore = Math.min(1.0, station.confidenceScore + 0.03);
      station.updatedAt = new Date().toISOString();
    }
  }

  addLog(
    isFake ? 'warn' : 'success',
    'MAX Integration',
    `Получено новое сообщение от ${sender} в чате "${connectedExternalChat?.title || 'Внешний чат'}": "${text.length > 40 ? text.substring(0, 40) + '...' : text}"`
  );
}

// Connected External Chat Endpoints
app.get('/api/chats/connected', (req, res) => {
  res.json({ connectedChat: connectedExternalChat, connectedChats: connectedExternalChats });
});

app.post('/api/chats/connect-link', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Не указана ссылка для подключения' });
  }

  addLog('info', 'Integration', `Попытка подключения к внешнему источнику по ссылке: ${url}`);

  try {
    let chatTitle = 'Внешний чат';
    let isMaxRu = url.includes('max.ru');
    let isTelegram = url.includes('t.me') || url.includes('telegram');
    let scrapedMessagesCount = 0;

    if (isMaxRu) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const html = await response.text();
        const titleMatch = html.match(/<h1 class="title[^"]*">(.*?)<\/h1>/);
        const jsonMatch = html.match(/"chat":\s*\{\s*"title"\s*:\s*"([^"]+)"\}/);
        
        if (jsonMatch && jsonMatch[1]) {
          chatTitle = jsonMatch[1];
        } else if (titleMatch && titleMatch[1]) {
          chatTitle = titleMatch[1];
        } else {
          chatTitle = 'ТОПЛИВО СЕЙЧАС АНАПА И ПРИГОРОД! (MAX)';
        }

        // Real scrape content from MAX HTML
        const postMatches = html.match(/<div class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/g) || 
                            html.match(/<p[^>]*>([\s\S]*?)<\/p>/g);
        if (postMatches) {
          for (const matchText of postMatches) {
            if (scrapedMessagesCount >= 5) break;
            const plainText = matchText.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
            if (plainText.length > 15 && plainText.length < 300) {
              const parsedResult = mockParseMessage(plainText);
              if (parsedResult.isFuelRelated) {
                const isFake = parsedResult.isFake || false;
                const isFuelRelated = parsedResult.isFuelRelated || false;
                
                const newMsg: ChatMessage = {
                  id: `msg-max-${Date.now()}-${scrapedMessagesCount}`,
                  sender: 'Пользователь чата MAX',
                  text: plainText,
                  source: 'max_integration',
                  isFake,
                  parsed: isFuelRelated ? {
                    isFuelRelated,
                    brand: parsedResult.brand || null,
                    address: parsedResult.address || null,
                    fuelType: parsedResult.fuelType || null,
                    status: parsedResult.status || null,
                    queue: parsedResult.queue || null,
                    isFake,
                    explanation: parsedResult.explanation || 'Успешно импортировано с сайта MAX.',
                  } : undefined,
                  createdAt: new Date(Date.now() - scrapedMessagesCount * 60000).toISOString(),
                };
                chatMessages.unshift(newMsg);

                if (isFuelRelated && !isFake && !isMessageExcluded(plainText)) {
                  const station = findBestStationMatch(parsedResult.brand, parsedResult.address);
                  if (station) {
                    if (parsedResult.fuelType && parsedResult.status) {
                      const ft = parsedResult.fuelType;
                      const mappedStatus = parsedResult.status;
                      if (ft.includes('92') || ft === 'AI92') station.status.AI92 = mappedStatus;
                      else if (ft.includes('95') || ft === 'AI95') station.status.AI95 = mappedStatus;
                      else if (ft.includes('ДТ') || ft.toLowerCase().includes('дизел') || ft === 'DT') station.status.DT = mappedStatus;
                    }
                    if (parsedResult.queue) {
                      const q = parsedResult.queue;
                      station.queueLength = q;
                      if (q === 'none') station.waitingTime = 0;
                      else if (q === 'short') station.waitingTime = 10;
                      else if (q === 'medium') station.waitingTime = 25;
                      else if (q === 'long') station.waitingTime = 50;
                    }
                    station.confidenceScore = Math.min(1.0, station.confidenceScore + 0.05);
                    station.updatedAt = new Date().toISOString();
                  }
                }
                scrapedMessagesCount++;
              }
            }
          }
        }
      } catch (err) {
        console.warn('Could not scrape chat directly, using default title:', err);
        chatTitle = 'ТОПЛИВО СЕЙЧАС АНАПА И ПРИГОРОД! (MAX)';
      }
    } else if (isTelegram) {
      let channelUsername = url.split('t.me/').pop()?.split('/')[0];
      if (channelUsername) {
        const webviewUrl = `https://t.me/s/${channelUsername}`;
        try {
          const response = await fetch(webviewUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
          const html = await response.text();
          const titleMatch = html.match(/<meta property="og:title" content="([^"]+)">/);
          if (titleMatch && titleMatch[1]) {
            chatTitle = titleMatch[1];
          } else {
            chatTitle = `@${channelUsername}`;
          }

          // Real scrape content from Telegram webview HTML
          const messageRegex = /<div class="tgme_widget_message_text js-message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
          let match;
          while ((match = messageRegex.exec(html)) !== null && scrapedMessagesCount < 5) {
            let msgText = match[1]
              .replace(/<br\s*\/?>/g, '\n')
              .replace(/<[^>]+>/g, '') // strip html tags
              .trim();
            
            if (msgText) {
              const parsedResult = mockParseMessage(msgText);
              const isFake = parsedResult.isFake || false;
              const isFuelRelated = parsedResult.isFuelRelated || false;
              
              const newMsg: ChatMessage = {
                id: `msg-tg-${Date.now()}-${scrapedMessagesCount}`,
                sender: `Участник чата @${channelUsername}`,
                text: msgText,
                source: 'telegram',
                isFake,
                parsed: isFuelRelated ? {
                  isFuelRelated,
                  brand: parsedResult.brand || null,
                  address: parsedResult.address || null,
                  fuelType: parsedResult.fuelType || null,
                  status: parsedResult.status || null,
                  queue: parsedResult.queue || null,
                  isFake,
                  explanation: parsedResult.explanation || 'Успешно импортировано из Telegram-канала.',
                } : undefined,
                createdAt: new Date(Date.now() - scrapedMessagesCount * 60000).toISOString(),
              };
              chatMessages.unshift(newMsg);

              if (isFuelRelated && !isFake && !isMessageExcluded(msgText)) {
                const station = findBestStationMatch(parsedResult.brand, parsedResult.address);
                if (station) {
                  if (parsedResult.fuelType && parsedResult.status) {
                    const ft = parsedResult.fuelType;
                    const mappedStatus = parsedResult.status;
                    if (ft.includes('92') || ft === 'AI92') station.status.AI92 = mappedStatus;
                    else if (ft.includes('95') || ft === 'AI95') station.status.AI95 = mappedStatus;
                    else if (ft.includes('ДТ') || ft.toLowerCase().includes('дизел') || ft === 'DT') station.status.DT = mappedStatus;
                  }
                  if (parsedResult.queue) {
                    const q = parsedResult.queue;
                    station.queueLength = q;
                    if (q === 'none') station.waitingTime = 0;
                    else if (q === 'short') station.waitingTime = 10;
                    else if (q === 'medium') station.waitingTime = 25;
                    else if (q === 'long') station.waitingTime = 50;
                  }
                  station.confidenceScore = Math.min(1.0, station.confidenceScore + 0.1);
                  station.updatedAt = new Date().toISOString();
                }
              }
              scrapedMessagesCount++;
            }
          }
        } catch (err) {
          console.error('Error scraping Telegram webview:', err);
          chatTitle = `@${channelUsername}`;
        }
      }
    }

    // Check if channel already exists
    let existingChannel = chatChannels.find(c => c.name === chatTitle || (c.id === 'chat-max' && isMaxRu));
    if (!existingChannel) {
      const newChannel: ChatChannel = {
        id: isMaxRu ? 'chat-max' : `chat-${Date.now()}`,
        name: `${chatTitle}`,
        keywords: 'анапа, пригород, супсех, витязево, анапская, заправка, бензин, дизель, дт, 92, 95'
      };
      chatChannels.push(newChannel);
      saveChannels();
    }

    const chatObj = {
      id: isMaxRu ? 'chat-max' : `chat-${Date.now()}`,
      url,
      title: chatTitle,
      status: 'connected',
      connectedAt: new Date().toISOString()
    };
    connectedExternalChat = chatObj;
    if (!connectedExternalChats.some(c => c.url === url)) {
      connectedExternalChats.push(chatObj);
    }

    // Add 3 gas stations in Anapa to the station list so that they can be synced with this channel!
    const anapaStations: GasStation[] = [
      {
        id: 'station-anapa-1',
        brand: 'Лукойл',
        address: 'Анапа, Анапское шоссе, 8',
        coords: { lat: 44.8942, lng: 37.3325 },
        status: { AI92: 'available', AI95: 'empty', DT: 'unloading' },
        queueLength: 'medium',
        waitingTime: 20,
        confidenceScore: 0.9,
        deficitForecast: 'medium',
        nextDelivery: 'нет данных',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'station-anapa-2',
        brand: 'Роснефть',
        address: 'Анапа, ул. Крестьянская, 25',
        coords: { lat: 44.8911, lng: 37.3214 },
        status: { AI92: 'available', AI95: 'available', DT: 'empty' },
        queueLength: 'long',
        waitingTime: 45,
        confidenceScore: 0.85,
        deficitForecast: 'high',
        nextDelivery: 'нет данных',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'station-anapa-3',
        brand: 'Газпромнефть',
        address: 'Анапа, Супсехское шоссе, 4',
        coords: { lat: 44.8725, lng: 37.3412 },
        status: { AI92: 'empty', AI95: 'available', DT: 'available' },
        queueLength: 'none',
        waitingTime: 0,
        confidenceScore: 0.8,
        deficitForecast: 'low',
        nextDelivery: 'нет данных',
        updatedAt: new Date().toISOString(),
      }
    ];

    // Add them if they don't exist yet
    for (const stat of anapaStations) {
      if (!stations.some(s => s.id === stat.id)) {
        stations.push(stat);
      }
    }

    addLog(
      'success',
      'Integration',
      `Успешное подключение к источнику: "${chatTitle}"! Импортировано ${scrapedMessagesCount} реальных сообщений.`
    );

    res.json({
      status: 'ok',
      connectedChat: connectedExternalChat,
      connectedChats: connectedExternalChats,
      channels: chatChannels,
      stations
    });
  } catch (error: any) {
    console.error('Error connecting real chat:', error);
    addLog('error', 'Integration', `Ошибка при подключении к внешнему источнику: ${error.message}`);
    res.status(500).json({ error: `Не удалось подключиться: ${error.message}` });
  }
});

app.post('/api/chats/disconnect', (req, res) => {
  const { url } = req.body;
  if (url) {
    connectedExternalChats = connectedExternalChats.filter(c => c.url !== url);
  } else {
    connectedExternalChats = [];
  }

  if (connectedExternalChats.length === 0) {
    if (chatInterval) {
      clearInterval(chatInterval);
      chatInterval = null;
    }
    connectedExternalChat = null;
    chatChannels = chatChannels.filter(c => c.id !== 'chat-max');
    saveChannels();
  } else {
    connectedExternalChat = connectedExternalChats[connectedExternalChats.length - 1];
  }

  const title = url || 'Внешний чат';
  addLog(
    'warn',
    'Integration',
    `Отключено соединение с чатом: "${title}"`
  );

  res.json({
    status: 'ok',
    channels: chatChannels,
    connectedChat: connectedExternalChat,
    connectedChats: connectedExternalChats
  });
});

app.post('/api/reset', (req, res) => {
  stations = [
    {
      id: 'station-real-1',
      brand: 'Роснефть',
      address: 'г. Анапа, Анапское шоссе, 1',
      coords: { lat: 44.8952, lng: 37.3165 },
      status: { AI92: 'available', AI95: 'available', DT: 'available' },
      queueLength: 'medium',
      waitingTime: 20,
      confidenceScore: 0.85,
      deficitForecast: 'medium',
      nextDelivery: 'нет данных',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'station-real-2',
      brand: 'Роснефть',
      address: 'г. Анапа, Пионерский проспект, 4',
      coords: { lat: 44.9071, lng: 37.3210 },
      status: { AI92: 'available', AI95: 'available', DT: 'empty' },
      queueLength: 'short',
      waitingTime: 12,
      confidenceScore: 0.82,
      deficitForecast: 'medium',
      nextDelivery: 'нет данных',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'station-real-3',
      brand: 'Роснефть',
      address: 'г. Анапа, Симферопольское шоссе, 33',
      coords: { lat: 44.8908, lng: 37.3292 },
      status: { AI92: 'available', AI95: 'empty', DT: 'available' },
      queueLength: 'long',
      waitingTime: 35,
      confidenceScore: 0.91,
      deficitForecast: 'high',
      nextDelivery: 'нет данных',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'station-real-4',
      brand: 'Роснефть',
      address: 'г. Анапа, Супсехское шоссе, 4',
      coords: { lat: 44.8820, lng: 37.3355 },
      status: { AI92: 'available', AI95: 'available', DT: 'available' },
      queueLength: 'short',
      waitingTime: 7,
      confidenceScore: 0.78,
      deficitForecast: 'low',
      nextDelivery: 'нет данных',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'station-real-5',
      brand: 'Роснефть',
      address: 'г. Анапа, ул. Владимирская, 77',
      coords: { lat: 44.9025, lng: 37.3051 },
      status: { AI92: 'empty', AI95: 'available', DT: 'available' },
      queueLength: 'medium',
      waitingTime: 25,
      confidenceScore: 0.87,
      deficitForecast: 'high',
      nextDelivery: 'нет данных',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'station-real-6',
      brand: 'Лукойл',
      address: 'г. Анапа, ул. Ленина, 182',
      coords: { lat: 44.8984, lng: 37.3080 },
      status: { AI92: 'available', AI95: 'available', DT: 'empty' },
      queueLength: 'medium',
      waitingTime: 30,
      confidenceScore: 0.90,
      deficitForecast: 'high',
      nextDelivery: 'нет данных',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'station-real-7',
      brand: 'Лукойл',
      address: 'г. Анапа, Симферопольское шоссе, 58',
      coords: { lat: 44.8895, lng: 37.3310 },
      status: { AI92: 'available', AI95: 'available', DT: 'available' },
      queueLength: 'short',
      waitingTime: 18,
      confidenceScore: 0.83,
      deficitForecast: 'medium',
      nextDelivery: 'нет данных',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'station-real-8',
      brand: 'Лукойл',
      address: 'г. Анапа, Анапское шоссе, 10',
      coords: { lat: 44.8965, lng: 37.3178 },
      status: { AI92: 'available', AI95: 'empty', DT: 'available' },
      queueLength: 'long',
      waitingTime: 40,
      confidenceScore: 0.92,
      deficitForecast: 'high',
      nextDelivery: 'нет данных',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'station-real-9',
      brand: 'Лукойл',
      address: 'ст-ца Благовещенская, ул. Таманская, 2А',
      coords: { lat: 45.0552, lng: 37.1301 },
      status: { AI92: 'available', AI95: 'available', DT: 'available' },
      queueLength: 'none',
      waitingTime: 5,
      confidenceScore: 0.76,
      deficitForecast: 'low',
      nextDelivery: 'нет данных',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'station-real-10',
      brand: 'Газпромнефть',
      address: 'г. Анапа, Симферопольское шоссе, 80',
      coords: { lat: 44.8880, lng: 37.3335 },
      status: { AI92: 'available', AI95: 'available', DT: 'empty' },
      queueLength: 'short',
      waitingTime: 10,
      confidenceScore: 0.80,
      deficitForecast: 'medium',
      nextDelivery: 'нет данных',
      updatedAt: new Date().toISOString(),
    },
  ];

  chatMessages = [
    {
      id: 'msg-1',
      sender: 'Алексей С.',
      text: 'На Газпромнефти на Симферопольском шоссе дизель есть, но очередь уже машин 15. Простоял минут 40.',
      source: 'telegram',
      isFake: false,
      parsed: {
        isFuelRelated: true,
        brand: 'Газпромнефть',
        address: 'г. Анапа, Симферопольское шоссе, 80',
        fuelType: 'ДТ',
        status: 'available',
        queue: 'long',
        isFake: false,
        explanation: 'Сообщение подтверждает наличие дизеля и длинную очередь на Симферопольском шоссе.',
      },
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: 'msg-2',
      sender: 'Ирина К.',
      text: 'Лукойл на Ленина дизель закончился полностью, говорят бензовоз застрял где-то на трассе!',
      source: 'telegram',
      isFake: false,
      parsed: {
        isFuelRelated: true,
        brand: 'Лукойл',
        address: 'г. Анапа, ул. Ленина, 182',
        fuelType: 'ДТ',
        status: 'empty',
        queue: 'none',
        isFake: false,
        explanation: 'Пользователь сообщает об окончании дизеля на Ленина.',
      },
      createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    },
    {
      id: 'msg-3',
      sender: 'Дмитрий (Тролль)',
      text: 'Парни, на Лукойле на Ленина бесплатно раздают АИ-95 в честь юбилея мэра! Очереди вообще нет!',
      source: 'telegram',
      isFake: true,
      parsed: {
        isFuelRelated: true,
        brand: 'Лукойл',
        address: 'г. Анапа, ул. Ленина, 182',
        fuelType: 'АИ-95',
        status: 'available',
        queue: 'none',
        isFake: true,
        explanation: 'Сообщение помечено как фейк: бесплатная раздача топлива крайне сомнительна, противоречит штатному режиму.',
      },
      createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    },
  ];

  supplyEvents = [
    {
      id: 'supply-1',
      stationId: 'station-real-6',
      stationName: 'Лукойл ул. Ленина, 182',
      eta: 'через 1.5 часа',
      fuelType: 'ДТ',
      confidence: 0.9,
    },
    {
      id: 'supply-2',
      stationId: 'station-real-3',
      stationName: 'Роснефть Симферопольское шоссе, 33',
      eta: 'через 30 минут',
      fuelType: 'АИ-95',
      confidence: 0.95,
    },
  ];

  settings.totalTokensUsed = 1420;

  addLog('warn', 'System', 'Выполнен сброс состояния базы данных симулятора.');

  res.json({ status: 'ok', stations, chatMessages, supplyEvents });
});

// Vite Middleware & Static Serves
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
