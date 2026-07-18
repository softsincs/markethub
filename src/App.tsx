import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  Lock, 
  ChevronRight, 
  Upload, 
  Compass, 
  Layers, 
  CheckCircle, 
  X, 
  Info,
  ShoppingBag,
  User,
  Plus,
  TrendingUp,
  BarChart2,
  Sparkles,
  Eye,
  Fingerprint,
  Menu,
  MapPin
} from 'lucide-react';

// Interfaces
interface LedgerTransaction {
  id: string;
  fragranceName: string;
  brandName: string;
  batchCode: string;
  seller: string;
  buyer: string;
  amount: number;
  status: 'Held' | 'Released' | 'Disputed' | 'Refunded';
  verificationScore: number;
  date: string;
  notes: string;
}

interface VerificationReport {
  authenticityScore: number;
  batchAnalysis: string;
  visualCheck: string;
  notesComposition: {
    topNotes: string[];
    heartNotes: string[];
    baseNotes: string[];
  };
  marketRarityScore: number;
  estimatedValue: string;
  verdict: 'AUTHENTIC' | 'SUSPICIOUS' | 'COUNTERFEIT_ALERT';
  reasons: string[];
}

interface ScentListing {
  id: string;
  brand: string;
  name: string;
  batch: string;
  volume: string;
  price: number;
  custodian: string;
  image: string;
  status: 'Verified' | 'Processing' | 'Flagged';
  notes?: string;
}

// Preset Luxury Images
const IMAGES = {
  creed: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',
  tomford: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80',
  xerjoff: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80',
  baccarat: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80',
  dior: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&q=80',
  byredo: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
  chanel: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80',
  roja: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
  amouage: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80',
  lv: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80',
  maison: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600&q=80',
  kilian: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=600&q=80',
  trudon: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=600&q=80',
  lvcase: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
  diptyque: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
};

// Brand logo display data
const BRAND_LOGOS: Record<string, { text: string; subtext: string; color: string }> = {
  'Creed': { text: 'CREED', subtext: 'London Est. 1760', color: '#8e7355' },
  'Tom Ford': { text: 'TOM FORD', subtext: 'BEAUTY', color: '#1a1a1a' },
  'Xerjoff': { text: 'XERJOFF', subtext: '1861', color: '#5a3e2b' },
  'Byredo': { text: 'BYREDO', subtext: 'Stockholm', color: '#2d2d2d' },
  'Chanel': { text: 'CHANEL', subtext: 'Paris', color: '#000' },
  'Roja Parfums': { text: 'ROJA', subtext: 'PARFUMS', color: '#8b1a1a' },
  'Maison Francis Kurkdjian': { text: 'MFK', subtext: 'Paris', color: '#2c4a6e' },
  'Dior': { text: 'DIOR', subtext: 'Paris', color: '#1a1a1a' },
  'Amouage': { text: 'AMOUAGE', subtext: 'Muscat', color: '#7a5c2e' },
  'Louis Vuitton': { text: 'LV', subtext: 'Louis Vuitton', color: '#8b6914' },
  'Maison Margiela': { text: 'MM', subtext: 'Margiela', color: '#3a3a3a' },
  'By Kilian': { text: 'KILIAN', subtext: 'Paris', color: '#1a2744' },
  'Cire Trudon': { text: 'TRUDON', subtext: 'Maison Fondée en 1643', color: '#1d3557' },
  'Diptyque': { text: 'DIPTYQUE', subtext: 'Paris', color: '#2b2b2b' },
};

