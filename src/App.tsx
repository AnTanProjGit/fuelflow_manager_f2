import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Bot,
  Database,
  Fuel,
  MapPin,
  MessageSquare,
  Send,
  Settings,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sliders,
  Terminal,
  Code,
  Clock,
  ArrowRight,
  ExternalLink,
  FileCode,
  User,
  Check,
  Copy,
  Search,
  Filter,
  Plus,
  X,
  Gauge,
  TrendingUp,
  Sparkles,
  Layers,
  Activity,
  Megaphone,
  Info,
  ChevronDown,
  ChevronUp,
  Link2,
  Mic,
  MicOff,
  Eye,
  EyeOff,
  Globe,
  Coins,
  CreditCard,
  Lock,
  KeyRound,
  Mail,
  Upload
} from 'lucide-react';
import { GasStation, ChatMessage, SystemSettings, SupplyEvent, ChatChannel, Subscriber } from './types.js';

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator' | 'admin' | 'logs' | 'architecture' | 'backend' | 'auth'>('dashboard');
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  // User Auth States
  const [currentUser, setCurrentUser] = useState<{ email: string; role: 'user' | 'admin'; name?: string } | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  // Ad placement & calculator states
  const [showAdForm, setShowAdForm] = useState(false);
  const [adPlacementZone, setAdPlacementZone] = useState<'zone1' | 'zone2'>('zone1');
  const [adDays, setAdDays] = useState<number>(7);
  const [adPromoCode, setAdPromoCode] = useState('');
  const [adCompanyName, setAdCompanyName] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('https://images.unsplash.com/photo-1610492103153-7a50687654f5?q=80&w=300&auto=format&fit=crop');
  const [adSubmitted, setAdSubmitted] = useState(false);
  const [adEmail, setAdEmail] = useState('');

  useEffect(() => {
    if (currentUser?.email && !adEmail) {
      setAdEmail(currentUser.email);
    }
  }, [currentUser]);

  // Backend Data States
  const [stations, setStations] = useState<GasStation[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    llmModel: 'gemini-3.5-flash',
    systemPrompt: '',
    ragContext: '',
    temperature: 0.1,
    totalTokensUsed: 0,
    apiUrl: '',
    recommendationApiUrl: '',
  });

  // External Cloudflare recommendations
  const [externalRecommendation, setExternalRecommendation] = useState<any | null>(null);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [isFetchingRecommendations, setIsFetchingRecommendations] = useState<boolean>(false);

  // UI loading/action states
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshingStationId, setRefreshingStationId] = useState<string | null>(null);
  const [isRefreshingChats, setIsRefreshingChats] = useState(false);
  const [botInput, setBotInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [botUser, setBotUser] = useState('Тимофей П.');
  const [botSelectedStation, setBotSelectedStation] = useState('');
  const [backendCode, setBackendCode] = useState<Record<string, string>>({});
  const [activeCodeTab, setActiveCodeTab] = useState<string>('main');
  const [copyStatus, setCopyStatus] = useState<string>('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [showLlmApiKey, setShowLlmApiKey] = useState<boolean>(false);

  // Report Modal / Quick Actions State
  const [selectedStationForReport, setSelectedStationForReport] = useState<GasStation | null>(null);
  const [reportFuel, setReportFuel] = useState<'AI92' | 'AI95' | 'DT'>('DT');
  const [reportStatus, setReportStatus] = useState<'available' | 'empty' | 'unloading' | 'coupon'>('empty');
  const [reportQueue, setReportQueue] = useState<'none' | 'short' | 'medium' | 'long'>('medium');

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [feedbackSelectedFuel, setFeedbackSelectedFuel] = useState<'AI92' | 'AI95' | 'DT'>('DT');
  const [stationFilter, setStationFilter] = useState<'all' | 'deficit' | 'queues'>('all');

  // Admin override editing states
  const [editingStation, setEditingStation] = useState<GasStation | null>(null);

  // Admin dynamic tab states
  const [adminSubTab, setAdminSubTab] = useState<'ai' | 'stations' | 'chats' | 'subscribers' | 'ads'>('stations');

  // Ad Management & Monetization States
  const [carouselInterval, setCarouselInterval] = useState<number>(5);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [carouselInterval2, setCarouselInterval2] = useState<number>(5);
  const [autoRotate2, setAutoRotate2] = useState<boolean>(true);
  const [currentIdx1, setCurrentIdx1] = useState<number>(0);
  const [currentIdx2, setCurrentIdx2] = useState<number>(0);

  const [banners1, setBanners1] = useState([
    {
      id: 'b1-1',
      title: 'Спецпредложение от Роснефть-Бизнес',
      description: 'Оформление топливных карт со скидкой до 10% на всех АЗС сети. Персональный менеджер и отсрочка платежа.',
      imageUrl: '/src/assets/images/fuel_partner_promo_1783929145672.jpg',
      targetUrl: 'https://rosneft-business.ru',
      isActive: true,
      clicks: 1240,
      views: 45200,
    },
    {
      id: 'b1-2',
      title: 'ГЛОНАСС Omnicomm — Контроль топлива',
      description: 'Скидка 15% на датчики уровня топлива и терминалы мониторинга транспорта. Снижение расходов на ГСМ до 30%.',
      imageUrl: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=300&auto=format&fit=crop',
      targetUrl: 'https://omnicomm.ru',
      isActive: true,
      clicks: 980,
      views: 31200,
    },
    {
      id: 'b1-3',
      title: 'Оптовые поставки топлива ЮФО',
      description: 'Бензин и дизель напрямую со складов Роснефть и Лукойл. Доставка собственными бензовозами от 5 тонн за 24 часа.',
      imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=300&auto=format&fit=crop',
      targetUrl: 'https://south-fuel.ru',
      isActive: true,
      clicks: 650,
      views: 28400,
    }
  ]);

  const [banners2, setBanners2] = useState([
    {
      id: 'b2-1',
      title: 'Спецпредложения для участников FuelFlow',
      description: 'Оформление карт «Роснефть-Бизнес» • ГЛОНАСС Omnicomm (скидка 15%) • Оптовые поставки топлива по ЮФО.',
      imageUrl: '/src/assets/images/fuel_partner_promo_1783929145672.jpg',
      targetUrl: 'https://rosneft-business.ru',
      isActive: true,
      clicks: 850,
      views: 19800,
    },
    {
      id: 'b2-2',
      title: 'Реклама Вашего бизнеса в FuelFlow',
      description: 'Размещение баннеров в приложении: охват более 10 000 водителей и диспетчеров Юга России ежедневно.',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300&auto=format&fit=crop',
      targetUrl: 'https://fuelflow.ru/ads',
      isActive: true,
      clicks: 420,
      views: 15400,
    }
  ]);

  const banners1Ref = useRef(banners1);
  banners1Ref.current = banners1;
  const banners2Ref = useRef(banners2);
  banners2Ref.current = banners2;

  const [partners, setPartners] = useState<string[]>([
    '«Роснефть-Бизнес»',
    'ГЛОНАСС Omnicomm',
    'Оптовые поставки топлива (ЮФО)'
  ]);

  const [monetizationSettings, setMonetizationSettings] = useState({
    cpmRate: 450, // руб. за 1000 показов
    cpcRate: 25,  // руб. за клик
    footerRate: 5000, // руб./мес за ссылку в подвале
    stationHighlightRate: 1500, // руб./мес за статус премиум-АЗС
    autoApproveAds: true,
    revenueTotal: 78450, // общая выручка
    viewsTotal: 124500,  // общие показы
    clicksTotal: 4850,   // общие клики
  });

  // State for ad placement payment form
  const [adOrder, setAdOrder] = useState({
    companyName: '',
    inn: '',
    contactEmail: '',
    placementZone: 'dashboard', // dashboard or chat
    billingModel: 'cpm', // cpm, cpc, flat
    targetTitle: '',
    targetDescription: '',
    targetImageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop',
    targetLink: 'https://example.com',
    cpmQuantity: 10000, // default 10k views
    cpcQuantity: 500,   // default 500 clicks
    flatDurationMonths: 1, // default 1 month
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    isProcessing: false,
    successMessage: '',
  });

  const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);

  // Effect for Zone 1 Carousel Rotate
  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      const banners = banners1Ref.current;
      const length = banners.length;
      if (length === 0) return;

      let nextIdx = currentIdx1;
      for (let i = 1; i <= length; i++) {
        const idx = (currentIdx1 + i) % length;
        if (banners[idx]?.isActive) {
          nextIdx = idx;
          break;
        }
      }

      setCurrentIdx1(nextIdx);
      setBanners1(prev => prev.map((b, i) => i === nextIdx ? { ...b, views: b.views + 1 } : b));

      // Update total platform stats for Zone 1 views
      setMonetizationSettings(prev => ({
        ...prev,
        viewsTotal: prev.viewsTotal + 1,
        revenueTotal: prev.revenueTotal + (prev.cpmRate / 1000),
      }));
    }, carouselInterval * 1000);

    return () => clearInterval(timer);
  }, [carouselInterval, autoRotate, currentIdx1]);

  // Effect for Zone 2 Carousel Rotate
  useEffect(() => {
    if (!autoRotate2) return;
    const timer = setInterval(() => {
      const banners = banners2Ref.current;
      const length = banners.length;
      if (length === 0) return;

      let nextIdx = currentIdx2;
      for (let i = 1; i <= length; i++) {
        const idx = (currentIdx2 + i) % length;
        if (banners[idx]?.isActive) {
          nextIdx = idx;
          break;
        }
      }

      setCurrentIdx2(nextIdx);
      setBanners2(prev => prev.map((b, i) => i === nextIdx ? { ...b, views: b.views + 1 } : b));

      // Update total platform stats for Zone 2 views
      setMonetizationSettings(prev => ({
        ...prev,
        viewsTotal: prev.viewsTotal + 1,
        revenueTotal: prev.revenueTotal + (prev.cpmRate / 1000),
      }));
    }, carouselInterval2 * 1000);

    return () => clearInterval(timer);
  }, [carouselInterval2, autoRotate2, currentIdx2]);

  // РФ Парсер / Агрегатор States
  const [parserSubTab, setParserSubTab] = useState<'telegram' | 'vk' | 'max' | 'db' | 'fastapi'>('telegram');
  const [tgApiId, setTgApiId] = useState('28472910');
  const [tgApiHash, setTgApiHash] = useState('e3f019a8bc894ef93d8b12f65a1900ad');
  const [tgChannels, setTgChannels] = useState('@m4_don_fuel, @fuel_city_anapa, @dalnoboy_south');
  const [tgIsActive, setTgIsActive] = useState(true);
  
  const [vkAccessToken, setVkAccessToken] = useState('vk1.a.df9a28bc01d9f8e77a28b7762c9431ea90bb10fc812c');
  const [vkGroupIds, setVkGroupIds] = useState('-2190392, -18928392');
  const [vkParseInterval, setVkParseInterval] = useState('15');
  const [vkIsActive, setVkIsActive] = useState(false);
  
  const [maxUrl, setMaxUrl] = useState('https://max-local-community.ru/board');
  const [maxAuthType, setMaxAuthType] = useState('cookies');
  const [maxSelector, setMaxSelector] = useState('.feed-post-content');
  const [maxUsePlaywright, setMaxUsePlaywright] = useState(true);
  const [maxIsActive, setMaxIsActive] = useState(false);

  const [parserTestLogs, setParserTestLogs] = useState<string[]>([
    'Инициализация асинхронного диспетчера воркеров...',
    'Соединение с локальным репозиторием Redis установлено.',
    'Запуск Telegram коллектора (API ID: 28472910)...',
    'Telegram: Подключение активно. Прослушивание @m4_don_fuel, @fuel_city_anapa.',
    'Ожидание новых событий парсинга...'
  ]);
  const [isTestingParser, setIsTestingParser] = useState(false);

  const [selectedFastApiRoute, setSelectedFastApiRoute] = useState<string>('/stats/messages_per_day');
  const [fastApiResponseData, setFastApiResponseData] = useState<any>({
    "status": "success",
    "route": "/stats/messages_per_day",
    "period": "Last 7 Days (РФ Режим)",
    "data": [
      { "date": "2026-07-06", "telegram_msgs": 142, "vk_msgs": 48, "max_scraped": 34, "total": 224 },
      { "date": "2026-07-07", "telegram_msgs": 165, "vk_msgs": 55, "max_scraped": 41, "total": 261 },
      { "date": "2026-07-08", "telegram_msgs": 188, "vk_msgs": 72, "max_scraped": 59, "total": 319 },
      { "date": "2026-07-09", "telegram_msgs": 210, "vk_msgs": 68, "max_scraped": 50, "total": 328 },
      { "date": "2026-07-10", "telegram_msgs": 295, "vk_msgs": 104, "max_scraped": 88, "total": 487 },
      { "date": "2026-07-11", "telegram_msgs": 340, "vk_msgs": 120, "max_scraped": 112, "total": 572 },
      { "date": "2026-07-12", "telegram_msgs": 185, "vk_msgs": 62, "max_scraped": 49, "total": 296 }
    ],
    "summary": "Пиковая активность зафиксирована 11 июля в связи с задержкой бензовозов на трассе М-4 Дон."
  });
  const [isFetchingFastApi, setIsFetchingFastApi] = useState(false);

  // Add/Edit Gas Station Form States
  const [isEditingExisting, setIsEditingExisting] = useState(false);
  const [stationFormId, setStationFormId] = useState('');
  const [stationBrand, setStationBrand] = useState('');
  const [stationAddress, setStationAddress] = useState('');
  const [stationLat, setStationLat] = useState('55.75');
  const [stationLng, setStationLng] = useState('37.61');
  const [stationAI92, setStationAI92] = useState<'available' | 'empty' | 'unloading' | 'unknown' | 'coupon'>('available');
  const [stationAI95, setStationAI95] = useState<'available' | 'empty' | 'unloading' | 'unknown' | 'coupon'>('available');
  const [stationDT, setStationDT] = useState<'available' | 'empty' | 'unloading' | 'unknown' | 'coupon'>('available');
  const [stationQueue, setStationQueue] = useState<'none' | 'short' | 'medium' | 'long'>('none');
  const [stationWaitingTime, setStationWaitingTime] = useState('0');
  const [stationConfidence, setStationConfidence] = useState('1.0');
  const [stationDeficit, setStationDeficit] = useState<'low' | 'medium' | 'high'>('low');
  const [stationNextDelivery, setStationNextDelivery] = useState('нет данных');
  const [stationApiUrl, setStationApiUrl] = useState('');
  const [stationApiKey, setStationApiKey] = useState('');

  // Add Channel Form States
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelKeywords, setNewChannelKeywords] = useState('');

  // Add Custom Message Form States
  const [newMessageSender, setNewMessageSender] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [newMessageChannel, setNewMessageChannel] = useState('');

  // Track selected chat and collapse state
  const [selectedChat, setSelectedChat] = useState<string>('');
  const [isChatExpanded, setIsChatExpanded] = useState(true);

  // Real Chat Integration States
  const [connectedChat, setConnectedChat] = useState<{ url: string; title: string; status: string; connectedAt: string } | null>(null);
  const [connectedChats, setConnectedChats] = useState<Array<{ url: string; title: string; status: string; connectedAt: string }>>([]);
  const [externalChatUrl, setExternalChatUrl] = useState('');

  // System logs state
  const [logs, setLogs] = useState<{
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    module: string;
    message: string;
  }[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [logFilterLevel, setLogFilterLevel] = useState<'all' | 'info' | 'warn' | 'error' | 'success'>('all');

  const fetchRecommendations = async () => {
    try {
      setIsFetchingRecommendations(true);
      setRecommendationError(null);
      const res = await fetch('/api/recommendations');
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          setExternalRecommendation(data.data);
        } else {
          setRecommendationError(data.error || 'Бекенд оффлайн');
          setExternalRecommendation(null);
        }
      } else {
        setRecommendationError('Ошибка сети');
        setExternalRecommendation(null);
      }
    } catch (err: any) {
      setRecommendationError(err.message || 'Ошибка запроса');
      setExternalRecommendation(null);
    } finally {
      setIsFetchingRecommendations(false);
    }
  };

  // Fetch Initial Data
  const fetchChannels = async () => {
    try {
      const res = await fetch('/api/channels');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const chs = await res.json();
        setChannels(chs);
        if (chs.length > 0) {
          if (!selectedChat || !chs.some((c: any) => c.id === selectedChat)) {
            setSelectedChat(chs[0].id);
          }
          if (!newMessageChannel || !chs.some((c: any) => c.id === newMessageChannel)) {
            setNewMessageChannel(chs[0].id);
          }
        } else {
          setSelectedChat('');
          setNewMessageChannel('');
        }
      }
    } catch (err: any) {
      console.warn('Channels loading info (offline/restart):', err?.message || err);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/subscribers');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        setSubscribers(await res.json());
      }
    } catch (err: any) {
      console.warn('Subscribers loading info (offline/restart):', err?.message || err);
    }
  };

  const handleToggleBan = async (name: string) => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/subscribers/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        setSubscribers(data.subscribers);
        fetchLogs();
      }
    } catch (err: any) {
      console.warn('Error toggling ban status:', err?.message || err);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resStations, resChats, resSettings, resLogs, resChannels, resConnected, resSubscribers] = await Promise.all([
        fetch('/api/stations'),
        fetch('/api/chats'),
        fetch('/api/settings'),
        fetch('/api/logs'),
        fetch('/api/channels'),
        fetch('/api/chats/connected'),
        fetch('/api/subscribers')
      ]);

      const isJson = (r: Response) => {
        const ct = r.headers.get('content-type');
        return ct ? ct.includes('application/json') : false;
      };

      if (resStations.ok && isJson(resStations)) {
        const stats = await resStations.json();
        setStations(stats);
        if (stats.length > 0) {
          const rosneft = stats.find((s: any) => s.brand.toLowerCase().includes('роснефть'));
          setBotSelectedStation(rosneft ? rosneft.id : stats[0].id);
        }
      }
      if (resChats.ok && isJson(resChats)) setChats(await resChats.json());
      if (resSettings.ok && isJson(resSettings)) setSettings(await resSettings.json());
      if (resLogs.ok && isJson(resLogs)) setLogs(await resLogs.json());
      if (resSubscribers.ok && isJson(resSubscribers)) setSubscribers(await resSubscribers.json());
      
      let currentChannels: any[] = [];
      if (resChannels.ok && isJson(resChannels)) {
        currentChannels = await resChannels.json();
        setChannels(currentChannels);
      }
      
      if (resConnected.ok && isJson(resConnected)) {
        const connData = await resConnected.json();
        setConnectedChat(connData.connectedChat);
        setConnectedChats(connData.connectedChats || (connData.connectedChat ? [connData.connectedChat] : []));
      }

      // Automatically select first channel if current is empty or invalid
      if (currentChannels.length > 0) {
        setSelectedChat(prev => {
          if (!prev || !currentChannels.some((c: any) => c.id === prev)) {
            return currentChannels[0].id;
          }
          return prev;
        });
        setNewMessageChannel(prev => {
          if (!prev || !currentChannels.some((c: any) => c.id === prev)) {
            return currentChannels[0].id;
          }
          return prev;
        });
      } else {
        setSelectedChat('');
        setNewMessageChannel('');
      }

    } catch (err: any) {
      console.warn('Data loading info (offline/restart):', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        setLogs(await res.json());
      }
    } catch (err: any) {
      console.warn('Logs loading info (offline/restart):', err?.message || err);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        setChats(await res.json());
      }
    } catch (err: any) {
      console.warn('Chats loading info (offline/restart):', err?.message || err);
    }
  };

  const handleRefreshChats = async () => {
    try {
      setIsRefreshingChats(true);
      await fetchChats();
    } finally {
      setIsRefreshingChats(false);
    }
  };

  const fetchBackendCode = async () => {
    try {
      const res = await fetch('/api/backend/code');
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        setBackendCode(await res.json());
      }
    } catch (err: any) {
      console.warn('Backend code loading info (offline/restart):', err?.message || err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBackendCode();
    fetchRecommendations();
  }, []);

  // Poll logs periodically when in the admin or logs tab
  useEffect(() => {
    if (activeTab !== 'admin' && activeTab !== 'logs') return;
    fetchLogs();
    fetchSubscribers();
    const interval = setInterval(() => {
      fetchLogs();
      fetchSubscribers();
    }, 3000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Update setttings on backend
  const saveSettings = async (updatedSettings: Partial<SystemSettings>) => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Submit direct button report (trigger-based verification)
  const submitReport = async (payload: {
    stationId: string;
    fuelType?: string;
    type?: string;
    queueLength?: string;
    source: 'report_app' | 'report_bot';
    sender?: string;
  }) => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        // Update in state
        setStations(prev => prev.map(s => s.id === data.station.id ? data.station : s));
        setChats(prev => [data.message, ...prev]);
        setSelectedStationForReport(null);
        fetchLogs();
        if (data.isUpdated) {
          setFeedbackSuccess(`Триггер отправлен! Получено несколько подтверждений, статус АЗС успешно обновлен ИИ!`);
        } else {
          setFeedbackSuccess(`Триггер отправлен! ИИ проверил чат и зафиксировал сигнал. Ожидаются другие подтверждения.`);
        }
        setTimeout(() => setFeedbackSuccess(null), 4500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Run chat parser through Gemini
  const submitChatMessage = async (text: string, sender: string) => {
    if (!text.trim()) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/chat/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sender })
      });
      if (res.ok) {
        const data = await res.json();
        setStations(data.stations);
        setChats(prev => [data.message, ...prev]);
        setBotInput('');
        fetchLogs();
        setFeedbackSuccess('Текстовый отчет успешно распознан ИИ и отправлен!');
        setTimeout(() => setFeedbackSuccess(null), 3500);
        // Sync setting tokens count
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const freshSettings = await settingsRes.json();
          setSettings(freshSettings);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Voice Input SpeechRecognition API
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Голосовой ввод не поддерживается вашим браузером или заблокирован в iframe. Попробуйте открыть в новой вкладке.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ru-RU';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const speechToText = event.results[0][0].transcript;
        setBotInput((prev) => prev ? `${prev} ${speechToText}` : speechToText);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech start error:', err);
      setIsListening(false);
    }
  };

  // Admin Override Submit
  const submitAdminOverride = async (id: string, update: any) => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/stations/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...update })
      });
      if (res.ok) {
        const data = await res.json();
        setStations(prev => prev.map(s => s.id === data.station.id ? data.station : s));
        setEditingStation(null);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Add new Gas Station
  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationBrand.trim() || !stationAddress.trim()) {
      alert('Пожалуйста, заполните бренд и адрес АЗС');
      return;
    }
    try {
      setActionLoading(true);
      const res = await fetch('/api/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: stationBrand,
          address: stationAddress,
          coords: { lat: parseFloat(stationLat), lng: parseFloat(stationLng) },
          status: { AI92: stationAI92, AI95: stationAI95, DT: stationDT },
          queueLength: stationQueue,
          waitingTime: parseInt(stationWaitingTime),
          confidenceScore: parseFloat(stationConfidence),
          deficitForecast: stationDeficit,
          nextDelivery: stationNextDelivery,
          apiUrl: stationApiUrl,
          apiKey: stationApiKey
        })
      });
      if (res.ok) {
        const data = await res.json();
        setStations(prev => [...prev, data.station]);
        clearStationForm();
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Gas Station
  const handleEditStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stationFormId) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/stations/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: stationFormId,
          brand: stationBrand,
          address: stationAddress,
          coords: { lat: parseFloat(stationLat), lng: parseFloat(stationLng) },
          status: { AI92: stationAI92, AI95: stationAI95, DT: stationDT },
          queueLength: stationQueue,
          waitingTime: parseInt(stationWaitingTime),
          confidenceScore: parseFloat(stationConfidence),
          deficitForecast: stationDeficit,
          nextDelivery: stationNextDelivery,
          apiUrl: stationApiUrl,
          apiKey: stationApiKey
        })
      });
      if (res.ok) {
        const data = await res.json();
        setStations(prev => prev.map(s => s.id === data.station.id ? data.station : s));
        clearStationForm();
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Gas Station
  const handleDeleteStation = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту АЗС?')) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/stations/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setStations(prev => prev.filter(s => s.id !== id));
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const clearStationForm = () => {
    setIsEditingExisting(false);
    setStationFormId('');
    setStationBrand('');
    setStationAddress('');
    setStationLat('55.75');
    setStationLng('37.61');
    setStationAI92('available');
    setStationAI95('available');
    setStationDT('available');
    setStationQueue('none');
    setStationWaitingTime('0');
    setStationConfidence('1.0');
    setStationDeficit('low');
    setStationNextDelivery('нет данных');
    setStationApiUrl('');
    setStationApiKey('');
  };

  const populateStationForm = (s: GasStation) => {
    setIsEditingExisting(true);
    setStationFormId(s.id);
    setStationBrand(s.brand);
    setStationAddress(s.address);
    setStationLat(s.coords.lat.toString());
    setStationLng(s.coords.lng.toString());
    setStationAI92(s.status.AI92);
    setStationAI95(s.status.AI95);
    setStationDT(s.status.DT);
    setStationQueue(s.queueLength);
    setStationWaitingTime(s.waitingTime.toString());
    setStationConfidence(s.confidenceScore.toString());
    setStationDeficit(s.deficitForecast);
    setStationNextDelivery(s.nextDelivery);
    setStationApiUrl(s.apiUrl || '');
    setStationApiKey(s.apiKey || '');
    setAdminSubTab('stations');
  };

  // Run Parser Simulation Test
  const handleRunParserTest = () => {
    if (isTestingParser) return;
    setIsTestingParser(true);
    setParserTestLogs(['[10:35:01] [System] Инициализация асинхронного диспетчера воркеров...']);
    
    const messages = [
      '[10:35:02] [Redis] Соединение с локальным репозиторием Redis (порт 6379) успешно установлено.',
      `[10:35:03] [Telegram] Запуск воркера Telegram (API ID: ${tgApiId || '28472910'}). Сбор сообщений из: ${tgChannels || '@m4_don_fuel'}`,
      `[10:35:04] [VK API] Запрос постов из пабликов VK: ${vkGroupIds || '-2190392, -18928392'}. Лимит: 50 постов.`,
      `[10:35:05] [Max Scraper] Платформа MAX не предоставляет открытого API. Запуск Playwright Headless (Chromium)...`,
      `[10:35:06] [Max Scraper] Переход по адресу ${maxUrl || 'https://max-local-community.ru/board'}. Авторизация по типу: ${maxAuthType}.`,
      `[10:35:07] [Max Scraper] Селектор "${maxSelector || '.feed-post-content'}" успешно обнаружен. Извлечено 4 новых поста.`,
      '[10:35:08] [NLP Processor] Все извлеченные сообщения (всего 12) отправлены в очередь сообщений RabbitMQ.',
      '[10:35:09] [NLP Processor] Анализ ИИ (Gemini API) на наличие триггеров дефицита, проверку фейков и дубликатов.',
      '[10:35:10] [Postgres DB] Успешный импорт данных: добавлено 2 новых пользователя, 5 релевантных сообщений занесено в таблицу `messages`.',
      '[10:35:11] [FastAPI] Кэш статистики API успешно инвалидирован и пересобран за 120мс. Сбор данных завершен успешно! ✅'
    ];

    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setParserTestLogs(prev => [...prev, msg]);
        if (idx === messages.length - 1) {
          setIsTestingParser(false);
        }
      }, (idx + 1) * 750);
    });
  };

  // Execute FastAPI simulated route
  const handleExecuteFastApiRoute = (route: string) => {
    setIsFetchingFastApi(true);
    setSelectedFastApiRoute(route);
    
    setTimeout(() => {
      setIsFetchingFastApi(false);
      if (route === '/stats/messages_per_day') {
        setFastApiResponseData({
          "status": "success",
          "route": "/stats/messages_per_day",
          "period": "Last 7 Days (РФ Режим)",
          "data": [
            { "date": "2026-07-06", "telegram_msgs": 142, "vk_msgs": 48, "max_scraped": 34, "total": 224 },
            { "date": "2026-07-07", "telegram_msgs": 165, "vk_msgs": 55, "max_scraped": 41, "total": 261 },
            { "date": "2026-07-08", "telegram_msgs": 188, "vk_msgs": 72, "max_scraped": 59, "total": 319 },
            { "date": "2026-07-09", "telegram_msgs": 210, "vk_msgs": 68, "max_scraped": 50, "total": 328 },
            { "date": "2026-07-10", "telegram_msgs": 295, "vk_msgs": 104, "max_scraped": 88, "total": 487 },
            { "date": "2026-07-11", "telegram_msgs": 340, "vk_msgs": 120, "max_scraped": 112, "total": 572 },
            { "date": "2026-07-12", "telegram_msgs": 185, "vk_msgs": 62, "max_scraped": 49, "total": 296 }
          ],
          "summary": "Пиковая активность зафиксирована 11 июля в связи с задержкой бензовозов на трассе М-4 Дон."
        });
      } else if (route === '/stats/active_users') {
        setFastApiResponseData({
          "status": "success",
          "route": "/stats/active_users",
          "total_monitored_users": 1840,
          "top_contributors": [
            { "username": "Alex_K", "platform": "telegram", "messages_sent": 42, "reliability_rate": "98%" },
            { "username": "Ростовский_Драйвер", "platform": "telegram", "messages_sent": 38, "reliability_rate": "94%" },
            { "username": "id8293021", "platform": "vk", "messages_sent": 29, "reliability_rate": "91%" },
            { "username": "max_user_992", "platform": "max_scraper", "messages_sent": 22, "reliability_rate": "89%" },
            { "username": "Серж88", "platform": "telegram", "messages_sent": 19, "reliability_rate": "100%" }
          ],
          "system_note": "Пользователи с низким рейтингом достоверности (менее 60%) автоматически помечаются системой анти-спама."
        });
      } else if (route === '/stats/fuel_trends') {
        setFastApiResponseData({
          "status": "success",
          "route": "/stats/fuel_trends",
          "brands_analyzed": ["Роснефть", "Лукойл", "Газпромнефть"],
          "metrics": {
            "average_waiting_time_minutes": { "Роснефть": 21, "Лукойл": 32, "Газпромнефть": 10 },
            "deficit_risk_level": { "Роснефть": "Средний", "Лукойл": "Высокий", "Газпромнефть": "Низкий" },
            "unverified_reports_percentage": { "Telegram": "4.2%", "VK": "8.7%", "Max (Scraped)": "14.5%" }
          },
          "ai_insights": "Локальные чаты Max содержат повышенный уровень шума. Рекомендуется увеличить вес доверия к каналам Telegram."
        });
      }
    }, 400);
  };

  // Add Dynamic Chat Channel
  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newChannelName, keywords: newChannelKeywords })
      });
      if (res.ok) {
        const data = await res.json();
        setChannels(data.channels);
        setNewChannelName('');
        setNewChannelKeywords('');
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Chat Channel
  const handleDeleteChannel = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот чат-канал?')) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/channels/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        setChannels(data.channels);
        if (selectedChat === id) {
          const remaining = data.channels.filter((c: any) => c.id !== id);
          if (remaining.length > 0) {
            setSelectedChat(remaining[0].id);
          } else {
            setSelectedChat('');
          }
        }
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Chat Channel Analysis
  const handleToggleChannelAnalysis = async (id: string) => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/channels/toggle-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        setChannels(data.channels);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Connect External Chat
  const handleConnectExternalChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalChatUrl.trim()) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/chats/connect-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: externalChatUrl.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setConnectedChat(data.connectedChat);
        setConnectedChats(data.connectedChats || (data.connectedChat ? [data.connectedChat] : []));
        setChannels(data.channels);
        setStations(data.stations);
        setExternalChatUrl('');
        const newId = data.connectedChat?.id || 'chat-max';
        setSelectedChat(newId); // Switch to newly connected channel!
        fetchLogs();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Ошибка при подключении чата');
      }
    } catch (err) {
      console.error(err);
      alert('Сетевая ошибка при подключении чата');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisconnectChat = async (url: string) => {
    if (!window.confirm('Отключить этот чат?')) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/chats/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (res.ok) {
        const data = await res.json();
        setConnectedChat(data.connectedChat || null);
        setConnectedChats(data.connectedChats || []);
        setChannels(data.channels);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete individual chat message
  const handleDeleteChatMessage = async (id: string) => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/chats/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Clear all chat messages
  const handleClearAllChats = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить все сообщения чата? Это действие необратимо.')) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/chats/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats);
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Sync station data via API URL
  const handleSyncStationApi = async (id: string) => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/stations/sync-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        setStations(prev => prev.map(s => s.id === data.station.id ? data.station : s));
        fetchLogs();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Ошибка синхронизации');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Re-analyze or refresh station data manually
  const handleRefreshStationAnalysis = async (id: string) => {
    try {
      setRefreshingStationId(id);
      const res = await fetch('/api/stations/refresh-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        setStations(prev => prev.map(s => s.id === data.station.id ? data.station : s));
        fetchLogs();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Ошибка обновления анализа данных');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshingStationId(null);
    }
  };

  // Reset simulator state
  const resetSimulator = async () => {
    if (!window.confirm('Вы уверены, что хотите сбросить состояние симулятора к исходным значениям?')) return;
    try {
      setActionLoading(true);
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setStations(data.stations);
        setChats(data.chatMessages);
        alert('Симулятор успешно сброшен!');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Copy to clipboard helper
  const handleCopyCode = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopyStatus(key);
    setTimeout(() => setCopyStatus(''), 2000);
  };

  // Derived dashboard stats
  const totalStations = stations.length;
  const stationsWithDeficit = stations.filter(s => s.deficitForecast === 'high').length;
  const stationsWithEmptyDT = stations.filter(s => s.status.DT === 'empty').length;
  const activeQueuesCount = stations.filter(s => s.queueLength === 'long' || s.queueLength === 'medium').length;

  // Derived log variables
  const filteredLogs = logs.filter(log => {
    if (logFilterLevel !== 'all' && log.level !== logFilterLevel) return false;
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q) ||
        log.level.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalLogsCount = logs.length;
  const successLogsCount = logs.filter(l => l.level === 'success').length;
  const warnLogsCount = logs.filter(l => l.level === 'warn').length;
  const errorLogsCount = logs.filter(l => l.level === 'error').length;
  const infoLogsCount = logs.filter(l => l.level === 'info').length;

  // Filter messages based on selected chat
  const getFilteredChats = () => {
    if (chats.length === 0) return [];
    
    return chats.filter(msg => {
      const text = msg.text.toLowerCase();
      const activeChannel = channels.find(c => c.id === selectedChat);
      if (!activeChannel) {
        // Fallback to general/all messages if active channel not found
        return true;
      }
      
      // If keywords is empty, show all messages in that channel
      if (!activeChannel.keywords.trim()) {
        return true;
      }

      const keywordsList = activeChannel.keywords
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(Boolean);

      if (keywordsList.length === 0) {
        return true;
      }

      // If it's the general chat-m4, let's also allow messages that don't match city or freight if they don't have other keywords
      if (selectedChat === 'chat-m4') {
        const matchesKeyword = keywordsList.some(k => text.includes(k));
        const isCityOrFreight = text.includes('ленина') || text.includes('мира') || text.includes('город') || text.includes('дт') || text.includes('дизель') || text.includes('дальнобой');
        return matchesKeyword || !isCityOrFreight;
      }

      return keywordsList.some(k => text.includes(k));
    });
  };

  const filteredChatList = getFilteredChats();
  const lastMessage = filteredChatList.length > 0 ? filteredChatList[0] : null;

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-slate-100 bg-slate-950">
      {/* Upper Brand Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2.5 py-1 sm:px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              <Fuel className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold tracking-tight font-display text-white">FuelFlow Manager</h1>
                <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.5 rounded bg-slate-800/40 border border-slate-800/80">MVP - тестовый режим</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400">Система управления потребительскими потоками топлива при дефиците</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsAdminDropdownOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Реестр АЗС
            </button>
            
            {/* Administrator Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className={`p-2 rounded-lg text-xs font-medium transition flex items-center gap-1 border border-transparent ${
                  ['simulator', 'admin', 'logs', 'architecture', 'backend'].includes(activeTab)
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
                title="Администратор"
              >
                <Sliders className="w-4 h-4" />
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isAdminDropdownOpen && (
                <>
                  {/* Overlay to catch clicks and close the dropdown */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsAdminDropdownOpen(false)} />
                  
                  <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => {
                        setActiveTab('simulator');
                        if (stations.length > 0 && !botSelectedStation) setBotSelectedStation(stations[0].id);
                        setIsAdminDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition flex items-center gap-2.5 ${
                        activeTab === 'simulator' ? 'bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-500 pl-3.5' : 'text-slate-300 hover:bg-slate-800 hover:text-white pl-4'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5 text-emerald-400" /> FeedBack_Bot
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setIsAdminDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition flex items-center gap-2.5 ${
                        activeTab === 'admin' ? 'bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-500 pl-3.5' : 'text-slate-300 hover:bg-slate-800 hover:text-white pl-4'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5 text-blue-400" /> Настройки
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('logs');
                        setIsAdminDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition flex items-center gap-2.5 ${
                        activeTab === 'logs' ? 'bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-500 pl-3.5' : 'text-slate-300 hover:bg-slate-800 hover:text-white pl-4'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Системные логи
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('architecture');
                        setIsAdminDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition flex items-center gap-2.5 ${
                        activeTab === 'architecture' ? 'bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-500 pl-3.5' : 'text-slate-300 hover:bg-slate-800 hover:text-white pl-4'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" /> ER-Схема
                    </button>
                    
                    <button
                      onClick={() => {
                        setActiveTab('backend');
                        setIsAdminDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition flex items-center gap-2.5 ${
                        activeTab === 'backend' ? 'bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-500 pl-3.5' : 'text-slate-300 hover:bg-slate-800 hover:text-white pl-4'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5 text-violet-400" /> Код FastAPI
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Authorization Tab */}
            <button
              id="header-auth-tab"
              onClick={() => {
                setActiveTab('auth');
                setIsAdminDropdownOpen(false);
              }}
              className={`p-2 rounded-lg text-xs font-medium transition flex items-center justify-center border border-transparent ${
                activeTab === 'auth'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : currentUser 
                    ? 'text-emerald-400 hover:text-emerald-300 hover:bg-slate-900/50 border border-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
              title={currentUser ? `Авторизован: ${currentUser.name || currentUser.email}` : "Авторизация"}
            >
              {currentUser ? (
                <User className="w-4 h-4 text-emerald-400" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 py-2 sm:px-4 lg:px-6">
        
        {/* --- 📊 TAB 1: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-2">
              
              {/* Рекламный блок партнеров (Карусель с ротацией по таймеру) */}
              {banners1.length > 0 && banners1[currentIdx1]?.isActive && (
                <div 
                  className="bg-slate-900/60 border border-emerald-500/10 rounded-xl p-2 relative overflow-hidden shadow-md flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-slate-900/80 transition group hover:border-emerald-500/30" 
                  id="partner-ad-banner"
                  onClick={() => {
                    // Track click
                    setBanners1(prev => prev.map((b, idx) => idx === currentIdx1 ? { ...b, clicks: b.clicks + 1 } : b));
                    setMonetizationSettings(prev => ({
                      ...prev,
                      clicksTotal: prev.clicksTotal + 1,
                      revenueTotal: prev.revenueTotal + prev.cpcRate,
                    }));
                    window.open(banners1[currentIdx1].targetUrl, '_blank');
                  }}
                >
                  <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-bl border-l border-b border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Реклама</span>
                  </div>
                  {/* Изображение на крайнем левом пространстве */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-emerald-500/20 shrink-0 bg-slate-950 flex items-center justify-center relative">
                    <img
                      src={banners1[currentIdx1].imageUrl}
                      alt={banners1[currentIdx1].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Текст рекламы в 2 строки */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-[11px] sm:text-xs font-semibold text-white truncate flex items-center gap-1 group-hover:text-emerald-400 transition">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{banners1[currentIdx1].title}</span>
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed truncate">
                      {banners1[currentIdx1].description}
                    </p>
                  </div>
                  {/* Slide controls in the banner itself */}
                  <div className="flex items-center gap-1 pr-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {banners1.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx1(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === currentIdx1 ? 'bg-emerald-400 w-3' : 'bg-slate-700 hover:bg-slate-500'
                        }`}
                        title={`Слайд ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 sm:p-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                      <Fuel className="w-5 h-5 text-emerald-400" /> Реестр АЗС и статус дефицита
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">В реальном времени по сообщениям краудсорсинга и API парсера</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setStationFilter('all')}
                      className={`border rounded-xl py-1 px-2 flex items-center justify-between transition cursor-pointer text-left focus:outline-none h-8 ${
                        stationFilter === 'all'
                          ? 'bg-blue-500/10 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-850 hover:border-slate-750'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mr-2">АЗС на Мониторинге:</span>
                      <span className="text-xs font-bold font-display text-white mr-2">
                        {loading ? '...' : totalStations}
                      </span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                        stationFilter === 'all'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        <MapPin className="w-3 h-3" />
                      </div>
                    </button>

                    <button
                      onClick={() => setStationFilter(prev => prev === 'deficit' ? 'all' : 'deficit')}
                      className={`border rounded-xl py-1 px-2 flex items-center justify-between transition cursor-pointer text-left focus:outline-none h-8 ${
                        stationFilter === 'deficit'
                          ? 'bg-rose-500/10 border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-850 hover:border-slate-750'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mr-2">Критической дефицит:</span>
                      <span className="text-xs font-bold font-display text-rose-500 mr-2">
                        {loading ? '...' : `${stationsWithDeficit} АЗС`}
                      </span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                        stationFilter === 'deficit'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        <AlertTriangle className="w-3 h-3" />
                      </div>
                    </button>

                    <button
                      onClick={() => setStationFilter(prev => prev === 'queues' ? 'all' : 'queues')}
                      className={`border rounded-xl py-1 px-2 flex items-center justify-between transition cursor-pointer text-left focus:outline-none h-8 ${
                        stationFilter === 'queues'
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-850 hover:border-slate-750'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mr-2">Активных очередей:</span>
                      <span className="text-xs font-bold font-display text-amber-500 mr-2">
                        {loading ? '...' : activeQueuesCount}
                      </span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                        stationFilter === 'queues'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <Clock className="w-3 h-3" />
                      </div>
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-500" />
                    Загрузка статуса заправочных станций...
                  </div>
                ) : stations.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">Нет доступных станций. Сбросьте состояние симулятора в Настройках AI.</div>
                ) : (
                  <div className="space-y-2.5">
                    {(() => {
                      const filteredList = stations.filter(s => {
                        if (stationFilter === 'deficit') return s.deficitForecast === 'high';
                        if (stationFilter === 'queues') return s.queueLength === 'long' || s.queueLength === 'medium';
                        return true;
                      });
                      if (filteredList.length === 0) {
                        return (
                          <div className="py-10 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-900/10 space-y-2">
                            <div>Нет станций, соответствующих выбранному фильтру.</div>
                            <button onClick={() => setStationFilter('all')} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition cursor-pointer text-[11px]">
                              Показать все АЗС
                            </button>
                          </div>
                        );
                      }
                      return filteredList.map(station => {
                      // Status colors helper
                      const getStatusBadge = (status: 'available' | 'empty' | 'unloading' | 'unknown') => {
                        if (status === 'available') {
                          return <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-medium">Есть</span>;
                        } else if (status === 'empty') {
                          return <span className="text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-mono font-medium">Нет</span>;
                        } else if (status === 'unloading') {
                          return <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-medium animate-pulse">Слив</span>;
                        }
                        return <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded font-mono">?</span>;
                      };

                      const getQueueBadge = (q: string) => {
                        if (q === 'long') return <span className="text-rose-400 font-semibold font-display">Огромная queue</span>;
                        if (q === 'medium') return <span className="text-amber-400 font-medium">Средняя (около 30 мин)</span>;
                        if (q === 'short') return <span className="text-emerald-400 text-xs">Небольшая (10 мин)</span>;
                        return <span className="text-slate-400 text-xs">Очереди нет</span>;
                      };

                      const getForecastBadge = (f: string) => {
                        if (f === 'high') return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[10px] px-2 py-0.5 rounded-full font-semibold">Угроза дефицита</span>;
                        if (f === 'medium') return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[10px] px-2 py-0.5 rounded-full">Умеренный риск</span>;
                        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] px-2 py-0.5 rounded-full">Стабильно</span>;
                      };

                      const getDetailedFuelStatusBadge = (fuelKey: 'AI92' | 'AI95' | 'DT') => {
                        const rawStatus = station.status[fuelKey];
                        
                        const isAvailable = (key: 'AI92' | 'AI95' | 'DT') => {
                          const s = station.status[key];
                          return s === 'available' || s === 'coupon' || (station.id === 'station-1' && key === 'DT');
                        };

                        const hasNoSalesAtAll = !isAvailable('AI92') && !isAvailable('AI95') && !isAvailable('DT');

                        if (hasNoSalesAtAll) {
                          return (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-red-500/10 text-red-400 border border-red-500/25 px-2 py-0.5 rounded font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Не работает
                            </span>
                          );
                        }

                        // Check "coupon" status first
                        if (rawStatus === 'coupon' || (station.id === 'station-1' && fuelKey === 'DT')) {
                          return (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 px-2 py-0.5 rounded font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                              По талонам
                            </span>
                          );
                        }

                        if (rawStatus === 'available') {
                          return (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Есть
                            </span>
                          );
                        }

                        if (rawStatus === 'empty' || (station.id === 'station-2' && fuelKey === 'AI92')) {
                          return (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                              Нет
                            </span>
                          );
                        }

                        if (rawStatus === 'unloading') {
                          return (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded font-medium animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                              Слив бензовоза
                            </span>
                          );
                        }

                        return (
                          <span className="inline-flex items-center gap-1 text-[11px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-medium">
                            Не работает
                          </span>
                        );
                      };

                      const getDetailedFuelQueue = (fuelKey: 'AI92' | 'AI95' | 'DT') => {
                        const fuelStatus = station.status[fuelKey];
                        
                        const isAvailable = (key: 'AI92' | 'AI95' | 'DT') => {
                          const s = station.status[key];
                          return s === 'available' || s === 'coupon' || (station.id === 'station-1' && key === 'DT');
                        };

                        const hasNoSalesAtAll = !isAvailable('AI92') && !isAvailable('AI95') && !isAvailable('DT');

                        if (fuelStatus === 'empty' || hasNoSalesAtAll || (station.id === 'station-2' && fuelKey === 'AI92')) {
                          return (
                            <div className="text-slate-500 font-mono text-[11px]">
                              <div>0 авто</div>
                              <div className="text-[10px] text-slate-600">Очереди нет</div>
                            </div>
                          );
                        }

                        let carsRange = '0 авто';
                        let queueLabel = 'Очереди нет';
                        let queueColor = 'text-slate-400';
                        
                        if (station.queueLength === 'long') {
                          carsRange = '18-25 авто';
                          queueLabel = 'Длинная';
                          queueColor = 'text-rose-400';
                        } else if (station.queueLength === 'medium') {
                          carsRange = '8-12 авто';
                          queueLabel = 'Средняя';
                          queueColor = 'text-amber-400';
                        } else if (station.queueLength === 'short') {
                          carsRange = '3-5 авто';
                          queueLabel = 'Короткая';
                          queueColor = 'text-emerald-400';
                        }

                        const formatTime = (mins: number) => {
                          if (mins <= 0) return '0 мин';
                          if (mins < 60) return `${mins} мин`;
                          const h = Math.floor(mins / 60);
                          const m = mins % 60;
                          return `${h} ч ${m} мин`;
                        };

                        const waitTimeStr = formatTime(station.waitingTime);

                        return (
                          <div className="space-y-1 font-mono text-[11px] text-center">
                            <div className="text-slate-200 font-semibold">{carsRange}</div>
                            <div className={`text-[10px] ${queueColor}`}>{queueLabel}</div>
                            <div className="text-amber-400 text-[10px] font-medium bg-amber-500/10 px-1.5 py-0.5 rounded w-fit mx-auto">
                              ~ {waitTimeStr}
                            </div>
                          </div>
                        );
                      };

                      const getFuelImplementation = (fuelKey: 'AI92' | 'AI95' | 'DT') => {
                        const fuelStatus = station.status[fuelKey];
                        
                        const isAvailable = (key: 'AI92' | 'AI95' | 'DT') => {
                          const s = station.status[key];
                          return s === 'available' || s === 'coupon' || (station.id === 'station-1' && key === 'DT');
                        };

                        const hasNoSalesAtAll = !isAvailable('AI92') && !isAvailable('AI95') && !isAvailable('DT');

                        let implementationTime = '';
                        let deficitForecastText = '';
                        
                        if (fuelStatus === 'empty' || hasNoSalesAtAll || (station.id === 'station-2' && fuelKey === 'AI92')) {
                          implementationTime = 'Продаж нет';
                          deficitForecastText = 'Закончилось';
                        } else if (fuelStatus === 'unloading') {
                          implementationTime = 'Слив топлива';
                          deficitForecastText = 'Ожидание начала продаж';
                        } else {
                          const updatedDate = new Date(station.updatedAt);
                          const diffMs = Date.now() - updatedDate.getTime();
                          const diffMins = Math.max(15, Math.floor(diffMs / 60000) % 180);
                          const hours = Math.floor(diffMins / 60);
                          const mins = diffMins % 60;
                          implementationTime = `Продажа: ${hours > 0 ? `${hours}ч ` : ''}${mins}м назад`;
                          
                          if (station.deficitForecast === 'high') {
                            deficitForecastText = 'До дефицита: ~1-2 ч';
                          } else if (station.deficitForecast === 'medium') {
                            deficitForecastText = 'До дефицита: ~4-6 ч';
                          } else {
                            deficitForecastText = 'Запас: >18 ч';
                          }
                        }

                        return (
                          <div className="space-y-1 text-[11px] text-center">
                            <div className="text-slate-300 font-medium">{implementationTime}</div>
                            <div className={`text-[10px] ${fuelStatus === 'empty' || hasNoSalesAtAll ? 'text-rose-400 font-semibold' : station.deficitForecast === 'high' ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
                              {deficitForecastText}
                            </div>
                          </div>
                        );
                      };

                      const getFuelDelivery = (fuelKey: 'AI92' | 'AI95' | 'DT') => {
                        const fuelStatus = station.status[fuelKey];
                        let deliveryText = 'Нет данных';
                        if (station.nextDelivery && station.nextDelivery !== 'нет данных') {
                          const nextDeliveryLower = station.nextDelivery.toLowerCase();
                          const isFuelMentioned = 
                            (fuelKey === 'DT' && (nextDeliveryLower.includes('дт') || nextDeliveryLower.includes('дизел'))) ||
                            (fuelKey === 'AI95' && nextDeliveryLower.includes('95')) ||
                            (fuelKey === 'AI92' && nextDeliveryLower.includes('92'));
                            
                          if (isFuelMentioned || (!nextDeliveryLower.includes('дт') && !nextDeliveryLower.includes('95') && !nextDeliveryLower.includes('92'))) {
                            deliveryText = station.nextDelivery;
                          }
                        }

                        return (
                          <div className="space-y-1 text-[11px] text-center">
                            <div className="text-emerald-400 text-[10px] font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded w-fit mx-auto flex items-center justify-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                              <span>{deliveryText}</span>
                            </div>
                          </div>
                        );
                      };

                      return (
                        <div
                          key={station.id}
                          className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition flex flex-col gap-1.5"
                        >
                          {/* Card Header Area */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 pb-1.5 border-b border-slate-800">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-white text-base font-display">{station.brand}</h3>
                                <span className="text-[11px] text-slate-500 flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800/60">
                                  Доверие ИИ: <strong className="text-emerald-400 font-mono">{(station.confidenceScore * 100).toFixed(0)}%</strong>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRefreshStationAnalysis(station.id)}
                                  disabled={refreshingStationId !== null}
                                  className="text-[11px] bg-slate-900 hover:bg-slate-800 active:bg-slate-755 border border-slate-800/80 text-slate-300 hover:text-white px-2 py-0.5 rounded flex items-center gap-1 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium ml-1"
                                  title="Запустить повторный интеллектуальный анализ данных по этой АЗС"
                                >
                                  <RefreshCw className={`w-2.5 h-2.5 text-blue-400 ${refreshingStationId === station.id ? 'animate-spin' : ''}`} />
                                  <span>Обновить</span>
                                </button>
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-500" /> {station.address}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-slate-500 block">Обновлено:</span>
                              <span className="text-xs text-slate-300 font-mono font-medium block">
                                {new Date(station.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          {/* Beautiful Interactive Table */}
                          <div className="overflow-x-auto border border-slate-800/70 rounded-xl bg-slate-900/25">
                            <table className="w-full text-left border-collapse min-w-[500px]">
                              <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/60">
                                  <th className="p-1 sm:p-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-display w-1/4">
                                    Показатель
                                  </th>
                                  <th className="p-1 sm:p-1.5 text-[10px] font-bold tracking-wider text-slate-300 uppercase font-display text-center w-1/4 border-l border-slate-800/40">
                                    АИ-92
                                  </th>
                                  <th className="p-1 sm:p-1.5 text-[10px] font-bold tracking-wider text-slate-300 uppercase font-display text-center w-1/4 border-l border-slate-800/40">
                                    АИ-95
                                  </th>
                                  <th className="p-1 sm:p-1.5 text-[10px] font-bold tracking-wider text-slate-300 uppercase font-display text-center w-1/4 border-l border-slate-800/40">
                                    ДТ (Дизель)
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60 text-xs">
                                {/* Row 1: Статус */}
                                <tr className="hover:bg-slate-900/10 transition">
                                  <td className="p-1 sm:p-1.5 font-medium text-slate-400 bg-slate-950/20">
                                    Наличие
                                  </td>
                                  <td className="p-1 sm:p-1.5 text-center border-l border-slate-800/40">
                                    {getDetailedFuelStatusBadge('AI92')}
                                  </td>
                                  <td className="p-1 sm:p-1.5 text-center border-l border-slate-800/40">
                                    {getDetailedFuelStatusBadge('AI95')}
                                  </td>
                                  <td className="p-1 sm:p-1.5 text-center border-l border-slate-800/40">
                                    {getDetailedFuelStatusBadge('DT')}
                                  </td>
                                </tr>
                                
                                {/* Row 2: Очередь */}
                                <tr className="hover:bg-slate-900/10 transition">
                                  <td className="p-1 sm:p-1.5 font-medium text-slate-400 bg-slate-950/20">
                                    Потребители в очереди
                                  </td>
                                  <td className="p-1 sm:p-1.5 text-center border-l border-slate-800/40">
                                    {getDetailedFuelQueue('AI92')}
                                  </td>
                                  <td className="p-1 sm:p-1.5 text-center border-l border-slate-800/40">
                                    {getDetailedFuelQueue('AI95')}
                                  </td>
                                  <td className="p-1 sm:p-1.5 text-center border-l border-slate-800/40">
                                    {getDetailedFuelQueue('DT')}
                                  </td>
                                </tr>
                                
                                {/* Row 3: Реализация */}
                                <tr className="hover:bg-slate-900/10 transition">
                                  <td className="p-1 sm:p-1.5 font-medium text-slate-400 bg-slate-950/20 align-top pt-1 sm:pt-1.5">
                                    Реализация
                                  </td>
                                  <td className="p-1 sm:p-1.5 align-top border-l border-slate-800/40">
                                    {getFuelImplementation('AI92')}
                                  </td>
                                  <td className="p-1 sm:p-1.5 align-top border-l border-slate-800/40">
                                    {getFuelImplementation('AI95')}
                                  </td>
                                  <td className="p-1 sm:p-1.5 align-top border-l border-slate-800/40">
                                    {getFuelImplementation('DT')}
                                  </td>
                                </tr>

                                {/* Row 4: Поставки */}
                                <tr className="hover:bg-slate-900/10 transition">
                                  <td className="p-1 sm:p-1.5 font-medium text-slate-400 bg-slate-950/20 align-top pt-1 sm:pt-1.5">
                                    Поставки
                                  </td>
                                  <td className="p-1 sm:p-1.5 align-top border-l border-slate-800/40">
                                    {getFuelDelivery('AI92')}
                                  </td>
                                  <td className="p-1 sm:p-1.5 align-top border-l border-slate-800/40">
                                    {getFuelDelivery('AI95')}
                                  </td>
                                  <td className="p-1 sm:p-1.5 align-top border-l border-slate-800/40">
                                    {getFuelDelivery('DT')}
                                  </td>
                                </tr>

                                {/* Row 5: Коррекция статуса */}
                                <tr className="hover:bg-slate-900/10 transition">
                                  <td className="p-1 sm:p-1.5 font-medium text-slate-400 bg-slate-950/20 align-top pt-1 sm:pt-1.5">
                                    Коррекция статуса
                                  </td>
                                  <td className="p-1 sm:p-1.5 text-center border-l border-slate-800/40 align-middle">
                                    <button
                                      id={`correct-ai92-${station.id}`}
                                      onClick={() => {
                                        setActiveTab('simulator');
                                        setBotSelectedStation(station.id);
                                        setFeedbackSelectedFuel('AI92');
                                      }}
                                      className="px-2 py-0.5 bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-300 hover:border-emerald-500/30 border border-slate-700 text-[10px] font-bold rounded transition cursor-pointer"
                                    >
                                      править
                                    </button>
                                  </td>
                                  <td className="p-1 sm:p-1.5 text-center border-l border-slate-800/40 align-middle">
                                    <button
                                      id={`correct-ai95-${station.id}`}
                                      onClick={() => {
                                        setActiveTab('simulator');
                                        setBotSelectedStation(station.id);
                                        setFeedbackSelectedFuel('AI95');
                                      }}
                                      className="px-2 py-0.5 bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-300 hover:border-emerald-500/30 border border-slate-700 text-[10px] font-bold rounded transition cursor-pointer"
                                    >
                                      править
                                    </button>
                                  </td>
                                  <td className="p-1 sm:p-1.5 text-center border-l border-slate-800/40 align-middle">
                                    <button
                                      id={`correct-dt-${station.id}`}
                                      onClick={() => {
                                        setActiveTab('simulator');
                                        setBotSelectedStation(station.id);
                                        setFeedbackSelectedFuel('DT');
                                      }}
                                      className="px-2 py-0.5 bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-300 hover:border-emerald-500/30 border border-slate-700 text-[10px] font-bold rounded transition cursor-pointer"
                                    >
                                      править
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })
                  })()}
                  </div>
                )}
              </div>

              {/* Рекламный блок партнеров 2 (Карусель в чате) */}
              {banners2.length > 0 && banners2[currentIdx2]?.isActive && (
                <div 
                  className="bg-slate-900/60 border border-emerald-500/10 rounded-xl p-2 relative overflow-hidden shadow-md flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-slate-900/80 transition group hover:border-emerald-500/30" 
                  id="partner-ad-banner-2"
                  onClick={() => {
                    // Track click
                    setBanners2(prev => prev.map((b, idx) => idx === currentIdx2 ? { ...b, clicks: b.clicks + 1 } : b));
                    setMonetizationSettings(prev => ({
                      ...prev,
                      clicksTotal: prev.clicksTotal + 1,
                      revenueTotal: prev.revenueTotal + prev.cpcRate,
                    }));
                    window.open(banners2[currentIdx2].targetUrl, '_blank');
                  }}
                >
                  <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-bl border-l border-b border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Реклама</span>
                  </div>
                  {/* Изображение на крайнем левом пространстве */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-emerald-500/20 shrink-0 bg-slate-950 flex items-center justify-center relative">
                    <img
                      src={banners2[currentIdx2].imageUrl}
                      alt={banners2[currentIdx2].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Текст рекламы в 2 строки */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-[11px] sm:text-xs font-semibold text-white truncate flex items-center gap-1 group-hover:text-emerald-400 transition">
                      <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{banners2[currentIdx2].title}</span>
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-300 leading-relaxed truncate">
                      {banners2[currentIdx2].description}
                    </p>
                  </div>
                  {/* Slide controls in the banner itself */}
                  <div className="flex items-center gap-1 pr-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {banners2.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx2(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === currentIdx2 ? 'bg-emerald-400 w-3' : 'bg-slate-700 hover:bg-slate-500'
                        }`}
                        title={`Слайд ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Сообщения чата */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 sm:p-3 space-y-1.5">
                <div className="pb-1 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <h3 className="text-base font-bold font-display text-white">Сообщения чата</h3>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end flex-wrap sm:flex-nowrap gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium text-xs whitespace-nowrap">Чат:</span>
                      <div className="relative flex items-center">
                        <select
                          value={selectedChat}
                          onChange={(e) => setSelectedChat(e.target.value)}
                          className="appearance-none bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-100 rounded-lg pl-3 pr-8 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer min-w-[160px] sm:min-w-[220px] h-8 shadow-sm"
                        >
                          {channels.map(chan => (
                            <option key={chan.id} value={chan.id} className="bg-slate-950 text-slate-100 font-normal">
                              {chan.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-2 flex items-center text-slate-400">
                          <ChevronDown className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <button
                        onClick={handleRefreshChats}
                        disabled={isRefreshingChats}
                        className="h-8 px-2.5 flex items-center justify-center gap-1 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-slate-800 bg-slate-950/50 transition"
                        title="Обновить сообщения чата"
                        id="refresh-chats-button"
                      >
                        <RefreshCw className={`w-3 h-3 ${isRefreshingChats ? 'animate-spin text-emerald-400' : ''}`} />
                        <span className="text-xs font-semibold">Обновить</span>
                      </button>

                      <button
                        onClick={() => setIsChatExpanded(!isChatExpanded)}
                        className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-800 bg-slate-950/50 transition"
                        title={isChatExpanded ? "Свернуть" : "Развернуть"}
                        id="expand-chats-button"
                      >
                        {isChatExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {isChatExpanded && (
                  <div className="space-y-2 pt-1">
                    {!lastMessage ? (
                      <div className="text-slate-500 text-center text-xs py-4 bg-slate-950/40 rounded border border-slate-800/40 italic">
                        Нет входящих сообщений. Напишите сообщение в симуляторе бота.
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {/* Scrollable box exactly 6 lines with scroll */}
                        <div className="h-[145px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs space-y-2">
                          <div className="flex items-center justify-between font-semibold">
                            <button
                              onClick={() => {
                                setActiveTab('simulator');
                                setBotUser(lastMessage.sender);
                                if (stations.length > 0 && !botSelectedStation) {
                                  setBotSelectedStation(stations[0].id);
                                }
                              }}
                              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 hover:underline cursor-pointer transition focus:outline-none"
                              title={`Перейти в чат-симулятор для написания сообщения от ${lastMessage.sender}`}
                            >
                              <User className="w-3.5 h-3.5 text-emerald-500" /> {lastMessage.sender}
                            </button>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500 font-mono">
                                {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <button
                                onClick={() => handleDeleteChatMessage(lastMessage.id)}
                                className="p-0.5 text-rose-500 hover:text-rose-450 hover:bg-rose-500/10 rounded transition cursor-pointer"
                                title="Удалить это сообщение"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="italic font-sans text-slate-200">"{lastMessage.text}"</p>

                          {/* Parsed Meta Block */}
                          {lastMessage.parsed && (
                            <div className="p-2 rounded bg-slate-900 border border-slate-800/50 text-[10px] space-y-1">
                              <div className="flex items-center justify-between border-b border-slate-800/40 pb-1 mb-1">
                                <span className="font-medium text-slate-300">Извлеченные сущности ИИ:</span>
                                {lastMessage.isFake ? (
                                  <span className="text-rose-400 font-bold flex items-center gap-0.5">
                                    <ShieldAlert className="w-3 h-3" /> ФЕЙК
                                  </span>
                                ) : (
                                  <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                                    <CheckCircle2 className="w-3 h-3" /> Валидно
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-slate-400">
                                <div>Станция: <strong className="text-slate-200">{lastMessage.parsed.brand || 'не указана'}</strong></div>
                                <div>Адрес: <strong className="text-slate-200">{lastMessage.parsed.address || 'не указан'}</strong></div>
                                <div>Топливо: <strong className="text-slate-200">{lastMessage.parsed.fuelType || 'не указано'}</strong></div>
                                <div>Статус: <strong className="text-slate-200">{lastMessage.parsed.status || 'не указан'}</strong></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Рекомендательный Алгоритм */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 sm:p-3 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <div>
                      <h3 className="text-sm font-bold font-display text-white">Рекомендательный Алгоритм</h3>
                      <p className="text-[9px] text-slate-500 font-mono leading-none mt-0.5 max-w-[200px] truncate" title={settings.recommendationApiUrl || 'https://banner-airplane-yard-relay.trycloudflare.com/recommendation'}>
                        API: {settings.recommendationApiUrl || 'https://banner-airplane-yard-relay.trycloudflare.com/recommendation'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isFetchingRecommendations ? (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1 font-mono">
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Опрос...
                      </span>
                    ) : externalRecommendation ? (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Внешний ИИ
                      </span>
                    ) : (
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono" title={recommendationError || 'Туннель выключен'}>
                        Локальный ИИ
                      </span>
                    )}
                    <button
                      onClick={fetchRecommendations}
                      disabled={isFetchingRecommendations}
                      className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Проверить внешний бекенд рекомендаций"
                    >
                      <RefreshCw className={`w-3 h-3 ${isFetchingRecommendations ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {recommendationError && (
                  <div className="p-1.5 rounded bg-amber-500/[0.03] border border-amber-500/15 text-[10px] text-amber-300/90 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-[10.5px]">Внешний туннель Cloudflare оффлайн</span>
                      Пожалуйста, запустите `cloudflared` туннель на вашем сервере. Задействован локальный алгоритм расчета.
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {/* If we have external recommendations, show them */}
                  {externalRecommendation ? (
                    <div className="space-y-2">
                      {Array.isArray(externalRecommendation) ? (
                        externalRecommendation.map((rec: any, idx: number) => (
                          <div key={idx} className="p-2 sm:p-2.5 rounded-lg bg-indigo-500/[0.02] border border-indigo-500/20 flex gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-bold flex items-center justify-center font-display text-sm shrink-0">
                              #{idx + 1}
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 block font-display">Рекомендация Внешнего ИИ</span>
                              <h4 className="font-bold text-white text-sm">{rec.title || rec.stationName || rec.brand || 'Рекомендация'}</h4>
                              <p className="text-xs text-slate-300 mt-1">{rec.description || rec.text || rec.recommendation || JSON.stringify(rec)}</p>
                              {rec.score && (
                                <div className="mt-2 flex items-center gap-1.5">
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                    Скор: {rec.score}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : typeof externalRecommendation === 'object' ? (
                        <div className="p-2.5 rounded-lg bg-indigo-500/[0.02] border border-indigo-500/20">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 block font-display mb-1">Рекомендация Внешнего ИИ</span>
                          {externalRecommendation.title && <h4 className="font-bold text-white text-sm mb-1">{externalRecommendation.title}</h4>}
                          <p className="text-xs text-slate-300 whitespace-pre-line">{externalRecommendation.description || externalRecommendation.recommendation || externalRecommendation.message || JSON.stringify(externalRecommendation, null, 2)}</p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-lg bg-indigo-500/[0.02] border border-indigo-500/20">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 block font-display mb-1">Рекомендация Внешнего ИИ</span>
                          <p className="text-xs text-slate-300">{String(externalRecommendation)}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Fallback Local Smart Recommendation */
                    stations.filter(s => Object.values(s.status).some(v => v === 'available')).length === 0 ? (
                      <div className="text-slate-500 text-sm py-4 text-center">Нет станций с активным наличием топлива для рекомендаций.</div>
                    ) : (
                      stations
                        .map(s => {
                          let score = 0;
                          const availCount = Object.values(s.status).filter(v => v === 'available').length;
                          score += availCount * 30;
                          if (s.queueLength === 'none') score += 40;
                          else if (s.queueLength === 'short') score += 20;
                          else if (s.queueLength === 'medium') score -= 10;
                          else if (s.queueLength === 'long') score -= 50;

                          score += Math.round(s.confidenceScore * 15);
                          return { s, score };
                        })
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 2)
                        .map(({ s, score }, index) => (
                          <div key={s.id} className="p-2 sm:p-2.5 rounded-lg bg-emerald-500/[0.02] border border-emerald-500/20 flex gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center justify-center font-display text-sm shrink-0">
                              #{index + 1}
                            </div>
                            <div>
                              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 block font-display">Рекомендуемый маршрут</span>
                              <h4 className="font-bold text-white text-sm">{s.brand} — {s.address}</h4>
                              <p className="text-xs text-slate-300 mt-1">
                                Рекомендуется ехать сюда: очереди {s.queueLength === 'none' ? 'нет' : s.queueLength === 'short' ? 'минимальные' : 'приемлемые'}. Есть {Object.entries(s.status).filter(([_, v]) => v === 'available').map(([k]) => k === 'DT' ? 'ДТ' : k).join(', ')}.
                              </p>
                              <div className="mt-2 flex items-center gap-1.5">
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                  Индекс Скора: {score}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                    )
                  )}
                </div>
              </div>

          </div>
        )}

        {/* --- 🤖 TAB 2: INTERACTIVE SIMULATORS --- */}
        {activeTab === 'simulator' && (
          <div className="max-w-xl mx-auto space-y-3.5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 shadow-2xl relative overflow-hidden">
              
              <div className="mb-4 pb-2.5 border-b border-slate-800">
                <h2 className="text-base font-bold font-display text-white flex items-center gap-1.5">
                  <Bot className="w-4.5 h-4.5 text-emerald-400" /> FeedBack_Bot
                </h2>
              </div>

              {feedbackSuccess && (
                <div className="mb-4 p-3.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feedbackSuccess}</span>
                </div>
              )}

              {actionLoading && !feedbackSuccess && (
                <div className="mb-4 p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 italic flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Обработка данных парсером...</span>
                </div>
              )}

              {/* Action Form */}
              <div className="space-y-3">
                <div className="space-y-2.5">
                  <div className="p-2 bg-slate-950 border border-slate-850 rounded-xl text-xs flex flex-wrap items-center gap-1 justify-between">
                    <div className="flex items-center gap-1 text-slate-300">
                      <span className="font-bold text-white">АЗС:</span>
                      <span className="truncate max-w-[200px]">
                        {stations.find(s => s.id === botSelectedStation)?.brand || (stations[0] ? stations[0].brand : 'Не выбрана')}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">
                        ({stations.find(s => s.id === botSelectedStation)?.address || (stations[0] ? stations[0].address : '—')})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Топливо:</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold font-mono rounded text-[10px]">
                        {feedbackSelectedFuel === 'AI92' ? 'АИ-92' : feedbackSelectedFuel === 'AI95' ? 'АИ-95' : 'ДТ'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Telegram Bot Style Buttons Menu */}
                <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Кнопочный интерфейс бота ({feedbackSelectedFuel === 'AI92' ? 'АИ-92' : feedbackSelectedFuel === 'AI95' ? 'АИ-95' : 'ДТ'})</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                    <button
                      onClick={() => {
                        const targetStationId = botSelectedStation || (stations[0]?.id || '');
                        if (!targetStationId) {
                          alert('Пожалуйста, сначала выберите АЗС');
                          return;
                        }
                        submitReport({ stationId: targetStationId, fuelType: feedbackSelectedFuel, type: 'empty', source: 'report_bot' });
                      }}
                      className="px-3 py-2 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-800/40 text-rose-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      🚫 {feedbackSelectedFuel === 'AI92' ? '92' : feedbackSelectedFuel === 'AI95' ? '95' : 'ДТ'}: Нет топлива
                    </button>
                    <button
                      onClick={() => {
                        const targetStationId = botSelectedStation || (stations[0]?.id || '');
                        if (!targetStationId) {
                          alert('Пожалуйста, сначала выберите АЗС');
                          return;
                        }
                        submitReport({ stationId: targetStationId, fuelType: feedbackSelectedFuel, type: 'unloading', source: 'report_bot' });
                      }}
                      className="px-3 py-2 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-800/40 text-amber-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      🚚 {feedbackSelectedFuel === 'AI92' ? '92' : feedbackSelectedFuel === 'AI95' ? '95' : 'ДТ'}: Разгружают
                    </button>
                    <button
                      onClick={() => {
                        const targetStationId = botSelectedStation || (stations[0]?.id || '');
                        if (!targetStationId) {
                          alert('Пожалуйста, сначала выберите АЗС');
                          return;
                        }
                        submitReport({ stationId: targetStationId, fuelType: feedbackSelectedFuel, type: 'available', source: 'report_bot' });
                      }}
                      className="px-3 py-2 bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      ⛽ {feedbackSelectedFuel === 'AI92' ? '92' : feedbackSelectedFuel === 'AI95' ? '95' : 'ДТ'}: Есть в продаже
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-2 space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ориентировочное количество машин в очереди:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5">
                      <button
                        onClick={() => {
                          const targetStationId = botSelectedStation || (stations[0]?.id || '');
                          if (!targetStationId) {
                            alert('Пожалуйста, сначала выберите АЗС');
                            return;
                          }
                          submitReport({ stationId: targetStationId, queueLength: 'none', source: 'report_bot' });
                        }}
                        className="px-2 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 rounded text-xs text-slate-300 transition cursor-pointer"
                      >
                        🟢 до 5машин
                      </button>
                      <button
                        onClick={() => {
                          const targetStationId = botSelectedStation || (stations[0]?.id || '');
                          if (!targetStationId) {
                            alert('Пожалуйста, сначала выберите АЗС');
                            return;
                          }
                          submitReport({ stationId: targetStationId, queueLength: 'short', source: 'report_bot' });
                        }}
                        className="px-2 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 rounded text-xs text-slate-300 transition cursor-pointer"
                      >
                        🟡 до 20машин
                      </button>
                      <button
                        onClick={() => {
                          const targetStationId = botSelectedStation || (stations[0]?.id || '');
                          if (!targetStationId) {
                            alert('Пожалуйста, сначала выберите АЗС');
                            return;
                          }
                          submitReport({ stationId: targetStationId, queueLength: 'medium', source: 'report_bot' });
                        }}
                        className="px-2 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 rounded text-xs text-slate-300 transition cursor-pointer"
                      >
                        🟠 до40машин
                      </button>
                      <button
                        onClick={() => {
                          const targetStationId = botSelectedStation || (stations[0]?.id || '');
                          if (!targetStationId) {
                            alert('Пожалуйста, сначала выберите АЗС');
                            return;
                          }
                          submitReport({ stationId: targetStationId, queueLength: 'long', source: 'report_bot' });
                        }}
                        className="px-2 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 rounded text-xs text-slate-300 transition cursor-pointer"
                      >
                        🔴 от 40 и более
                      </button>
                    </div>
                  </div>
                </div>

                {/* Custom text chat parsing area */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs text-slate-400 font-bold block">Или напишите в свободной форме (сработает LLM):</label>
                  <div className="flex gap-1.5 items-center">
                    <div className="flex-1 flex gap-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1 items-center focus-within:ring-1 focus-within:ring-emerald-500 transition">
                      <input
                        type="text"
                        value={botInput}
                        onChange={(e) => setBotInput(e.target.value)}
                        placeholder="Например: На Лукойле Ленина разгружают ДТ, очередь небольшая"
                        className="flex-1 bg-transparent border-none py-2 text-xs outline-none text-white placeholder-slate-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') submitChatMessage(botInput, botUser);
                        }}
                      />
                      <button
                        onClick={handleVoiceInput}
                        title="Голосовой ввод"
                        className={`p-1.5 rounded-lg transition shrink-0 cursor-pointer ${
                          isListening 
                            ? 'bg-rose-600/20 text-rose-400 animate-pulse border border-rose-500/40' 
                            : 'text-slate-400 hover:text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => submitChatMessage(botInput, botUser)}
                      disabled={!botInput.trim() || actionLoading}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1 shrink-0 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Отправить
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- 🧠 TAB 3: ADMIN SETTINGS & CONTROL PANEL --- */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            {/* Control Panel Title & Sub-tabs bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                    <Sliders className="w-5.5 h-5.5 text-emerald-400" /> Панель Администратора
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Инструменты для управления сетью АЗС, API-интеграцией, каналами мониторинга чатов и параметрами ИИ-модели.
                  </p>
                </div>

                {/* Sub-tabs buttons */}
                <div className="flex flex-wrap gap-2 border-b md:border-b-0 border-slate-800 pb-3 md:pb-0">
                  <button
                    onClick={() => setAdminSubTab('stations')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      adminSubTab === 'stations'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" /> Управление АЗС & API
                  </button>
                  <button
                    onClick={() => setAdminSubTab('chats')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      adminSubTab === 'chats'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Каналы & Чат
                  </button>
                  <button
                    onClick={() => setAdminSubTab('ai')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      adminSubTab === 'ai'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5" /> Настройки AI
                  </button>
                  <button
                    id="admin-sub-tab-subscribers"
                    onClick={() => setAdminSubTab('subscribers')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      adminSubTab === 'subscribers'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Подписчики
                  </button>
                  <button
                    id="admin-sub-tab-ads"
                    onClick={() => setAdminSubTab('ads')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      adminSubTab === 'ads'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-850 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Megaphone className="w-3.5 h-3.5" /> Реклама & Монетизация
                  </button>
                </div>
              </div>
            </div>

            {/* Content for sub-tab: STATIONS */}
            {adminSubTab === 'stations' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                {/* Form column (5 cols) */}
                <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                  <div className="border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-400" />
                      {isEditingExisting ? 'Редактировать параметры АЗС' : 'Добавить новую АЗС в сеть'}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isEditingExisting
                        ? 'Изменение адреса, геолокации, статуса топлива и параметров API-интеграции заправки.'
                        : 'Новая точка мгновенно появится на карте мониторинга и в отчетах симуляции.'}
                    </p>
                  </div>

                  <form onSubmit={isEditingExisting ? handleEditStation : handleAddStation} className="space-y-2">
                    {/* Brand & Address */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">Сеть / Бренд АЗС:</label>
                        <input
                          type="text"
                          required
                          value={stationBrand}
                          onChange={(e) => setStationBrand(e.target.value)}
                          placeholder="Роснефть, Лукойл"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">Адрес:</label>
                        <input
                          type="text"
                          required
                          value={stationAddress}
                          onChange={(e) => setStationAddress(e.target.value)}
                          placeholder="пр-т Мира, 102"
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">Широта (Lat):</label>
                        <input
                          type="number"
                          step="0.000001"
                          required
                          value={stationLat}
                          onChange={(e) => setStationLat(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-0.5">Долгота (Lng):</label>
                        <input
                          type="number"
                          step="0.000001"
                          required
                          value={stationLng}
                          onChange={(e) => setStationLng(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-xs text-white focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* API Integration Section */}
                    <div className="bg-slate-950/60 p-2 border border-slate-800/80 rounded-lg space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Интеграция с API АЗС</span>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-slate-300 block mb-0.5">API URL Поставщика/Сенсоров:</label>
                          <input
                            type="url"
                            value={stationApiUrl}
                            onChange={(e) => setStationApiUrl(e.target.value)}
                            placeholder="https://api.partner.ru/station/status"
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200 placeholder-slate-700 outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-300 block mb-0.5">Ключ авторизации API (API Key):</label>
                          <input
                            type="password"
                            value={stationApiKey}
                            onChange={(e) => setStationApiKey(e.target.value)}
                            placeholder="••••••••••••••••••••••••"
                            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200 placeholder-slate-700 outline-none focus:border-emerald-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit row */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition text-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {actionLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                        {isEditingExisting ? 'Сохранить изменения АЗС' : 'Добавить АЗС'}
                      </button>
                      {isEditingExisting && (
                        <button
                          type="button"
                          onClick={clearStationForm}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition cursor-pointer"
                        >
                          Отмена
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Stations List Column (7 cols) */}
                <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col h-[640px]">
                  <div className="border-b border-slate-800 pb-2 mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" /> Текущая сеть АЗС ({stations.length})
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Список всех заправок в базе. Выберите любую АЗС для изменения всех параметров (включая API интеграцию) или удаления.
                    </p>
                  </div>

                  {/* Gas station rows scroll area */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
                    {stations.map((s) => {
                      const isLinkedToApi = !!s.apiUrl;
                      return (
                        <div
                          key={s.id}
                          className={`p-3 rounded-lg border transition ${
                            stationFormId === s.id
                              ? 'bg-emerald-950/20 border-emerald-500/50'
                              : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-xs">{s.brand}</span>
                                <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                  ID: {s.id}
                                </span>
                                {isLinkedToApi && (
                                  <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                                    <Activity className="w-2.5 h-2.5 animate-pulse" /> API Интеграция
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-300 block mt-0.5">{s.address}</span>
                              
                              {isLinkedToApi && (
                                <div className="mt-2 text-[10px] text-slate-500 font-mono truncate max-w-xs md:max-w-md bg-slate-950 p-1 rounded border border-slate-800">
                                  Endpoint: <span className="text-slate-400">{s.apiUrl}</span>
                                </div>
                              )}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                              {isLinkedToApi && (
                                <button
                                  type="button"
                                  onClick={() => handleSyncStationApi(s.id)}
                                  disabled={actionLoading}
                                  className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[10px] font-semibold rounded cursor-pointer transition flex items-center gap-1"
                                  title="Запросить свежие данные АЗС через API URL"
                                >
                                  <RefreshCw className={`w-2.5 h-2.5 ${actionLoading ? 'animate-spin' : ''}`} /> Опросить API
                                </button>
                              )}
                              <button
                                onClick={() => populateStationForm(s)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-semibold rounded cursor-pointer transition"
                              >
                                Изменить
                              </button>
                              <button
                                onClick={() => handleDeleteStation(s.id)}
                                className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/30 text-rose-300 text-[10px] font-semibold rounded cursor-pointer transition"
                              >
                                Удалить
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Content for sub-tab: CHATS & CHANNELS */}
            {adminSubTab === 'chats' && (
              <div className="space-y-3.5">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                  {/* Form column (5 cols) */}
                  <div className="lg:col-span-5 space-y-3.5">
                    {/* Create chat channel */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                      <div className="border-b border-slate-800 pb-2">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Plus className="w-4 h-4 text-emerald-400" /> Добавить чат-канал (Telegram / Чат)
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Создайте отдельную группу или канал для сбора информации от водителей. Укажите ключевые слова, чтобы фильтрация работала автоматически.
                        </p>
                      </div>

                      <form onSubmit={handleAddChannel} className="space-y-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">Название чат-канала:</label>
                          <input
                            type="text"
                            required
                            value={newChannelName}
                            onChange={(e) => setNewChannelName(e.target.value)}
                            placeholder="Трасса М-2 Водители"
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">Ключевые слова для фильтрации (через запятую):</label>
                          <textarea
                            rows={3}
                            value={newChannelKeywords}
                            onChange={(e) => setNewChannelKeywords(e.target.value)}
                            placeholder="м-2, белгород, тула, заправка, бензин, дизель"
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 placeholder-slate-600 focus:border-emerald-500 outline-none font-mono"
                          />
                          <span className="text-[9px] text-slate-500 mt-1 block">
                            Сообщения, содержащие эти слова, будут автоматически отображаться в этом канале на главной панели.
                          </span>
                        </div>

                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {actionLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                          Создать чат-канал
                        </button>
                      </form>
                    </div>

                    {/* Подключить чат */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                      <div className="border-b border-slate-800 pb-1.5">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Link2 className="w-4 h-4 text-blue-400" /> Подключить чат
                        </h3>
                      </div>

                      <form onSubmit={handleConnectExternalChat} className="space-y-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-300 block mb-1">Ссылка на чат:</label>
                          <input
                            type="url"
                            required
                            value={externalChatUrl}
                            onChange={(e) => setExternalChatUrl(e.target.value)}
                            placeholder="https://example.com/join/..."
                            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white placeholder-slate-600 focus:border-blue-500 outline-none font-mono"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition text-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {actionLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                          Установить соединение
                        </button>
                      </form>

                      {connectedChats.length > 0 && (
                        <div className="pt-3 border-t border-slate-800 space-y-2.5">
                          <span className="text-xs font-bold text-slate-300 block">Активные подключения ({connectedChats.length}):</span>
                          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
                            {connectedChats.map((chat) => (
                              <div key={chat.url} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg flex items-start justify-between gap-2.5 transition hover:border-slate-700">
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                    <span className="text-xs font-bold text-white truncate">{chat.title}</span>
                                  </div>
                                  <span className="text-[9px] text-slate-500 break-all font-mono block">{chat.url}</span>
                                  <span className="text-[9px] text-slate-600 block">
                                    Подключен: {new Date(chat.connectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDisconnectChat(chat.url)}
                                  className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded border border-rose-950/20 transition cursor-pointer shrink-0"
                                  title="Отключить этот чат"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Channels List Column (7 cols) */}
                  <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col h-[620px]">
                    <div className="border-b border-slate-800 pb-2 mb-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-400" /> Список чат-каналов ({channels.length})
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Активные каналы мониторинга с заданными правилами контентного фильтра.
                      </p>
                    </div>

                    {/* Channel rows scroll area */}
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 scrollbar-thin">
                      {channels.map((chan) => {
                        const isSystem = chan.id === 'chat-m4' || chan.id === 'chat-city' || chan.id === 'chat-freight';
                        return (
                          <div
                            key={chan.id}
                            className={`p-3.5 rounded-lg border transition ${
                              chan.excludeFromAnalysis 
                                ? 'border-slate-800/60 bg-slate-950/20 opacity-75' 
                                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-white text-xs sm:text-sm">{chan.name}</span>
                                  {isSystem ? (
                                    <span className="text-[9px] text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.2 rounded font-medium">
                                      Системный
                                    </span>
                                  ) : (
                                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded font-medium">
                                      Созданный
                                    </span>
                                  )}
                                  
                                  {chan.excludeFromAnalysis ? (
                                    <span className="text-[9px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                                      <span className="w-1 h-1 rounded-full bg-rose-500"></span> Исключен из анализа
                                    </span>
                                  ) : (
                                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                                      <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Участвует в анализе
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                                  ID: {chan.id}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                                {/* Segmented control for inclusion/exclusion */}
                                <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-0.5 shadow-inner">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (chan.excludeFromAnalysis) {
                                        handleToggleChannelAnalysis(chan.id);
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                                      !chan.excludeFromAnalysis
                                        ? 'bg-emerald-550/20 text-emerald-400 border border-emerald-500/20 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-300 border border-transparent opacity-50'
                                    }`}
                                    title="Включить этот чат-канал в RAG-анализ"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Включить в анализ</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!chan.excludeFromAnalysis) {
                                        handleToggleChannelAnalysis(chan.id);
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                                      chan.excludeFromAnalysis
                                        ? 'bg-amber-550/20 text-amber-400 border border-amber-500/20 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-300 border border-transparent opacity-50'
                                    }`}
                                    title="Исключить этот чат-канал из RAG-анализа"
                                  >
                                    <X className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Исключить из анализа</span>
                                  </button>
                                </div>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteChannel(chan.id)}
                                  className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/30 text-rose-300 text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1.5 hover:text-white shadow-sm"
                                  title="Удалить этот чат из системы"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Удалить чат</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* РФ ПАРСЕР, АГРЕГАТОР И АНАЛИТИКА */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3.5">
                  {/* HEADER */}
                  <div className="border-b border-slate-800 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-400 animate-pulse" /> РФ-Парсер & Агрегатор Сообщений (Telegram, ВКонтакте, MAX)
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Асинхронный сбор и автоматический анализ сообщений водителей и потребителей на территории РФ.
                      </p>
                    </div>
                    
                    <div className="flex gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg shrink-0 overflow-x-auto">
                      {(['telegram', 'vk', 'max', 'db', 'fastapi'] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setParserSubTab(tab)}
                          className={`px-2 py-1 rounded text-[10px] font-semibold transition uppercase tracking-wider cursor-pointer whitespace-nowrap ${
                            parserSubTab === tab
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {tab === 'telegram' && 'Telegram'}
                          {tab === 'vk' && 'ВКонтакте (VK)'}
                          {tab === 'max' && 'MAX (Scraper)'}
                          {tab === 'db' && 'Структура СУБД'}
                          {tab === 'fastapi' && 'FastAPI API'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CONTROLLER GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                    {/* LEFT side: Configurations depending on parserSubTab */}
                    <div className="lg:col-span-6 bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
                      
                      {/* Telegram Config tab */}
                      {parserSubTab === 'telegram' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                              <span className="text-xs font-bold text-white">Параметры Telegram API & MTProto</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={tgIsActive} 
                                onChange={(e) => setTgIsActive(e.target.checked)} 
                                className="sr-only peer" 
                              />
                              <div className="w-7 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                              <span className="ml-1.5 text-[10px] font-medium text-slate-400">
                                {tgIsActive ? 'Активен' : 'Отключен'}
                              </span>
                            </label>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1 font-mono">TG_API_ID:</label>
                              <input 
                                type="text" 
                                value={tgApiId} 
                                onChange={(e) => setTgApiId(e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white font-mono outline-none focus:border-emerald-500" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1 font-mono">TG_API_HASH:</label>
                              <input 
                                type="password" 
                                value={tgApiHash} 
                                onChange={(e) => setTgApiHash(e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white font-mono outline-none focus:border-emerald-500" 
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Группы и каналы (через запятую):</label>
                            <input 
                              type="text" 
                              value={tgChannels} 
                              onChange={(e) => setTgChannels(e.target.value)} 
                              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500" 
                            />
                            <span className="text-[9px] text-slate-500 mt-1 block leading-relaxed">
                              Использует асинхронный клиент Telethon/Pyrogram для парсинга новых постов и пересылки в очередь RabbitMQ/Redis.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* VK Config tab */}
                      {parserSubTab === 'vk' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-xs font-bold text-white">Интеграция с ВКонтакте (VK API)</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={vkIsActive} 
                                onChange={(e) => setVkIsActive(e.target.checked)} 
                                className="sr-only peer" 
                              />
                              <div className="w-7 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                              <span className="ml-1.5 text-[10px] font-medium text-slate-400">
                                {vkIsActive ? 'Активен' : 'Отключен'}
                              </span>
                            </label>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1 font-mono">VK_SERVICE_ACCESS_TOKEN:</label>
                            <input 
                              type="password" 
                              value={vkAccessToken} 
                              onChange={(e) => setVkAccessToken(e.target.value)} 
                              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white font-mono outline-none focus:border-emerald-500" 
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">ID Групп / Сообществ:</label>
                              <input 
                                type="text" 
                                value={vkGroupIds} 
                                onChange={(e) => setVkGroupIds(e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white font-mono outline-none focus:border-emerald-500" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Интервал опроса (мин):</label>
                              <input 
                                type="number" 
                                value={vkParseInterval} 
                                onChange={(e) => setVkParseInterval(e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white font-mono outline-none focus:border-emerald-500" 
                              />
                            </div>
                          </div>
                          <span className="text-[9px] text-slate-500 block leading-relaxed">
                            Парсер опрашивает открытые стены сообществ РФ с помощью метода <code className="bg-slate-900 text-amber-400 px-1 rounded">wall.get</code>, извлекая комментарии и посты о пробках и топливе.
                          </span>
                        </div>
                      )}

                      {/* MAX Config tab */}
                      {parserSubTab === 'max' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                              <span className="text-xs font-bold text-white">Скрейпер MAX (Playwright Scraper)</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={maxIsActive} 
                                onChange={(e) => setMaxIsActive(e.target.checked)} 
                                className="sr-only peer" 
                              />
                              <div className="w-7 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-300 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                              <span className="ml-1.5 text-[10px] font-medium text-slate-400">
                                {maxIsActive ? 'Активен' : 'Отключен'}
                              </span>
                            </label>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1">Адрес закрытой платформы / форума:</label>
                            <input 
                              type="text" 
                              value={maxUrl} 
                              onChange={(e) => setMaxUrl(e.target.value)} 
                              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500" 
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">CSS Селектор контента:</label>
                              <input 
                                type="text" 
                                value={maxSelector} 
                                onChange={(e) => setMaxSelector(e.target.value)} 
                                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400 block mb-1">Метод авторизации:</label>
                              <select 
                                value={maxAuthType} 
                                onChange={(e) => setMaxAuthType(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white outline-none focus:border-emerald-500 cursor-pointer"
                              >
                                <option value="cookies">Куки сессии (JSON payload)</option>
                                <option value="credentials">Имя пользователя / Пароль</option>
                                <option value="none">Без авторизации</option>
                              </select>
                            </div>
                          </div>

                          <div className="bg-slate-900 border border-slate-850 rounded p-2 text-[10px] font-mono leading-relaxed text-slate-300">
                            <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Python Playwright Script Snippet:
                            </div>
                            <pre className="text-[9px] text-amber-200/90 overflow-x-auto whitespace-pre scrollbar-thin max-h-[110px]">
{`from playwright.async_api import async_playwright

async def run_scraper():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        # Загрузка куки сессии для обхода логина
        if AUTH_TYPE == 'cookies':
            await context.add_cookies(load_saved_cookies())
        page = await context.new_page()
        await page.goto("${maxUrl}")
        await page.wait_for_selector("${maxSelector}")
        posts = await page.query_selector_all("${maxSelector}")
        return [await post.inner_text() for post in posts]`}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* DB Schema tab */}
                      {parserSubTab === 'db' && (
                        <div className="space-y-3">
                          <div className="border-b border-slate-800/60 pb-1.5 flex justify-between items-center">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Database className="w-3.5 h-3.5 text-emerald-400" /> Структура СУБД (PostgreSQL Schema)
                            </span>
                            <span className="text-[9px] bg-slate-800 text-slate-400 font-mono px-1.5 py-0.2 rounded border border-slate-700">Schema Active</span>
                          </div>

                          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                            <div className="p-2 rounded bg-slate-900 border border-slate-800">
                              <span className="text-[10px] font-bold text-emerald-400 font-mono block">1. Таблица источников (sources)</span>
                              <pre className="text-[9px] text-slate-300 font-mono mt-1 whitespace-pre scrollbar-thin">
{`CREATE TABLE sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL -- 'telegram', 'vk', 'max'
);`}
                              </pre>
                            </div>

                            <div className="p-2 rounded bg-slate-900 border border-slate-800">
                              <span className="text-[10px] font-bold text-emerald-400 font-mono block">2. Таблица сообщений (messages)</span>
                              <pre className="text-[9px] text-slate-300 font-mono mt-1 whitespace-pre scrollbar-thin">
{`CREATE TABLE messages (
    id BIGINT,
    source_id INT REFERENCES sources(id),
    text TEXT NOT NULL,
    date TIMESTAMP DEFAULT NOW(),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    raw JSONB,
    PRIMARY KEY (id, source_id)
);`}
                              </pre>
                            </div>

                            <div className="p-2 rounded bg-slate-900 border border-slate-800">
                              <span className="text-[10px] font-bold text-emerald-400 font-mono block">3. Таблица пользователей (users)</span>
                              <pre className="text-[9px] text-slate-300 font-mono mt-1 whitespace-pre scrollbar-thin">
{`CREATE TABLE users (
    id BIGINT,
    username VARCHAR(255),
    source_id INT REFERENCES sources(id),
    PRIMARY KEY (id, source_id)
);`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* FastAPI Analytics Tab */}
                      {parserSubTab === 'fastapi' && (
                        <div className="space-y-3">
                          <div className="border-b border-slate-800/60 pb-1.5 flex justify-between items-center">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Code className="w-3.5 h-3.5 text-blue-400" /> Аналитический REST API (FastAPI)
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">http://localhost:8000</span>
                          </div>

                          <p className="text-[10.5px] text-slate-400 leading-relaxed">
                            Веб-сервис FastAPI предоставляет агрегированные отчеты по трендам дефицита топлива и активности в каналах. Выберите GET-маршрут для проверки ответа:
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { route: '/stats/messages_per_day', label: 'Сообщения/День' },
                              { route: '/stats/active_users', label: 'Топ Пишущих' },
                              { route: '/stats/fuel_trends', label: 'Тренды по топливу' }
                            ].map((item) => (
                              <button
                                key={item.route}
                                type="button"
                                onClick={() => handleExecuteFastApiRoute(item.route)}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                                  selectedFastApiRoute === item.route
                                    ? 'bg-emerald-600/20 border border-emerald-500 text-emerald-400 shadow-sm'
                                    : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800'
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>

                          <div className="bg-slate-900 border border-slate-850 rounded p-2.5 max-h-[160px] overflow-y-auto scrollbar-thin">
                            {isFetchingFastApi ? (
                              <div className="flex items-center justify-center py-6 text-slate-500 text-xs gap-1.5 font-mono">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                                <span>GET {selectedFastApiRoute}...</span>
                              </div>
                            ) : (
                              <pre className="text-[9px] text-emerald-300 font-mono whitespace-pre-wrap leading-relaxed">
                                {JSON.stringify(fastApiResponseData, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* RIGHT side: Live System Terminal & Architecture flow */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-3.5">
                      
                      {/* Architecture visual display */}
                      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Контур данных (Data Pipeline Flow)</span>
                          <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active Pipeline
                          </span>
                        </div>

                        {/* Mini grid of steps */}
                        <div className="grid grid-cols-5 gap-1.5 text-[10px] text-center font-mono">
                          <div className="bg-slate-900/60 p-1.5 border border-slate-800 rounded">
                            <div className="text-blue-400 font-bold">1. Сбор</div>
                            <div className="text-[7.5px] text-slate-500 mt-0.5">TG/VK/Max</div>
                          </div>
                          <div className="bg-slate-900/60 p-1.5 border border-slate-800 rounded">
                            <div className="text-amber-400 font-bold">2. Очередь</div>
                            <div className="text-[7.5px] text-slate-500 mt-0.5">Redis Queue</div>
                          </div>
                          <div className="bg-slate-900/60 p-1.5 border border-slate-800 rounded">
                            <div className="text-purple-400 font-bold">3. ИИ NLP</div>
                            <div className="text-[7.5px] text-slate-500 mt-0.5">Gemini API</div>
                          </div>
                          <div className="bg-slate-900/60 p-1.5 border border-slate-800 rounded">
                            <div className="text-emerald-400 font-bold">4. Хранение</div>
                            <div className="text-[7.5px] text-slate-500 mt-0.5">PostgreSQL</div>
                          </div>
                          <div className="bg-slate-900/60 p-1.5 border border-slate-800 rounded">
                            <div className="text-sky-400 font-bold">5. Выдача</div>
                            <div className="text-[7.5px] text-slate-500 mt-0.5">FastAPI Layer</div>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Console logs */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col flex-1 min-h-[175px] justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 mb-2">
                            <span className="text-xs font-bold text-slate-300 font-display flex items-center gap-1.5">
                              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Лог выполнения Агрегатора
                            </span>
                            <button
                              type="button"
                              onClick={handleRunParserTest}
                              disabled={isTestingParser}
                              className={`px-3 py-1 rounded text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                isTestingParser
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                              }`}
                            >
                              {isTestingParser ? (
                                <>
                                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                                  <span>Парсинг...</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-2.5 h-2.5" />
                                  <span>Запустить сбор сообщений</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="font-mono text-[9px] leading-relaxed text-slate-300 space-y-1 bg-black/40 p-2.5 rounded-lg max-h-[120px] overflow-y-auto scrollbar-thin">
                            {parserTestLogs.map((log, index) => {
                              let color = 'text-slate-300';
                              if (log.includes('✅') || log.includes('успешно') || log.includes('активно')) color = 'text-emerald-400 font-semibold';
                              if (log.includes('[Telegram]')) color = 'text-blue-400';
                              if (log.includes('[VK')) color = 'text-sky-400';
                              if (log.includes('[Max')) color = 'text-orange-400';
                              return (
                                <div key={index} className={color}>
                                  {log}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="text-[9px] text-slate-500 mt-2 text-right">
                          * Архитектура спроектирована под высокие лимиты РФ операторов.
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Content for sub-tab: LLM SETTINGS & RAG */}
            {adminSubTab === 'ai' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                {/* Left box: Prompt & RAG Tuning (Span 2) */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
                  <div>
                    <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-emerald-400" /> Настройка LLM и RAG базы
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Тонкая настройка промптов парсинга сущностей и правил фильтрации фейков в реальном времени.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Выбор LLM провайдера и модели:</label>
                        <select
                          value={settings.llmModel}
                          onChange={(e) => setSettings(prev => ({ ...prev, llmModel: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-emerald-500"
                        >
                          <optgroup label="Google Gemini API">
                            <option value="gemini-3.5-flash">Gemini 3.5 Flash (Рекомендуется)</option>
                            <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite</option>
                            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Для глубокого анализа)</option>
                          </optgroup>
                          <optgroup label="OpenAI API">
                            <option value="gpt-4o">GPT-4o (Высокая точность)</option>
                            <option value="gpt-4o-mini">GPT-4o-mini (Быстрый парсинг)</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          </optgroup>
                          <optgroup label="Anthropic API">
                            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                            <option value="claude-3-5-haiku">Claude 3.5 Haiku</option>
                          </optgroup>
                          <optgroup label="DeepSeek API">
                            <option value="deepseek-chat">DeepSeek V3 (Экономичный)</option>
                            <option value="deepseek-coder">DeepSeek Coder V2</option>
                          </optgroup>
                          <optgroup label="Локальные & Кастомные LLM">
                            <option value="ollama-llama3">Ollama: Llama 3 (8B)</option>
                            <option value="custom-endpoint">Пользовательский OpenAI-совместимый API</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Температура генерации (Креативность):</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.temperature}
                            onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                            className="flex-1 accent-emerald-500 cursor-pointer"
                          />
                          <span className="font-mono text-xs bg-slate-950 px-2 py-1 rounded border border-slate-800 w-10 text-center">
                            {settings.temperature}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* LLM Connection Token / API Key with hide-show toggle and Proxy options */}
                    <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl space-y-4">
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <Globe className="w-4 h-4 text-emerald-400" /> Настройки аутентификации и прокси
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300 block">API Ключ / Токен LLM подключения:</label>
                          <div className="relative flex items-center shadow-sm">
                            <input
                              type={showLlmApiKey ? 'text' : 'password'}
                              value={settings.llmApiKey || ''}
                              onChange={(e) => setSettings(prev => ({ ...prev, llmApiKey: e.target.value }))}
                              placeholder="Введите секретный API токен (например: sk-... или AIzaSy...)"
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 pr-10 text-xs text-slate-200 font-mono outline-none focus:border-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLlmApiKey(!showLlmApiKey)}
                              className="absolute right-3 text-slate-400 hover:text-slate-200 focus:outline-none transition cursor-pointer"
                              title={showLlmApiKey ? 'Скрыть токен' : 'Показать токен'}
                            >
                              {showLlmApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-500 block leading-normal">
                            Используется для авторизации запросов к выбранному LLM-провайдеру. Ключ безопасно маскируется и хранится на сервере.
                          </span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300 block">Тип Прокси подключения:</label>
                          <select
                            value={settings.proxyType || 'direct'}
                            onChange={(e) => setSettings(prev => ({ ...prev, proxyType: e.target.value as any }))}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-emerald-500"
                          >
                            <option value="direct">Direct Connection (Прямое подключение без прокси)</option>
                            <option value="cloudflare">Cloudflare API Shield Proxy (Обход региональных ограничений)</option>
                            <option value="custom">Custom Gateway Proxy (Свой SOCKS5/HTTP прокси)</option>
                            <option value="vpn">VPN Tunnel Gateway (Выделенный VPN-сервер сети)</option>
                          </select>
                          <span className="text-[10px] text-slate-500 block leading-normal">
                            Позволяет осуществлять бесперебойные запросы к зарубежным моделям (например, OpenAI или Anthropic).
                          </span>
                        </div>
                      </div>

                      {settings.proxyType && settings.proxyType !== 'direct' && (
                        <div className="space-y-1 pt-1">
                          <label className="text-xs font-semibold text-slate-300 block">Адрес Прокси сервера / Шлюза:</label>
                          <input
                            type="text"
                            value={settings.proxyAddress || ''}
                            onChange={(e) => setSettings(prev => ({ ...prev, proxyAddress: e.target.value }))}
                            placeholder={
                              settings.proxyType === 'cloudflare' 
                                ? 'https://gateway.cloudflare.com/v1/accounts/...' 
                                : settings.proxyType === 'vpn' 
                                  ? '10.8.0.1:8080 (VPN шлюз)' 
                                  : 'http://username:password@proxy-host:port'
                            }
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono focus:border-emerald-500 outline-none"
                          />
                          <span className="text-[10px] text-slate-500 block">
                            Укажите полный адрес прокси-сервера или приватного шлюза для перенаправления ИИ трафика.
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">Системные инструкции парсинга (System Prompt):</label>
                      <textarea
                        rows={3}
                        value={settings.systemPrompt}
                        onChange={(e) => setSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
                        placeholder="Введите системные инструкции..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">Базовый контекст RAG (Справочные Факты):</label>
                      <textarea
                        rows={3}
                        value={settings.ragContext}
                        onChange={(e) => setSettings(prev => ({ ...prev, ragContext: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono focus:ring-1 focus:ring-emerald-500 outline-none"
                        placeholder="Справочник текущей реальности заправок для выявления аномалий..."
                      />
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-semibold text-slate-300 block">Интеграционный API URL системы:</label>
                      <input
                        type="url"
                        value={settings.apiUrl || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, apiUrl: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none"
                        placeholder="Например: https://api.fuel-monitoring-system.ru/v1"
                      />
                      <span className="text-[10px] text-slate-500 block">
                        Базовый URL-адрес для синхронизации и интеграции датчиков АЗС с внешней ERP/ИИ-платформой.
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-semibold text-slate-300 block">Ссылка на бекенд рекомендаций (TryCloudflare / FastAPI):</label>
                      <input
                        type="url"
                        value={settings.recommendationApiUrl || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, recommendationApiUrl: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none"
                        placeholder="Например: https://banner-airplane-yard-relay.trycloudflare.com/recommendation"
                      />
                      <span className="text-[10px] text-slate-500 block">
                        Внешний URL-адрес через туннель Cloudflare для получения рекомендаций по топливу.
                      </span>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => saveSettings({ 
                          systemPrompt: settings.systemPrompt, 
                          ragContext: settings.ragContext, 
                          apiUrl: settings.apiUrl,
                          llmModel: settings.llmModel,
                          temperature: settings.temperature,
                          llmApiKey: settings.llmApiKey,
                          proxyType: settings.proxyType,
                          proxyAddress: settings.proxyAddress,
                          recommendationApiUrl: settings.recommendationApiUrl
                        })}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />} Сохранить настройки
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right box: Stats & Cost analysis */}
                <div className="space-y-3.5">
                  {/* Token Cost / Usage Analysis Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                      <Activity className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h3 className="text-sm font-bold text-white">Анализ затрат токенов (LLM)</h3>
                        <p className="text-[11px] text-slate-400">Мониторинг расходов на API и оптимизация запросов</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Использовано токенов</span>
                        <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                          {settings.totalTokensUsed.toLocaleString('ru-RU')}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">накопительным итогом</span>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Оценочная стоимость</span>
                        <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                          ${(settings.totalTokensUsed * 0.00000015).toFixed(5)}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          ~{((settings.totalTokensUsed * 0.00000015) * 93.5).toFixed(2)} ₽
                        </span>
                      </div>
                    </div>

                    {/* Progress with simulated limit */}
                    <div className="space-y-1.5 bg-slate-950/40 p-3 border border-slate-800/60 rounded-lg">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-slate-400">Лимит тестового баланса (50 000 токенов):</span>
                        <span className={`${settings.totalTokensUsed > 40000 ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                          {Math.min(100, Math.round((settings.totalTokensUsed / 50000) * 100))}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 rounded-full ${
                            settings.totalTokensUsed > 40000 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (settings.totalTokensUsed / 50000) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] text-slate-500 block">Предотвращает бесконечные циклы вызовов в режиме разработки.</span>
                    </div>

                    {/* Breakdown by Request Category */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Распределение по операциям:</span>
                      
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                            Парсинг отзывов и чатов (LLM Parser)
                          </span>
                          <span className="font-mono font-semibold text-slate-400">
                            {Math.round(settings.totalTokensUsed * 0.75).toLocaleString('ru-RU')} t (75%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            Запросы RAG контекста (RAG Checks)
                          </span>
                          <span className="font-mono font-semibold text-slate-400">
                            {Math.round(settings.totalTokensUsed * 0.20).toLocaleString('ru-RU')} t (20%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                            Прочие системные метаданные
                          </span>
                          <span className="font-mono font-semibold text-slate-400">
                            {Math.round(settings.totalTokensUsed * 0.05).toLocaleString('ru-RU')} t (5%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Active rates details */}
                    <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        Для активной модели <strong className="text-slate-200 font-mono">{settings.llmModel}</strong> тариф составляет $0.075 за 1 млн вв. токенов и $0.30 за 1 млн исх. токенов. Для минимизации затрат рекомендуется использовать фильтрацию пустых сообщений на клиенте.
                      </div>
                    </div>
                  </div>

                  {/* Reset State Helper */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Сбросить данные</h4>
                    <p className="text-xs text-slate-400 mb-3">Сбросьте базу к исходным данным симуляции для демонстрации.</p>
                    <button
                      onClick={resetSimulator}
                      className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/20 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Сбросить состояние АЗС и Чата
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Content for sub-tab: SUBSCRIBERS */}
            {adminSubTab === 'subscribers' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-400" /> Управление подписчиками чата
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Список реальных участников канала, контроль их активности и ограничение спама/фейковых отчетов.
                    </p>
                  </div>
                  
                  {/* Quick stats badges */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                      Всего: <strong className="text-white font-mono">{subscribers.length}</strong>
                    </span>
                    <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-900/60 rounded-lg text-emerald-400">
                      Активные: <strong className="font-mono">{subscribers.filter(s => s.status === 'active').length}</strong>
                    </span>
                    <span className="px-3 py-1 bg-rose-950/40 border border-rose-900/60 rounded-lg text-rose-400">
                      В бане: <strong className="font-mono">{subscribers.filter(s => s.status === 'banned').length}</strong>
                    </span>
                  </div>
                </div>

                {/* Subscribers list/table */}
                {subscribers.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-sm">
                    Подписчики отсутствуют.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/20">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50">
                          <th className="p-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-display">
                            Имя подписчика
                          </th>
                          <th className="p-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-display text-center">
                            Статус
                          </th>
                          <th className="p-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-display text-center">
                            Сообщений
                          </th>
                          <th className="p-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-display">
                            Последняя активность
                          </th>
                          <th className="p-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-display text-right">
                            Действие
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs">
                        {subscribers.map((sub) => (
                          <tr key={sub.name} className="hover:bg-slate-900/10 transition">
                            <td className="p-2 font-semibold text-slate-200 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold flex items-center justify-center font-display text-xs">
                                {sub.name.slice(0, 1).toUpperCase()}
                              </div>
                              <span>{sub.name}</span>
                            </td>
                            <td className="p-2 text-center">
                              {sub.status === 'banned' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-900/50">
                                  <ShieldAlert className="w-3 h-3" /> ЗАБАНЕН
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900/50">
                                  <CheckCircle2 className="w-3 h-3" /> Активен
                                </span>
                              )}
                            </td>
                            <td className="p-2 text-center font-mono font-medium text-slate-300">
                              {sub.messagesCount}
                            </td>
                            <td className="p-2 text-slate-400 font-mono text-[11px]">
                              {sub.lastActive ? new Date(sub.lastActive).toLocaleString('ru-RU') : 'Нет активности'}
                            </td>
                            <td className="p-2 text-right">
                              <button
                                id={`toggle-ban-${sub.name.replace(/\s+/g, '-')}`}
                                onClick={() => handleToggleBan(sub.name)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                                  sub.status === 'banned'
                                    ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/30'
                                    : 'bg-rose-600/10 hover:bg-rose-650 hover:text-white border-rose-500/20 text-rose-400'
                                }`}
                              >
                                {sub.status === 'banned' ? 'Разбанить' : 'БАН'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Content for sub-tab: ADS & MONETIZATION */}
            {adminSubTab === 'ads' && (
              <div className="space-y-6">
                {/* 1. Quick Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Общий доход с рекламы</p>
                      <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                        {monetizationSettings.revenueTotal.toLocaleString('ru-RU')} ₽
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Включая CPC, CPM и спонсорство</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <Coins className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Всего показов баннеров</p>
                      <h3 className="text-2xl font-bold font-mono text-white mt-1">
                        {monetizationSettings.viewsTotal.toLocaleString('ru-RU')}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Динамическая ротация каруселей</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                      <Eye className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Переходов (Кликов)</p>
                      <h3 className="text-2xl font-bold font-mono text-white mt-1">
                        {monetizationSettings.clicksTotal.toLocaleString('ru-RU')}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Конверсия по ссылкам в каруселях</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Эффективность CTR</p>
                      <h3 className="text-2xl font-bold font-mono text-violet-400 mt-1">
                        {monetizationSettings.viewsTotal > 0 
                          ? ((monetizationSettings.clicksTotal / monetizationSettings.viewsTotal) * 100).toFixed(2) 
                          : '0.00'} %
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Средний CTR каруселей</p>
                    </div>
                    <div className="p-3 bg-violet-500/10 rounded-lg text-violet-400">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* 2. Main content grids */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: AD CAROUSEL MANAGEMENT */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Carousel Rotation & Timing Configuration */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                        <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                        <div>
                          <h4 className="text-sm font-bold text-white">Параметры ротации рекламных зон</h4>
                          <p className="text-[11px] text-slate-400">Настройка таймингов авто-смены баннеров карусели для каждой зоны независимо</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Zone 1 Carousel Config */}
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>Зона 1: Баннеры в Реестре АЗС</span>
                              </h5>
                              <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={autoRotate}
                                  onChange={(e) => setAutoRotate(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">Интервал слайдов:</span>
                                <span className="text-emerald-400 font-bold font-mono">{carouselInterval} сек.</span>
                              </div>
                              <input
                                type="range"
                                min="2"
                                max="30"
                                step="1"
                                value={carouselInterval}
                                onChange={(e) => setCarouselInterval(parseInt(e.target.value))}
                                className="w-full accent-emerald-500 cursor-pointer"
                              />
                              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                <span>2с (быстро)</span>
                                <span>15с</span>
                                <span>30с (медленно)</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/60 p-2 rounded border border-slate-800 mt-2">
                            {autoRotate 
                              ? `Активно: Слайдер вращается каждые ${carouselInterval} сек. Фиксируются просмотры.`
                              : "Отключено: Слайдер не вращается. Доступно ручное переключение."}
                          </div>
                        </div>

                        {/* Zone 2 Carousel Config */}
                        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-3 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                <span>Зона 2: Баннеры в Чате</span>
                              </h5>
                              <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={autoRotate2}
                                  onChange={(e) => setAutoRotate2(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">Интервал слайдов:</span>
                                <span className="text-blue-400 font-bold font-mono">{carouselInterval2} сек.</span>
                              </div>
                              <input
                                type="range"
                                min="2"
                                max="30"
                                step="1"
                                value={carouselInterval2}
                                onChange={(e) => setCarouselInterval2(parseInt(e.target.value))}
                                className="w-full accent-blue-500 cursor-pointer"
                              />
                              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                <span>2с (быстро)</span>
                                <span>15с</span>
                                <span>30с (медленно)</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/60 p-2 rounded border border-slate-800 mt-2">
                            {autoRotate2 
                              ? `Активно: Слайдер вращается каждые ${carouselInterval2} сек. Фиксируются просмотры.`
                              : "Отключено: Слайдер не вращается. Доступно ручное переключение."}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Zone 1 Banner Manager */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded">Зона 1</span>
                          <span>Баннеры в Реестре АЗС ({banners1.length})</span>
                        </h4>
                        <button
                          onClick={() => {
                            const title = prompt('Введите заголовок баннера:');
                            if (!title) return;
                            const desc = prompt('Введите описание баннера:');
                            if (!desc) return;
                            const img = prompt('Введите URL картинки (или оставьте пустым для дефолта):') || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop';
                            const link = prompt('Введите целевую ссылку:') || 'https://example.com';
                            
                            const newBanner = {
                              id: `b1-${Date.now()}`,
                              title,
                              description: desc,
                              imageUrl: img,
                              targetUrl: link,
                              isActive: true,
                              clicks: 0,
                              views: 0
                            };
                            setBanners1([...banners1, newBanner]);
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer border border-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5" /> Новый баннер
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {banners1.map((banner, index) => (
                          <div key={banner.id} className={`p-2.5 rounded-lg border flex items-center gap-3 bg-slate-950/60 ${index === currentIdx1 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800'}`}>
                            <img src={banner.imageUrl} alt="" className="w-10 h-10 rounded object-cover border border-slate-800 shrink-0 bg-slate-900" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs font-bold text-white truncate">{banner.title}</h5>
                                {index === currentIdx1 && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1 rounded uppercase tracking-wider">Показывается сейчас</span>}
                              </div>
                              <p className="text-[10px] text-slate-400 truncate">{banner.description}</p>
                              <div className="flex items-center gap-3 text-[9px] text-slate-500 font-mono mt-1">
                                <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {banner.views.toLocaleString()}</span>
                                <span className="flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> {banner.clicks.toLocaleString()}</span>
                                <span>CTR: {banner.views > 0 ? ((banner.clicks / banner.views) * 100).toFixed(1) : '0.0'}%</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setBanners1(banners1.map(b => b.id === banner.id ? { ...b, isActive: !b.isActive } : b));
                                }}
                                className={`px-1.5 py-1 rounded text-[10px] font-semibold cursor-pointer border ${
                                  banner.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                                }`}
                              >
                                {banner.isActive ? 'Акт.' : 'Выкл.'}
                              </button>
                              {deletingBannerId === banner.id ? (
                                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded border border-rose-500/30">
                                  <span className="text-[9px] text-rose-400 font-bold px-1">Удалить?</span>
                                  <button
                                    onClick={() => {
                                      const filtered = banners1.filter(b => b.id !== banner.id);
                                      setBanners1(filtered);
                                      setDeletingBannerId(null);
                                      
                                      const deletedIdx = index;
                                      if (filtered.length === 0) {
                                        setCurrentIdx1(0);
                                      } else if (deletedIdx < currentIdx1) {
                                        setCurrentIdx1(currentIdx1 - 1);
                                      } else if (deletedIdx === currentIdx1) {
                                        setCurrentIdx1(Math.min(currentIdx1, filtered.length - 1));
                                      }
                                    }}
                                    className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-bold rounded cursor-pointer transition"
                                  >
                                    Да
                                  </button>
                                  <button
                                    onClick={() => setDeletingBannerId(null)}
                                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded cursor-pointer transition"
                                  >
                                    Нет
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeletingBannerId(banner.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                                  title="Удалить баннер"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Zone 2 Banner Manager */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] rounded">Зона 2</span>
                          <span>Баннеры в Чате ({banners2.length})</span>
                        </h4>
                        <button
                          onClick={() => {
                            const title = prompt('Введите заголовок баннера чата:');
                            if (!title) return;
                            const desc = prompt('Введите описание баннера:');
                            if (!desc) return;
                            const img = prompt('Введите URL картинки (или оставьте пустым):') || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300&auto=format&fit=crop';
                            const link = prompt('Введите целевую ссылку:') || 'https://example.com';
                            
                            const newBanner = {
                              id: `b2-${Date.now()}`,
                              title,
                              description: desc,
                              imageUrl: img,
                              targetUrl: link,
                              isActive: true,
                              clicks: 0,
                              views: 0
                            };
                            setBanners2([...banners2, newBanner]);
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer border border-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5" /> Новый баннер
                        </button>
                      </div>

                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {banners2.map((banner, index) => (
                          <div key={banner.id} className={`p-2.5 rounded-lg border flex items-center gap-3 bg-slate-950/60 ${index === currentIdx2 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800'}`}>
                            <img src={banner.imageUrl} alt="" className="w-10 h-10 rounded object-cover border border-slate-800 shrink-0 bg-slate-900" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs font-bold text-white truncate">{banner.title}</h5>
                                {index === currentIdx2 && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1 rounded uppercase tracking-wider">Показывается сейчас</span>}
                              </div>
                              <p className="text-[10px] text-slate-400 truncate">{banner.description}</p>
                              <div className="flex items-center gap-3 text-[9px] text-slate-500 font-mono mt-1">
                                <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {banner.views.toLocaleString()}</span>
                                <span className="flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> {banner.clicks.toLocaleString()}</span>
                                <span>CTR: {banner.views > 0 ? ((banner.clicks / banner.views) * 100).toFixed(1) : '0.0'}%</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setBanners2(banners2.map(b => b.id === banner.id ? { ...b, isActive: !b.isActive } : b));
                                }}
                                className={`px-1.5 py-1 rounded text-[10px] font-semibold cursor-pointer border ${
                                  banner.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                                }`}
                              >
                                {banner.isActive ? 'Акт.' : 'Выкл.'}
                              </button>
                              {deletingBannerId === banner.id ? (
                                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded border border-rose-500/30">
                                  <span className="text-[9px] text-rose-400 font-bold px-1">Удалить?</span>
                                  <button
                                    onClick={() => {
                                      const filtered = banners2.filter(b => b.id !== banner.id);
                                      setBanners2(filtered);
                                      setDeletingBannerId(null);
                                      
                                      const deletedIdx = index;
                                      if (filtered.length === 0) {
                                        setCurrentIdx2(0);
                                      } else if (deletedIdx < currentIdx2) {
                                        setCurrentIdx2(currentIdx2 - 1);
                                      } else if (deletedIdx === currentIdx2) {
                                        setCurrentIdx2(Math.min(currentIdx2, filtered.length - 1));
                                      }
                                    }}
                                    className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-bold rounded cursor-pointer transition"
                                  >
                                    Да
                                  </button>
                                  <button
                                    onClick={() => setDeletingBannerId(null)}
                                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold rounded cursor-pointer transition"
                                  >
                                    Нет
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeletingBannerId(banner.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                                  title="Удалить баннер"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Partners Management */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Link2 className="w-5 h-5 text-emerald-400" /> Ссылки партнеров в подвале сайта
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Управление брендами партнеров в футере страницы</p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {partners.map((p, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-xs text-slate-300">
                              <span>{p}</span>
                              <button
                                onClick={() => setPartners(partners.filter((_, i) => i !== idx))}
                                className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                          <input
                            type="text"
                            id="new-partner-input"
                            placeholder="Название нового бренда..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.currentTarget;
                                if (input.value.trim() && !partners.includes(input.value.trim())) {
                                  setPartners([...partners, input.value.trim()]);
                                  input.value = '';
                                }
                              }
                            }}
                            className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-slate-700"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById('new-partner-input') as HTMLInputElement;
                              if (input && input.value.trim() && !partners.includes(input.value.trim())) {
                                setPartners([...partners, input.value.trim()]);
                                input.value = '';
                              }
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" /> Добавить
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: TARIF & INTERACTIVE AD ADVERTISERS PAYMENT FORM */}
                  <div className="lg:col-span-5 space-y-6">
                    {/* Tariffs section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-emerald-400" /> Тарифная сетка для партнеров
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Базовые параметры расчета стоимости рекламных кампаний</p>
                      </div>

                      <div className="space-y-4">
                        {/* CPM rate */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-300">Стоимость 1000 показов (CPM)</span>
                            <span className="text-emerald-400 font-mono">{monetizationSettings.cpmRate} ₽</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="2000"
                            step="50"
                            value={monetizationSettings.cpmRate}
                            onChange={(e) => setMonetizationSettings({ ...monetizationSettings, cpmRate: parseInt(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>100 ₽</span>
                            <span>1 000 ₽</span>
                            <span>2 000 ₽</span>
                          </div>
                        </div>

                        {/* CPC rate */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-300">Стоимость 1 клика (CPC)</span>
                            <span className="text-emerald-400 font-mono">{monetizationSettings.cpcRate} ₽</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="150"
                            step="5"
                            value={monetizationSettings.cpcRate}
                            onChange={(e) => setMonetizationSettings({ ...monetizationSettings, cpcRate: parseInt(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>5 ₽</span>
                            <span>75 ₽</span>
                            <span>150 ₽</span>
                          </div>
                        </div>

                        {/* Footer monthly rate */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-300">Месячный спонсорский взнос</span>
                            <span className="text-emerald-400 font-mono">{monetizationSettings.footerRate} ₽ / мес.</span>
                          </div>
                          <input
                            type="range"
                            min="1000"
                            max="25000"
                            step="1000"
                            value={monetizationSettings.footerRate}
                            onChange={(e) => setMonetizationSettings({ ...monetizationSettings, footerRate: parseInt(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>1 000 ₽</span>
                            <span>12 000 ₽</span>
                            <span>25 000 ₽</span>
                          </div>
                        </div>

                        {/* Highlight Monthly rate */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-300">Премиум-АЗС подсветка</span>
                            <span className="text-emerald-400 font-mono">{monetizationSettings.stationHighlightRate} ₽ / мес.</span>
                          </div>
                          <input
                            type="range"
                            min="500"
                            max="10000"
                            step="500"
                            value={monetizationSettings.stationHighlightRate}
                            onChange={(e) => setMonetizationSettings({ ...monetizationSettings, stationHighlightRate: parseInt(e.target.value) })}
                            className="w-full accent-emerald-500 cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>500 ₽</span>
                            <span>5 000 ₽</span>
                            <span>10 000 ₽</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                          <span>Авто-одобрение рекламы:</span>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={monetizationSettings.autoApproveAds}
                              onChange={(e) => setMonetizationSettings({ ...monetizationSettings, autoApproveAds: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Advertisers interactive checkout form */}
                    <div className="bg-slate-900 border border-emerald-550/25 rounded-xl p-4 space-y-4 shadow-lg shadow-emerald-950/20">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Coins className="w-5 h-5 text-emerald-400" /> Разместить рекламу (Оплата онлайн)
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Интерактивный конструктор кампании с моментальным запуском</p>
                      </div>

                      {adOrder.successMessage ? (
                        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-xs space-y-3">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>Рекламная кампания успешно оплачена!</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">
                            {adOrder.successMessage}
                          </p>
                          <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800 font-mono text-[10px] space-y-1 text-slate-400">
                            <div><span className="text-slate-500">Компания:</span> {adOrder.companyName}</div>
                            <div><span className="text-slate-500">ИНН:</span> {adOrder.inn}</div>
                            <div><span className="text-slate-500">Email:</span> {adOrder.contactEmail}</div>
                            <div><span className="text-slate-500">Номер транзакции:</span> FT-{Math.floor(Math.random() * 899999 + 100000)}</div>
                            <div><span className="text-slate-500">Карусель:</span> {adOrder.placementZone === 'dashboard' ? 'Главный дашборд (Зона 1)' : 'Чат-интерфейс (Зона 2)'}</div>
                          </div>
                          <button
                            onClick={() => setAdOrder({ ...adOrder, successMessage: '' })}
                            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold text-xs transition cursor-pointer"
                          >
                            Запустить еще одну кампанию
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 text-xs">
                          {/* 1. Advertiser metadata */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Организация / Бренд</label>
                              <input
                                type="text"
                                placeholder="ООО «Ростов-Ойл»"
                                value={adOrder.companyName}
                                onChange={(e) => setAdOrder({ ...adOrder, companyName: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-700"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">ИНН налогоплательщика</label>
                              <input
                                type="text"
                                placeholder="6164098471"
                                value={adOrder.inn}
                                onChange={(e) => setAdOrder({ ...adOrder, inn: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-700 font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Контактный Email</label>
                              <input
                                type="email"
                                placeholder="ads@rostov-oil.ru"
                                value={adOrder.contactEmail}
                                onChange={(e) => setAdOrder({ ...adOrder, contactEmail: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-700 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Зона размещения</label>
                              <select
                                value={adOrder.placementZone}
                                onChange={(e) => setAdOrder({ ...adOrder, placementZone: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none focus:border-slate-700 cursor-pointer"
                              >
                                <option value="dashboard">Реестр АЗС (Зона 1)</option>
                                <option value="chat">Чат-комната (Зона 2)</option>
                              </select>
                            </div>
                          </div>

                          {/* 2. Billing Model */}
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-400 mb-1">Модель тарификации</label>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { id: 'cpm', label: 'Показы (CPM)', icon: Eye },
                                { id: 'cpc', label: 'Клики (CPC)', icon: TrendingUp },
                                { id: 'flat', label: 'Спонсор (Flat)', icon: Sparkles },
                              ].map(m => {
                                const Icon = m.icon;
                                return (
                                  <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setAdOrder({ ...adOrder, billingModel: m.id })}
                                    className={`py-1.5 px-2 rounded border flex flex-col items-center justify-center gap-1 transition text-center cursor-pointer ${
                                      adOrder.billingModel === m.id
                                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                                    }`}
                                  >
                                    <Icon className="w-3.5 h-3.5 shrink-0" />
                                    <span className="text-[9px] font-bold">{m.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3. Package Selection Details */}
                          <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                            {adOrder.billingModel === 'cpm' && (
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-[10px]">
                                  <span className="text-slate-400">Объем гарантированных показов:</span>
                                  <span className="text-emerald-400 font-mono font-bold">{adOrder.cpmQuantity.toLocaleString()} показов</span>
                                </div>
                                <input
                                  type="range"
                                  min="5000"
                                  max="100000"
                                  step="5000"
                                  value={adOrder.cpmQuantity}
                                  onChange={(e) => setAdOrder({ ...adOrder, cpmQuantity: parseInt(e.target.value) })}
                                  className="w-full accent-emerald-500 cursor-pointer"
                                />
                                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                  <span>5 000</span>
                                  <span>50 000</span>
                                  <span>100 000</span>
                                </div>
                              </div>
                            )}

                            {adOrder.billingModel === 'cpc' && (
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-[10px]">
                                  <span className="text-slate-400">Количество целевых переходов:</span>
                                  <span className="text-emerald-400 font-mono font-bold">{adOrder.cpcQuantity.toLocaleString()} кликов</span>
                                </div>
                                <input
                                  type="range"
                                  min="100"
                                  max="5000"
                                  step="100"
                                  value={adOrder.cpcQuantity}
                                  onChange={(e) => setAdOrder({ ...adOrder, cpcQuantity: parseInt(e.target.value) })}
                                  className="w-full accent-emerald-500 cursor-pointer"
                                />
                                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                  <span>100</span>
                                  <span>2 500</span>
                                  <span>5 000</span>
                                </div>
                              </div>
                            )}

                            {adOrder.billingModel === 'flat' && (
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center text-[10px]">
                                  <span className="text-slate-400">Продолжительность спонсорства:</span>
                                  <span className="text-emerald-400 font-mono font-bold">{adOrder.flatDurationMonths} мес.</span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="12"
                                  step="1"
                                  value={adOrder.flatDurationMonths}
                                  onChange={(e) => setAdOrder({ ...adOrder, flatDurationMonths: parseInt(e.target.value) })}
                                  className="w-full accent-emerald-500 cursor-pointer"
                                />
                                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                                  <span>1 месяц</span>
                                  <span>6 месяцев</span>
                                  <span>12 месяцев</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 4. Banner Content Details */}
                          <div className="space-y-2.5 bg-slate-950/40 p-2.5 rounded border border-slate-800">
                            <p className="text-[10px] font-semibold text-slate-300">Содержимое Вашего баннера:</p>
                            <div>
                              <input
                                type="text"
                                placeholder="Заголовок баннера (до 40 символов)..."
                                value={adOrder.targetTitle}
                                onChange={(e) => setAdOrder({ ...adOrder, targetTitle: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-white focus:outline-none focus:border-slate-700"
                              />
                            </div>
                            <div>
                              <textarea
                                rows={2}
                                placeholder="Текст рекламного спецпредложения (до 140 символов)..."
                                value={adOrder.targetDescription}
                                onChange={(e) => setAdOrder({ ...adOrder, targetDescription: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-[11px] text-white focus:outline-none focus:border-slate-700 resize-none"
                              />
                            </div>
                            
                            <div className="space-y-3">
                              {/* Banner Image + Upload Button Row */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Изображение баннера</label>
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="https://... или выберите файл"
                                    value={adOrder.targetImageUrl}
                                    onChange={(e) => setAdOrder({ ...adOrder, targetImageUrl: e.target.value })}
                                    className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-300 focus:outline-none focus:border-slate-700 font-mono"
                                  />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    id="admin-ad-upload"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          if (typeof reader.result === 'string') {
                                            setAdOrder({ ...adOrder, targetImageUrl: reader.result });
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor="admin-ad-upload"
                                    className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 rounded text-[10px] font-semibold text-slate-200 cursor-pointer flex items-center gap-1 hover:text-white transition shrink-0"
                                  >
                                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Загрузить</span>
                                  </label>
                                </div>
                              </div>

                              {/* Target Link Row */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Целевая ссылка (URL перехода)</label>
                                <input
                                  type="text"
                                  placeholder="https://example.com"
                                  value={adOrder.targetLink}
                                  onChange={(e) => setAdOrder({ ...adOrder, targetLink: e.target.value })}
                                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-300 focus:outline-none focus:border-slate-700 font-mono"
                                />
                              </div>

                              {/* Live Banner Preview */}
                              {adOrder.targetImageUrl && (
                                <div className="relative group w-full h-16 rounded border border-slate-800 overflow-hidden bg-slate-950 mt-1.5">
                                  <img src={adOrder.targetImageUrl} alt="Предпросмотр баннера" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={() => setAdOrder({ ...adOrder, targetImageUrl: '' })}
                                      className="px-2 py-1 bg-rose-650 hover:bg-rose-700 text-white text-[9px] font-bold rounded cursor-pointer transition"
                                    >
                                      Удалить изображение
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 5. Dynamically Calculated Price Display */}
                          {(() => {
                            let price = 0;
                            if (adOrder.billingModel === 'cpm') {
                              price = (adOrder.cpmQuantity / 1000) * monetizationSettings.cpmRate;
                            } else if (adOrder.billingModel === 'cpc') {
                              price = adOrder.cpcQuantity * monetizationSettings.cpcRate;
                            } else if (adOrder.billingModel === 'flat') {
                              price = adOrder.flatDurationMonths * monetizationSettings.footerRate;
                            }
                            return (
                              <div className="bg-slate-950 p-2.5 rounded border border-emerald-500/20 flex items-center justify-between">
                                <div>
                                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Итого к оплате:</span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    {adOrder.billingModel === 'cpm' && `${(adOrder.cpmQuantity/1000)} x ${monetizationSettings.cpmRate} ₽`}
                                    {adOrder.billingModel === 'cpc' && `${adOrder.cpcQuantity} x ${monetizationSettings.cpcRate} ₽`}
                                    {adOrder.billingModel === 'flat' && `${adOrder.flatDurationMonths} мес x ${monetizationSettings.footerRate} ₽`}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-lg font-mono font-bold text-emerald-400">{price.toLocaleString('ru-RU')} ₽</span>
                                  <span className="block text-[8px] text-slate-500">НДС 20% включен в стоимость</span>
                                </div>
                              </div>
                            );
                          })()}

                          {/* 7. Action Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!adOrder.companyName || !adOrder.inn || !adOrder.contactEmail) {
                                alert('Пожалуйста, заполните реквизиты организации (Название, ИНН, Email)!');
                                return;
                              }
                              if (!adOrder.targetTitle || !adOrder.targetDescription) {
                                alert('Пожалуйста, введите заголовок и описание Вашего баннера!');
                                return;
                              }

                              // Start processing animation
                              setAdOrder(prev => ({ ...prev, isProcessing: true }));
                              
                              let step = 0;
                              const interval = setInterval(() => {
                                step++;
                                if (step === 1) {
                                  // simulate payment progress logging or alert in state
                                }
                              }, 1000);

                              setTimeout(() => {
                                clearInterval(interval);
                                // calculate paid cost
                                let cost = 0;
                                if (adOrder.billingModel === 'cpm') {
                                  cost = (adOrder.cpmQuantity / 1000) * monetizationSettings.cpmRate;
                                } else if (adOrder.billingModel === 'cpc') {
                                  cost = adOrder.cpcQuantity * monetizationSettings.cpcRate;
                                } else if (adOrder.billingModel === 'flat') {
                                  cost = adOrder.flatDurationMonths * monetizationSettings.footerRate;
                                }

                                // Create new banner object
                                const newBannerId = `b-paid-${Date.now()}`;
                                const newBanner = {
                                  id: newBannerId,
                                  title: adOrder.targetTitle,
                                  description: adOrder.targetDescription,
                                  imageUrl: adOrder.targetImageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop',
                                  targetUrl: adOrder.targetLink || 'https://example.com',
                                  isActive: true,
                                  clicks: 0,
                                  views: 1 // starts with 1
                                };

                                // Inject into rotation list
                                if (adOrder.placementZone === 'dashboard') {
                                  setBanners1([newBanner, ...banners1]);
                                  setCurrentIdx1(0); // auto-focus on paid banner
                                } else {
                                  setBanners2([newBanner, ...banners2]);
                                  setCurrentIdx2(0); // auto-focus on paid banner
                                }

                                // Credit monetization stats
                                setMonetizationSettings(prev => ({
                                  ...prev,
                                  revenueTotal: prev.revenueTotal + cost,
                                  viewsTotal: prev.viewsTotal + (adOrder.billingModel === 'cpm' ? adOrder.cpmQuantity : 0),
                                  clicksTotal: prev.clicksTotal + (adOrder.billingModel === 'cpc' ? adOrder.cpcQuantity : 0)
                                }));

                                setAdOrder(prev => ({
                                  ...prev,
                                  isProcessing: false,
                                  successMessage: `Счет на оплату на сумму ${cost.toLocaleString()} ₽ успешно сформирован и направлен на ${adOrder.contactEmail}. Баннер «${adOrder.targetTitle}» автоматически проверен ИИ-модератором и активирован в карусели ротации!`
                                }));
                              }, 2500);
                            }}
                            disabled={adOrder.isProcessing}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-md border border-emerald-500/30"
                          >
                            {adOrder.isProcessing ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> Регистрация кампании...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" /> Разместить и запустить трансляцию баннера
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      {/* --- 📟 TAB: SYSTEM LOGS --- */}
      {activeTab === 'logs' && (
        <div className="space-y-3.5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <Terminal className="w-5.5 h-5.5 text-emerald-400" /> Системные логи и трассировка
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Аудит работы парсера ИИ (Gemini API), ручных изменений АЗС, сброса данных и входящих отчетов в реальном времени.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const logsText = filteredLogs.map(l => `[${new Date(l.timestamp).toLocaleString()}] [${l.level.toUpperCase()}] [${l.module}] ${l.message}`).join('\n');
                    handleCopyCode('logs', logsText);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 justify-center cursor-pointer shadow-sm"
                  title="Скопировать все отфильтрованные логи в буфер обмена"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copyStatus === 'logs' ? 'Скопировано!' : 'Копировать логи'}
                </button>

                <button
                  onClick={fetchLogs}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition flex items-center gap-1 cursor-pointer"
                  title="Обновить логи вручную"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Logs Stats Summary Bento Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-3.5">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 text-center">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Всего записей</div>
                <div className="text-lg font-bold text-slate-200 mt-0.5">{totalLogsCount}</div>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-center">
                <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Успешно
                </div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">{successLogsCount}</div>
              </div>
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 text-center">
                <div className="text-[10px] text-blue-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Информация
                </div>
                <div className="text-lg font-bold text-blue-400 mt-0.5">{infoLogsCount}</div>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 text-center">
                <div className="text-[10px] text-amber-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Предупреждения
                </div>
                <div className="text-lg font-bold text-amber-400 mt-0.5">{warnLogsCount}</div>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-3 text-center col-span-2 lg:col-span-1">
                <div className="text-[10px] text-rose-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Ошибки
                </div>
                <div className="text-lg font-bold text-rose-400 mt-0.5">{errorLogsCount}</div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-950 border border-slate-800 p-2 rounded-lg">
              <div className="flex-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Поиск по содержанию лога или модулю..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700 transition"
                />
                {logSearch && (
                  <button
                    onClick={() => setLogSearch('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mr-1 flex items-center gap-1 select-none">
                  <Filter className="w-3 h-3 text-slate-500" /> Фильтр уровня:
                </span>
                
                {[
                  { id: 'all', label: 'Все' },
                  { id: 'success', label: 'Успешно' },
                  { id: 'info', label: 'Инфо' },
                  { id: 'warn', label: 'Предупр.' },
                  { id: 'error', label: 'Ошибки' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setLogFilterLevel(btn.id as any)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs transition cursor-pointer"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Terminal Window */}
            <div className="mt-3 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex flex-col shadow-2xl">
              {/* Terminal Window Header (Simulating Unix/macOS Terminal) */}
              <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between select-none shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 block"></span>
                </div>
                <div className="text-[11px] font-mono font-medium text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  system_activity.log
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-500 tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                  LIVE FEED
                </div>
              </div>

              {/* Terminal Logs Content Viewport */}
              <div className="p-2.5 h-[350px] overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                {filteredLogs.length === 0 ? (
                  <div className="text-slate-500 italic text-center py-20 flex flex-col items-center justify-center gap-2">
                    <span>По вашему запросу логи не найдены.</span>
                    {(logSearch || logFilterLevel !== 'all') && (
                      <button
                        onClick={() => {
                          setLogSearch('');
                          setLogFilterLevel('all');
                        }}
                        className="text-emerald-400 hover:underline hover:text-emerald-300 text-xs mt-1 transition cursor-pointer"
                      >
                        Сбросить фильтры поиска
                      </button>
                    )}
                  </div>
                ) : (
                  filteredLogs.map((log) => {
                    let levelColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
                    if (log.level === 'success') levelColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                    if (log.level === 'warn') levelColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                    if (log.level === 'error') levelColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                    return (
                      <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/50 p-1 rounded transition text-left border border-transparent hover:border-slate-800/40">
                        <span className="text-slate-500 select-none shrink-0 font-sans text-[10px]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${levelColor} select-none shrink-0`}>
                          {log.level}
                        </span>
                        <span className="text-slate-400 font-bold select-none shrink-0">
                          [{log.module}]
                        </span>
                        <span className="text-slate-200 break-all flex-1 select-text">
                          {log.message}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

        {/* --- 📐 TAB 4: ARCHITECTURE & ER DIAGRAM --- */}
        {activeTab === 'architecture' && (
          <div className="space-y-3.5">
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <div>
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" /> ER-Диаграмма СУБД и Системный Контур Данных
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Визуализация сущностей базы данных PostgreSQL/SQLite (MVP) и их взаимосвязей.
                </p>
              </div>

              {/* Interactive SVG Diagram */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mt-3.5 overflow-x-auto flex justify-center">
                <svg width="860" height="420" viewBox="0 0 860 420" className="max-w-full block">
                  {/* Entity Stations */}
                  <rect x="20" y="20" width="280" height="375" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <rect x="20" y="20" width="280" height="40" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <text x="35" y="45" fill="#34d399" fontWeight="bold" fontFamily="monospace" fontSize="13">stations (Таблица АЗС)</text>
                  
                  <text x="35" y="80" fill="#e2e8f0" fontFamily="monospace" fontSize="11">🔑 id: INTEGER [PK]</text>
                  <text x="35" y="100" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 brand: VARCHAR</text>
                  <text x="35" y="120" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 address: VARCHAR</text>
                  <text x="35" y="140" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 latitude: DOUBLE</text>
                  <text x="35" y="160" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 longitude: DOUBLE</text>
                  <text x="35" y="180" fill="#38bdf8" fontFamily="monospace" fontSize="11">🔸 AI92_status: VARCHAR</text>
                  <text x="35" y="200" fill="#38bdf8" fontFamily="monospace" fontSize="11">🔸 AI95_status: VARCHAR</text>
                  <text x="35" y="220" fill="#38bdf8" fontFamily="monospace" fontSize="11">🔸 DT_status: VARCHAR</text>
                  <text x="35" y="240" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 queue_length: VARCHAR</text>
                  <text x="35" y="260" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 waiting_time: INT</text>
                  <text x="35" y="280" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 confidence_score: DOUBLE</text>
                  <text x="35" y="300" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 deficit_forecast: VARCHAR</text>
                  <text x="35" y="320" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 next_delivery: VARCHAR</text>
                  <text x="35" y="340" fill="#a7f3d0" fontFamily="monospace" fontSize="11">🔸 api_url / api_key: VARCHAR</text>
                  <text x="35" y="360" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 updated_at: TIMESTAMP</text>

                  {/* Entity Supply Events */}
                  <rect x="420" y="20" width="280" height="170" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <rect x="420" y="20" width="280" height="40" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <text x="435" y="45" fill="#34d399" fontWeight="bold" fontFamily="monospace" fontSize="13">supply_events (Поставки)</text>
                  
                  <text x="435" y="80" fill="#e2e8f0" fontFamily="monospace" fontSize="11">🔑 id: INTEGER [PK]</text>
                  <text x="435" y="100" fill="#fbbf24" fontFamily="monospace" fontSize="11">🔗 station_id: INTEGER [FK]</text>
                  <text x="435" y="120" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 station_name: VARCHAR</text>
                  <text x="435" y="140" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 eta: VARCHAR</text>
                  <text x="435" y="160" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 fuel_type: VARCHAR</text>
                  <text x="435" y="180" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 confidence: DOUBLE</text>

                  {/* Entity Chat Messages */}
                  <rect x="420" y="215" width="280" height="180" rx="10" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <rect x="420" y="215" width="280" height="40" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <text x="435" y="240" fill="#38bdf8" fontWeight="bold" fontFamily="monospace" fontSize="13">chat_messages (Логи чатов)</text>
                  
                  <text x="435" y="275" fill="#e2e8f0" fontFamily="monospace" fontSize="11">🔑 id: INTEGER [PK]</text>
                  <text x="435" y="295" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 sender: VARCHAR</text>
                  <text x="435" y="315" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 text: TEXT (оригинал)</text>
                  <text x="435" y="335" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 is_fake: BOOLEAN (спам-фильтр)</text>
                  <text x="435" y="355" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 is_fuel_related: BOOLEAN</text>
                  <text x="435" y="375" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 parsed_json: TEXT (сущности)</text>
                  <text x="435" y="395" fill="#cbd5e1" fontFamily="monospace" fontSize="11">🔸 created_at: TIMESTAMP</text>

                  {/* Relationship Lines */}
                  {/* stations.id to supply_events.station_id */}
                  <path d="M 300 80 L 420 100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                  <circle cx="300" cy="80" r="4" fill="#34d399" />
                  <polygon points="420,100 410,95 410,105" fill="#fbbf24" />

                  {/* stations.id to chat_messages / raw matching */}
                  <path d="M 300 240 L 420 295" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                  <circle cx="300" cy="240" r="4" fill="#34d399" />
                  <polygon points="420,295 410,290 410,300" fill="#38bdf8" />
                </svg>
              </div>

              {/* Data Pipeline Explainer */}
              <div className="mt-4">
                <h3 className="text-base font-bold font-display text-white mb-2">Поток данных системы (Data Pipeline)</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center relative">
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full font-mono block mb-1.5 w-fit mx-auto">1. ВХОД</span>
                    <h5 className="font-bold text-white text-xs mb-1">Telegram & Bot</h5>
                    <p className="text-[11px] text-slate-400">Сообщения пользователей о ситуации на дорогах</p>
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-slate-600">▶</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center relative">
                    <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-mono block mb-1.5 w-fit mx-auto">2. NLP ИИ</span>
                    <h5 className="font-bold text-white text-xs mb-1">LLM Chat Parser</h5>
                    <p className="text-[11px] text-slate-400">Извлечение бренда, адреса, вида топлива, статуса и очередей</p>
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-slate-600">▶</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center relative">
                    <span className="text-xs bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full font-mono block mb-1.5 w-fit mx-auto">3. АНТИ-ФЕЙК</span>
                    <h5 className="font-bold text-white text-xs mb-1">RAG Валидация</h5>
                    <p className="text-[11px] text-slate-400">Проверка на вбросы и спам по базе исторических паттернов</p>
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-slate-600">▶</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center relative">
                    <span className="text-xs bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full font-mono block mb-1.5 w-fit mx-auto">4. ОЧЕРЕДИ</span>
                    <h5 className="font-bold text-white text-xs mb-1">Queue Estimator</h5>
                    <p className="text-[11px] text-slate-400">Обновление весов времени ожидания и прогнозирование поставок</p>
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-slate-600">▶</div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-mono block mb-1.5 w-fit mx-auto">5. НАВИГАЦИЯ</span>
                    <h5 className="font-bold text-white text-xs mb-1">Routing Engine</h5>
                    <p className="text-[11px] text-slate-400">Направление автомобилей к наименее загруженным АЗС</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* --- 💻 TAB 5: DEVELOPER BACKEND CODE EXPORT --- */}
        {activeTab === 'backend' && (
          <div className="space-y-3.5">
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800 mb-3.5">
                <div>
                  <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-emerald-400" /> Генератор Готового Бэкенда (Python FastAPI + PostgreSQL + Docker)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Полноценная модульная кодовая база для быстрого развертывания продакшн-системы.
                  </p>
                </div>
                
                <div className="text-xs bg-slate-950 p-1.5 rounded-lg border border-slate-800 inline-flex">
                  <span className="text-emerald-400 font-bold px-2 py-1">MVP → Scalable</span>
                </div>
              </div>

              {/* Code viewer split */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                
                {/* Left col: File Selector */}
                <div className="space-y-2 lg:col-span-1">
                  <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider mb-2">Файлы проекта бэкенда:</span>
                  {[
                    { id: 'main', label: 'main.py', type: 'FastAPI Router' },
                    { id: 'database', label: 'database.py', type: 'SQLAlchemy ORM' },
                    { id: 'parser', label: 'parser.py', type: 'NLP Parser' },
                    { id: 'dockerfile', label: 'Dockerfile', type: 'Container Build' },
                    { id: 'dockercompose', label: 'docker-compose.yml', type: 'Stack Config' },
                    { id: 'requirements', label: 'requirements.txt', type: 'Python Deps' }
                  ].map(file => (
                    <button
                      key={file.id}
                      onClick={() => setActiveCodeTab(file.id)}
                      className={`w-full text-left p-2 rounded-lg text-xs font-mono transition flex justify-between items-center ${
                        activeCodeTab === file.id
                          ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                          : 'bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      <span>📁 {file.label}</span>
                      <span className="text-[9px] opacity-70 bg-slate-900 px-1.5 py-0.5 rounded uppercase">{file.type}</span>
                    </button>
                  ))}

                  <div className="pt-3 border-t border-slate-800">
                    <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-slate-300 leading-relaxed">
                      💡 <strong>Инструкция:</strong> Скопируйте эти файлы в локальную директорию на вашем ПК, запустите команду <code className="bg-slate-950 text-amber-300 px-1 rounded font-mono">docker-compose up --build</code> и вы получите полностью рабочий боевой REST API бэкенд на Python!
                    </div>
                  </div>
                </div>

                {/* Right col: Editor viewport */}
                <div className="lg:col-span-3 space-y-2">
                  <div className="flex justify-between items-center bg-slate-950 px-4 py-1.5 rounded-t-lg border-t border-x border-slate-800 text-xs font-mono text-slate-400">
                    <span>Active: {activeCodeTab}.py</span>
                    <button
                      onClick={() => handleCopyCode(activeCodeTab, backendCode[activeCodeTab] || '')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition flex items-center gap-1"
                    >
                      {copyStatus === activeCodeTab ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Скопировано!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Копировать код
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-950 rounded-b-lg border-b border-x border-slate-800 p-3 max-h-[350px] overflow-y-auto">
                    <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {backendCode[activeCodeTab] || 'Загрузка кода...'}
                    </pre>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* --- 🔐 TAB 6: USER AUTHORIZATION & PROFILE --- */}
        {activeTab === 'auth' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {currentUser ? (
              showAdForm ? (
                /* --- Advertisement Placement Form & Cost Calculator --- */
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
                  {/* Header of Form & Calculator */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-base sm:text-lg font-bold font-display text-white">Размещение рекламы на платформе</h2>
                        <p className="text-xs text-slate-400">Форма заявки и калькулятор стоимости размещения рекламы</p>
                      </div>
                    </div>
                    <button
                      id="back-to-profile-btn"
                      onClick={() => setShowAdForm(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition border border-slate-700/50 cursor-pointer self-start sm:self-auto"
                    >
                      ← Назад в профиль
                    </button>
                  </div>

                  {adSubmitted ? (
                    /* Success State Card */
                    <div className="p-8 bg-slate-950/60 rounded-xl border border-emerald-500/30 text-center space-y-4">
                      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold font-display text-white">Заявка успешно отправлена!</h3>
                      <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                        Ваша рекламная кампания под названием <strong className="text-emerald-400 font-semibold">«{adCompanyName} — {adTitle}»</strong> успешно зарегистрирована и активирована в тестовом MVP-режиме!
                      </p>
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 max-w-sm mx-auto text-left">
                        <p className="flex justify-between border-b border-slate-800/40 pb-1">
                          <span>Рекламная зона:</span> 
                          <span className="text-white">{adPlacementZone === 'zone1' ? 'Верхний баннер (Реестр АЗС)' : 'Баннер в чате ботов'}</span>
                        </p>
                        <p className="flex justify-between border-b border-slate-800/40 py-1">
                          <span>Период:</span> 
                          <span className="text-white">{adDays} дней</span>
                        </p>
                        <p className="flex justify-between border-b border-slate-800/40 py-1">
                          <span>Email контакта:</span> 
                          <span className="text-white font-semibold">{adEmail || 'Не указан'}</span>
                        </p>
                        <p className="flex justify-between pt-1">
                          <span>Стоимость:</span> 
                          <span className="text-emerald-400 font-bold">
                            {Math.round(adDays * (adPlacementZone === 'zone1' ? 1000 : 600) * (adPromoCode.trim().toUpperCase() === 'MVP2026' ? 0.7 : adPromoCode.trim().toUpperCase() === 'FUELFLOW' ? 0.5 : 1))} ₽
                          </span>
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Вы можете перейти в Реестр АЗС или в Симулятор обратной связи, чтобы увидеть вашу рекламу в действии!
                      </p>
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setAdSubmitted(false);
                            setAdCompanyName('');
                            setAdTitle('');
                            setAdDescription('');
                            setAdLink('');
                            setAdEmail(currentUser?.email || '');
                          }}
                          className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 transition cursor-pointer"
                        >
                          Создать еще одну
                        </button>
                        <button
                          onClick={() => setShowAdForm(false)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Вернуться в профиль
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Interactive Calculator & Form Block */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                      
                      {/* Left: Input Form and Selection (md:col-span-7) */}
                      <div className="md:col-span-7 space-y-5">
                        <div className="space-y-4">
                          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-display">1. Настройка кампании</h3>
                          
                          {/* Placement zone selection */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Рекламная зона размещения</label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setAdPlacementZone('zone1')}
                                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                                  adPlacementZone === 'zone1'
                                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                                }`}
                              >
                                <p className="text-xs font-bold font-sans">Верхний баннер</p>
                                <p className="text-[10px] text-slate-400 mt-1 leading-tight">Отображается в Реестре АЗС над картой</p>
                                <p className="text-xs font-mono text-emerald-400 font-bold mt-2">1 000 ₽ / день</p>
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => setAdPlacementZone('zone2')}
                                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                                  adPlacementZone === 'zone2'
                                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                                }`}
                              >
                                <p className="text-xs font-bold font-sans">Слайдер в чате</p>
                                <p className="text-[10px] text-slate-400 mt-1 leading-tight">Карусель в сайдбаре симулятора отзывов</p>
                                <p className="text-xs font-mono text-emerald-400 font-bold mt-2">600 ₽ / день</p>
                              </button>
                            </div>
                          </div>

                          {/* Days slider */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Срок размещения (дней)</label>
                              <span className="text-sm font-bold font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-900/40">{adDays} дней</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="30"
                              value={adDays}
                              onChange={(e) => setAdDays(parseInt(e.target.value))}
                              className="w-full h-1.5 bg-slate-950 border border-slate-850 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-[9px] font-mono text-slate-500">
                              <span>1 день</span>
                              <span>15 дней</span>
                              <span>30 дней</span>
                            </div>
                          </div>
                        </div>

                        {/* Banner Details Form */}
                        <div className="space-y-4 pt-4 border-t border-slate-800/60">
                          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-display">2. Содержимое объявления</h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display block">Компания / Бренд</label>
                              <input
                                type="text"
                                value={adCompanyName}
                                onChange={(e) => setAdCompanyName(e.target.value)}
                                placeholder="ООО Топливные Системы"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display block">Заголовок</label>
                              <input
                                type="text"
                                value={adTitle}
                                onChange={(e) => setAdTitle(e.target.value)}
                                placeholder="Скидка 15% на датчики уровня"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display block">Описание / Текст баннера</label>
                            <textarea
                              value={adDescription}
                              onChange={(e) => setAdDescription(e.target.value)}
                              placeholder="Специальное предложение на датчики уровня топлива Omnicomm и терминалы мониторинга..."
                              rows={2}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display block">Ссылка перехода (URL)</label>
                              <input
                                type="text"
                                value={adLink}
                                onChange={(e) => setAdLink(e.target.value)}
                                placeholder="https://mycompany.ru/promo"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display block">Промокод на скидку</label>
                              <input
                                type="text"
                                value={adPromoCode}
                                onChange={(e) => setAdPromoCode(e.target.value)}
                                placeholder="MVP2026 (-30%) или FUELFLOW (-50%)"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display block">Электронная почта (Email)</label>
                              <input
                                type="email"
                                value={adEmail}
                                onChange={(e) => setAdEmail(e.target.value)}
                                placeholder="mail@example.com"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition font-mono"
                              />
                            </div>
                          </div>

                          {/* Quick Unsplash Image choices */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display block">Выбор обложки / Фото баннера</label>
                            <div className="grid grid-cols-5 gap-2">
                              {[
                                { url: 'https://images.unsplash.com/photo-1610492103153-7a50687654f5?q=80&w=300&auto=format&fit=crop', label: 'Топливо' },
                                { url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=300&auto=format&fit=crop', label: 'Технологии' },
                                { url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?q=80&w=300&auto=format&fit=crop', label: 'Логистика' },
                                { url: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=300&auto=format&fit=crop', label: 'Трасса' }
                              ].map((img, idx) => (
                                <button
                                  type="button"
                                  key={idx}
                                  onClick={() => setAdImageUrl(img.url)}
                                  className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                                    adImageUrl === img.url ? 'border-emerald-500 scale-[1.03]' : 'border-slate-800 hover:border-slate-700'
                                  }`}
                                >
                                  <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt={img.label} />
                                  <div className="absolute inset-0 bg-slate-950/60 flex items-end p-1">
                                    <span className="text-[8px] text-slate-300 truncate">{img.label}</span>
                                  </div>
                                </button>
                              ))}

                              {/* Custom upload button */}
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  id="ad-image-upload-input"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          setAdImageUrl(reader.result);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor="ad-image-upload-input"
                                  className={`flex flex-col items-center justify-center aspect-[16/10] rounded-lg border-2 border-dashed transition cursor-pointer text-center p-1 h-full ${
                                    adImageUrl.startsWith('data:image/')
                                      ? 'border-emerald-500 bg-emerald-950/10 text-emerald-400'
                                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 hover:text-slate-300'
                                  }`}
                                >
                                  <Upload className="w-4 h-4 mb-1 text-slate-400" />
                                  <span className="text-[8px] font-bold leading-tight uppercase font-display block text-slate-400">Загрузить</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Cost Calculator Output & Real-time Live Preview (md:col-span-5) */}
                      <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                        {/* Cost & Reach Card */}
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-display">Расчет стоимости</h4>
                          
                          {/* Live counters */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 rounded bg-slate-900 border border-slate-850 text-center">
                              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold font-display block">Прогноз показов</span>
                              <span className="text-sm font-bold font-mono text-white">~{(adDays * 1400).toLocaleString('ru-RU')}</span>
                            </div>
                            <div className="p-2.5 rounded bg-slate-900 border border-slate-850 text-center">
                              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold font-display block">Прогноз кликов</span>
                              <span className="text-sm font-bold font-mono text-emerald-400">~{(adDays * 48).toLocaleString('ru-RU')}</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-slate-800/60 font-mono text-xs">
                            <div className="flex justify-between text-slate-400">
                              <span>Базовый тариф:</span>
                              <span className="text-white">{adPlacementZone === 'zone1' ? '1 000 ₽ / день' : '600 ₽ / день'}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>Кол-во дней:</span>
                              <span className="text-white">{adDays} дней</span>
                            </div>
                            
                            {/* Promo Code check and discount display */}
                            {adPromoCode.trim().toUpperCase() === 'MVP2026' && (
                              <div className="flex justify-between text-emerald-400">
                                <span>Промокод MVP2026:</span>
                                <span>-30%</span>
                              </div>
                            )}
                            {adPromoCode.trim().toUpperCase() === 'FUELFLOW' && (
                              <div className="flex justify-between text-emerald-400">
                                <span>Промокод FUELFLOW:</span>
                                <span>-50%</span>
                              </div>
                            )}

                            <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold mt-2 font-sans">
                              <span className="text-slate-200">Итого к оплате:</span>
                              <span className="text-emerald-400 font-mono font-bold">
                                {Math.round(
                                  adDays * 
                                  (adPlacementZone === 'zone1' ? 1000 : 600) * 
                                  (adPromoCode.trim().toUpperCase() === 'MVP2026' ? 0.7 : adPromoCode.trim().toUpperCase() === 'FUELFLOW' ? 0.5 : 1)
                                ).toLocaleString('ru-RU')} ₽
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Ad Banner Live Preview */}
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">Предпросмотр баннера (Live Preview)</h4>
                          
                          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                            <div className="relative h-20 w-full rounded-md overflow-hidden bg-slate-950">
                              <img src={adImageUrl} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" alt="preview cover" />
                              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent p-3 flex flex-col justify-center">
                                <span className="text-[8px] uppercase tracking-wider text-emerald-400 font-bold font-mono">{adCompanyName || 'Ваша Компания'}</span>
                                <h5 className="text-xs font-bold text-white line-clamp-1">{adTitle || 'Ваш заголовок'}</h5>
                                <p className="text-[9px] text-slate-300 line-clamp-1 mt-0.5">{adDescription || 'Ваше рекламное описание...'}</p>
                              </div>
                              <span className="absolute top-1.5 right-1.5 text-[8px] bg-slate-950/80 px-1 rounded text-slate-400 font-bold border border-slate-800">РЕКЛАМА</span>
                            </div>
                            <div className="flex justify-between text-[9px] font-mono text-slate-500">
                              <span>Целевой URL: {adLink || 'https://site.ru'}</span>
                              <span>Зона: {adPlacementZone === 'zone1' ? 'Реестр АЗС' : 'Чат'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Submit Action */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!adCompanyName || !adTitle || !adEmail) {
                              alert('Пожалуйста, заполните Название компании, Заголовок баннера и Контактный Email.');
                              return;
                            }
                            
                            // Let's build the banner object!
                            const newBanner = {
                              id: `ad-${Date.now()}`,
                              title: `${adCompanyName} — ${adTitle}`,
                              description: adDescription || 'Реклама партнера платформы FuelFlow',
                              imageUrl: adImageUrl,
                              targetUrl: adLink || 'https://fuelflow.ru',
                              isActive: true,
                              clicks: 0,
                              views: 1,
                            };

                            // Append to state dynamically so they see it live!
                            if (adPlacementZone === 'zone1') {
                              setBanners1(prev => [newBanner, ...prev]);
                            } else {
                              setBanners2(prev => [newBanner, ...prev]);
                            }

                            setAdSubmitted(true);
                          }}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/20 active:scale-[0.98] cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Оплатить и разместить в MVP</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                /* --- Profile view (Authorized User) --- */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Profile Card */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-lg font-display animate-pulse">
                          {(currentUser.name || currentUser.email).slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <h2 className="text-lg font-bold font-display text-white">Личный кабинет пользователя</h2>
                          <p className="text-xs text-slate-400">Управление учетной записью и параметрами сессии</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-900/50 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Авторизован
                      </span>
                    </div>

                    {/* Account detail list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 space-y-1 text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-display">Имя / Псевдоним</span>
                        <p className="text-sm font-semibold text-slate-200">{currentUser.name || 'Не указано'}</p>
                      </div>
                      <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 space-y-1 text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-display">Электронная почта</span>
                        <p className="text-sm font-semibold text-slate-200 font-mono">{currentUser.email}</p>
                      </div>
                      <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 space-y-1 text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-display">Системная роль</span>
                        <p className="text-sm font-semibold text-emerald-400 font-mono">
                          {currentUser.role === 'admin' ? '🛡️ Администратор системы' : '👤 Полноправный пользователь'}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/60 space-y-1 text-left">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-display">Статус сессии</span>
                        <p className="text-sm font-semibold text-sky-400 flex items-center gap-1.5 font-mono text-[11px]">
                          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Активна (JWT-Token)
                        </p>
                      </div>
                    </div>

                    {/* Secure Token display */}
                    <div className="bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">Ваш JWT токен сессии (SHA-256)</h4>
                        <button
                          id="copy-session-token-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW5hdG9seSIsImVtYWlsIjoiYW5hdG9seXRhbnRhbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDQwNjcyMDB9`);
                            setAuthSuccess('Токен успешно скопирован в буфер обмена!');
                            setTimeout(() => setAuthSuccess(''), 3000);
                          }}
                          className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded border border-slate-700 transition flex items-center gap-1 font-sans cursor-pointer"
                        >
                          <Copy className="w-3 h-3" /> Копировать
                        </button>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[10px] text-slate-400 break-all leading-normal select-all">
                        eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW5hdG9seSIsImVtYWlsIjoiYW5hdG9seXRhbnRhbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDQwNjcyMDB9
                      </div>
                      <p className="text-[10px] text-slate-500">Токен генерируется автоматически при каждом входе в систему и используется для авторизации API-запросов к распределенной ноде.</p>
                    </div>

                    {/* Actions / Logout */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="text-xs text-slate-400 text-left">
                        Нужно войти в другой аккаунт? Нажмите кнопку выхода справа.
                      </div>
                      <button
                        id="auth-logout-btn"
                        onClick={() => {
                          setCurrentUser(null);
                          setAuthSuccess('Вы успешно вышли из системы.');
                          setTimeout(() => setAuthSuccess(''), 3000);
                        }}
                        className="px-4 py-2 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 hover:border-transparent rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        🚪 Выйти из системы
                      </button>
                    </div>
                  </div>

                  {/* Right side status panels */}
                  <div className="space-y-4">
                    {/* System Access Card */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 text-left">
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-display flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-emerald-400" /> Права доступа
                      </h3>
                      <p className="text-xs text-slate-400">Ваша учетная запись имеет доступ к следующим модулям системы:</p>

                      <div className="space-y-2 pt-1">
                        {[
                          { name: 'Просмотр Реестра АЗС', ok: true },
                          { name: 'Симулятор Feedback_Bot', ok: true },
                          { name: 'Конфигурация Системы (Настройки)', ok: currentUser.role === 'admin' },
                          { name: 'Просмотр Системных Логов', ok: currentUser.role === 'admin' },
                          { name: 'Экспорт Кода FastAPI', ok: currentUser.role === 'admin' },
                        ].filter(item => item.ok).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800 text-xs">
                            <span className="text-slate-300">{item.name}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-950/50 border border-emerald-900/60 text-emerald-400 rounded">Разрешено</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-800/60">
                        <button
                          id="place-ad-btn"
                          onClick={() => {
                            setShowAdForm(true);
                            setAdSubmitted(false);
                          }}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2 border border-emerald-500/20 active:scale-[0.98] cursor-pointer"
                        >
                          <Megaphone className="w-3.5 h-3.5 animate-pulse text-emerald-100" />
                          <span>Разместить рекламу</span>
                        </button>
                      </div>
                    </div>

                    {/* Security telemetry */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-left">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">Информация о безопасности</h4>
                      <div className="space-y-1 font-mono text-[10px] text-slate-400">
                        <div className="flex justify-between border-b border-slate-800/40 pb-1">
                          <span>IP-Адрес клиента:</span>
                          <span className="text-slate-200">178.46.12.189 (SSL)</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-800/40 pb-1">
                          <span>Шифрование:</span>
                          <span className="text-slate-200">TLS 1.3 - ECDHE</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Статус БД пользователей:</span>
                          <span className="text-emerald-400">Синхронизировано</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              /* --- Registration / Login Form --- */
              <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
                {/* Left Side: Interactive Form */}
                <div className="p-6 sm:p-8 md:col-span-7 flex flex-col justify-between space-y-6">
                  <div>
                    {/* Header of Form */}
                    <div className="space-y-1.5">
                      <h2 className="text-2xl font-bold font-display text-white">
                        {isRegistering ? 'Создать учетную запись' : 'Вход в систему'}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {isRegistering 
                          ? 'Зарегистрируйте аккаунт для получения доступа к расширенным функциям MVP.' 
                          : 'Авторизуйтесь, чтобы управлять каруселями рекламы и личным кабинетом.'}
                      </p>
                    </div>

                    {/* Notification Messages */}
                    {authError && (
                      <div className="mt-4 p-3 bg-rose-950/40 border border-rose-900/60 text-rose-400 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}
                    {authSuccess && (
                      <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-900/60 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{authSuccess}</span>
                      </div>
                    )}

                    {/* Inputs */}
                    <form 
                      id="auth-form-handler"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setAuthError('');
                        setAuthSuccess('');

                        if (!authEmail) {
                          setAuthError('Пожалуйста, введите Email адрес.');
                          return;
                        }
                        if (!authEmail.includes('@')) {
                          setAuthError('Некорректный формат Email.');
                          return;
                        }
                        if (!authPassword || authPassword.length < 4) {
                          setAuthError('Пароль должен состоять минимум из 4 символов.');
                          return;
                        }

                        if (isRegistering) {
                          // Simulating registration success
                          setCurrentUser({
                            email: authEmail,
                            name: authName || authEmail.split('@')[0],
                            role: 'user'
                          });
                          setAuthSuccess('Учетная запись успешно создана! Добро пожаловать!');
                        } else {
                          // Simulating login success
                          const isAdmin = authEmail === 'admin@fuelflow.ru' || authEmail.includes('admin');
                          setCurrentUser({
                            email: authEmail,
                            name: authEmail.split('@')[0],
                            role: isAdmin ? 'admin' : 'user'
                          });
                          setAuthSuccess('Авторизация прошла успешно! Добро пожаловать!');
                        }
                      }}
                      className="space-y-4 mt-6"
                    >
                      {isRegistering && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-display block">Ваше имя</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                              <User className="w-4 h-4" />
                            </span>
                            <input
                              id="auth-name-input"
                              type="text"
                              value={authName}
                              onChange={(e) => setAuthName(e.target.value)}
                              placeholder="Алексей"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-display block">Электронная почта</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input
                            id="auth-email-input"
                            type="text"
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-display block">Пароль</label>
                          {!isRegistering && (
                            <button
                              id="forgot-password-trigger"
                              type="button"
                              onClick={() => {
                                if (!authEmail) {
                                  setAuthError('Сначала введите ваш Email в поле ввода.');
                                } else {
                                  setAuthSuccess(`Ссылка для сброса пароля отправлена на ${authEmail}!`);
                                  setAuthError('');
                                }
                              }}
                              className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 transition animate-pulse"
                            >
                              Забыли пароль?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                            <Lock className="w-4 h-4" />
                          </span>
                          <input
                            id="auth-password-input"
                            type={showAuthPassword ? 'text' : 'password'}
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none transition font-mono"
                          />
                          <button
                            id="toggle-auth-password-visibility"
                            type="button"
                            onClick={() => setShowAuthPassword(!showAuthPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
                          >
                            {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Remember Me */}
                      <div className="flex items-center">
                        <input
                          id="remember-me-checkbox"
                          type="checkbox"
                          className="h-4 w-4 bg-slate-950 border-slate-800 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer"
                        />
                        <label htmlFor="remember-me-checkbox" className="ml-2 text-xs text-slate-400 select-none cursor-pointer">
                          Запомнить меня на этом устройстве
                        </label>
                      </div>

                      <button
                        id="auth-submit-button"
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>{isRegistering ? 'Создать учетную запись' : 'Войти в личный кабинет'}</span>
                      </button>
                    </form>
                  </div>

                  {/* Switch between modes */}
                  <div className="pt-4 border-t border-slate-800 text-center text-xs">
                    <span className="text-slate-400">
                      {isRegistering ? 'Уже есть аккаунт?' : 'Впервые в системе?'}
                    </span>{' '}
                    <button
                      id="auth-toggle-mode-btn"
                      onClick={() => {
                        setIsRegistering(!isRegistering);
                        setAuthError('');
                        setAuthSuccess('');
                      }}
                      className="font-bold text-emerald-400 hover:text-emerald-300 transition"
                    >
                      {isRegistering ? 'Войти в личный кабинет' : 'Зарегистрировать новый'}
                    </button>
                  </div>
                </div>

                {/* Right Side: Demo Quick Login & Information */}
                <div className="p-6 sm:p-8 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col justify-between md:col-span-5 space-y-6">
                  {/* Demo/Test pre-sets */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-display flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" /> Демонстрационный доступ
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Для удобства проверки MVP вы можете войти в один клик под тестовыми аккаунтами:
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      <button
                        id="demo-user-login-btn"
                        onClick={() => {
                          setCurrentUser({
                            email: 'anatolytantan@gmail.com',
                            name: 'Анатолий Т.',
                            role: 'user'
                          });
                          setAuthSuccess('Успешно авторизован как Анатолий (User)!');
                          setAuthError('');
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/30 text-left transition flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white">Тестовый Пользователь</p>
                          <p className="text-[10px] font-mono text-slate-400">anatolytantan@gmail.com</p>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 rounded">Вход</span>
                      </button>

                      <button
                        id="demo-admin-login-btn"
                        onClick={() => {
                          setCurrentUser({
                            email: 'admin@fuelflow.ru',
                            name: 'Администратор FuelFlow',
                            role: 'admin'
                          });
                          setAuthSuccess('Успешно авторизован как Администратор!');
                          setAuthError('');
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/30 text-left transition flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white">Тестовый Администратор</p>
                          <p className="text-[10px] font-mono text-slate-400">admin@fuelflow.ru</p>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded">Вход</span>
                      </button>
                    </div>
                  </div>

                  {/* Cryptographic check */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-850/80 space-y-2 text-[11px] text-slate-400">
                    <p className="font-semibold text-slate-200 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-slate-400" /> Защищенная сессия:
                    </p>
                    <p className="leading-relaxed">
                      Все данные шифруются по протоколу <strong className="text-slate-200 font-mono">SHA-256</strong>. Данная форма авторизации находится в режиме общего доступа и сохраняет сессию в текущем браузере.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* --- QUICK REPORT SLIDEOVER / MODAL --- */}
      {selectedStationForReport && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-w-md w-full space-y-3">
            
            <div className="flex justify-between items-start pb-2 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white">Новый отчет по топливу</h3>
                <p className="text-xs text-slate-400">{selectedStationForReport.brand} ({selectedStationForReport.address})</p>
              </div>
              <button
                onClick={() => setSelectedStationForReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Вид топлива:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'AI92', label: 'АИ-92' },
                    { id: 'AI95', label: 'АИ-95' },
                    { id: 'DT', label: 'Дизель (ДТ)' }
                  ].map(fuel => (
                    <button
                      key={fuel.id}
                      onClick={() => setReportFuel(fuel.id as any)}
                      className={`py-1 rounded text-xs font-semibold border transition ${
                        reportFuel === fuel.id
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fuel.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Статус на АЗС:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'available', label: '⛽ Есть в наличии' },
                    { id: 'coupon', label: '🎟️ По талонам' },
                    { id: 'empty', label: '🚫 Нет в наличии' },
                    { id: 'unloading', label: '🚚 Слив бензовоза' }
                  ].map(status => (
                    <button
                      key={status.id}
                      onClick={() => setReportStatus(status.id as any)}
                      className={`py-1.5 px-1 rounded text-[10px] font-semibold border text-center transition ${
                        reportStatus === status.id
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Очередь перед заправкой:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'none', label: 'Нет' },
                    { id: 'short', label: 'Короткая' },
                    { id: 'medium', label: 'Средняя' },
                    { id: 'long', label: 'Огромная' }
                  ].map(q => (
                    <button
                      key={q.id}
                      onClick={() => setReportQueue(q.id as any)}
                      className={`py-1.5 px-0.5 rounded text-[10px] font-semibold border text-center transition ${
                        reportQueue === q.id
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setSelectedStationForReport(null)}
                className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-bold text-slate-300 transition"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  submitReport({
                    stationId: selectedStationForReport.id,
                    fuelType: reportFuel,
                    type: reportStatus,
                    queueLength: reportQueue,
                    source: 'report_app'
                  });
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition text-center"
              >
                Отправить в Систему
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/40 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p>© 2026 FuelFlow - Интеллектуальный контроль дефицита и маршрутизация потребителей.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-slate-500">
            <span className="text-slate-600 font-medium">Наши партнёры:</span>
            {partners.map((partner, idx) => (
              <span key={idx} className="bg-slate-950/40 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-medium">{partner}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
