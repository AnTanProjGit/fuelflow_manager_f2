export interface FuelStatus {
  AI92: 'available' | 'empty' | 'unloading' | 'unknown' | 'coupon';
  AI95: 'available' | 'empty' | 'unloading' | 'unknown' | 'coupon';
  DT: 'available' | 'empty' | 'unloading' | 'unknown' | 'coupon';
}

export interface GasStation {
  id: string;
  brand: string;
  address: string;
  coords: { lat: number; lng: number };
  status: FuelStatus;
  queueLength: 'none' | 'short' | 'medium' | 'long';
  waitingTime: number; // in minutes
  confidenceScore: number; // 0 to 1
  deficitForecast: 'low' | 'medium' | 'high';
  nextDelivery: string; // e.g. "через 2 часа", "нет данных"
  updatedAt: string;
  apiUrl?: string; // API URL для интеграции данных АЗС
  apiKey?: string; // API Ключ для интеграции данных АЗС
}

export interface ChatChannel {
  id: string;
  name: string;
  keywords: string; // comma separated keywords
  excludeFromAnalysis?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  parsed?: {
    isFuelRelated: boolean;
    brand: string | null;
    address: string | null;
    fuelType: string | null;
    status: 'available' | 'empty' | 'unloading' | null;
    queue: 'none' | 'short' | 'medium' | 'long' | null;
    isFake: boolean;
    explanation: string;
  };
  source: 'telegram' | 'report_app' | 'report_bot' | 'max_integration';
  isFake: boolean;
  createdAt: string;
}

export interface SupplyEvent {
  id: string;
  stationId: string;
  stationName: string;
  eta: string;
  fuelType: string;
  confidence: number;
}

export interface Subscriber {
  name: string;
  status: 'active' | 'banned';
  messagesCount: number;
  lastActive: string;
}

export interface SystemSettings {
  llmModel: string;
  systemPrompt: string;
  ragContext: string;
  temperature: number;
  totalTokensUsed: number;
  apiUrl?: string;
  llmApiKey?: string;
  proxyType?: 'direct' | 'cloudflare' | 'custom' | 'vpn';
  proxyAddress?: string;
  recommendationApiUrl?: string; // URL для внешних рекомендаций (например, trycloudflare)
}