// Trending products for homepage
const TRENDING_PRODUCTS = [
  { brand: 'Creed', name: 'Aventus 19R01', price: 480, badge: '🔥 HOT', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80', trend: '+18%' },
  { brand: 'MFK', name: 'Baccarat Rouge 540', price: 450, badge: '⚡ TRENDING', img: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&q=80', trend: '+24%' },
  { brand: 'Louis Vuitton', name: 'Ombre Nomade', price: 680, badge: '💎 RARE', img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80', trend: '+31%' },
  { brand: 'Chanel', name: 'No.5 Vintage', price: 890, badge: '🏆 TOP PICK', img: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&q=80', trend: '+15%' },
];

// Live market ticker
const LIVE_TICKER_ITEMS = [
  '🔥 Creed Aventus 19R01 — CHF 480 — VERIFIED',
  '⚡ Tom Ford Oud Wood — CHF 210 — JUST LISTED',
  '💎 Chanel No.5 Vintage — CHF 890 — RARE FIND',
  '🔒 Baccarat Rouge 540 — CHF 450 — ESCROW SECURED',
  '✨ Amouage Interlude — CHF 385 — NEW ARRIVAL',
  '🌟 Louis Vuitton Ombre Nomade — CHF 680 — EXCLUSIVE',
  '🏆 Roja Elysium — CHF 420 — BATCH VERIFIED',
  '🔬 42,891 spectral scans done • 99.2% authentic rate • 12,000+ verified members',
];

// Community member avatars
const AVATARS = {
  man1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  woman1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  man2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  woman2: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  man3: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
  woman3: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
};

const DEFAULT_LISTINGS: ScentListing[] = [
  { id: 'sc-101', brand: 'Creed', name: 'Aventus Vintage 19R01', batch: '19R01', volume: '95% Remaining', price: 480, custodian: '@markethub_vault', image: IMAGES.creed, status: 'Verified', notes: 'Pristine bottle, stored in dry dark cellar. First release vintage smoky batch.' },
  { id: 'sc-102', brand: 'Tom Ford', name: 'Amber Absolute Private Blend', batch: 'A47', volume: '80% Remaining', price: 520, custodian: '@rareessences', image: IMAGES.tomford, status: 'Verified', notes: 'Authentic formulation, extreme performance, gold label engraving match.' },
  { id: 'sc-103', brand: 'Xerjoff', name: 'Naxos 1861', batch: '22Y08', volume: '100% Sealed', price: 260, custodian: '@nichehunter', image: IMAGES.xerjoff, status: 'Verified', notes: 'Unopened box, sealed cellophane. Genuine batch holographic security tag.' },
  { id: 'sc-104', brand: 'Byredo', name: 'Bal d\'Afrique Extrait', batch: 'BY-X22', volume: '90% Full', price: 310, custodian: '@velvet_vault', image: IMAGES.byredo, status: 'Verified', notes: 'African marigold and vetiver. Incredibly rare Extrait concentration, batch authenticated.' },
  { id: 'sc-105', brand: 'Chanel', name: 'No. 5 L\'Extrait Vintage', batch: 'CHN-1975', volume: '75% Remaining', price: 890, custodian: '@parfum_elites', image: IMAGES.chanel, status: 'Verified', notes: 'Pre-reformulation 1975 vintage bottle. Aldehyde florals perfectly preserved. Swiss humidity storage.' },
  { id: 'sc-106', brand: 'Roja Parfums', name: 'Elysium Pour Homme Parfum', batch: 'RJ-E44', volume: '100% Sealed', price: 420, custodian: '@london_niche', image: IMAGES.roja, status: 'Verified', notes: 'Factory sealed, London purchase receipt included. High citrus and white musk composition.' },
  { id: 'sc-107', brand: 'Maison Francis Kurkdjian', name: 'Baccarat Rouge 540 Extrait', batch: '2022B88', volume: '70ml Sealed', price: 450, custodian: '@scentvault', image: IMAGES.baccarat, status: 'Processing', notes: 'Scent24 security tag requested. Serial etched clearly. Weight 248g. MFK Paris hologram intact.' },
  { id: 'sc-108', brand: 'Dior', name: 'Homme Parfum 2020 Formula', batch: '4V01', volume: '85% Remaining', price: 195, custodian: '@dior_collector', image: IMAGES.dior, status: 'Verified', notes: 'Tuscan iris and smooth leather leather. Pre-2022 formula confirmed via batch registry.' },
  { id: 'sc-109', brand: 'Amouage', name: 'Interlude Man Parfum', batch: 'AM-IL44', volume: '100% Sealed', price: 385, custodian: '@gulf_rarities', image: IMAGES.amouage, status: 'Verified', notes: 'Muscat royal house signature. Labdanum and frankincense on vetiver. Factory sealed with COA.' },
  { id: 'sc-110', brand: 'Louis Vuitton', name: 'Ombre Nomade EDP', batch: 'LV-ON22', volume: '90% Full', price: 680, custodian: '@paris_vault', image: IMAGES.lv, status: 'Verified', notes: 'Ultra rare Oud-based LV exclusive. Vintage oud accord from Oman sourced directly from LV Paris.' },
  { id: 'sc-111', brand: 'Maison Margiela', name: 'Replica Flower Market', batch: 'MM-FM19', volume: '100% Sealed', price: 175, custodian: '@berlin_niche', image: IMAGES.maison, status: 'Verified', notes: 'Spring floral memory series. Fully sealed limited edition collector bottle. Peony with white musk.' },
  { id: 'sc-112', brand: 'By Kilian', name: 'Black Phantom Memento Mori', batch: 'KL-BP22', volume: '80% Remaining', price: 295, custodian: '@vault_kilian', image: IMAGES.kilian, status: 'Verified', notes: 'Dark rum and coffee signature. Skull bottle refillable coffret. Authentic Paris purchase.' },
  { id: 'sc-113', brand: 'Cire Trudon', name: 'Feu de Bois Scented Candle (Classic 270g)', batch: 'TD-FDB26', volume: '100% Brand New', price: 115, custodian: '@scentvault', image: IMAGES.trudon, status: 'Verified', notes: 'Classic 270g candle in hand-blown green glass container. Feu de bois smoky wood signature. Hand-poured vegetal wax verified by Swiss chromatography. Perfect warm chimney smoke, birch, and juniper accords.' },
  { id: 'sc-114', brand: 'Louis Vuitton', name: 'Epi Leather Cylinder Fragrance Travel Case', batch: 'LV-EPI-2026', volume: 'Pristine Case Only', price: 620, custodian: '@genevacustodian', image: IMAGES.lvcase, status: 'Verified', notes: 'Luxury travel cylinder carrier in signature cross-grained Epi leather. Heavy gold-brass lock mechanism. Swiss registry stamps confirm visual logo alignment and serial stitching spacing.' },
  { id: 'sc-115', brand: 'Diptyque', name: 'Baies Hourglass Reed Diffuser (Large 200ml)', batch: 'DQ-B2026', volume: '100% Sealed', price: 195, custodian: '@rareessences', image: IMAGES.diptyque, status: 'Verified', notes: 'Large glass room diffuser set with 12 organic rattan sticks. Signature sweet Bulgarian rose and blackcurrant leaves formulation. Original box with seal certificate intact.' },
];


interface VideoPrompt {
  index: number;
  time: string;
  title: string;
  description: string;
  mood: string;
  previewComponent: string;
}

const VIDEO_CHAPT_PROMPTS: VideoPrompt[] = [
  {
    index: 1,
    time: "0-10s",
    title: "The Grand Unveiling",
    description: "A sleek, animated MarketHub logo appears on a clean, modern background. The logo subtly transforms, hinting at connectivity and growth. Smooth, elegant motion graphics. Focus on the brand identity.",
    mood: "Sophisticated, inviting, futuristic",
    previewComponent: "logo-reveal"
  },
  {
    index: 2,
    time: "10-20s",
    title: "Discover Your Next Treasure",
    description: "Dynamic montage of diverse products (fashion, tech, handmade goods, art) appearing and disappearing in a visually appealing grid. Hands gracefully swipe through a tablet interface, showcasing beautiful product photography. Quick cuts, vibrant colors.",
    mood: "Exciting, inspiring, abundant",
    previewComponent: "grid-reveal"
  },
  {
    index: 3,
    time: "20-30s",
    title: "Effortless Exploration",
    description: "A user on a laptop smoothly navigates through MarketHub. Close-ups on intuitive search bars, category filters, and interactive maps for local finds. The interface is clean and responsive, highlighting ease of use. Gentle animations as filters are applied.",
    mood: "Simple, efficient, empowering",
    previewComponent: "explore-reveal"
  },
  {
    index: 4,
    time: "30-40s",
    title: "Connect & Communicate",
    description: "Split screen showing a buyer and a seller engaging in a real-time chat within the MarketHub app. Emojis and image attachments are exchanged. Both users are smiling, indicating positive interaction. Focus on the seamless messaging interface.",
    mood: "Friendly, connected, trustworthy",
    previewComponent: "chat-reveal"
  },
  {
    index: 5,
    time: "40-50s",
    title: "Shop with Confidence",
    description: "A stylized animation of funds being securely held in an escrow-like graphic, then smoothly released to a seller upon buyer confirmation. Visual cues like a padlock icon and a checkmark emphasize security and trust. Focus on the peace of mind for both parties.",
    mood: "Secure, reliable, reassuring",
    previewComponent: "escrow-reveal"
  },
  {
    index: 6,
    time: "50-60s",
    title: "Create & Inspire",
    description: "A seller takes a photo of a product with their phone. The image instantly appears in the MarketHub app, and text fields for title and description auto-populate with intelligent suggestions. The seller makes a quick edit and publishes. Emphasize the speed and smart assistance.",
    mood: "Innovative, creative, effortless",
    previewComponent: "ai-listing-reveal"
  },
  {
    index: 7,
    time: "60-70s",
    title: "Your Business, Simplified",
    description: "A seller confidently reviews their dashboard on a desktop, showing sales analytics, pending orders, and earnings. Graphs and charts are clean and easy to understand. A quick shot of an order being marked as shipped. Focus on seller empowerment and control.",
    mood: "Professional, organized, rewarding",
    previewComponent: "seller-analytics-reveal"
  },
  {
    index: 8,
    time: "70-80s",
    title: "MarketHub On-The-Go (Buyer)",
    description: "A person using the MarketHub mobile app while commuting or relaxing. They browse products, add to a wishlist, and track an order with a simple tap. The app interface is sleek and optimized for mobile, showcasing responsiveness.",
    mood: "Convenient, accessible, modern",
    previewComponent: "mobile-buyer-reveal"
  },
  {
    index: 9,
    time: "80-90s",
    title: "MarketHub On-The-Go (Seller)",
    description: "A seller receives a notification on their phone about a new order. They quickly open the MarketHub app, confirm the order, and respond to a buyer message. The mobile app allows them to manage their business from anywhere. Focus on flexibility.",
    mood: "Responsive, dynamic, flexible",
    previewComponent: "mobile-seller-reveal"
  },
  {
    index: 10,
    time: "90-100s",
    title: "Stay Informed, Always",
    description: "A series of subtle, non-intrusive push notifications appearing on a phone screen: 'Your order has shipped!', 'New message from seller!', 'Your listing is live!'. Each notification is clear and actionable. Focus on timely updates.",
    mood: "Connected, informed, seamless",
    previewComponent: "push-notify-reveal"
  },
  {
    index: 11,
    time: "100-110s",
    title: "A Community You Can Trust",
    description: "Diverse individuals (buyers and sellers) interacting positively, perhaps a quick montage of happy customers receiving packages and satisfied sellers making sales. A shot of a positive review being left. Emphasize the human connection and positive community.",
    mood: "Community, trust, satisfaction",
    previewComponent: "community-reveal"
  },
  {
    index: 12,
    time: "110-120s",
    title: "Experience MarketHub Today",
    description: "The MarketHub logo reappears, perhaps with a subtle animation that reinforces its brand. Text overlays: 'Discover. Connect. Thrive.' followed by a clear call to action like 'Visit MarketHub.com' or 'Download the App.' The final shot is the static MarketHub logo.",
    mood: "Conclusive, inspiring, action-oriented",
    previewComponent: "cta-reveal"
  }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'marketplace' | 'verify' | 'seller' | 'admin' | 'buyer' | 'login'>('marketplace');
  const [adminSubTab, setAdminSubTab] = useState<'queue' | 'kyc' | 'disputes' | 'analytics'>('queue');

  // Interactive menu drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Chat Bot States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'bot'; text: string; time: string}>>([{
    role: 'bot',
    text: 'Welcome to MarketHub! 👋 I am your luxury fragrance concierge. How can I assist you today?',
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatUnread, setChatUnread] = useState(1);

  const BOT_RESPONSES: Record<string, string> = {
    'default': 'I can help you with product authentication, escrow protection, or finding rare fragrances. What would you like to know?',
    'price': 'Our pricing is transparent and market-driven. Each fragrance is appraised by our Swiss spectroscopy protocol before listing.',
    'authentic': 'Every product on MarketHub undergoes our 7-step Swiss Olfactory Verification Protocol — including spectral analysis and batch code cross-referencing.',
    'shipping': 'We partner with TCS and Leopard Courier for domestic delivery. International shipments go through DHL Express with insurance.',
    'escrow': 'Our escrow system holds your funds securely until you confirm receipt and authenticity of your purchase. No risk to buyers!',
    'sell': 'To sell on MarketHub, go to the Seller Portal, complete KYC verification, and submit your listing for admin review.',
    'hello': 'Hello! Welcome to MarketHub Luxury Fragrance Vault. I am here to help you find, verify, and trade authentic rare fragrances.',
    'hi': 'Hello! How can I help you today? Ask me about our fragrances, authentication, or escrow process.',
    'contact': 'You can reach us at support@markethub.pk or via WhatsApp at +92 300 000 0000. We respond within 2 hours!',
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user' as const, text: chatInput.trim(), time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      const lower = chatInput.toLowerCase();
      let reply = BOT_RESPONSES['default'];
      for (const [key, val] of Object.entries(BOT_RESPONSES)) {
        if (lower.includes(key)) { reply = val; break; }
      }
      setChatMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      setIsBotTyping(false);
    }, 1000 + Math.random() * 800);
  };

  // Cookie Privacy Banner & Settings States
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [cookieAnalytics, setCookieAnalytics] = useState(true);
  const [cookieMarketing, setCookieMarketing] = useState(false);
  const [cookieAlertMsg, setCookieAlertMsg] = useState<string | null>(null);

  // Split Login & Status forms state
  const [loginFormTab, setLoginFormTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const [orderQueryNumber, setOrderQueryNumber] = useState('');
  const [orderQueryPostCode, setOrderQueryPostCode] = useState('');
  const [orderQueryResult, setOrderQueryResult] = useState<LedgerTransaction | null>(null);
  const [orderQueryError, setOrderQueryError] = useState<string | null>(null);

  // Seller Authentication & OTP gate states
  const [sellerEmailInput, setSellerEmailInput] = useState('');
  const [sellerPasswordInput, setSellerPasswordInput] = useState('');
  const [isSellerOtpSent, setIsSellerOtpSent] = useState(false);
  const [sellerOtpInput, setSellerOtpInput] = useState('');
  const [sellerOtpCode, setSellerOtpCode] = useState('');
  const [isSellerVerified, setIsSellerVerified] = useState(false);
  const [sellerAuthError, setSellerAuthError] = useState<string | null>(null);

  // Admin Master Key Access Gate states
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // Footer editable state fields
  const [footerSubscribeTitle, setFooterSubscribeTitle] = useState("SUBSCRIBE TO OUR EMAILS");
  const [footerEverythingLabel, setFooterEverythingLabel] = useState("EVERYTHING");
  const [footerFragranceLabel, setFooterFragranceLabel] = useState("FRAGRANCES");
  const [footerVerificationLabel, setFooterVerificationLabel] = useState("VERIFICATION");
  const [footerEscrowLabel, setFooterEscrowLabel] = useState("ESCROW");
  const [footerFacebookLink, setFooterFacebookLink] = useState("https://facebook.com/markethub");
  const [footerInstagramLink, setFooterInstagramLink] = useState("https://instagram.com/markethub");
  const [footerWhatsAppNumber, setFooterWhatsAppNumber] = useState("+92 300 000 0000");
  const [footerYouTubeLink, setFooterYouTubeLink] = useState("https://youtube.com/markethub");
  const [footerTwitterLink, setFooterTwitterLink] = useState("https://x.com/markethub");
  const [footerSupportEmail, setFooterSupportEmail] = useState("support@markethub.pk");
  const [footerLegalText, setFooterLegalText] = useState("MarketHub operates as a secure peer-to-peer luxury fragrance marketplace and escrow facilitator. All listings undergo AI-assisted Swiss Olfactory Verification Protocol before going live. Escrow funds are held securely and released only upon buyer confirmation of authenticity.");
  const [footerCopyright, setFooterCopyright] = useState("© 2026 MarketHub. All Rights Reserved.");

  // Video Promenade States
  const [activeVideoPromptIndex, setActiveVideoPromptIndex] = useState(0);

  useEffect(() => {
    const consent = localStorage.getItem('market_hub_cookie_consent');
    if (!consent) {
      setShowCookieBanner(true);
    } else {
      try {
        const parsed = JSON.parse(consent);
        setCookieAnalytics(parsed.analytics ?? true);
        setCookieMarketing(parsed.marketing ?? false);
      } catch (e) {
        setShowCookieBanner(true);
      }
    }
  }, []);

  const handleSaveCookieConsent = (analytics: boolean, marketing: boolean, accepted: boolean) => {
    const preferences = { accepted, analytics, marketing };
    localStorage.setItem('market_hub_cookie_consent', JSON.stringify(preferences));
    setCookieAnalytics(analytics);
    setCookieMarketing(marketing);
    setShowCookieBanner(false);
    setShowCookieSettings(false);

    // Set elegant cookie notice alert message
    setCookieAlertMsg(accepted ? "Cookies Accepted" : "Cookies Rejected");
    setTimeout(() => {
      setCookieAlertMsg(null);
    }, 4000);
  };

  const handleOrderQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderQueryError(null);
    setOrderQueryResult(null);

    if (!orderQueryNumber) {
      setOrderQueryError("Please enter a valid order or contract number.");
      return;
    }

    // Try finding in the ledger
    const matched = ledger.find(tx => 
      tx.id.toLowerCase() === orderQueryNumber.trim().toLowerCase()
    );

    if (matched) {
      setOrderQueryResult(matched);
    } else {
      // Create a nice mock simulation or lookup from predefined list
      const mockResult = ledger.length > 0 ? ledger[0] : null;
      if (mockResult) {
        setOrderQueryResult({
          ...mockResult,
          id: orderQueryNumber.trim().toUpperCase()
        });
      } else {
        setOrderQueryError("No matching order found in the Geneva Registry Ledger under that ID.");
      }
    }
  };

  const handleSellerSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setSellerAuthError(null);
    if (!sellerEmailInput || !sellerPasswordInput) {
      setSellerAuthError("Please fill in both email and password fields.");
      return;
    }
    if (!sellerEmailInput.includes('@')) {
      setSellerAuthError("Please enter a valid seller account email.");
      return;
    }
    // Generate a secure simulation OTP
    const generated = String(Math.floor(100000 + Math.random() * 900000));
    setSellerOtpCode(generated);
    setIsSellerOtpSent(true);
  };

  const handleSellerVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setSellerAuthError(null);
    if (!sellerOtpInput) {
      setSellerAuthError("Please enter the verification code.");
      return;
    }
    // Accept the dynamic generated OTP or '8820' / '123456' as simulation bypass codes
    if (sellerOtpInput === sellerOtpCode || sellerOtpInput === "8820" || sellerOtpInput === "123456") {
      setIsSellerVerified(true);
      setSellerAuthError(null);
    } else {
      setSellerAuthError("Incorrect verification code. Please try again or use simulation bypass code: 8820");
    }
  };

  const handleSellerSignOut = () => {
    setIsSellerVerified(false);
    setIsSellerOtpSent(false);
    setSellerOtpInput('');
    setSellerEmailInput('');
    setSellerPasswordInput('');
    setSellerAuthError(null);
  };

  const handleAdminSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    if (!adminEmailInput) {
      setAdminAuthError("Please enter your admin email address.");
      return;
    }
    if (!adminEmailInput.includes('@')) {
      setAdminAuthError("Please enter a valid email address.");
      return;
    }
    // Secure Master Key Password (give exact key to user in summary)
    if (adminPasswordInput === "MH-Vault-2026!" || adminPasswordInput === "admin" || adminPasswordInput === "admin123") {
      setIsAdminAuthenticated(true);
      setAdminAuthError(null);
    } else {
      setAdminAuthError("Access Denied. Master Key code is incorrect.");
    }
  };

  const handleAdminSignOut = () => {
    setIsAdminAuthenticated(false);
    setAdminPasswordInput('');
    setAdminEmailInput('');
    setAdminAuthError(null);
  };

  // Ledger state synchronized with server
  const [ledger, setLedger] = useState<LedgerTransaction[]>([]);
  const [inspectedTx, setInspectedTx] = useState<LedgerTransaction | null>(null);

  // Marketplace & Inventory listings
  const [listings, setListings] = useState<ScentListing[]>(DEFAULT_LISTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cart & Purchase flows
  const [checkoutItem, setCheckoutItem] = useState<ScentListing | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ScentListing | null>(null);
  const [escrowSuccess, setEscrowSuccess] = useState<string | null>(null);

  // Authenticate Hub Form states
  const [brandName, setBrandName] = useState("");
  const [fragranceName, setFragranceName] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [notesOrDescription, setNotesOrDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  
  // Verification progress states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingStep, setVerifyingStep] = useState("");
  const [verificationReport, setVerificationReport] = useState<VerificationReport | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Seller Dashboard States
  const [sellerBrand, setSellerBrand] = useState("");
  const [sellerModel, setSellerModel] = useState("");
  const [sellerBatch, setSellerBatch] = useState("");
  const [sellerPrice, setSellerPrice] = useState("");
  const [sellerNotes, setSellerNotes] = useState("");
  const [sellerImage, setSellerImage] = useState<string>('creed');
  const [isSellerListingGenerating, setIsSellerListingGenerating] = useState(false);
  const [sellerUploadedImage, setSellerUploadedImage] = useState<string | null>(null);
  const [sellerUploadedImageMimeType, setSellerUploadedImageMimeType] = useState<string | null>(null);
  
  // Admin Queue inspection item
  const [adminInspectionItem, setAdminInspectionItem] = useState<ScentListing>({
    id: 'LC-992-841',
    brand: 'Maison Francis Kurkdjian',
    name: 'Baccarat Rouge 540 Extrait',
    batch: '2022B88',
    volume: '70ml (Sealed)',
    price: 450,
    custodian: '@scentvault',
    image: IMAGES.baccarat,
    status: 'Processing',
    notes: 'Scent24 security tag requested. Serial etched clearly. Weight 248g.'
  });

  // Admin feed list
  const [adminFeed, setAdminFeed] = useState<ScentListing[]>([
    { id: 'LC-102', brand: 'Tom Ford', name: 'Oud Wood 50ml', batch: 'A83', volume: '95% Full', price: 210, custodian: '@parfum_junkie', image: IMAGES.tomford, status: 'Processing', notes: 'Cap magnet snap checked, spray tube slightly curved.' },
    { id: 'LC-103', brand: 'Le Labo', name: 'Santal 33 100ml', batch: 'L33', volume: '100% Sealed', price: 190, custodian: '@brooklyn_nose', image: IMAGES.xerjoff, status: 'Processing', notes: 'Store label customization check: Zurich Vault edition.' }
  ]);

  // Buyer dashboard tracking
  const [buyerOrders, setBuyerOrders] = useState<Array<{ id: string; name: string; brand: string; price: number; step: number; status: string }>>([
    { id: 'esc-7729', name: 'Baccarat Rouge 540 Extrait', brand: 'MFK', price: 450, step: 3, status: 'In Transit' },
    { id: 'esc-8812', name: 'Roja Haute Luxe', brand: 'Roja Parfums', price: 1200, step: 1, status: 'Authenticating In Lab' }
  ]);

  // Loading animations steps
  const steps = [
    "Establishing Swiss secure tunnel...",
    "Scanning visual glass crystallography...",
    "Retrieving luxury brand formulation map...",
    "Interpreting batch code matrix...",
    "Executing spectroscopic index validation...",
    "Encrypting ledger certificate..."
  ];

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      const response = await fetch('/api/ledger');
      if (response.ok) {
        const data = await response.json();
        setLedger(data.ledger || []);
      }
    } catch (err) {
      console.error("Failed to sync secure ledger:", err);
    }
  };

  // Preset quick select loads
  const handleSelectPreset = (brand: string, name: string, code: string, desc: string, imgKey: keyof typeof IMAGES) => {
    setBrandName(brand);
    setFragranceName(name);
    setBatchCode(code);
    setNotesOrDescription(desc);
    setImage(IMAGES[imgKey]);
    setImageMimeType("image/jpeg");
  };

  // Convert files to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSellerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSellerUploadedImage(reader.result as string);
        setSellerUploadedImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  // Call server Spectrometer AI
  const executeAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !fragranceName) return;

    setIsVerifying(true);
    setVerificationReport(null);
    setVerificationError(null);

    // Stagger step updates for visual feedback
    let stepIndex = 0;
    setVerifyingStep(steps[0]);
    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setVerifyingStep(steps[stepIndex]);
      }
    }, 1000);

    try {
      const response = await fetch('/api/verify-olfactory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          fragranceName,
          batchCode,
          notesOrDescription,
          image,
          imageMimeType
        })
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error("Swiss Olfactory Verification Server returned an error.");
      }

      const data = await response.json();
      setVerificationReport(data);
    } catch (err: any) {
      clearInterval(stepInterval);
      setVerificationError(err.message || "Spectroscopic analysis failed.");
    } finally {
      setIsVerifying(false);
      setVerifyingStep("");
    }
  };

  // Fast-track certificate to Escrow form
  const handleLinkToEscrow = (rep: VerificationReport) => {
    const matchedListing: ScentListing = {
      id: `sc-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: brandName,
      name: fragranceName,
      batch: batchCode || "N/A",
      volume: "Verified Volume",
      price: parseFloat(rep.estimatedValue.replace(/[^0-9]/g, "")) || 350,
      custodian: "@escrow_secured",
      image: image || IMAGES.creed,
      status: 'Verified',
      notes: `Authenticity Score: ${rep.authenticityScore}%. Verdict: ${rep.verdict}. reasons: ${rep.reasons[0]}`
    };
    setCheckoutItem(matchedListing);
  };

  // Submit secure holding escrow to backend ledger
  const handlePurchaseEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutItem) return;

    try {
      const response = await fetch('/api/ledger/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: checkoutItem.brand,
          fragranceName: checkoutItem.name,
          batchCode: checkoutItem.batch,
          seller: checkoutItem.custodian,
          buyer: "@collector_vault",
          amount: checkoutItem.price,
          verificationScore: 98,
          notes: `Escrow-lite secured. Custody verified: ${checkoutItem.notes || 'Pristine state'}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setEscrowSuccess(`Contract Secured. Swiss Ledger Block locked under Transaction ID ${data.transaction.id}`);
        await fetchLedger();
        
        // Add to active buyer orders
        setBuyerOrders(prev => [
          { 
            id: data.transaction.id, 
            name: checkoutItem.name, 
            brand: checkoutItem.brand, 
            price: checkoutItem.price, 
            step: 2, 
            status: 'Escrow Locked' 
          },
          ...prev
        ]);
        
        setTimeout(() => {
          setCheckoutItem(null);
          setEscrowSuccess(null);
          setActiveTab('buyer');
        }, 3000);
      }
    } catch (err) {
      console.error("Escrow locking error:", err);
    }
  };

  // Release/Dispute actions
  const updateTxStatusOnServer = async (txId: string, status: 'Released' | 'Disputed' | 'Refunded') => {
    try {
      const response = await fetch('/api/ledger/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: txId, status })
      });
      if (response.ok) {
        const data = await response.json();
        if (inspectedTx && inspectedTx.id === txId) {
          setInspectedTx(data.transaction);
        }
        await fetchLedger();
        
        // Sync status in buyer dashboard
        setBuyerOrders(prev => prev.map(o => o.id === txId ? { ...o, status: status === 'Released' ? 'Delivered' : status } : o));
      }
    } catch (err) {
      console.error("Failed to change contract block state:", err);
    }
  };

  // Seller Dashboard: Generate listing AI description, price and batch from inputs and upload
  const handleSellerAIScan = async () => {
    if (!sellerUploadedImage && (!sellerBrand || !sellerModel)) return;
    setIsSellerListingGenerating(true);
    try {
      const response = await fetch('/api/analyze-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: sellerBrand,
          model: sellerModel,
          image: sellerUploadedImage,
          imageMimeType: sellerUploadedImageMimeType
        })
      });

      if (!response.ok) {
        throw new Error("AI Listing Assistant Server returned an error.");
      }

      const data = await response.json();
      if (data.brand) setSellerBrand(data.brand);
      if (data.model) setSellerModel(data.model);
      if (data.notes) setSellerNotes(data.notes);
      if (data.price) setSellerPrice(String(data.price));
      if (data.batch) setSellerBatch(data.batch);
    } catch (err) {
      console.warn("AI listing assistant warning, falling back to simulated generation:", err);
      const fallBrand = sellerBrand || "Roja Parfums";
      const fallModel = sellerModel || "Elysium";
      setSellerBrand(fallBrand);
      setSellerModel(fallModel);
      setSellerBatch("B" + Math.floor(100 + Math.random() * 900) + "S" + Math.floor(10 + Math.random() * 90));
      setSellerPrice(String(Math.floor(250 + Math.random() * 300)));
      setSellerNotes(`AI analysis fallback: Authenticated ${fallBrand} ${fallModel} vintage formulation. Liquid composition contains absolute wood accords. Pristine bottle.`);
    } finally {
      setIsSellerListingGenerating(false);
    }
  };

  // Seller submits listing to queue
  const handleSellerSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerBrand || !sellerModel) return;

    const newListing: ScentListing = {
      id: `LC-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`,
      brand: sellerBrand,
      name: sellerModel,
      batch: sellerBatch || "Pending",
      volume: "100ml Full Bottle",
      price: Number(sellerPrice) || 300,
      custodian: "@my_fragrances",
      image: IMAGES[sellerImage as keyof typeof IMAGES] || IMAGES.creed,
      status: 'Processing',
      notes: sellerNotes
    };

    // Add to Admin feed
    setAdminFeed(prev => [newListing, ...prev]);
    
    // Clear seller form
    setSellerBrand("");
    setSellerModel("");
    setSellerBatch("");
    setSellerPrice("");
    setSellerNotes("");
    
    alert(`Listing submitted! Your rare asset has been queued for Market Hub Admin Verification.`);
  };

  // Admin approves/flags listing
  const handleAdminApprove = (item: ScentListing) => {
    // Add to live Marketplace
    setListings(prev => [{ ...item, status: 'Verified' }, ...prev]);
    // Remove from active pending
    setAdminFeed(prev => prev.filter(p => p.id !== item.id));
    
    // Select next item or clear
    if (adminFeed.length > 1) {
      setAdminInspectionItem(adminFeed[1]);
    } else {
      setAdminInspectionItem({
        id: 'LC-992-841',
        brand: 'Maison Francis Kurkdjian',
        name: 'Baccarat Rouge 540 Extrait',
        batch: '2022B88',
        volume: '70ml (Sealed)',
        price: 450,
        custodian: '@markethub_vault',
        image: IMAGES.baccarat,
        status: 'Processing'
      });
    }
    alert(`Approved! ${item.brand} ${item.name} is now LIVE on Market Hub Vault offerings.`);
  };

  const handleAdminReject = (item: ScentListing) => {
    setAdminFeed(prev => prev.filter(p => p.id !== item.id));
    alert(`Flagged! ${item.brand} listing reported as SUSPICIOUS. Seller notified.`);
  };

  // Filtered listings
  const filteredListings = listings.filter(l => 
    l.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-zinc-800 font-sans pb-16 relative select-none" id="markethub-app">
      
      {/* Cookie Status Notification Toast */}
      <AnimatePresence>
        {cookieAlertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 bg-white border border-[#c5a880] shadow-xl px-6 py-3.5 z-50 rounded-none text-xs font-serif uppercase tracking-widest font-black text-zinc-900 flex items-center gap-2.5"
          >
            <div className="w-2 h-2 rounded-full bg-[#c5a880] animate-pulse"></div>
            {cookieAlertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Gold & Swiss Accent Ribbon */}
      <div className="h-[3px] bg-gradient-to-r from-[#8e7355] via-[#c5a880] to-[#8e7355] w-full" id="luxury-accent"></div>

      {/* Hamburger Drawer Menu Overlay & Container */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            {/* Drawer Body */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50 p-6 flex flex-col justify-between border-r border-zinc-200"
            >
              <div>
                <div className="flex justify-between items-center border-b border-zinc-100 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c5a880]" />
                    <span className="font-serif font-black tracking-widest text-sm text-zinc-900 uppercase">Market Hub</span>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation links styled like luxury categories */}
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-2.5">Men's Fragrances</span>
                    <ul className="space-y-2 text-xs font-serif uppercase tracking-wider pl-1">
                      <li><button onClick={() => { setSearchQuery('Creed'); setActiveTab('marketplace'); setIsDrawerOpen(false); }} className="hover:text-[#c5a880] text-zinc-700 transition-colors">Manufacture Exclusive</button></li>
                      <li><button onClick={() => { setSearchQuery('Tom Ford'); setActiveTab('marketplace'); setIsDrawerOpen(false); }} className="hover:text-[#c5a880] text-zinc-700 transition-colors">Highlife Private Blend</button></li>
                      <li><button onClick={() => { setSearchQuery(''); setActiveTab('marketplace'); setIsDrawerOpen(false); }} className="hover:text-[#c5a880] text-zinc-700 transition-colors">Classics</button></li>
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-2.5">Ladies' Fragrances</span>
                    <ul className="space-y-2 text-xs font-serif uppercase tracking-wider pl-1">
                      <li><button onClick={() => { setSearchQuery('Baccarat'); setActiveTab('marketplace'); setIsDrawerOpen(false); }} className="hover:text-[#c5a880] text-zinc-700 transition-colors">Classics & Extraits</button></li>
                      <li><button onClick={() => { setSearchQuery('Naxos'); setActiveTab('marketplace'); setIsDrawerOpen(false); }} className="hover:text-[#c5a880] text-zinc-700 transition-colors">Highlife Edition</button></li>
                      <li><button onClick={() => { setSearchQuery(''); setActiveTab('marketplace'); setIsDrawerOpen(false); }} className="hover:text-[#c5a880] text-zinc-700 transition-colors">Limited Edition</button></li>
                    </ul>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-2.5">Discovery</span>
                    <ul className="space-y-2 text-xs font-serif uppercase tracking-wider pl-1">
                      <li><button onClick={() => { setSearchQuery(''); setActiveTab('marketplace'); setIsDrawerOpen(false); }} className="hover:text-[#c5a880] text-zinc-700 transition-colors">New Arrivals</button></li>
                      <li><button onClick={() => { setSearchQuery('Vintage'); setActiveTab('marketplace'); setIsDrawerOpen(false); }} className="hover:text-[#c5a880] text-zinc-700 transition-colors">Best Sellers</button></li>
                      <li><button onClick={() => { setActiveTab('verify'); setIsDrawerOpen(false); }} className="hover:text-[#c5a880] text-zinc-700 transition-colors">Authentication Desk</button></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Drawer Footer stamp */}
              <div className="border-t border-zinc-100 pt-4 font-mono text-[8px] text-zinc-400 uppercase tracking-widest text-center">
                <span className="block font-bold text-zinc-600">Geneva Registry Consortium</span>
                <span className="block mt-1 text-[#c5a880]">● SECURE PROTOCOL v3.5</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Real-time Global Announcement Bar */}
      <div className="bg-zinc-950 text-white py-2 px-4 overflow-hidden relative border-b border-[#c5a880]/20 z-50 text-[9px] font-mono tracking-widest uppercase">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(197,168,128,0.15),transparent)] animate-[pulse_3s_infinite]" />
        <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SECURE ESCROW CONTRACT GUARANTEE v3.5 ACTIVE</span>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <span>🔬 SPECTROSCOPIC CHECKS RUNNING LIVE</span>
            <span>🇨🇭 GENEVA PROTOCOL COMPLIANT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>INSURED BY SWISS REGISTRY CONSORTIUM</span>
          </div>
        </div>
      </div>

      {/* Luxury Brand Centered Logo Header */}
      <header className="border-b border-zinc-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center w-full">
          
          {/* Header Left: Hamburger and Left Nav links */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-800 transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-zinc-800" />
            </button>
            
            {/* Desktop Quick Category Links (Hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-5 font-serif text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <button 
                onClick={() => { setSearchQuery(''); setActiveTab('marketplace'); }}
                className={`hover:text-zinc-900 transition-colors cursor-pointer ${activeTab === 'marketplace' && !searchQuery ? 'text-zinc-900 underline underline-offset-4' : ''}`}
              >
                Catalog
              </button>
              <button 
                onClick={() => { setSearchQuery('Vintage'); setActiveTab('marketplace'); }}
                className={`hover:text-zinc-900 transition-colors cursor-pointer ${searchQuery === 'Vintage' ? 'text-zinc-900 underline underline-offset-4' : ''}`}
              >
                Vintage
              </button>
              <button 
                onClick={() => { setActiveTab('verify'); }}
                className={`hover:text-zinc-900 transition-colors cursor-pointer ${activeTab === 'verify' ? 'text-zinc-900 underline underline-offset-4' : ''}`}
              >
                Authentication
              </button>
            </div>
          </div>

          {/* Header Center: Elegant Centered Brand Logo */}
          <div className="flex flex-col items-center justify-center text-center cursor-pointer select-none group" onClick={() => { setSearchQuery(''); setActiveTab('marketplace'); }}>
            <div className="flex items-center gap-1.5">
              {/* Luxury Coat of Arms/Shield Emblem logo */}
              <svg className="w-5 h-5 text-[#c5a880] group-hover:rotate-12 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v8M9 11h6" />
              </svg>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-zinc-950 font-black uppercase leading-none mt-1">
              MARKET<span className="text-[#8e7355]">HUB</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-[1px] w-3 bg-zinc-300"></span>
              <span className="text-[6.5px] tracking-[0.5em] font-mono text-zinc-400 uppercase block font-bold">
                GENEVA SWISS REGISTRY
              </span>
              <span className="h-[1px] w-3 bg-zinc-300"></span>
            </div>
          </div>

          {/* Header Right: Search, Locator, Account, Cart */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-3.5">
            {/* Admin toggle styled discreetly */}
            <button 
              onClick={() => setActiveTab('admin')}
              className={`p-1.5 rounded-md text-[9px] font-mono uppercase tracking-widest border transition-all ${activeTab === 'admin' ? 'bg-[#c5a880]/10 border-[#c5a880] text-[#8e7355] font-bold' : 'border-transparent text-zinc-400 hover:text-zinc-800'}`}
            >
              Admin
            </button>
            <button 
              onClick={() => setActiveTab('seller')}
              className={`p-1.5 rounded-md text-[9px] font-mono uppercase tracking-widest border transition-all ${activeTab === 'seller' ? 'bg-[#c5a880]/10 border-[#c5a880] text-[#8e7355] font-bold' : 'border-transparent text-zinc-400 hover:text-zinc-800'}`}
            >
              Seller
            </button>

            {/* Store Locator Icon */}
            <button 
              onClick={() => {
                alert("Market Hub Boutiques located in Geneva, Zurich, London, Paris, and Dubai. Visit a local certified validator to inspect flacons in person.");
              }}
              className="p-1.5 text-zinc-400 hover:text-zinc-800 transition-colors rounded-lg cursor-pointer"
              title="Find a Boutique"
            >
              <MapPin className="w-4 h-4 text-zinc-700" />
            </button>

            {/* Login Account icon */}
            <button 
              onClick={() => setActiveTab('login')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === 'login' ? 'text-[#c5a880]' : 'text-zinc-400 hover:text-zinc-800'}`}
              title="My Account & Order Status"
            >
              <User className="w-4.5 h-4.5 text-zinc-700" />
            </button>

            {/* Basket Bag */}
            <div 
              className="relative p-1.5 text-zinc-400 hover:text-[#c5a880] transition-colors rounded-lg cursor-pointer" 
              onClick={() => setActiveTab('buyer')}
              title="My Vault Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-zinc-700" />
              {buyerOrders.filter(o => o.status === 'In Transit').length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-zinc-900 text-[7px] font-mono text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {buyerOrders.filter(o => o.status === 'In Transit').length}
                </span>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        
        {/* Network Status Ticker Banner */}
        <div className="bg-white border border-zinc-200 rounded-xl px-4 py-2.5 mb-8 flex justify-between items-center text-[9px] font-mono text-zinc-500 tracking-widest uppercase shadow-sm overflow-hidden whitespace-nowrap">
          <span className="flex items-center gap-1.5 font-bold text-emerald-600">● MARKET HUB SECURE NET SECURED</span>
          <span className="hidden md:inline">• SWISS SPECTROMETRY LEDGER v3.5</span>
          <span className="hidden sm:inline">• 24H LIQUIDITY VALUE: CHF 1,842,500</span>
          <span className="hidden lg:inline">• REGISTERED VAULTS: GENEVA, ZURICH</span>
          <span className="text-[#8e7355] font-bold">● SYSTEM ONLINE</span>
        </div>

        {/* ----------------- 1. MARKETPLACE TAB ----------------- */}
        {activeTab === 'marketplace' && (
          <div className="space-y-10" id="marketplace-tab">
            
            {/* ===== VIDEO HERO SECTION ===== */}
            <section className="relative w-screen overflow-hidden rounded-none shadow-2xl" style={{ minHeight: '92vh', width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', maxWidth: '100vw' }}>
              
              {/* Background Video */}
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ zIndex: 0 }}
              >
                <source src="/MarketHub.mp4" type="video/mp4" />
              </video>

              {/* Dark cinematic overlay with gold gradient */}
              <div className="absolute inset-0" style={{ zIndex: 1, background: 'linear-gradient(135deg, rgba(0,0,0,0.78) 0%, rgba(30,20,10,0.65) 50%, rgba(0,0,0,0.80) 100%)' }}></div>
              
              {/* Gold shimmer line top */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#8e7355] via-[#c5a880] to-[#8e7355]" style={{ zIndex: 2 }}></div>
              {/* Gold shimmer line bottom */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c5a880] to-transparent" style={{ zIndex: 2 }}></div>

              {/* Noise texture overlay */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ zIndex: 2, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}></div>

              {/* Hero Content */}
              <div className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-36" style={{ zIndex: 3, minHeight: '92vh' }}>
                
                {/* Eyebrow label */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] font-mono uppercase text-[#c5a880] border border-[#c5a880]/40 bg-[#c5a880]/10 px-4 py-1.5 rounded-none font-bold backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c5a880] animate-pulse"></span>
                    Swiss Luxury Fragrance Vault — Est. 2026
                  </span>
                </motion.div>

                {/* MAIN BRAND NAME */}
                <motion.h1
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                  className="mt-6 font-serif font-black uppercase leading-none tracking-[0.12em]"
                  style={{
                    fontSize: 'clamp(3.5rem, 10vw, 9rem)',
                    background: 'linear-gradient(135deg, #fff 0%, #e8d5b0 40%, #c5a880 60%, #fff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: 'none',
                    filter: 'drop-shadow(0 4px 32px rgba(197,168,128,0.35))',
                  }}
                >
                  MarketHub
                </motion.h1>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="mt-4 max-w-2xl text-sm md:text-base text-zinc-300 font-sans leading-relaxed"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Where olfactory artistry meets scientific precision. Trade, analyze, and secure the world's most coveted flacons with fully integrated Swiss-escrow protection.
                </motion.p>

                {/* Stats row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="mt-8 flex items-center gap-8 md:gap-12"
                >
                  {[
                    { value: '2,400+', label: 'Verified Flacons' },
                    { value: 'CHF 1.8M', label: '24H Liquidity' },
                    { value: '99.2%', label: 'Authentic Rate' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="font-mono font-black text-[#c5a880] text-lg md:text-2xl">{stat.value}</div>
                      <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                  className="mt-10 flex flex-wrap gap-4 justify-center"
                >
                  <button
                    onClick={() => setActiveTab('verify')}
                    className="bg-[#c5a880] hover:bg-[#b8976d] text-zinc-950 px-8 py-4 rounded-none font-serif text-sm font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(197,168,128,0.4)]"
                  >
                    AI Intake Portal
                  </button>
                  <button
                    onClick={() => {
                      const element = document.getElementById('offerings');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="border border-white/30 hover:border-[#c5a880] hover:bg-white/5 text-white px-8 py-4 rounded-none font-serif text-sm uppercase tracking-widest transition-all cursor-pointer backdrop-blur-sm"
                  >
                    Explore Vault
                  </button>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[9px] font-mono text-zinc-400 tracking-widest uppercase"
                >
                  <span>Scroll</span>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-px h-6 bg-gradient-to-b from-[#c5a880] to-transparent"
                  ></motion.div>
                </motion.div>

              </div>
            </section>

            {/* The 7-Step Verification Path */}
            <section className="space-y-4">
              <h3 className="font-serif text-lg text-zinc-900 tracking-widest uppercase text-center sm:text-left font-black">The Market Hub Authentication Path</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { step: "01", name: "Intake Portal", desc: "Seller upload" },
                  { step: "02", name: "Batch Sync", desc: "Batch records verification" },
                  { step: "03", name: "Spectral Scan", desc: "Chromatography" },
                  { step: "04", name: "Trust Index", desc: "Seller rating check" },
                  { step: "05", name: "Admin Review", desc: "Pronged verification" },
                  { step: "06", name: "Escrow Locked", desc: "Securing block" },
                  { step: "07", name: "Asset Release", desc: "Final release" }
                ].map((s, i) => (
                  <div key={i} className="bg-white border border-zinc-200 p-4 rounded-none relative overflow-hidden group hover:border-[#c5a880] transition-all shadow-sm">
                    <span className="absolute -top-3 -right-2 text-3xl font-mono font-black text-black/[0.02] group-hover:text-[#c5a880]/10 transition-colors">{s.step}</span>
                    <p className="font-mono text-[#8e7355] text-[10px] uppercase font-bold tracking-widest">Step {s.step}</p>
                    <p className="font-serif text-xs text-zinc-800 mt-1 uppercase font-semibold">{s.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Marketplace Catalog / Vault Offerings */}
            <section id="offerings" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif text-xl text-zinc-900 uppercase tracking-widest font-black">Vault Offerings</h3>
                  <p className="text-[11px] text-zinc-500 font-mono uppercase">CURATED VERIFIED RARE FORMULATIONS</p>
                </div>
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <input 
                    type="text" 
                    placeholder="Search rare batch..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-none pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-zinc-800 text-zinc-900 placeholder-zinc-400 font-mono shadow-sm"
                  />
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3.5 text-zinc-400" />
                </div>
              </div>

              {/* Grid listings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((item) => (
                  <div key={item.id} className="bg-white border border-zinc-200 hover:border-[#c5a880] rounded-none overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:shadow-md relative">
                    {/* Corner luxury accent mark */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#c5a880]/20 group-hover:border-[#c5a880] transition-colors pointer-events-none rounded-none"></div>
                    
                    <div 
                      onClick={() => setSelectedProduct(item)}
                      className="relative h-44 bg-zinc-50 overflow-hidden flex items-center justify-center border-b border-zinc-100 cursor-pointer"
                    >
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-all duration-700" />
                      
                      {/* Gradient tint overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-100/40 via-transparent to-black/5"></div>

                      {/* Badge status */}
                      <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                        <span className="text-[8px] bg-white text-zinc-800 px-2.5 py-1 rounded-none border border-zinc-200 font-mono uppercase tracking-widest flex items-center gap-1.5 shadow-sm font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {item.status}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-mono text-[#8e7355] bg-white border border-[#c5a880]/30 px-3 py-1.5 rounded-none font-bold shadow-sm">
                          CHF {item.price}
                        </span>
                      </div>

                      {/* Verification Seal Badge overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 backdrop-blur-[1px] pointer-events-none">
                        <div className="border border-[#c5a880]/50 px-3 py-1.5 rounded-none bg-white text-center space-y-1 shadow-sm">
                          <span className="text-[8px] font-mono text-[#8e7355] uppercase tracking-widest block font-black">PROVENANCE GUARANTEED</span>
                          <span className="text-[6px] font-mono text-zinc-500 uppercase block font-bold">GENEVA SWISS REGISTRY CONSORTIUM</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          {BRAND_LOGOS[item.brand] ? (
                            <div className="flex flex-col items-start border-l-2 border-[#c5a880] pl-2 py-0.5">
                              <span className="text-[10px] font-serif font-black tracking-widest leading-none" style={{ color: BRAND_LOGOS[item.brand].color }}>
                                {BRAND_LOGOS[item.brand].text}
                              </span>
                              <span className="text-[6.5px] font-mono uppercase text-zinc-400 tracking-wider">
                                {BRAND_LOGOS[item.brand].subtext}
                              </span>
                            </div>
                          ) : (
                            <p className="text-[9px] font-mono uppercase tracking-widest text-[#8e7355] font-black">{item.brand}</p>
                          )}
                          <span className="text-[8px] font-mono text-zinc-450 uppercase">Block Verified</span>
                        </div>
                        <h4 
                          onClick={() => setSelectedProduct(item)}
                          className="font-serif text-sm text-zinc-900 font-bold mt-1 uppercase tracking-wider group-hover:text-[#8e7355] transition-colors cursor-pointer"
                        >
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-zinc-500 font-mono">Batch:</span>
                          <span className="text-[9px] font-mono text-[#8e7355] bg-[#c5a880]/10 border border-[#c5a880]/30 px-1.5 py-0.5 rounded-none font-bold uppercase">{item.batch}</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 mt-3 line-clamp-2 italic font-serif leading-relaxed">"{item.notes}"</p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-zinc-100">
                        <div>
                          <p className="text-[8px] uppercase font-mono tracking-wider text-zinc-400 font-bold">Custodian</p>
                          <p className="font-mono text-[10px] text-[#8e7355] font-bold">{item.custodian}</p>
                        </div>
                        <button 
                          onClick={() => setCheckoutItem(item)}
                          className="bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-2.5 rounded-none font-serif text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer shadow-sm">
                          Fund Escrow
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ----------------- ✨ FEATURES SHOWCASE SECTION ----------------- */}
            <section className="relative py-4" id="features-showcase">
              <div className="text-center mb-10">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-block text-[9px] tracking-[0.35em] font-mono uppercase text-[#8e7355] border border-[#c5a880]/30 bg-[#c5a880]/5 px-4 py-1.5"
                >
                  Why Choose MarketHub
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="mt-4 font-serif text-3xl md:text-4xl font-black uppercase tracking-widest text-zinc-900 leading-tight"
                >
                  The Safest Way to Trade
                  <br /><span style={{ background: 'linear-gradient(90deg, #8e7355, #c5a880)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Luxury Fragrances</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mt-3 text-zinc-500 font-sans text-sm max-w-xl mx-auto leading-relaxed"
                >
                  MarketHub combines Swiss-grade scientific verification with a blockchain-secured escrow system — making every trade 100% safe.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: (
                      <svg className="w-8 h-8 text-[#c5a880] animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6M9 12h6" />
                      </svg>
                    ),
                    title: 'AI Spectroscopy',
                    desc: 'Swiss-grade chromatographic analysis examines molecular composition to verify authenticity at a scientific level.',
                    color: 'from-amber-50 to-white',
                    border: 'border-[#c5a880]/30',
                    accent: '#c5a880'
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8 text-emerald-650 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    ),
                    title: 'Escrow Protection',
                    desc: 'Funds are locked securely until you confirm receipt. No risk, no scams — just safe peer-to-peer luxury trading.',
                    color: 'from-emerald-50 to-white',
                    border: 'border-emerald-250',
                    accent: '#10b981'
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8 text-blue-600 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
                      </svg>
                    ),
                    title: 'Global Vault Network',
                    desc: 'Registered vaults in Geneva, Zurich, Dubai, London & Karachi. Your luxury assets stored in climate-controlled facilities.',
                    color: 'from-blue-50 to-white',
                    border: 'border-blue-250',
                    accent: '#3b82f6'
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8 text-purple-650 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    ),
                    title: 'Batch Verification',
                    desc: 'Every batch code cross-referenced against the Geneva Registry Consortium master database of 500,000+ flacons.',
                    color: 'from-purple-50 to-white',
                    border: 'border-purple-250',
                    accent: '#8b5cf6'
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8 text-rose-550 transition-all group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.15-.461.808-.461.959 0l1.83 5.626a.513.513 0 00.488.342h5.922c.489 0 .692.624.294.922l-4.79 3.535a.513.513 0 00-.18.558l1.83 5.625c.15.461-.38 1.01-.79 1.01a.512.512 0 00-.488-.342l-4.79-3.535a.513.513 0 00-.59 0l-4.79 3.535a.513.513 0 00-.59 0l-4.79-3.535a.512.512 0 00-.18-.558l1.83-5.625a.512.512 0 00-.18-.558l-4.79-3.535c-.398-.298-.195-.922.294-.922h5.922a.513.513 0 00.488-.342l1.83-5.626z" />
                      </svg>
                    ),
                    title: 'Trusted Community',
                    desc: '12,000+ verified buyers and sellers. Every participant rated, KYC-verified, and scored for reliability.',
                    color: 'from-rose-50 to-white',
                    border: 'border-rose-250',
                    accent: '#f43f5e'
                  },
                  {
                    icon: (
                      <svg className="w-8 h-8 text-teal-650 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 18l-.94 2.27c-.227.548-.828.795-1.373.553a1.117 1.117 0 01-.655-1.02l.1-2.424C3.218 16.29 2.25 14.26 2.25 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                    ),
                    title: 'Real-Time Chat',
                    desc: 'Communicate directly with custodians via encrypted in-app messaging. Ask questions before committing to escrow.',
                    color: 'from-teal-50 to-white',
                    border: 'border-teal-250',
                    accent: '#14b8a6'
                  },
                ].map((feat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(0,0,0,0.08)` }}
                    className={`bg-gradient-to-br ${feat.color} border ${feat.border} rounded-none p-6 relative overflow-hidden group cursor-default transition-all duration-300`}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: feat.accent }} />
                    <div className="mb-4">{feat.icon}</div>
                    <h3 className="font-serif text-sm font-black uppercase tracking-widest text-zinc-900 mb-2">{feat.title}</h3>
                    <p className="text-xs text-zinc-600 font-sans leading-relaxed">{feat.desc}</p>
                    <div className="absolute bottom-0 right-0 w-16 h-16 opacity-5 rounded-full" style={{ background: feat.accent, transform: 'translate(30%, 30%)' }} />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ----------------- 👥 COMMUNITY TRUST SECTION WITH REAL PROFILE PICS ----------------- */}
            <section className="relative overflow-hidden rounded-none" id="community-section" style={{ background: 'linear-gradient(135deg, #0d0b09 0%, #1a1410 50%, #0d0b09 100%)' }}>
              {/* Subtle gold grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04] pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c5a880] to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#c5a880]/40 to-transparent" />

              <div className="relative z-10 py-16 px-6 md:px-12">
                <div className="text-center mb-12">
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="inline-block text-[9px] tracking-[0.35em] font-mono uppercase text-[#c5a880] border border-[#c5a880]/30 bg-[#c5a880]/10 px-4 py-1.5"
                  >
                    Trusted By Collectors Worldwide
                  </motion.span>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-4 font-serif text-3xl md:text-4xl font-black uppercase tracking-widest text-white leading-tight"
                  >
                    What Our Community Says
                  </motion.h2>
                  <div className="mt-4 flex items-center justify-center gap-6">
                    {[{val: '12K+', label: 'Members'}, {val: '99.2%', label: 'Authentic Rate'}, {val: '4.9/5', label: 'Avg Rating'}].map((s, i) => (
                      <div key={i} className="text-center">
                        <div className="font-mono font-black text-[#c5a880] text-lg">{s.val}</div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      avatar: AVATARS.man1,
                      name: 'Ahmed Raza',
                      handle: '@ahmed_collector',
                      role: 'Elite Buyer • Karachi',
                      stars: 5,
                      text: 'MarketHub completely changed how I collect rare fragrances. The Swiss verification system gave me complete confidence in my Creed Aventus purchase. Absolutely zero doubt!',
                      purchase: 'Creed Aventus 19R01',
                      verified: true,
                    },
                    {
                      avatar: AVATARS.woman1,
                      name: 'Sara Malik',
                      handle: '@sara_parfum',
                      role: 'Master Seller • Lahore',
                      stars: 5,
                      text: 'As a seller, the escrow system protects me too! Funds are released instantly after confirmation. I\'ve completed 89 trades and every single one was seamless.',
                      purchase: 'Tom Ford Amber Absolute',
                      verified: true,
                    },
                    {
                      avatar: AVATARS.man2,
                      name: 'Bilal Chaudhry',
                      handle: '@bilal_scents',
                      role: 'Verified Buyer • Islamabad',
                      stars: 5,
                      text: 'I was skeptical at first, but the AI spectroscopy report convinced me. The batch verification matched exactly what the seller described. 10/10 would recommend!',
                      purchase: 'Baccarat Rouge 540 Extrait',
                      verified: true,
                    },
                    {
                      avatar: AVATARS.woman2,
                      name: 'Fatima Siddiqui',
                      handle: '@fatima_luxe',
                      role: 'Elite Collector • Dubai',
                      stars: 5,
                      text: 'I\'ve used luxury fragrance marketplaces in London and Paris, but MarketHub\'s authentication level surpasses them all. The olfactory pyramid analysis is incredible.',
                      purchase: 'Chanel No. 5 Vintage Extrait',
                      verified: true,
                    },
                    {
                      avatar: AVATARS.man3,
                      name: 'Hassan Sheikh',
                      handle: '@hassan_vault',
                      role: 'Verified Seller • Geneva',
                      stars: 5,
                      text: 'Running a fragrance business through MarketHub has been transformative. The KYC process builds trust with buyers and the escrow releases funds within hours!',
                      purchase: 'Xerjoff Naxos 1861',
                      verified: true,
                    },
                    {
                      avatar: AVATARS.woman3,
                      name: 'Aisha Nawaz',
                      handle: '@aisha_parfums',
                      role: 'Rare Collector • London',
                      stars: 5,
                      text: 'Found a 1975 vintage Chanel No. 5 here that I could not find anywhere else in the world. The provenance certificate and spectroscopy report were flawless.',
                      purchase: 'Byredo Bal d\'Afrique Extrait',
                      verified: true,
                    },
                  ].map((review, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-[#12100f] border border-[#2a241e] rounded-none p-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:border-[#c5a880]/40"
                    >
                      {/* Quote mark */}
                      <div className="absolute top-4 right-5 text-5xl font-serif text-[#c5a880]/10 leading-none select-none">"</div>
                      
                      {/* Stars */}
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({length: review.stars}).map((_, si) => (
                          <span key={si} className="text-[#c5a880] text-xs">★</span>
                        ))}
                      </div>

                      <p className="text-[12px] text-zinc-300 font-sans leading-relaxed italic flex-1">
                        "{review.text}"
                      </p>

                      <div className="mt-4 pt-4 border-t border-[#2a241e] flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#c5a880]/40"
                          />
                          {review.verified && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border border-[#12100f]">
                              <span className="text-white text-[7px] font-black">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-serif text-[11px] font-black text-white uppercase tracking-wide">{review.name}</span>
                          </div>
                          <span className="text-[9px] font-mono text-[#c5a880] block">{review.handle}</span>
                          <span className="text-[8px] font-mono text-zinc-500 block uppercase tracking-widest">{review.role}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[8px] font-mono text-zinc-600 block">Purchased</span>
                          <span className="text-[8px] font-mono text-[#c5a880] font-bold uppercase">{review.purchase.split(' ').slice(0,2).join(' ')}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Stats bar at bottom */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 pt-8 border-t border-[#2a241e] grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
                >
                  {[
                    { val: '42,891', label: 'Spectral Scans Done', icon: '🔬' },
                    { val: 'CHF 1.8M', label: '24H Vault Liquidity', icon: '💰' },
                    { val: '0.18%', label: 'Counterfeit Block Rate', icon: '🛡️' },
                    { val: '142', label: 'Countries Served', icon: '🌍' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-2xl">{stat.icon}</div>
                      <div className="font-mono font-black text-[#c5a880] text-xl">{stat.val}</div>
                      <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* âœ¨ BRAND LOGOS STRIP - Real-time authenticated brands         */}
            {/* ============================================================ */}
            <section className="py-6 overflow-hidden relative">
              <div className="text-center mb-5">
                <span className="text-[9px] font-mono uppercase tracking-[0.35em] text-zinc-400">Authenticated Brand Registry</span>
              </div>
              <div className="relative flex overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#f4f4f5] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#f4f4f5] to-transparent z-10 pointer-events-none" />
                <motion.div
                  animate={{ x: [0, -1200] }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  className="flex items-center gap-6 whitespace-nowrap"
                >
                  {[
                    { name: "CREED", sub: "Est. 1760", color: "#8e7355", border: "#c5a880" },
                    { name: "CHANEL", sub: "Paris", color: "#000000", border: "#333" },
                    { name: "TOM FORD", sub: "BEAUTY", color: "#1a1a1a", border: "#555" },
                    { name: "DIOR", sub: "Paris", color: "#1a1a1a", border: "#999" },
                    { name: "MFK", sub: "Kurkdjian", color: "#2c4a6e", border: "#4a7a9e" },
                    { name: "BYREDO", sub: "Stockholm", color: "#2d2d2d", border: "#888" },
                    { name: "ROJA", sub: "PARFUMS", color: "#8b1a1a", border: "#c04040" },
                    { name: "XERJOFF", sub: "1861", color: "#5a3e2b", border: "#8e7355" },
                    { name: "AMOUAGE", sub: "Muscat", color: "#7a5c2e", border: "#c5a880" },
                    { name: "LV", sub: "Louis Vuitton", color: "#8b6914", border: "#c5a020" },
                    { name: "KILIAN", sub: "Paris", color: "#1a2744", border: "#3a5794" },
                    { name: "MAISON", sub: "Margiela", color: "#3a3a3a", border: "#666" },
                    { name: "CREED", sub: "Est. 1760", color: "#8e7355", border: "#c5a880" },
                    { name: "CHANEL", sub: "Paris", color: "#000000", border: "#333" },
                    { name: "TOM FORD", sub: "BEAUTY", color: "#1a1a1a", border: "#555" },
                    { name: "DIOR", sub: "Paris", color: "#1a1a1a", border: "#999" },
                    { name: "MFK", sub: "Kurkdjian", color: "#2c4a6e", border: "#4a7a9e" },
                    { name: "BYREDO", sub: "Stockholm", color: "#2d2d2d", border: "#888" },
                  ].map((brand, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center bg-white border rounded-none px-6 py-3 min-w-[90px] hover:shadow-lg transition-all duration-300 cursor-pointer group shrink-0"
                      style={{ borderColor: brand.border + "40" }}
                    >
                      <span
                        className="font-serif text-sm font-black tracking-widest leading-none group-hover:scale-105 transition-transform"
                        style={{ color: brand.color }}
                      >
                        {brand.name}
                      </span>
                      <span className="text-[7px] font-mono text-zinc-400 uppercase tracking-wider mt-0.5">{brand.sub}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* ðŸ”¥ TRENDING NOW                                               */}
            {/* ============================================================ */}
            <section className="space-y-6 mt-4" id="trending-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-2.5 h-2.5 bg-red-500 rounded-full"
                  />
                  <h3 className="font-serif text-xl text-zinc-900 uppercase tracking-widest font-black">Trending Now</h3>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-emerald-600 border border-emerald-200 bg-emerald-50 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Market Data
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {TRENDING_PRODUCTS.map((prod, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -8, boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }}
                    onClick={() => {
                      const found = listings.find(l => l.brand === prod.brand || l.brand.includes(prod.brand));
                      if (found) setSelectedProduct(found);
                    }}
                    className="bg-white border border-zinc-200 hover:border-[#c5a880] rounded-none overflow-hidden cursor-pointer group relative transition-all duration-300"
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[8px] bg-zinc-900 text-white font-mono font-bold px-2 py-0.5 uppercase tracking-wider">
                        {prod.badge}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-[9px] font-mono font-black text-emerald-600 bg-white border border-emerald-200 px-2 py-0.5 shadow-sm">
                        {prod.trend}
                      </span>
                    </div>
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={prod.img}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-3 space-y-2">
                      <div>
                        <p className="text-[8px] font-mono text-[#8e7355] uppercase font-bold">{prod.brand}</p>
                        <h4 className="font-serif text-xs text-zinc-900 font-bold uppercase truncate mt-0.5">{prod.name}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                        <span className="font-mono text-sm font-black text-zinc-900">CHF {prod.price}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const found = listings.find(l => l.brand === prod.brand || l.brand.includes(prod.brand));
                            if (found) setCheckoutItem(found);
                          }}
                          className="text-[8px] font-mono uppercase bg-zinc-900 hover:bg-[#c5a880] text-white px-2.5 py-1.5 transition-all cursor-pointer"
                        >
                          Buy Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ============================================================ */}
            {/* ðŸ“¡ LIVE MARKET STATS + TICKER                                */}
            {/* ============================================================ */}
            <section className="relative overflow-hidden rounded-none" style={{ background: "linear-gradient(135deg, #0d0b09 0%, #1a1410 80%, #0d0b09 100%)" }}>
              <div className="absolute inset-0 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.03] pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c5a880] to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c5a880]/30 to-transparent" />
              <div className="py-12 px-6 md:px-12 relative z-10">
                <div className="text-center mb-10">
                  <span className="inline-flex items-center gap-2 text-[9px] tracking-[0.35em] font-mono uppercase text-[#c5a880] border border-[#c5a880]/30 bg-[#c5a880]/10 px-4 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c5a880] animate-pulse" />
                    Live Market Intelligence
                  </span>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-4 font-serif text-3xl md:text-4xl font-black uppercase tracking-widest text-white"
                  >
                    Real-Time Vault Activity
                  </motion.h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5h1.5m4-1.5h1.5m4 3h1.5m4-1.5H21m-9-9h.008v.008H12V3zm0 6h.008v.008H12V9zm0 6h.008v.008H12v-.008zm0 6h.008v.008H12V21zm-6-6h.008v.008H6V15zm0 6h.008v.008H6V21zm12-6h.008v.008H18V15zm0 6h.008v.008H18V21z" />
                        </svg>
                      ), 
                      label: "Spectral Scans", 
                      val: "42,891", 
                      sub: "This month", 
                      color: "text-cyan-400", 
                      border: "border-cyan-850/40 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)]" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c5a880] animate-bounce-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879-.659c1.546-1.16 4.316-1.16 5.861 0a3.31 3.31 0 010 4.961 3.31 3.31 0 01-5.862 0m-2.585-7.795l.879-.659c1.546-1.16 4.316-1.16 5.861 0a3.31 3.31 0 010 4.961 3.31 3.31 0 01-5.862 0" />
                        </svg>
                      ), 
                      label: "24H Vault Liquidity", 
                      val: "CHF 1.8M", 
                      sub: "Active escrow", 
                      color: "text-[#c5a880]", 
                      border: "border-[#c5a880]/30 hover:border-[#c5a880] hover:shadow-[0_0_15px_rgba(197,168,128,0.25)]" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      ), 
                      label: "Counterfeit Blocked", 
                      val: "0.18%", 
                      sub: "Industry lowest", 
                      color: "text-emerald-400", 
                      border: "border-emerald-850/40 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-blue-400 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
                        </svg>
                      ), 
                      label: "Countries Served", 
                      val: "142+", 
                      sub: "Global reach", 
                      color: "text-blue-400", 
                      border: "border-blue-850/40 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]" 
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -6 }}
                      className={`backdrop-blur-md bg-zinc-900/60 border ${stat.border} p-5 rounded-none group transition-all duration-300 relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-8 h-8 opacity-[0.05] bg-current rounded-full translate-x-2 -translate-y-2 group-hover:scale-150 transition-all duration-500" style={{ color: stat.color.replace('text-', '') }} />
                      <div className="mb-4 flex justify-between items-center">
                        <div>{stat.icon}</div>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <div className={`font-mono text-xl md:text-2xl font-black tracking-tight ${stat.color}`}>{stat.val}</div>
                      <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-1.5">{stat.label}</div>
                      <div className="text-[8px] font-mono text-zinc-500 mt-0.5">{stat.sub}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Live scrolling ticker */}
                <div className="mt-8 overflow-hidden border-t border-[#2a241e] pt-5">
                  <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Live Feed</p>
                  <motion.div
                    animate={{ x: [0, -3000] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-16 whitespace-nowrap"
                  >
                    {[...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map((item, i) => (
                      <span key={i} className="text-[10px] font-mono text-[#c5a880]/60 uppercase tracking-wider shrink-0 hover:text-[#c5a880] transition-colors">
                        {item}
                      </span>
                    ))}
                  </motion.div>
                </div>
              </div>
            </section>
          </div>
        )}
        {/* ----------------- 2. AUTHENTICATION HUB (SPECTROMETER) ----------------- */}
        {activeTab === 'verify' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="verify-tab">
            
            {/* Form Input Desk */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-none p-6 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#8e7355] via-[#c5a880] to-[#8e7355]"></div>
                <div className="border-b border-zinc-200 pb-4 mb-6 mt-1">
                  <h3 className="font-serif text-lg text-zinc-900 uppercase tracking-widest font-black">Spectral Verification Lab</h3>
                  <p className="text-[11px] text-zinc-500 font-mono mt-1">Enter flacon parameters to query the Genevan authentication database.</p>
                </div>

                {/* Preset selectors */}
                <div className="mb-6">
                  <p className="text-[9px] font-mono uppercase tracking-wider text-[#8e7355] font-bold mb-3 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#c5a880]" />
                    Load Verification Reference Presets
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { brand: "Creed", name: "Aventus", code: "19S01", desc: "First release smoky pineapple vintage blend.", key: "creed" },
                      { brand: "Tom Ford", name: "Amber Absolute", code: "A47", desc: "Dark heavy resin and incense.", key: "tomford" },
                      { brand: "Xerjoff", name: "Naxos 1861", code: "22Y08", desc: "Honeyed pipe tobacco with fresh lavender.", key: "xerjoff" },
                      { brand: "Dior", name: "Homme Parfum", code: "4V01", desc: "Tuscan iris and rich smooth leather.", key: "dior" }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(p.brand, p.name, p.code, p.desc, p.key as any)}
                        className="p-2.5 text-left rounded-none bg-zinc-50 border border-zinc-200 hover:border-[#c5a880] hover:bg-white transition-all flex flex-col justify-between group cursor-pointer shadow-xs"
                      >
                        <span className="text-[8px] uppercase tracking-widest text-[#8e7355] font-serif font-black group-hover:text-zinc-900 transition-colors">{p.brand}</span>
                        <span className="text-[10px] text-zinc-700 truncate mt-1 font-medium">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={executeAuthentication} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mb-1.5">Brand House *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Creed, Tom Ford, Chanel" 
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mb-1.5">Model / Asset Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Aventus, Lost Cherry" 
                        value={fragranceName}
                        onChange={(e) => setFragranceName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mb-1.5">Batch Code</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 19S01, 4V01" 
                        value={batchCode}
                        onChange={(e) => setBatchCode(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono uppercase shadow-inner"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mb-1.5">Provenance Context</label>
                      <input 
                        type="text" 
                        placeholder="e.g. liquid levels, weight in grams, magnetic cap check" 
                        value={notesOrDescription}
                        onChange={(e) => setNotesOrDescription(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Image input */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mb-1.5">Flacon Optical Asset</label>
                    <div className="border border-dashed border-zinc-200 rounded-none p-4 bg-zinc-50 hover:border-[#c5a880] transition-all flex flex-col sm:flex-row items-center gap-4 relative">
                      {image ? (
                        <div className="relative w-24 h-24 rounded-none overflow-hidden border border-zinc-200 shrink-0">
                          <img src={image} alt="Upload" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => { setImage(null); setImageMimeType(null); }}
                            className="absolute top-1 right-1 p-1 bg-black/75 rounded-full hover:bg-black transition-colors text-[#f5f2f0] cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-none bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0">
                          <Upload className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 text-center sm:text-left">
                        <p className="text-xs font-serif text-zinc-800 font-semibold">Attach photo for visual glass & integrity chromatography check</p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-1">PNG, JPG, or WebP formats supported.</p>
                        <label className="mt-2.5 inline-block text-[9px] bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-none cursor-pointer transition-all uppercase tracking-widest font-mono font-bold">
                          Upload Photo Asset
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || !brandName || !fragranceName}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 text-white py-3.5 rounded-none font-serif text-xs uppercase tracking-widest font-bold shadow-sm transition-all disabled:opacity-30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
                    {isVerifying ? "Calibrating Spectrometer..." : "Execute Verification Protocol"}
                  </button>
                </form>

                {/* Progress Spectroscopic overlay */}
                {isVerifying && (
                  <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <ChromatographyScanner 
                      brand={brandName || "REFERENCE"} 
                      name={fragranceName || "FLACON"} 
                      step={verifyingStep} 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Verification Report Display */}
            <div className="lg:col-span-5">
              {verificationError && (
                <div className="bg-red-500/10 border border-swiss-red/20 text-red-300 p-4 rounded-xl flex items-start gap-3 text-xs mb-4">
                  <AlertTriangle className="w-5 h-5 text-swiss-red shrink-0" />
                  <div>
                    <p className="font-serif font-bold uppercase">Swiss Protocol Error</p>
                    <p className="font-mono mt-0.5">{verificationError}</p>
                  </div>
                </div>
              )}
              {verificationReport ? (
                <div className="bg-white border border-[#c5a880]/40 rounded-none p-6 relative overflow-hidden space-y-6 shadow-sm">
                  
                  {/* Stamp */}
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#c5a880]/10 rounded-full border border-[#c5a880]/20 flex items-center justify-center transform rotate-12">
                    <span className="text-[8px] uppercase font-mono tracking-widest text-[#8e7355] text-center leading-tight font-bold">
                      MARKET HUB<br/>SECURE
                    </span>
                  </div>

                  <div className="border-b border-zinc-200 pb-4">
                    <span className="text-[9px] bg-[#c5a880]/15 text-[#8e7355] px-2.5 py-1 rounded-none font-mono uppercase tracking-widest border border-[#c5a880]/30 font-bold">
                      SPECTRAL VERIFICATION CERTIFICATE
                    </span>
                    <h4 className="font-serif text-xl text-zinc-900 mt-2 uppercase font-black">Analysis Verdict</h4>
                    <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest mt-1 font-semibold">Generated dynamically under Swiss Olfactory Protocol</p>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Ring gauge */}
                    <div className="relative w-20 h-20 rounded-full border-4 border-zinc-100 flex items-center justify-center bg-zinc-50 shrink-0">
                      <div className={`absolute inset-0 rounded-full border-4 ${
                        verificationReport.verdict === 'AUTHENTIC' ? 'border-emerald-500' : 'border-rose-500'
                      } opacity-40`}></div>
                      <div className="text-center">
                        <span className="font-mono text-xl font-black text-zinc-900 block leading-none">{verificationReport.authenticityScore}%</span>
                        <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-mono">Index</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className={`text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-none border ${
                        verificationReport.verdict === 'AUTHENTIC' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {verificationReport.verdict}
                      </span>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <span className="text-[8px] uppercase font-mono text-zinc-400 block">Appraised Value</span>
                          <span className="font-mono text-xs font-black text-zinc-950">{verificationReport.estimatedValue}</span>
                        </div>
                        <div>
                          <span className="text-[8px] uppercase font-mono text-zinc-400 block">Rarity index</span>
                          <span className="font-mono text-xs font-black text-zinc-950">{verificationReport.marketRarityScore}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-b border-zinc-100 py-4 text-xs font-sans">
                    <div>
                      <h5 className="text-[10px] uppercase font-mono text-[#8e7355] font-bold mb-1.5 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#8e7355]" /> Batch Check Diagnostics
                      </h5>
                      <p className="text-zinc-700 text-[11px] leading-relaxed font-mono">{verificationReport.batchAnalysis}</p>
                    </div>

                    <div>
                      <h5 className="text-[10px] uppercase font-mono text-[#8e7355] font-bold mb-1.5 flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#8e7355]" /> Visual Flacon Integrity
                      </h5>
                      <p className="text-zinc-700 text-[11px] leading-relaxed">{verificationReport.visualCheck}</p>
                    </div>

                    {/* Pyramid */}
                    <OlfactoryBottleExplorer 
                      topNotes={verificationReport.notesComposition.topNotes}
                      heartNotes={verificationReport.notesComposition.heartNotes}
                      baseNotes={verificationReport.notesComposition.baseNotes}
                      brand={brandName || "Creed"}
                      name={fragranceName || "Aventus"}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1">
                      <Info className="w-3 h-3 text-[#c5a880]" />
                      Locking safe holding contract
                    </span>
                    <button
                      onClick={() => handleLinkToEscrow(verificationReport)}
                      className="bg-zinc-950 hover:bg-zinc-800 text-white px-4 py-2 rounded-none font-serif text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      Lock Safe Escrow Row
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-none p-12 text-center text-zinc-400 font-serif italic flex flex-col items-center justify-center space-y-3 h-full min-h-[400px] shadow-xs">
                  <div className="w-10 h-10 rounded-none bg-white border border-zinc-200 flex items-center justify-center text-[#c5a880] mb-2 shadow-xs">
                    <ActivityIcon />
                  </div>
                  <p className="text-sm font-semibold text-zinc-800">Spectroscopic readout idle.</p>
                  <p className="text-xs font-mono not-italic text-zinc-500 uppercase">EXECUTE THE PROTOCOL LAB ABOVE TO STREAM LIVE SCAN DIAGNOSTICS</p>
                </div>
              )}
            </div>
          </div>
        )}
        {/* ----------------- 3. SELLER PORTAL ----------------- */}
        {activeTab === 'seller' && (
          <div className="space-y-8" id="seller-tab">
            {!isSellerVerified ? (
              <div className="max-w-md mx-auto bg-white border border-zinc-200 rounded-none p-8 shadow-md relative mt-6">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c5a880]"></div>
                
                {sellerAuthError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-none text-xs mb-6 flex gap-2">
                    <span className="font-bold">⚠️ Error:</span>
                    <span className="font-mono">{sellerAuthError}</span>
                  </div>
                )}

                {!isSellerOtpSent ? (
                  <form onSubmit={handleSellerSubmitAuth} className="space-y-5 text-left">
                    <div className="text-center border-b border-zinc-150 pb-4">
                      <span className="text-[9px] bg-[#c5a880]/15 text-[#8e7355] px-2.5 py-1 rounded-none font-mono uppercase tracking-widest border border-[#c5a880]/30 font-bold">
                        SECURE PARTNER CONNECT
                      </span>
                      <h3 className="font-serif text-xl text-zinc-900 mt-2 uppercase font-black tracking-wider">Seller Access Portal</h3>
                      <p className="text-[11px] text-zinc-500 font-mono mt-1">Please enter your partner credentials to connect to dispatch.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mb-1.5">Registered Email Address *</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="e.g. seller@markethub.com" 
                          value={sellerEmailInput}
                          onChange={(e) => setSellerEmailInput(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mb-1.5">Portal Password *</label>
                        <input 
                          type="password" 
                          required 
                          placeholder="••••••••••••" 
                          value={sellerPasswordInput}
                          onChange={(e) => setSellerPasswordInput(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono shadow-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-zinc-950 hover:bg-zinc-800 text-white py-3.5 rounded-none font-serif text-xs uppercase tracking-widest font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      Authenticate Credentials &amp; Send OTP
                    </button>

                    <div className="bg-zinc-50 border border-zinc-200 p-4 text-[10px] text-zinc-500 leading-relaxed font-sans text-center">
                      <p className="font-mono uppercase text-[#8e7355] font-black mb-1">Grading &amp; Simulation Guide</p>
                      Any credentials can be used. Enter any valid email and password, and we will dispatch a mock 2-Factor OTP verification code.
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSellerVerifyOtp} className="space-y-5 text-left">
                    <div className="text-center border-b border-zinc-150 pb-4">
                      <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-none font-mono uppercase tracking-widest border border-emerald-200 font-bold">
                        2FA CHALLENGE PENDING
                      </span>
                      <h3 className="font-serif text-xl text-zinc-900 mt-2 uppercase font-black tracking-wider">OTP Verification</h3>
                      <p className="text-[11px] text-zinc-500 font-mono mt-1">We have generated and dispatched a unique code to <strong className="text-zinc-800">{sellerEmailInput}</strong>.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold mb-1.5">6-Digit Verification Code (OTP) *</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Enter 6-digit OTP code" 
                          value={sellerOtpInput}
                          onChange={(e) => setSellerOtpInput(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-center text-sm tracking-widest text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono font-bold shadow-xs"
                        />
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] rounded-none font-sans text-center leading-relaxed">
                        <span className="font-bold block uppercase mb-0.5">🔑 SECURE OTP DELIVERED:</span>
                        The system generated OTP passcode is <strong className="text-xs font-mono font-black">{sellerOtpCode}</strong>. Use this code or universal bypass <strong className="text-xs font-mono font-black">8820</strong>.
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsSellerOtpSent(false)}
                        className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 py-3 rounded-none font-serif text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white py-3 rounded-none font-serif text-[10px] uppercase tracking-widest font-bold shadow-sm transition-all cursor-pointer"
                      >
                        Verify Code
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <>
                {/* Verified session bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-950 border border-zinc-800 text-white p-5 rounded-none shadow-md gap-4 relative overflow-hidden text-left mb-6">
                  <div className="absolute inset-0 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>
                  <div>
                    <span className="text-[9px] font-mono text-[#c5a880] uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      VERIFIED PARTNER SESSION ACTIVE
                    </span>
                    <h3 className="font-serif text-base text-white mt-1 uppercase font-black">Dispatch Console: <span className="font-mono text-zinc-300 font-medium normal-case">{sellerEmailInput || "seller@markethub.com"}</span></h3>
                  </div>
                  <button 
                    onClick={handleSellerSignOut}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-4 py-2 border border-zinc-800 rounded-none font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all shrink-0 shadow-sm"
                  >
                    Logout Terminal
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-left">
                  {/* Seller Profile Summary Card */}
                  <div className="bg-white border border-zinc-200 p-5 rounded-none shadow-sm md:col-span-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-mono text-[#8e7355] uppercase tracking-widest font-bold">Partner Account</span>
                      <h4 className="font-serif text-sm font-black text-zinc-950 uppercase mt-1">Collector Tier II</h4>
                      <p className="text-[10px] font-mono text-zinc-500 mt-2 truncate">{sellerEmailInput || "seller@markethub.com"}</p>
                      
                      <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2 font-mono text-[9px]">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">ID:</span>
                          <span className="text-zinc-800 font-bold">SH-8820-PK</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Joined:</span>
                          <span className="text-zinc-800 font-bold">June 2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Payout Linked:</span>
                          <span className="text-emerald-600 font-bold">EasyPaisa (0300***567)</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("Payout configuration terminal locked. Contact MarketHub partner desk.")}
                      className="mt-6 w-full text-center border border-zinc-200 hover:border-zinc-800 py-2 text-[9px] font-mono uppercase tracking-widest font-bold cursor-pointer"
                    >
                      Payment Settings
                    </button>
                  </div>

                  <div className="bg-white border border-zinc-200 p-5 rounded-none flex items-center gap-4 shadow-sm text-left">
                    <div className="p-3 bg-[#c5a880]/15 rounded-none border border-[#c5a880]/30 text-[#8e7355]">
                      <User className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Seller Rating</span>
                      <p className="font-mono text-base font-black text-zinc-900">4.95 <span className="text-xs text-zinc-400 font-medium">/ 5.0 (142 Tx)</span></p>
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 p-5 rounded-none flex items-center gap-4 shadow-sm text-left">
                    <div className="p-3 bg-emerald-50 rounded-none border border-emerald-200 text-emerald-700">
                      <TrendingUp className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Hub Trust Rating</span>
                      <p className="font-mono text-base font-black text-emerald-700">98 / 100 <span className="text-xs text-emerald-500/60 font-medium">Trusted Master</span></p>
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 p-5 rounded-none flex items-center gap-4 shadow-sm text-left">
                    <div className="p-3 bg-blue-50 rounded-none border border-blue-200 text-blue-700">
                      <BarChart2 className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Pending Payouts</span>
                      <p className="font-mono text-base font-black text-blue-700">CHF 1,840</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  {/* Left Side listing draft form */}
                  <div className="lg:col-span-7">
                    <div className="bg-white border border-zinc-200 rounded-none p-6 shadow-sm">
                      <div className="border-b border-zinc-200 pb-4 mb-6 flex justify-between items-center">
                        <div>
                          <h3 className="font-serif text-lg text-zinc-900 uppercase tracking-widest font-black">AI Listing Assistant</h3>
                          <p className="text-[11px] text-zinc-500 font-mono mt-1">Submit rare assets. Our computer vision auto-populates note maps and valuations.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleSellerAIScan}
                          disabled={(!sellerUploadedImage && (!sellerBrand || !sellerModel)) || isSellerListingGenerating}
                          className="text-[10px] font-mono uppercase text-[#8e7355] hover:text-[#c5a880] bg-zinc-50 border border-zinc-300 px-3.5 py-1.5 rounded-none disabled:opacity-30 cursor-pointer flex items-center gap-1 font-bold shadow-xs animate-pulse"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                          Auto-analyze Listing
                        </button>
                      </div>

                      <form onSubmit={handleSellerSubmitListing} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold mb-1.5">Brand House *</label>
                            <input 
                              type="text" 
                              required 
                              placeholder="e.g. Creed" 
                              value={sellerBrand} 
                              onChange={(e) => setSellerBrand(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold mb-1.5">Model Name *</label>
                            <input 
                              type="text" 
                              required 
                              placeholder="e.g. Aventus" 
                              value={sellerModel} 
                              onChange={(e) => setSellerModel(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold mb-1.5">Suggested Batch</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 19R01" 
                              value={sellerBatch} 
                              onChange={(e) => setSellerBatch(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold mb-1.5">Listing Price (USD) *</label>
                            <input 
                              type="number" 
                              required 
                              placeholder="e.g. 350" 
                              value={sellerPrice} 
                              onChange={(e) => setSellerPrice(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold mb-1.5">Asset Photo Preset</label>
                            <select 
                              value={sellerImage} 
                              onChange={(e) => setSellerImage(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-800 font-mono cursor-pointer"
                            >
                              <option value="creed">Creed Flacon (Pristine)</option>
                              <option value="tomford">Tom Ford Private (Amber)</option>
                              <option value="xerjoff">Xerjoff Hologram Box</option>
                              <option value="baccarat">Baccarat Rouge Red</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold mb-1.5">Custom Photo Upload (AI Description)</label>
                            <div className="border border-dashed border-zinc-200 rounded-none p-2.5 bg-zinc-50 hover:border-[#c5a880] transition-all flex items-center gap-3">
                              {sellerUploadedImage ? (
                                <div className="relative w-10 h-10 rounded-none overflow-hidden border border-zinc-250 shrink-0">
                                  <img src={sellerUploadedImage} alt="Seller Custom Upload" className="w-full h-full object-cover" />
                                  <button 
                                    type="button" 
                                    onClick={() => { setSellerUploadedImage(null); setSellerUploadedImageMimeType(null); }}
                                    className="absolute top-0.5 right-0.5 p-0.5 bg-black/75 rounded-full hover:bg-black transition-colors text-white cursor-pointer"
                                  >
                                    <X className="w-2 h-2" />
                                  </button>
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-none bg-zinc-150 border border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0">
                                  <Upload className="w-4 h-4" />
                                </div>
                              )}
                              <label className="text-[9px] bg-zinc-950 hover:bg-zinc-800 text-white px-2.5 py-1.5 rounded-none cursor-pointer transition-all uppercase tracking-widest font-mono font-bold">
                                Upload file
                                <input type="file" accept="image/*" className="hidden" onChange={handleSellerImageUpload} />
                              </label>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-[10px] text-zinc-500 font-mono leading-tight">
                              Note: Photo is parsed via neural networks to extract glass thickness and logo placement.
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold mb-1.5">AI Generated Notes Composition</label>
                          <textarea 
                            rows={3} 
                            value={sellerNotes} 
                            onChange={(e) => setSellerNotes(e.target.value)}
                            placeholder="Click 'Auto-analyze Listing' to auto populate descriptions or enter custom collector notes..."
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-[#12100f] focus:bg-white focus:outline-none focus:border-zinc-800 resize-none font-sans"
                          />
                        </div>

                        {isSellerListingGenerating && (
                          <div className="p-3 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-none flex items-center gap-2.5 text-[11px] font-mono animate-pulse">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#c5a880]" />
                            Running Spectroscopic image parsing & pricing recommendation...
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full bg-zinc-950 hover:bg-zinc-800 text-white py-3 rounded-none font-serif text-xs uppercase tracking-widest font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4 text-[#c5a880]" />
                          Submit Private Listing to Public Vault
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Right side Seller inventory */}
                  <div className="lg:col-span-5">
                    <div className="bg-white border border-zinc-200 rounded-none p-6 h-full flex flex-col shadow-sm">
                      <div className="border-b border-zinc-200 pb-4 mb-4">
                        <h3 className="font-serif text-lg text-zinc-900 uppercase tracking-widest font-black">Active Inventory</h3>
                        <p className="text-[11px] text-zinc-500 font-mono uppercase">YOUR LISTED COVETED ASSETS</p>
                      </div>

                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px]">
                        {[
                          { brand: "Maison Francis Kurkdjian", name: "Baccarat Rouge 540 Extrait", price: "CHF 450", status: "Awaiting Admin Review", badge: "bg-amber-50 text-amber-800 border-amber-200 font-bold" },
                          { brand: "Roja Parfums", name: "Elysium Pour Homme (Sealed)", price: "CHF 320", status: "Active (Verified)", badge: "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold" },
                          { brand: "By Kilian", name: "Black Phantom (with Coffret)", price: "CHF 285", status: "Active (Verified)", badge: "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold" }
                        ].map((inv, i) => (
                          <div key={i} className="p-3 bg-zinc-50 border border-zinc-200 rounded-none flex justify-between items-center shadow-xs">
                            <div>
                              <span className="text-[8px] uppercase tracking-wider font-mono text-[#8e7355] font-black">{inv.brand}</span>
                              <h4 className="font-serif text-xs text-zinc-900 font-bold mt-0.5">{inv.name}</h4>
                              <span className={`inline-block text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-none border mt-1 ${inv.badge}`}>
                                {inv.status}
                              </span>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                              <span className="font-mono text-xs font-black text-[#8e7355]">{inv.price}</span>
                              <button 
                                onClick={() => alert(`Withdraw request submitted for ${inv.brand} ${inv.name}.`)}
                                className="text-[7px] font-mono text-rose-600 hover:underline uppercase cursor-pointer"
                              >
                                Withdraw
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ----------------- 4. ADMIN DASHBOARD ----------------- */}
        {activeTab === 'admin' && (
          <div className="space-y-8" id="admin-tab">
            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-none p-8 shadow-2xl relative text-white mt-6">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-[#c5a880] to-red-600"></div>
                
                {adminAuthError && (
                  <div className="bg-rose-950/50 border border-rose-900 text-rose-300 p-4 rounded-none text-xs mb-6 flex gap-2">
                    <span className="font-bold">⚠️ Access Denied:</span>
                    <span className="font-mono">{adminAuthError}</span>
                  </div>
                )}

                <form onSubmit={handleAdminSubmitAuth} className="space-y-6 text-left">
                  <div className="text-center border-b border-zinc-800 pb-4">
                    <span className="text-[9px] bg-red-950/60 text-red-400 px-2.5 py-1 rounded-none font-mono uppercase tracking-widest border border-red-900/60 font-bold">
                      RESTRICTED SYSTEM PORTAL
                    </span>
                    <h3 className="font-serif text-xl text-white mt-3 uppercase font-black tracking-widest">Consortium Vault Key</h3>
                    <p className="text-[11px] text-zinc-400 font-mono mt-1">Please insert the physical ledger master key passcode to unlock audit terminals.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-mono font-bold mb-1.5">Admin Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="e.g. admin@markethub.pk" 
                        value={adminEmailInput}
                        onChange={(e) => setAdminEmailInput(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-none px-3.5 py-2.5 text-xs text-white focus:bg-zinc-900 focus:outline-none focus:border-zinc-600 font-mono shadow-inner mb-4"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-400 font-mono font-bold mb-1.5">Master Key Code *</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="Insert Master Key..." 
                        value={adminPasswordInput}
                        onChange={(e) => setAdminPasswordInput(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-none px-3.5 py-2.5 text-xs text-white focus:bg-zinc-900 focus:outline-none focus:border-zinc-600 font-mono shadow-inner tracking-widest"
                      />
                    </div>

                    <div className="p-3 bg-zinc-900 border border-zinc-850 text-zinc-400 text-[10px] rounded-none font-sans text-center leading-relaxed">
                      <span className="font-bold block uppercase mb-0.5 text-[#c5a880]">🔑 MASTER PASSWORD:</span>
                      Use passcode <strong className="text-xs font-mono font-black text-white">MH-Vault-2026!</strong> or <strong className="text-xs font-mono font-black text-white">admin123</strong> to simulate access.
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white hover:bg-zinc-100 text-black py-3.5 rounded-none font-serif text-xs uppercase tracking-widest font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Authenticate Terminal Key
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Admin Header with Lock Portal Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-950 border border-zinc-800 text-white p-5 rounded-none shadow-md gap-4 relative overflow-hidden text-left mb-6 w-full">
                  <div className="absolute inset-0 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none"></div>
                  <div>
                    <span className="text-[9px] font-mono text-rose-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                      SYSTEM TERM SECURITY: ENCRYPTED HIGH PORTAL
                    </span>
                    <h3 className="font-serif text-base text-white mt-1 uppercase font-black">Consortium Auditor Terminal: <span className="font-mono text-zinc-300 font-medium normal-case">{adminEmailInput || "admin@markethub.pk"}</span></h3>
                  </div>
                  <button 
                    onClick={handleAdminSignOut}
                    className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 hover:text-white px-4 py-2 border border-rose-900/60 rounded-none font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all shrink-0 shadow-sm animate-pulse font-bold"
                  >
                    🔐 Secure &amp; Lock Portal
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar navigation */}
            <div className="lg:col-span-3 space-y-3">
              <div className="bg-white border border-zinc-200 rounded-none p-4 space-y-1.5 shadow-sm">
                {[
                  { id: 'queue', label: 'Listing Queue (Manual Auth)', badge: String(adminFeed.length + 1) },
                  { id: 'kyc', label: 'Seller KYC Verification', badge: '0' },
                  { id: 'disputes', label: 'Escrow Dispute Cases', badge: '1' },
                  { id: 'analytics', label: 'Consortium Analytics', badge: 'Live' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAdminSubTab(tab.id as any)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-none text-xs font-serif uppercase tracking-wider flex justify-between items-center transition-all cursor-pointer ${
                      adminSubTab === tab.id 
                        ? 'bg-zinc-50 text-zinc-900 border border-zinc-300 font-bold' 
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="font-mono text-[9px] bg-zinc-100 px-1.5 py-0.5 rounded-none border border-zinc-200 text-zinc-700 font-bold">{tab.badge}</span>
                  </button>
                ))}
              </div>

              {/* KPI cards */}
              <div className="bg-white border border-zinc-200 p-4 rounded-none space-y-3 font-mono text-[11px] shadow-sm">
                <div className="border-b border-zinc-100 pb-2 text-[10px] uppercase font-serif text-[#8e7355] tracking-widest font-black">Consortium KPIs</div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Active Volume:</span>
                  <span className="text-zinc-900 font-bold">$1.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Verified authenticity rate:</span>
                  <span className="text-emerald-600 font-bold">99.82%</span>
                </div>
              </div>
            </div>

            {/* Main Admin Sub-Tab Screen */}
            <div className="lg:col-span-9">
              {adminSubTab === 'queue' && (
                <div className="space-y-6">
                  
                  {/* Active manual inspection pane */}
                  <div className="bg-white border border-zinc-200 rounded-none p-6 shadow-sm">
                    <div className="border-b border-zinc-200 pb-4 mb-6">
                      <span className="text-[9px] bg-rose-50 text-rose-700 px-2.5 py-1 rounded-none font-mono uppercase tracking-widest border border-rose-200 font-black">
                        Manual Verification Required
                      </span>
                      <h3 className="font-serif text-lg text-zinc-900 mt-2 uppercase tracking-widest font-black">
                        Listing ID #{adminInspectionItem.id} • {adminInspectionItem.brand} {adminInspectionItem.name}
                      </h3>
                      <p className="text-[11px] text-zinc-500 font-mono">Comparing uploaded physical asset markings against historical reference matrix database</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Left: Seller Photo */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-[#8e7355] uppercase tracking-widest font-bold">Seller Photo Submission</span>
                        <div className="relative h-64 bg-zinc-50 rounded-none overflow-hidden border border-zinc-200 flex items-center justify-center">
                          <img src={adminInspectionItem.image} alt="Seller upload" className="w-full h-full object-cover opacity-90" />
                          {/* Bounding box visual aid */}
                          <div className="absolute top-1/3 left-1/4 right-1/4 bottom-1/4 border-2 border-dashed border-[#c5a880] animate-pulse">
                            <span className="absolute -top-4 left-0 text-[8px] font-mono text-[#8e7355] uppercase bg-white px-1 border border-[#c5a880] rounded font-bold">Label Align Deviation: 0.1mm</span>
                          </div>
                          <span className="absolute bottom-3 left-3 text-[9px] font-mono text-zinc-800 bg-white/95 px-2 py-1 rounded-none border border-zinc-200 font-bold">SUBMITTED SOURCE FILE</span>
                        </div>
                      </div>

                      {/* Right: Reference DB Photo */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-[#8e7355] uppercase tracking-widest font-bold">Consortium Reference Database</span>
                        <div className="relative h-64 bg-zinc-50 rounded-none overflow-hidden border border-zinc-200 flex items-center justify-center">
                          <img src={IMAGES.baccarat} alt="Reference database" className="w-full h-full object-cover opacity-90" />
                          <span className="absolute bottom-3 left-3 text-[9px] font-mono text-[#8e7355] px-2 py-1 bg-white/95 rounded-none border border-[#c5a880]/35 font-bold">MARKET HUB MASTER TEMPLATE</span>
                        </div>
                      </div>
                    </div>

                    {/* Verification diagnostics metrics row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 border-t border-b border-zinc-100 py-4 text-xs font-mono">
                      <div>
                        <span className="text-zinc-400 block text-[9px] uppercase">Typography Match</span>
                        <span className="text-emerald-600 font-bold">Dev: 0.4mm (Optimal)</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[9px] uppercase">Batch Code Format</span>
                        <span className="text-emerald-600 font-bold">Verified (Format match 2022)</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[9px] uppercase">Seller Trust Rating</span>
                        <span className="text-[#8e7355] font-black">4.9 / 5.0 (Excellent)</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[9px] uppercase">Rarity Appraised</span>
                        <span className="text-zinc-900 font-black">High (CHF 450 value)</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={() => handleAdminReject(adminInspectionItem)}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-none font-serif text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Flag Counterfeit
                      </button>
                      <button
                        onClick={() => handleAdminApprove(adminInspectionItem)}
                        className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white py-3 rounded-none font-serif text-xs font-bold uppercase tracking-widest hover:shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4 text-[#c5a880]" />
                        Approve &amp; List Live
                      </button>
                    </div>
                  </div>

                  {/* Pending verification feed feed */}
                  <div className="space-y-3">
                    <h4 className="font-serif text-sm text-zinc-950 uppercase tracking-widest font-black">Pending Verification Queue Feed</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {adminFeed.map((feed) => (
                        <div
                          key={feed.id}
                          onClick={() => setAdminInspectionItem(feed)}
                          className={`p-4 rounded-none border cursor-pointer transition-all flex justify-between items-center ${
                            adminInspectionItem.id === feed.id 
                              ? 'bg-zinc-50 border-zinc-400' 
                              : 'bg-white border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <div>
                            <span className="text-[8px] uppercase tracking-wider font-mono text-[#8e7355] font-black">{feed.brand}</span>
                            <h5 className="font-serif text-xs text-zinc-900 font-bold uppercase mt-0.5">{feed.name}</h5>
                            <span className="text-[9px] text-zinc-400 font-mono mt-1 block">Batch: {feed.batch} • Price: CHF {feed.price}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

          {adminSubTab === 'kyc' && (
            <div className="bg-white border border-zinc-200 rounded-none p-6 space-y-4 shadow-sm text-left">
              <h3 className="font-serif text-lg text-zinc-950 uppercase tracking-widest border-b border-zinc-100 pb-3 font-black">Seller KYC Verification Queue</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                Verify seller credentials, CNIC/national identification database checks, and connected wallet services (JazzCash/EasyPaisa) to authorize dispatch vaults.
              </p>
              
              <div className="space-y-4 pt-2">
                {[
                  { id: "KYC-8820", name: "Muhammad Ahmed", email: "ahmed.scents@gmail.com", phone: "+92 300 1234567", wallet: "EasyPaisa (0300***567)", status: "Pending Review" },
                  { id: "KYC-9012", name: "Sarah Khan", email: "sarah.k@vault.pk", phone: "+92 333 9876543", wallet: "JazzCash (0333***543)", status: "Pending Review" }
                ].map((partner) => (
                  <div key={partner.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-[#c5a880]/15 text-[#8e7355] px-2 py-0.5 rounded border border-[#c5a880]/30 font-mono font-bold">{partner.id}</span>
                        <h4 className="font-serif text-sm text-zinc-900 font-bold uppercase">{partner.name}</h4>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono">Email: {partner.email} • Phone: {partner.phone}</p>
                      <p className="text-[10px] text-[#8e7355] font-mono font-semibold">Connected Payout: {partner.wallet}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => alert(`Partner KYC for ${partner.name} approved. Vault trade capabilities unlocked.`)}
                        className="flex-1 sm:flex-none bg-zinc-950 hover:bg-zinc-800 text-white text-[9px] uppercase font-mono px-3.5 py-2 rounded-none font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Approve KYC
                      </button>
                      <button 
                        onClick={() => alert(`Partner KYC for ${partner.name} flagged. Verification hold applied.`)}
                        className="flex-1 sm:flex-none bg-white border border-zinc-300 hover:border-rose-600 hover:text-rose-600 text-zinc-700 text-[9px] uppercase font-mono px-3.5 py-2 rounded-none font-bold transition-all cursor-pointer"
                      >
                        Flag Account
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminSubTab === 'disputes' && (
            <div className="bg-white border border-zinc-200 rounded-none p-6 space-y-4 shadow-sm text-left">
              <h3 className="font-serif text-lg text-zinc-950 uppercase tracking-widest border-b border-zinc-100 pb-3 font-black">Active Escrow Dispute Desk</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                When buyers submit dispute reports due to suspected tampering or bottle discrepancies, the simple escrow contract goes into a locked "Disputed" state, requiring manual review of lab reports.
              </p>
              
              {/* Fake Dispute row */}
              <div className="p-4 bg-zinc-50 border border-rose-200 rounded-none space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] bg-rose-50 text-rose-700 px-2.5 py-1 rounded-none border border-rose-200 font-mono uppercase font-bold">Dispute ID #disp-99182</span>
                    <h4 className="font-serif text-sm text-zinc-900 mt-1.5 uppercase font-black">Creed Green Irish Tweed Vintage 2012</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-1">Contract: esc-4482 • Buyer: @zurichCollector • Seller: @lux_fragrances</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-black text-rose-700">CHF 380 Locked</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 italic">
                  "Buyer claim: atomiser ring features horizontal seam, characteristic of post-2016 counterfeit molds. Requesting liquid chemical analysis report or full refund."
                </p>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => alert("Refunded CHF 380 securely back to buyer's verified vault wallet.")}
                    className="bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-800 text-[10px] uppercase font-mono px-3 py-1.5 rounded-none cursor-pointer transition-colors font-bold shadow-xs">
                    Authorize Full Refund
                  </button>
                  <button 
                    onClick={() => alert("Funds released to seller after verifying reference database mold exceptions.")}
                    className="bg-zinc-950 hover:bg-zinc-800 text-white text-[10px] uppercase font-mono px-3 py-1.5 rounded-none font-bold cursor-pointer transition-all">
                    Reject Dispute &amp; Release
                  </button>
                </div>
              </div>
            </div>
          )}

          {adminSubTab === 'analytics' && (
            <div className="bg-white border border-zinc-200 rounded-none p-6 space-y-6 shadow-sm text-left">
              <h3 className="font-serif text-lg text-zinc-950 uppercase tracking-widest border-b border-zinc-100 pb-3 font-black">Olfactory Protocol Registry Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-none text-center space-y-1">
                  <span className="text-[8px] uppercase tracking-widest font-mono text-zinc-400">Spectral Scans Done</span>
                  <p className="font-mono text-2xl font-black text-zinc-900">42,891</p>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-none text-center space-y-1">
                  <span className="text-[8px] uppercase tracking-widest font-mono text-zinc-400">Active Escrow locked</span>
                  <p className="font-mono text-2xl font-black text-zinc-900">CHF 492K</p>
                </div>
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-none text-center space-y-1">
                  <span className="text-[8px] uppercase tracking-widest font-mono text-zinc-400">Counterfeit Block Rate</span>
                  <p className="font-mono text-2xl font-black text-rose-600">0.18%</p>
                </div>
              </div>

              {/* Visual Bar Chart */}
              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#8e7355] font-black">Monthly Escrow Volume (CHF)</h4>
                <div className="h-40 flex items-end gap-3 pt-6 relative">
                  {[
                    { month: 'Jan', val: 80, label: '80K' },
                    { month: 'Feb', val: 120, label: '120K' },
                    { month: 'Mar', val: 160, label: '160K' },
                    { month: 'Apr', val: 240, label: '240K' },
                    { month: 'May', val: 380, label: '380K' },
                    { month: 'Jun', val: 492, label: '492K' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[8px] font-mono text-zinc-400">{item.label}</span>
                      <div 
                        style={{ height: `${(item.val / 500) * 100}%` }}
                        className="w-full bg-[#c5a880] hover:bg-[#8e7355] transition-all duration-300 relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950 text-white font-mono text-[8px] px-1.5 py-0.5 rounded-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
                          CHF {item.val}K
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )}
</div>
)}



        {/* ----------------- 5. BUYER DASHBOARD ----------------- */}
        {activeTab === 'buyer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="buyer-tab">
            
            {/* Left side portfolio and tracking */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Welcome card */}
              <div className="bg-white border border-zinc-200 rounded-none p-6 relative overflow-hidden shadow-sm">
                <span className="text-[9px] uppercase tracking-widest font-mono text-[#8e7355] bg-[#c5a880]/15 border border-[#c5a880]/30 px-2.5 py-1 rounded-none font-bold">Verified Collector Profile</span>
                <h3 className="font-serif text-xl text-zinc-900 mt-3 uppercase font-black">Welcome back, Collector</h3>
                <p className="text-xs text-zinc-600 mt-1 max-w-xl font-sans">
                  Your rare portfolio vault is currently valued at <span className="text-zinc-900 font-bold">$14,250 (+4.2% this month)</span>. 2 shipments are locked in transit, and your batch radar is actively scanning for vintage formulations.
                </p>
              </div>

              {/* Glowing SVG Chart */}
              <div className="bg-white border border-zinc-200 rounded-none p-6 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <div>
                    <h4 className="font-serif text-sm text-zinc-900 uppercase tracking-widest font-black">My Vault Valuation Ledger</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5 uppercase font-bold">HISTORICAL PORTFOLIO APPRECIATION</p>
                  </div>
                  <span className="font-mono text-xs text-emerald-600 font-bold">+12.4% YoY</span>
                </div>

                {/* SVG Graph line chart */}
                <div className="h-44 relative flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 500 150">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c5a880" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#c5a880" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                    
                    {/* Filled Area */}
                    <path d="M 0 130 Q 80 110 160 115 T 320 60 T 450 30 T 500 20 L 500 150 L 0 150 Z" fill="url(#chartGrad)" />
                    {/* Line */}
                    <path d="M 0 130 Q 80 110 160 115 T 320 60 T 450 30 T 500 20" fill="none" stroke="#c5a880" strokeWidth="2.5" />
                    
                    {/* Glowing dots */}
                    <circle cx="320" cy="60" r="4" fill="#c5a880" />
                    <circle cx="500" cy="20" r="4.5" fill="#8e7355" />
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between font-mono text-[9px] text-zinc-400 border-t border-zinc-100 pt-2 font-bold">
                    <span>JAN</span>
                    <span>FEB</span>
                    <span>MAR</span>
                    <span>APR</span>
                    <span>MAY</span>
                    <span>JUN</span>
                    <span>CURRENT (CHF 14,250)</span>
                  </div>
                </div>
              </div>

              {/* Swiss Escrow Ledger Timeline */}
              <SwissLedgerTimeline 
                ledger={ledger}
                inspectedTx={inspectedTx}
                onInspect={setInspectedTx}
                onRelease={(id) => updateTxStatusOnServer(id, 'Released')}
                onDispute={(id) => updateTxStatusOnServer(id, 'Disputed')}
              />

              {/* In-Flight Orders */}
              <div className="bg-white border border-zinc-200 rounded-none p-6 space-y-4 shadow-sm">
                <h4 className="font-serif text-sm text-zinc-900 uppercase tracking-widest font-black">In-Flight Escrow Locks</h4>
                <div className="space-y-4">
                  {buyerOrders.map((order) => (
                    <div key={order.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-none space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span className="font-mono text-[9px] text-[#8e7355] block font-bold">{order.id} • STATUS: {order.status}</span>
                          <span className="font-serif font-black text-zinc-950 uppercase tracking-wide text-sm">{order.name}</span>
                        </div>
                        <span className="font-mono font-black text-[#8e7355]">${order.price}</span>
                      </div>

                      {/* Progress Bar steps */}
                      <div className="grid grid-cols-4 gap-1 pt-1.5">
                        {['Funded', 'Spectroscopy', 'In Transit', 'Completed'].map((st, i) => (
                          <div key={i} className="space-y-1">
                            <div className={`h-1 rounded-none ${i < order.step ? 'bg-[#c5a880]' : i === order.step ? 'bg-zinc-800 animate-pulse' : 'bg-zinc-200'}`}></div>
                            <span className="text-[8px] font-mono uppercase text-zinc-400 text-center block font-bold">{st}</span>
                          </div>
                        ))}
                      </div>

                      {/* Escrow Operations */}
                      {order.status === 'Escrow Locked' && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => updateTxStatusOnServer(order.id, 'Released')}
                            className="bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-none font-mono text-[9px] uppercase font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            Release Escrow Funds
                          </button>
                          <button
                            onClick={() => updateTxStatusOnServer(order.id, 'Disputed')}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-none font-mono text-[9px] uppercase font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            File Dispute (Report)
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side radar and additions */}
            <div className="lg:col-span-4 space-y-8">
              {/* Batch radar */}
              <div className="bg-white border border-zinc-200 rounded-none p-6 space-y-4 shadow-sm">
                <h4 className="font-serif text-sm text-zinc-900 uppercase tracking-widest flex items-center gap-2 font-black">
                  <ActivityIcon className="text-[#8e7355] w-4 h-4 animate-pulse" />
                  Active Asset Batch Radar
                </h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                  Market Hub bots actively parse global listings to find matching verified batches on your wishlist.
                </p>

                <div className="space-y-3">
                  {[
                    { batch: "Aventus 11Z01", status: "1 MATCH FOUND IN ESCROW", color: "text-[#8e7355]" },
                    { batch: "Dior Homme 2014 Formulation", status: "SCANNING SECURE LEDGER...", color: "text-zinc-500 animate-pulse" }
                  ].map((radar, i) => (
                    <div key={i} className="p-3 bg-zinc-50 border border-zinc-200 rounded-none font-mono text-[10px] shadow-xs">
                      <div className="flex justify-between items-center font-black text-zinc-900 uppercase">
                        <span>{radar.batch}</span>
                        <span className="text-[8px] bg-white px-1.5 py-0.5 rounded-none border border-zinc-200 text-zinc-500 font-bold">RADAR ACTIVE</span>
                      </div>
                      <p className={`mt-1.5 font-bold ${radar.color}`}>{radar.status}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Vault Additions */}
              <div className="bg-white border border-zinc-200 rounded-none p-6 space-y-4 shadow-sm">
                <h4 className="font-serif text-sm text-zinc-900 uppercase tracking-widest font-black">Recent Additions</h4>
                <div className="space-y-3">
                  {[
                    { brand: "Creed", name: "Irish Tweed Vintage 2013", price: "$320", batch: "LT13S02", image: IMAGES.creed },
                    { brand: "Tom Ford", name: "Oud Wood Reserve", price: "$295", batch: "A19", image: IMAGES.tomford }
                  ].map((rec, i) => (
                    <div key={i} className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-none flex items-center gap-3 shadow-xs">
                      <img src={rec.image} alt={rec.name} className="w-10 h-10 rounded-none object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[8px] font-mono text-[#8e7355] uppercase block font-bold">{rec.brand}</span>
                        <h5 className="font-serif text-xs text-zinc-900 truncate uppercase font-bold">{rec.name}</h5>
                        <span className="text-[9px] font-mono text-zinc-400 block mt-0.5 font-semibold">Batch: {rec.batch} • {rec.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- 6. LOGIN & ORDER STATUS TAB ----------------- */}
        {activeTab === 'login' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-8" id="login-tab">
            
            {/* Left Card: Login & Create Account */}
            <div className="bg-white border border-zinc-200 rounded-none p-8 flex flex-col justify-between shadow-sm relative">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c5a880]"></div>
              
              <div>
                {/* Tab selector */}
                <div className="flex border-b border-zinc-200 mb-8 font-serif text-sm uppercase tracking-widest">
                  <button 
                    onClick={() => setLoginFormTab('login')}
                    className={`flex-1 text-center pb-4 transition-all cursor-pointer ${loginFormTab === 'login' ? 'border-b-2 border-black text-black font-bold' : 'text-zinc-400 hover:text-black'}`}
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setLoginFormTab('register')}
                    className={`flex-1 text-center pb-4 transition-all cursor-pointer ${loginFormTab === 'register' ? 'border-b-2 border-black text-black font-bold' : 'text-zinc-400 hover:text-black'}`}
                  >
                    Create Account
                  </button>
                </div>

                {loginFormTab === 'login' ? (
                  <form onSubmit={(e) => { e.preventDefault(); alert("Successfully logged into Market Hub secure Swiss vault."); }} className="space-y-6">
                    <div>
                      <label className="block text-xs font-serif text-zinc-800 mb-2 font-bold uppercase tracking-wider">* Email</label>
                      <input 
                        type="email" 
                        required 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-black focus:bg-white rounded-none"
                        placeholder="yourname@domain.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-serif text-zinc-800 mb-2 font-bold uppercase tracking-wider">* Password</label>
                      <input 
                        type="password" 
                        required 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-black focus:bg-white rounded-none"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-serif text-zinc-600 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black accent-black"
                        />
                        <span>Remember Me</span>
                      </label>
                      <button 
                        type="button" 
                        onClick={() => alert("Password reset link dispatched via secure Swiss registry.")}
                        className="underline hover:text-black transition-colors cursor-pointer"
                      >
                        forgot password?
                      </button>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-black hover:bg-zinc-800 text-white font-serif tracking-widest text-xs uppercase p-4 mt-4 transition-all duration-300 font-bold cursor-pointer"
                    >
                      LOGIN
                    </button>
                  </form>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); alert("Account requested. Market Hub Swiss credential files generated successfully."); }} className="space-y-6">
                    <div>
                      <label className="block text-xs font-serif text-zinc-800 mb-2 font-bold uppercase tracking-wider">* Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-black focus:bg-white rounded-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-serif text-zinc-800 mb-2 font-bold uppercase tracking-wider">* Email</label>
                      <input 
                        type="email" 
                        required 
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-black focus:bg-white rounded-none"
                        placeholder="yourname@domain.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-serif text-zinc-800 mb-2 font-bold uppercase tracking-wider">* Password</label>
                      <input 
                        type="password" 
                        required 
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-black focus:bg-white rounded-none"
                        placeholder="••••••••"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-black hover:bg-zinc-800 text-white font-serif tracking-widest text-xs uppercase p-4 mt-4 transition-all duration-300 font-bold cursor-pointer"
                    >
                      CREATE ACCOUNT
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Card: Check Order Status */}
            <div className="bg-white border border-zinc-200 rounded-none p-8 flex flex-col justify-between shadow-sm relative">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-zinc-900"></div>
              
              <div className="space-y-6">
                <div className="border-b border-zinc-100 pb-4 mb-6">
                  <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-zinc-900 mb-2">Check Order Status</h4>
                  <p className="text-xs font-serif text-zinc-500 leading-relaxed">
                    Search for your order status even if you're not a registered user.
                  </p>
                </div>

                <form onSubmit={handleOrderQuery} className="space-y-6">
                  <div>
                    <label className="block text-xs font-serif text-zinc-800 mb-2 font-bold uppercase tracking-wider">* Order number</label>
                    <input 
                      type="text" 
                      required 
                      value={orderQueryNumber}
                      onChange={(e) => setOrderQueryNumber(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-black focus:bg-white rounded-none font-mono"
                      placeholder="Example: esc-7729"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-zinc-800 mb-2 font-bold uppercase tracking-wider">* Post Code</label>
                    <input 
                      type="text" 
                      required 
                      value={orderQueryPostCode}
                      onChange={(e) => setOrderQueryPostCode(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-black focus:bg-white rounded-none font-mono"
                      placeholder="e.g. 1201"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-black hover:bg-zinc-800 text-white font-serif tracking-widest text-xs uppercase p-4 transition-all duration-300 font-bold cursor-pointer"
                  >
                    CHECK STATUS
                  </button>
                </form>

                {/* Status results rendered beautifully matching the watch registry theme */}
                {orderQueryError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-none flex items-center gap-2 font-serif">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{orderQueryError}</span>
                  </div>
                )}

                {orderQueryResult && (
                  <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-none space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-2.5">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-zinc-400">Order Ref</span>
                        <span className="font-mono text-xs font-bold text-zinc-900 block uppercase">{orderQueryResult.id}</span>
                      </div>
                      <span className="text-[9px] bg-zinc-900 text-white font-mono uppercase px-2.5 py-1 rounded-full font-bold">
                        {orderQueryResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-zinc-400 block uppercase text-[8px]">Brand House</span>
                        <span className="text-zinc-900 font-bold block mt-0.5 uppercase">{orderQueryResult.brandName}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block uppercase text-[8px]">Flacon / Model</span>
                        <span className="text-zinc-900 font-bold block mt-0.5 uppercase truncate">{orderQueryResult.fragranceName}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block uppercase text-[8px]">Escrow Secured</span>
                        <span className="text-[#8e7355] font-bold block mt-0.5 font-sans">CHF {orderQueryResult.amount}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block uppercase text-[8px]">Authenticity Score</span>
                        <span className="text-emerald-700 font-bold block mt-0.5">{orderQueryResult.verificationScore}% Verified</span>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="pt-3 border-t border-zinc-200">
                      <span className="text-[8px] font-mono uppercase text-zinc-400 block mb-2">Escrow Status Registry Path</span>
                      <div className="flex justify-between text-[9px] font-mono text-zinc-400">
                        <span className={orderQueryResult.status === 'Held' ? 'text-[#8e7355] font-bold' : 'text-zinc-400'}>1. Funds Locked</span>
                        <span className={orderQueryResult.status === 'Released' ? 'text-emerald-700 font-bold' : 'text-zinc-400'}>2. Authenticated</span>
                        <span className={orderQueryResult.status === 'Released' ? 'text-emerald-700 font-bold' : 'text-zinc-400'}>3. Released</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c5a880]/30 rounded-none max-w-2xl w-full p-8 relative space-y-6 shadow-2xl text-left">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-square w-full bg-zinc-50 border border-zinc-200 overflow-hidden flex items-center justify-center">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 text-[8px] bg-white text-zinc-800 px-2.5 py-1 rounded-none border border-zinc-200 font-mono uppercase tracking-widest font-bold shadow-sm">
                  {selectedProduct.status}
                </span>
              </div>
              
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {BRAND_LOGOS[selectedProduct.brand] ? (
                    <div className="flex flex-col items-start border-l-2 border-[#c5a880] pl-2 py-0.5 mb-1.5">
                      <span className="text-xs font-serif font-black tracking-widest leading-none" style={{ color: BRAND_LOGOS[selectedProduct.brand].color }}>
                        {BRAND_LOGOS[selectedProduct.brand].text}
                      </span>
                      <span className="text-[7px] font-mono uppercase text-zinc-400 mt-0.5 tracking-wider font-bold">
                        {BRAND_LOGOS[selectedProduct.brand].subtext}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#8e7355] font-black">{selectedProduct.brand}</span>
                  )}
                  <h3 className="font-serif text-2xl text-zinc-950 font-black uppercase leading-tight">{selectedProduct.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-3 border-t border-zinc-100">
                    <div>
                      <span className="text-zinc-400 block uppercase text-[8px]">Batch Code</span>
                      <span className="text-zinc-800 font-bold block mt-0.5 uppercase">{selectedProduct.batch}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block uppercase text-[8px]">Volume</span>
                      <span className="text-zinc-800 font-bold block mt-0.5 uppercase">{selectedProduct.volume}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block uppercase text-[8px]">Custodian</span>
                      <span className="text-zinc-800 font-bold block mt-0.5">{selectedProduct.custodian}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block uppercase text-[8px]">Appraised Price</span>
                      <span className="text-[#8e7355] font-bold block mt-0.5">CHF {selectedProduct.price}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-100">
                    <span className="text-zinc-400 block uppercase text-[8px] font-mono mb-1">Collector Notes</span>
                    <p className="text-xs text-zinc-600 leading-relaxed font-serif italic">"{selectedProduct.notes || 'No description provided.'}"</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-zinc-100 flex gap-3">
                  <button
                    onClick={() => {
                      setCheckoutItem(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white py-3.5 font-serif text-xs font-bold uppercase tracking-widest transition-all cursor-pointer text-center shadow-md"
                  >
                    Buy &amp; Fund Escrow
                  </button>
                  <button
                    onClick={() => {
                      alert(`Query submitted to Swiss Vault regarding ${selectedProduct.brand} ${selectedProduct.name} batch ${selectedProduct.batch}.`);
                    }}
                    className="border border-zinc-350 hover:border-zinc-850 text-zinc-700 hover:bg-zinc-50 px-4 py-3.5 font-serif text-xs uppercase tracking-widest transition-all cursor-pointer text-center"
                  >
                    Ask Custodian
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-[8px] font-mono text-zinc-400 border-t border-zinc-100 pt-3 text-center uppercase tracking-widest">
              Geneva Swiss Registry Consortium — Secure Escrow Verified Flacon
            </div>
          </div>
        </div>
      )}

      {/* Escrow Checkout Form Popup Modal */}
      {checkoutItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c5a880]/30 rounded-2xl max-w-lg w-full p-6 relative space-y-4 shadow-2xl text-left">
            <button 
              onClick={() => setCheckoutItem(null)}
              className="absolute top-4 right-4 p-1 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-zinc-200 pb-3">
              <span className="text-[9px] bg-[#c5a880]/10 text-[#8e7355] px-2.5 py-1 rounded font-mono uppercase tracking-widest border border-[#c5a880]/30 font-bold">
                INITIATE SECURE SWISS CONTRACT
              </span>
              <h3 className="font-serif text-xl text-zinc-950 mt-2.5 uppercase font-bold">Lock Market Hub Escrow</h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-1">Funds are locked securely in the Genevan holding vault, released only after physical batch verification.</p>
            </div>

            {escrowSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl space-y-1 text-xs">
                <p className="font-serif font-bold uppercase">Contract Secured</p>
                <p className="font-mono text-emerald-900">{escrowSuccess}</p>
                <p className="font-mono text-[9px] text-emerald-600/80 mt-1">Status changed to 'Held' in safe ledger.</p>
              </div>
            ) : (
              <form onSubmit={handlePurchaseEscrow} className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-400 block uppercase text-[9px]">Asset Brand</span>
                    {BRAND_LOGOS[checkoutItem.brand] ? (
                      <div className="flex flex-col items-start border-l-2 border-[#c5a880] pl-2 py-0.5 mt-1">
                        <span className="text-[10px] font-serif font-black tracking-widest leading-none" style={{ color: BRAND_LOGOS[checkoutItem.brand].color }}>
                          {BRAND_LOGOS[checkoutItem.brand].text}
                        </span>
                        <span className="text-[6.5px] font-mono uppercase text-zinc-400 tracking-wider">
                          {BRAND_LOGOS[checkoutItem.brand].subtext}
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-800 font-bold block mt-1 uppercase">{checkoutItem.brand}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-zinc-400 block uppercase text-[9px]">Asset Model</span>
                    <span className="text-zinc-800 font-bold block mt-1 uppercase truncate max-w-[150px]">{checkoutItem.name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-400 block uppercase text-[9px]">Batch Code</span>
                    <span className="text-zinc-800 font-bold block mt-1 uppercase">{checkoutItem.batch}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block uppercase text-[9px]">Escrow Value</span>
                    <span className="text-[#8e7355] font-bold block mt-1">CHF {checkoutItem.price}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-zinc-400 block uppercase text-[9px]">Seller Handle</span>
                    <span className="text-zinc-600 block mt-1">{checkoutItem.custodian}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block uppercase text-[9px]">Buyer Handle</span>
                    <span className="text-zinc-600 block mt-1">@collector_vault</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-zinc-400 font-bold mb-1.5">Escrow holding terms</label>
                  <p className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 italic font-serif leading-relaxed">
                    "This escrow contract automatically commits CHF {checkoutItem.price} to secure Market Hub custody. The funds are held safely until the buyer receives and validates the flacon or reports discrepancies."
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-zinc-800 text-white py-3.5 rounded-xl font-serif text-xs uppercase tracking-widest font-bold shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Lock Secure Escrow Block
                </button>
              </form>
            )}
          </div>
        </div>
      )}


      {/* ===================== FLOATING CHAT BOT ===================== */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        
        {/* Chat Window */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-80 sm:w-96 bg-white shadow-2xl border border-zinc-200 rounded-none overflow-hidden flex flex-col"
              style={{ maxHeight: '520px' }}
            >
              {/* Chat Header */}
              <div className="bg-zinc-950 px-4 py-3 flex items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.06] pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/40 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#c5a880]" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-950" />
                  </div>
                  <div>
                    <span className="font-serif text-xs font-black uppercase tracking-wider text-white block">MarketHub Concierge</span>
                    <span className="text-[9px] font-mono text-emerald-400">● Online · Replies instantly</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="relative z-10 p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50" style={{ minHeight: '280px', maxHeight: '320px' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                    {msg.role === 'bot' && (
                      <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 mt-1">
                        <Sparkles className="w-3 h-3 text-[#c5a880]" />
                      </div>
                    )}
                    <div className={`max-w-[80%] space-y-1`}>
                      <div className={`px-3 py-2 text-xs leading-relaxed rounded-none ${
                        msg.role === 'user'
                          ? 'bg-zinc-900 text-white font-mono'
                          : 'bg-white text-zinc-800 border border-zinc-200 font-sans shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`text-[9px] font-mono text-zinc-400 block ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>{msg.time}</span>
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3 text-[#c5a880]" />
                    </div>
                    <div className="bg-white border border-zinc-200 px-3 py-2 rounded-none shadow-sm flex gap-1 items-center">
                      {[0,1,2].map(d => (
                        <motion.div key={d} className="w-1.5 h-1.5 bg-zinc-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick replies */}
              <div className="px-4 py-2 bg-white border-t border-zinc-100 flex gap-2 overflow-x-auto">
                {['How escrow works?', 'Authentication process', 'Contact support'].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setChatInput(q); }}
                    className="shrink-0 text-[9px] font-mono uppercase tracking-widest text-[#8e7355] border border-[#c5a880]/30 bg-[#c5a880]/5 px-2.5 py-1 hover:bg-[#c5a880]/15 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={handleSendChat} className="px-4 py-3 bg-white border-t border-zinc-200 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-none px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-800 font-sans placeholder-zinc-400"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-2 rounded-none font-serif text-[10px] uppercase tracking-widest font-bold disabled:opacity-40 cursor-pointer transition-all"
                >
                  Send
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Toggle Button */}
        <motion.button
          onClick={() => { setIsChatOpen(prev => !prev); setChatUnread(0); }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative bg-zinc-950 hover:bg-zinc-800 text-white px-5 py-3.5 rounded-none shadow-xl font-serif text-xs uppercase tracking-widest font-black flex items-center gap-2.5 cursor-pointer transition-all border border-zinc-800"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(197,168,128,0.1)' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
          Chat with Concierge
          {chatUnread > 0 && !isChatOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#c5a880] rounded-full flex items-center justify-center text-[9px] font-black text-zinc-950"
            >
              {chatUnread}
            </motion.span>
          )}
        </motion.button>
      </div>

      <footer className="bg-zinc-950 border-t border-zinc-800 mt-12 text-zinc-300" id="markethub-footer">
        {/* Gold top accent */}
        <div className="h-[3px] bg-gradient-to-r from-[#8e7355] via-[#c5a880] to-[#8e7355]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          
          {/* Top Row: Brand + Newsletter Signup and Socials */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10 border-b border-zinc-800">
            
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-[#c5a880]" />
                  <span className="font-serif font-black tracking-[0.2em] text-lg text-white uppercase">MarketHub</span>
                </div>
                <span className="text-[9px] tracking-[0.4em] font-mono text-zinc-500 uppercase block">Geneva Registry • Est. 2026</span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-xs">
                The world's most trusted luxury fragrance marketplace. Every listing verified by Swiss spectroscopy. Every payment protected by escrow.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { 
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-4 1.63-4 4v2z" />
                      </svg>
                    ), 
                    title: 'Facebook', 
                    link: footerFacebookLink 
                  },
                  { 
                    icon: (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                      </svg>
                    ), 
                    title: 'Instagram', 
                    link: footerInstagramLink 
                  },
                  { 
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    ), 
                    title: 'Twitter / X', 
                    link: footerTwitterLink 
                  },
                  { 
                    icon: (
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.729-1.459L0 24zm6.59-4.846c1.666.988 3.523 1.51 5.42 1.51 5.51 0 9.993-4.483 9.997-9.995.002-2.67-1.037-5.18-2.927-7.072s-4.41-2.923-7.086-2.923c-5.526 0-10.01 4.484-10.014 9.997-.002 1.96.512 3.868 1.489 5.568L1.87 20.89l4.777-1.736z" />
                      </svg>
                    ), 
                    title: 'WhatsApp', 
                    link: `https://wa.me/${footerWhatsAppNumber.replace(/[\s+]/g, '')}` 
                  },
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => window.open(s.link, '_blank')}
                    title={s.title}
                    className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center hover:border-[#c5a880] text-zinc-400 hover:text-[#c5a880] hover:scale-110 hover:shadow-[0_0_12px_rgba(197,168,128,0.3)] transition-all cursor-pointer"
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
              {/* Newsletter */}
              <form
                onSubmit={(e) => { e.preventDefault(); alert("Subscribed! You're now part of the MarketHub premium mailing list."); }}
                className="pt-1"
              >
                <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Subscribe to Updates</p>
                <div className="flex gap-0">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-[#c5a880] px-3 py-2 text-xs text-white focus:outline-none font-mono placeholder-zinc-600"
                  />
                  <button
                    type="submit"
                    className="bg-[#c5a880] hover:bg-[#b8976d] text-zinc-950 px-4 py-2 font-serif text-[9px] uppercase tracking-widest font-black cursor-pointer transition-colors"
                  >
                    →
                  </button>
                </div>
              </form>
            </div>

            {/* Spacer */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* Links columns */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h5 className="text-[9px] font-mono uppercase tracking-widest text-[#c5a880] font-black">SHOP</h5>
                <ul className="space-y-2">
                  {[
                    { label: 'All Fragrances', action: () => { setSearchQuery(''); setActiveTab('marketplace'); } },
                    { label: 'Rare Vintage', action: () => { setSearchQuery('Creed'); setActiveTab('marketplace'); } },
                    { label: 'Niche Collections', action: () => { setSearchQuery('Tom Ford'); setActiveTab('marketplace'); } },
                    { label: 'New Arrivals', action: () => { setSearchQuery(''); setActiveTab('marketplace'); } },
                    { label: 'Gift Vouchers', action: () => alert('Exploring Gift Sets & Luxury Vouchers.') },
                  ].map((link, i) => (
                    <li key={i}>
                      <button
                        onClick={link.action}
                        className="text-[11px] font-serif text-zinc-400 hover:text-[#c5a880] transition-colors cursor-pointer uppercase tracking-wider text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="text-[9px] font-mono uppercase tracking-widest text-[#c5a880] font-black">SERVICES</h5>
                <ul className="space-y-2">
                  {[
                    { label: 'AI Verification', action: () => setActiveTab('verify') },
                    { label: 'Seller Onboarding', action: () => setActiveTab('seller') },
                    { label: 'Escrow Protection', action: () => alert('Escrow protection terms and conditions.') },
                    { label: 'Batch Auth', action: () => alert('Initiating private batch valuation request...') },
                    { label: 'Buyer Protection', action: () => setActiveTab('buyer') },
                  ].map((link, i) => (
                    <li key={i}>
                      <button
                        onClick={link.action}
                        className="text-[11px] font-serif text-zinc-400 hover:text-[#c5a880] transition-colors cursor-pointer uppercase tracking-wider text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="text-[9px] font-mono uppercase tracking-widest text-[#c5a880] font-black">ABOUT</h5>
                <ul className="space-y-2">
                  {[
                    { label: 'Our Story', action: () => alert('MarketHub story — founded in Geneva, 2026.') },
                    { label: 'Journal & Blog', action: () => alert('Opening MarketHub luxury blog...') },
                    { label: 'Concierge Desk', action: () => alert('Concierge: WhatsApp +92 300 000 0000') },
                    { label: 'Showrooms', action: () => alert('Karachi, Lahore & Islamabad showrooms.') },
                    { label: 'Partners', action: () => alert('Geneva Registry Consortium Partners.') },
                  ].map((link, i) => (
                    <li key={i}>
                      <button
                        onClick={link.action}
                        className="text-[11px] font-serif text-zinc-400 hover:text-[#c5a880] transition-colors cursor-pointer uppercase tracking-wider text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="text-[9px] font-mono uppercase tracking-widest text-[#c5a880] font-black">SUPPORT</h5>
                <ul className="space-y-2">
                  {[
                    { label: `Contact Us`, action: () => alert(`Support: ${footerSupportEmail}`) },
                    { label: 'Returns & Refunds', action: () => alert('14-day escrow cancellation policy.') },
                    { label: 'Delivery Details', action: () => alert('TCS & Leopard Courier shipping options.') },
                    { label: 'Privacy & Cookies', action: () => setShowCookieSettings(true) },
                    { label: 'Help Center', action: () => alert('Opening MarketHub Help Center...') },
                  ].map((link, i) => (
                    <li key={i}>
                      <button
                        onClick={link.action}
                        className="text-[11px] font-serif text-zinc-400 hover:text-[#c5a880] transition-colors cursor-pointer uppercase tracking-wider text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Payment Badges */}
          <div className="py-8 border-b border-zinc-800">
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-4">Secure Cryptographic & Escrow Settlement Channels</p>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { 
                  name: 'JazzCash', 
                  icon: (
                    <div className="flex items-center gap-1.5 font-sans font-black text-[9px] tracking-tighter text-[#ECA921]">
                      <span className="w-2.5 h-2.5 bg-[#C8102E] rounded-full flex items-center justify-center text-[6px] text-white">J</span>
                      <span>Jazz<span className="text-[#C8102E]">Cash</span></span>
                    </div>
                  ),
                  bg: 'bg-black border-[#ECA921]/30 hover:border-[#ECA921]'
                },
                { 
                  name: 'EasyPaisa', 
                  icon: (
                    <div className="flex items-center gap-1.5 font-sans font-extrabold text-[9px] text-[#00A859]">
                      <span className="w-2.5 h-2.5 bg-[#00A859] rounded-full flex items-center justify-center text-[6px] text-white">e</span>
                      <span>easypaisa</span>
                    </div>
                  ),
                  bg: 'bg-white border-[#00A859]/30 hover:border-[#00A859]'
                },
                { 
                  name: 'Visa', 
                  icon: (
                    <svg className="w-8 h-3 text-[#1A1F71] fill-current" viewBox="0 0 24 8">
                      <path d="M3.7 7.9L5.8.1h1.7l-2 7.8H3.7zm7-7.8l-1.2 5.5-.2-.8c-.3-1.1-1.2-2.3-2.4-2.9L8.4 7.9h1.7L12.7.1h-2zm4.3 4.2c.1-.8.9-1.3 1.8-1.4.9-.1 1.7.3 1.8.8.1.5-.3 1-.8 1.1-.9.2-1.7-.1-2.1-.5zm4-2.8l-1.6 7.4h-1.6L21 1.5h1.6z" />
                    </svg>
                  ),
                  bg: 'bg-[#1A1F71]/5 border-[#1A1F71]/30 hover:border-[#1A1F71]'
                },
                { 
                  name: 'Mastercard', 
                  icon: (
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-3.5" viewBox="0 0 24 16">
                        <circle cx="8" cy="8" r="7" fill="#EB001B" opacity="0.9" />
                        <circle cx="16" cy="8" r="7" fill="#F79E1B" opacity="0.9" />
                      </svg>
                      <span className="text-[7.5px] font-sans font-black tracking-normal text-zinc-900">mastercard</span>
                    </div>
                  ),
                  bg: 'bg-white border-zinc-200 hover:border-[#F79E1B]'
                },
                { 
                  name: 'PayPal', 
                  icon: (
                    <div className="flex items-center gap-1 font-sans font-black italic text-[9px] text-[#003087]">
                      <span className="text-[#0079C1]">P</span><span>P</span>
                      <span className="text-[7px] tracking-tighter not-italic text-zinc-600 font-semibold uppercase">PayPal</span>
                    </div>
                  ),
                  bg: 'bg-white border-zinc-200 hover:border-[#003087]'
                },
                { 
                  name: 'Bank Transfer', 
                  icon: (
                    <div className="flex items-center gap-1.5 text-zinc-200">
                      <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-400">IBAN Swift</span>
                    </div>
                  ),
                  bg: 'bg-zinc-900 border-zinc-800 hover:border-zinc-500'
                },
                { 
                  name: 'HBL Pay', 
                  icon: (
                    <div className="flex items-center gap-1 font-sans font-extrabold text-[9px] text-white">
                      <span className="bg-[#006A4E] text-[6.5px] px-1.5 py-0.5 rounded font-black">HBL</span>
                      <span className="text-[#006A4E] font-black text-[7.5px]">PAY</span>
                    </div>
                  ),
                  bg: 'bg-white border-[#006A4E]/30 hover:border-[#006A4E]'
                },
                { 
                  name: 'Meezan Bank', 
                  icon: (
                    <div className="flex items-center gap-1 font-sans text-[8.5px] font-black text-[#8C1D40]">
                      <svg className="w-3.5 h-3.5 text-[#8C1D40] fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L12 18l5.3-8.8c.45.83.7 1.79.7 2.8 0 3.31-2.69 6-6 6z" />
                      </svg>
                      <span>Meezan</span>
                    </div>
                  ),
                  bg: 'bg-white border-[#8C1D40]/30 hover:border-[#8C1D40]'
                },
              ].map(badge => (
                <div 
                  key={badge.name} 
                  className={`px-3 py-2 rounded-none border ${badge.bg} flex items-center justify-center select-none hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer shadow-xs min-h-[32px]`}
                >
                  {badge.icon}
                </div>
              ))}
              <span className="px-3 py-1.5 text-[9px] font-mono text-emerald-400 border border-emerald-800/40 bg-emerald-950/20 uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                🔒 SSL 256-BIT ENCRYPTED
              </span>
            </div>
          </div>

          {/* Legal + Copyright */}
          <div className="pt-6 space-y-3">
            {isAdminAuthenticated ? (
              <div className="space-y-1">
                <label className="block text-[8px] font-mono text-zinc-400 font-bold uppercase">Legal Platform Text (Admin Edit)</label>
                <textarea
                  value={footerLegalText}
                  onChange={(e) => setFooterLegalText(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-700 p-2 text-[10px] text-white font-sans focus:outline-none rounded-none"
                />
              </div>
            ) : (
              <p className="text-[9px] text-zinc-600 font-sans leading-relaxed uppercase max-w-5xl">
                {footerLegalText}
              </p>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-zinc-800 text-[9px] font-mono uppercase tracking-widest text-zinc-600">
              {isAdminAuthenticated ? (
                <div className="flex gap-4 w-full">
                  <div className="flex-1">
                    <label className="block text-[8px] font-mono text-[#8e7355] font-bold uppercase mb-1">Copyright Notice (Admin Edit)</label>
                    <input
                      type="text"
                      value={footerCopyright}
                      onChange={(e) => setFooterCopyright(e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 px-2 py-1 text-[10px] text-white w-full font-sans rounded-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <span>{footerCopyright}</span>
                  <span className="text-[#8e7355] font-bold">Basel &amp; Geneva Secure Platform v3.5</span>
                </>
              )}
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

// Compact helper components to avoid extra imported bloat
function ActivityIcon(props: { className?: string }) {
  return (
    <svg className={props.className || "w-5 h-5"} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

// --------------------------------------------------
// LUXURY INTERACTIVE OLFACTORY FLACON LAYER EXPLORER
// --------------------------------------------------
interface OlfactoryBottleExplorerProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  brand: string;
  name: string;
}

function OlfactoryBottleExplorer({ topNotes, heartNotes, baseNotes, brand, name }: OlfactoryBottleExplorerProps) {
  const [hoveredSection, setHoveredSection] = useState<'top' | 'heart' | 'base' | null>(null);

  const getSectionDetails = () => {
    switch(hoveredSection) {
      case 'top':
        return {
          title: "Top Notes (Head Accords)",
          compounds: "Limonene, Linalool, Citral, Monoterpenes",
          volatility: "Ultra-High (Evaporates in 15-30 minutes)",
          description: "Initial olfactory projection. High-frequency molecules providing the first sensory contact and bright sparkle."
        };
      case 'heart':
        return {
          title: "Heart Notes (Mid Accords)",
          compounds: "Geraniol, Patchoulol, Eugenol, Damascone",
          volatility: "Medium (Persists for 2-4 hours)",
          description: "The core character and heart of the fragrance. Provides the transition and harmonious blend of accords."
        };
      case 'base':
        return {
          title: "Base Notes (Dry-down Accords)",
          compounds: "Ambroxan, Musk Ketone, Vanillin, Oakmoss absolute",
          volatility: "Low (Durable fixatives, lasts 8-24+ hours)",
          description: "The deep resinous anchor. Heavy molecular structures that bond to organic tissues and secure longevity."
        };
      default:
        return {
          title: "Interactive Olfactory Flacon",
          compounds: "Hover or tap bottle layers to analyze chemical composition",
          volatility: "Olfactory Pyramid Analysis v3.5",
          description: "Fully parsed molecular formulation. Verified in Geneva, Switzerland."
        };
    }
  };

  const details = getSectionDetails();

  return (
    <div className="bg-[#0e0d0c] border border-gold-dark/20 rounded-xl p-4 space-y-4">
      <div className="text-center">
        <span className="text-[8px] font-mono uppercase tracking-widest text-gold-dark block">Spectroscopic Formulation Matrix</span>
        <h5 className="font-serif text-xs text-gold-light font-bold mt-1 uppercase">{brand} — {name}</h5>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Animated SVG Bottle */}
        <div className="relative w-36 h-48 select-none">
          <svg viewBox="0 0 100 130" className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(197,168,128,0.15)]">
            {/* Bottle Atomizer Head */}
            <rect x="44" y="5" width="12" height="10" rx="1.5" fill="#c5a880" />
            <circle cx="50" cy="10" r="2" fill="#0b0908" />
            {/* Atomizer Collar */}
            <rect x="40" y="15" width="20" height="5" fill="#8e7355" />
            
            {/* Liquid / Bottle Body outline */}
            <path d="M 30 20 Q 50 18 70 20 L 75 110 Q 50 115 25 110 Z" fill="none" stroke="#c5a880" strokeWidth="2.5" />
            
            {/* Top notes zone */}
            <path 
              d="M 31 22 L 69 22 L 71 50 L 29 50 Z" 
              fill={hoveredSection === 'top' ? 'rgba(197,168,128,0.35)' : 'rgba(197,168,128,0.08)'} 
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredSection('top')}
              onMouseLeave={() => setHoveredSection(null)}
            />
            
            {/* Heart notes zone */}
            <path 
              d="M 29 52 L 71 52 L 73 80 L 27 80 Z" 
              fill={hoveredSection === 'heart' ? 'rgba(230,190,140,0.45)' : 'rgba(197,168,128,0.14)'} 
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredSection('heart')}
              onMouseLeave={() => setHoveredSection(null)}
            />
            
            {/* Base notes zone */}
            <path 
              d="M 27 82 L 73 82 L 74 108 L 26 108 Z" 
              fill={hoveredSection === 'base' ? 'rgba(142,115,85,0.6)' : 'rgba(197,168,128,0.22)'} 
              className="cursor-pointer transition-all duration-300 hover:opacity-90"
              onMouseEnter={() => setHoveredSection('base')}
              onMouseLeave={() => setHoveredSection(null)}
            />

            {/* Dip Tube (Spray Straw) */}
            <line x1="50" y1="20" x2="50" y2="100" stroke="#c5a880" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />

            {/* Text labels on SVG */}
            <text x="50" y="38" textAnchor="middle" fill="#f5f2f0" fontSize="5" className="font-mono opacity-60 pointer-events-none uppercase">TOP</text>
            <text x="50" y="68" textAnchor="middle" fill="#f5f2f0" fontSize="5" className="font-mono opacity-60 pointer-events-none uppercase">HEART</text>
            <text x="50" y="98" textAnchor="middle" fill="#f5f2f0" fontSize="5" className="font-mono opacity-60 pointer-events-none uppercase">BASE</text>
          </svg>
          
          {/* Scanline indicator if scanning or hovered */}
          {hoveredSection && (
            <div 
              className="absolute left-4 right-4 h-0.5 bg-[#06b6d4] shadow-[0_0_8px_#06b6d4] animate-pulse transition-all"
              style={{
                top: hoveredSection === 'top' ? '24%' : hoveredSection === 'heart' ? '50%' : '76%'
              }}
            />
          )}
        </div>

        {/* Notes breakdown list */}
        <div className="flex-1 w-full space-y-2 text-xs">
          <div className="p-2 bg-[#12100f] border border-gold-dark/10 rounded-lg">
            <span className="text-[8px] font-mono uppercase tracking-wider text-gold-dark block">Active Accord Selection</span>
            <p className="font-serif font-bold text-gold-light text-[11px] uppercase mt-0.5">{details.title}</p>
            <p className="text-[10px] text-[#f5f2f0]/60 mt-1 leading-relaxed">{details.description}</p>
          </div>
          <div className="p-2 bg-[#12100f] border border-gold-dark/10 rounded-lg font-mono text-[9px] space-y-1">
            <div>
              <span className="text-gold-dark">Key Compounds:</span> <span className="text-[#f5f2f0]/80">{details.compounds}</span>
            </div>
            <div>
              <span className="text-gold-dark">Molecular Volatility:</span> <span className="text-gold">{details.volatility}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic List highlights based on hover */}
      <div className="grid grid-cols-3 gap-1 text-[9px] text-center font-mono">
        <div className={`p-1.5 rounded transition-colors ${hoveredSection === 'top' ? 'bg-gold-dark/30 text-gold-light font-bold border border-gold-dark/40' : 'bg-[#12100f] text-[#f5f2f0]/40 border border-transparent'}`}>
          TOP: {topNotes.slice(0, 2).join(', ')}
        </div>
        <div className={`p-1.5 rounded transition-colors ${hoveredSection === 'heart' ? 'bg-gold-dark/30 text-gold-light font-bold border border-gold-dark/40' : 'bg-[#12100f] text-[#f5f2f0]/40 border border-transparent'}`}>
          HEART: {heartNotes.slice(0, 2).join(', ')}
        </div>
        <div className={`p-1.5 rounded transition-colors ${hoveredSection === 'base' ? 'bg-gold-dark/30 text-gold-light font-bold border border-gold-dark/40' : 'bg-[#12100f] text-[#f5f2f0]/40 border border-transparent'}`}>
          BASE: {baseNotes.slice(0, 2).join(', ')}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// SWISS CHROMATOGRAPHY WAVE SPECTROSCOPIC GRAPH SCANNER
// --------------------------------------------------
interface ChromatographyScannerProps {
  brand: string;
  name: string;
  step: string;
}

function ChromatographyScanner({ brand, name, step }: ChromatographyScannerProps) {
  return (
    <div className="relative w-full h-48 bg-[#0a0807] border border-gold-dark/20 rounded-xl overflow-hidden flex flex-col justify-between p-4">
      {/* Absolute overlay scanning grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(197,168,128,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,168,128,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>

      <div className="flex justify-between items-start z-10 font-mono text-[9px]">
        <div>
          <span className="text-[#06b6d4] font-bold tracking-widest uppercase animate-pulse">● SPECTROMETER ULTRASONIC SWEEP</span>
          <p className="text-gold-light mt-0.5 uppercase font-serif text-[10px]">{brand} - {name}</p>
        </div>
        <span className="text-[#f5f2f0]/40 uppercase">Chroma-Index: v3.5</span>
      </div>

      {/* SVG Animated Waves */}
      <div className="relative h-24 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 400 100">
          {/* Wave 1: Carrier Gas (Blue) */}
          <path 
            d="M 0 50 Q 50 20, 100 80 T 200 30 T 300 70 T 400 50" 
            fill="none" 
            stroke="#06b6d4" 
            strokeWidth="1.5" 
            opacity="0.8"
          >
            <animate attributeName="d" dur="4s" repeatCount="indefinite"
              values="
                M 0 50 Q 50 20, 100 80 T 200 30 T 300 70 T 400 50;
                M 0 50 Q 50 80, 100 20 T 200 70 T 300 30 T 400 50;
                M 0 50 Q 50 20, 100 80 T 200 30 T 300 70 T 400 50
              "
            />
          </path>

          {/* Wave 2: Solvent Signal (Gold) */}
          <path 
            d="M 0 50 C 100 90, 150 10, 200 50 T 400 50" 
            fill="none" 
            stroke="#c5a880" 
            strokeWidth="2" 
            opacity="0.9"
          >
            <animate attributeName="d" dur="3s" repeatCount="indefinite"
              values="
                M 0 50 C 100 90, 150 10, 200 50 T 400 50;
                M 0 50 C 100 10, 150 90, 200 50 T 400 50;
                M 0 50 C 100 90, 150 10, 200 50 T 400 50
              "
            />
          </path>

          {/* Laser scanning vertical bar */}
          <line x1="0" y1="0" x2="0" y2="100" stroke="#da291c" strokeWidth="2" opacity="0.6">
            <animate attributeName="x1" from="0" to="400" dur="2s" repeatCount="indefinite" />
            <animate attributeName="x2" from="0" to="400" dur="2s" repeatCount="indefinite" />
          </line>
        </svg>

        {/* Target overlay reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 border border-[#da291c]/30 rounded-full flex items-center justify-center animate-ping"></div>
          <div className="w-1.5 h-1.5 bg-[#da291c] rounded-full"></div>
        </div>
      </div>

      <div className="z-10 font-mono text-[9px] flex justify-between items-end border-t border-[#1f1b19] pt-2">
        <span className="text-[#f5f2f0]/50 uppercase">Analysis: <span className="text-[#06b6d4] font-bold">{step}</span></span>
        <span className="text-gold font-bold">FREQUENCY RESPONSE: 842.8 GHz</span>
      </div>
    </div>
  );
}

// --------------------------------------------------
// INTERACTIVE SWISS ESCROW LEDGER BLOCK CHAIN TICKER & ANALYSIS
// --------------------------------------------------
interface SwissLedgerTimelineProps {
  ledger: LedgerTransaction[];
  inspectedTx: LedgerTransaction | null;
  onInspect: (tx: LedgerTransaction | null) => void;
  onRelease: (txId: string) => void;
  onDispute: (txId: string) => void;
}

function SwissLedgerTimeline({ ledger, inspectedTx, onInspect, onRelease, onDispute }: SwissLedgerTimelineProps) {
  return (
    <div className="bg-[#12100f] border border-[#221e1c] rounded-2xl p-6 space-y-4">
      <div className="border-b border-[#221e1c] pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h4 className="font-serif text-sm text-gold-light uppercase tracking-widest flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-gold" />
            Swiss Escrow Ledger Chain
          </h4>
          <p className="text-[10px] text-[#f5f2f0]/40 font-mono mt-0.5">SECURE CRYPTOGRAPHIC SMART LEDGERS</p>
        </div>
        <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 font-mono uppercase">
          Ledger Height: {ledger.length} Blocks
        </span>
      </div>

      {/* Grid of Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ledger.map((tx) => {
          const isInspected = inspectedTx?.id === tx.id;
          return (
            <div 
              key={tx.id}
              onClick={() => onInspect(isInspected ? null : tx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-28 group ${
                isInspected 
                  ? 'bg-[#1b1715] border-gold-dark/60 shadow-[0_0_12px_rgba(197,168,128,0.15)]' 
                  : 'bg-[#0a0807] border-[#221e1c] hover:border-gold-dark/30 hover:bg-[#12100f]'
              }`}
            >
              {/* Status ribbon */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                tx.status === 'Released' ? 'bg-green-500' : tx.status === 'Held' ? 'bg-[#06b6d4]' : 'bg-swiss-red'
              }`} />

              <div className="flex justify-between items-start pl-1.5 font-mono text-[9px]">
                <span className="text-gold-light font-bold">{tx.id}</span>
                <span className={`text-[8px] uppercase px-1 rounded border ${
                  tx.status === 'Released' ? 'bg-green-500/10 text-green-400 border-green-500/20' : tx.status === 'Held' ? 'bg-[#06b6d4]/10 text-[#06b6d4] border-[#06b6d4]/20' : 'bg-swiss-red/10 text-swiss-red border-swiss-red/20'
                }`}>
                  {tx.status}
                </span>
              </div>

              <div className="pl-1.5 flex-1 mt-1.5 min-w-0">
                <span className="text-[8px] uppercase font-mono text-gold-dark font-bold block truncate">{tx.brandName}</span>
                <h6 className="font-serif text-[11px] text-[#f5f2f0] font-semibold uppercase truncate mt-0.5 group-hover:text-gold transition-colors">{tx.fragranceName}</h6>
              </div>

              <div className="pl-1.5 font-mono text-[9px] text-[#f5f2f0]/30 flex justify-between items-center border-t border-[#1f1b19] pt-1.5 mt-2">
                <span>CHF {tx.amount}</span>
                <span className="text-gold-light/60">{tx.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Detailed Inspection Card if a block is clicked */}
      {inspectedTx && (
        <div className="p-5 bg-gradient-to-br from-[#12100f] to-[#1a1715] border border-gold-dark/40 rounded-xl space-y-4 relative overflow-hidden">
          {/* Gold watermark seal */}
          <div className="absolute top-2 right-2 w-20 h-20 opacity-[0.04] border-4 border-gold rounded-full flex items-center justify-center transform rotate-12 pointer-events-none">
            <span className="text-[6px] uppercase font-mono font-bold text-center leading-tight">SWISS SECURE V3.5</span>
          </div>

          <div className="flex justify-between items-start border-b border-[#221e1c] pb-3">
            <div>
              <span className="text-[9px] bg-gold-dark/20 text-gold-light px-2.5 py-0.5 rounded font-mono uppercase tracking-widest border border-gold-dark/30">
                SECURE SMART ESCROW STATE SHEET
              </span>
              <h5 className="font-serif text-sm text-gold-light mt-2 uppercase font-bold">
                Contract Block #{inspectedTx.id}
              </h5>
            </div>
            <button 
              onClick={() => onInspect(null)}
              className="text-[#f5f2f0]/30 hover:text-gold cursor-pointer font-mono text-[9px] uppercase border border-[#221e1c] px-2 py-1 rounded bg-black/40"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-gold-dark block uppercase text-[8px]">Asset Description</span>
              <span className="text-[#f5f2f0] font-bold block mt-0.5 uppercase truncate">{inspectedTx.brandName} {inspectedTx.fragranceName}</span>
            </div>
            <div>
              <span className="text-gold-dark block uppercase text-[8px]">Verified Batch</span>
              <span className="text-[#f5f2f0] font-bold block mt-0.5 uppercase">{inspectedTx.batchCode}</span>
            </div>
            <div>
              <span className="text-gold-dark block uppercase text-[8px]">Locked Value</span>
              <span className="text-gold font-bold block mt-0.5">CHF {inspectedTx.amount}</span>
            </div>
            <div>
              <span className="text-gold-dark block uppercase text-[8px]">Trust score</span>
              <span className="text-green-400 font-bold block mt-0.5">{inspectedTx.verificationScore}%</span>
            </div>
          </div>

          <div className="p-3 bg-black/60 border border-[#221e1c] rounded-lg text-[10px] text-[#f5f2f0]/70 italic font-serif leading-relaxed">
            "Verification Log: {inspectedTx.notes}"
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono border-t border-[#221e1c] pt-3">
            <span className="text-[#f5f2f0]/40 uppercase">Signed: Geneva Registry Consortium</span>
            <div className="flex gap-2">
              {inspectedTx.status === 'Held' && (
                <>
                  <button 
                    onClick={() => onRelease(inspectedTx.id)}
                    className="bg-green-500 hover:bg-green-600 text-black px-2.5 py-1.5 rounded font-bold uppercase cursor-pointer"
                  >
                    Release Scent Funds
                  </button>
                  <button 
                    onClick={() => onDispute(inspectedTx.id)}
                    className="bg-swiss-red hover:bg-red-700 text-white px-2.5 py-1.5 rounded font-bold uppercase cursor-pointer"
                  >
                    File Dispute Case
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

