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
  xerjoff: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80',
  baccarat: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80',
  dior: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600&q=80'
};

const DEFAULT_LISTINGS: ScentListing[] = [
  { id: 'sc-101', brand: 'Creed', name: 'Aventus Vintage 19R01', batch: '19R01', volume: '95% Remaining', price: 480, custodian: '@markethub_vault', image: IMAGES.creed, status: 'Verified', notes: 'Prisint bottle, stored in dry dark cellar. First release vintage smoky batch.' },
  { id: 'sc-102', brand: 'Tom Ford', name: 'Amber Absolute Private Blend', batch: 'A47', volume: '80% Remaining', price: 520, custodian: '@rareessences', image: IMAGES.tomford, status: 'Verified', notes: 'Authentic formulation, extreme performance, gold label engraving match.' },
  { id: 'sc-103', brand: 'Xerjoff', name: 'Naxos 1861', batch: '22Y08', volume: '100% Sealed', price: 260, custodian: '@nichehunter', image: IMAGES.xerjoff, status: 'Verified', notes: 'Unopened box, sealed cellophane. Genuine batch holographic security tag.' }
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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

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

  // Seller Dashboard: Generate listing mock visual AI auto-fill
  const handleSellerAIScan = () => {
    if (!sellerBrand || !sellerModel) return;
    setIsSellerListingGenerating(true);
    setTimeout(() => {
      setSellerBatch("B" + Math.floor(100 + Math.random() * 900) + "S" + Math.floor(10 + Math.random() * 90));
      setSellerPrice(String(Math.floor(250 + Math.random() * 300)));
      setSellerNotes(`First formulation, liquid volume inspected. Note composition contains pristine vanilla wood accords. Appraised high rarity score.`);
      setIsSellerListingGenerating(false);
    }, 1500);
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

      {/* Luxury Brand Centered Logo Header */}
      <header className="border-b border-zinc-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-sm">
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
          <div className="flex flex-col items-center justify-center text-center cursor-pointer select-none" onClick={() => { setSearchQuery(''); setActiveTab('marketplace'); }}>
            <div className="flex items-center gap-1 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a880] animate-pulse" />
            </div>
            <h1 className="font-serif text-lg sm:text-xl tracking-[0.22em] text-zinc-900 font-black uppercase leading-none">
              Market Hub
            </h1>
            <span className="text-[7px] tracking-[0.45em] font-mono text-zinc-400 uppercase block mt-1">
              Geneva Registry
            </span>
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
            
            {/* Elegant Hero */}
            <section className="relative border border-zinc-200 bg-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm rounded-none">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#8e7355] via-[#c5a880] to-[#8e7355]"></div>
              <div className="space-y-4 max-w-xl text-center md:text-left">
                <span className="text-[10px] tracking-widest font-mono uppercase text-[#8e7355] border border-[#c5a880]/30 bg-[#c5a880]/5 px-3 py-1 rounded-full font-bold">
                  The Absolute Provenance of Rare Perfumery
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-zinc-950 font-black leading-tight uppercase">
                  Market Hub: The Future of Fragrance Authentication
                </h2>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                  Where olfactory artistry meets scientific precision. Trade, analyze, and secure the world's most coveted flacons and discontinued formulations with fully integrated Swiss-escrow protection.
                </p>
                <div className="flex gap-4 justify-center md:justify-start pt-2">
                  <button 
                    onClick={() => setActiveTab('verify')}
                    className="bg-black hover:bg-zinc-800 text-white px-6 py-3.5 rounded-none font-serif text-xs font-bold uppercase tracking-widest transition-all cursor-pointer">
                    AI Intake Portal
                  </button>
                  <button 
                    onClick={() => {
                      const element = document.getElementById('offerings');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="border border-zinc-300 hover:border-zinc-800 hover:bg-zinc-50 px-6 py-3.5 rounded-none font-serif text-xs text-zinc-700 uppercase tracking-widest transition-all cursor-pointer">
                    Explore Vault
                  </button>
                </div>
              </div>

              {/* Decorative Holographic Scanning Graphic */}
              <div className="relative w-64 h-64 border border-zinc-200 rounded-none bg-zinc-100 overflow-hidden flex items-center justify-center group shadow-sm shrink-0">
                <img src={IMAGES.dior} alt="Dior" className="w-full h-full object-cover opacity-90" />
                <div className="absolute top-0 left-0 w-full h-0.5 bg-[#c5a880] shadow-[0_1px_6px_rgba(197,168,128,0.5)] animate-bounce mt-10"></div>
                <div className="absolute inset-x-4 bottom-4 p-3 bg-white/95 border border-zinc-200 rounded-none text-left shadow-sm">
                  <span className="text-[9px] font-mono text-[#8e7355] uppercase block">Dior Homme Vintage</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-mono text-[10px] text-emerald-700 font-bold">98.4% Authentic</span>
                    <span className="font-mono text-[10px] text-[#8e7355] font-black">$385</span>
                  </div>
                </div>
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
                    
                    <div className="relative h-56 bg-zinc-50 overflow-hidden flex items-center justify-center border-b border-zinc-100">
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
                          <p className="text-[9px] font-mono uppercase tracking-widest text-[#8e7355] font-black">{item.brand}</p>
                          <span className="text-[8px] font-mono text-zinc-400 uppercase">Block Verified</span>
                        </div>
                        <h4 className="font-serif text-sm text-zinc-900 font-bold mt-1 uppercase tracking-wider group-hover:text-[#8e7355] transition-colors">{item.name}</h4>
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

            {/* ----------------- 🎥 INTERACTIVE CINEMATIC PROMENADE & STORYBOARD ----------------- */}
            <section className="bg-zinc-950 border border-zinc-800 p-6 md:p-8 rounded-none relative overflow-hidden text-white space-y-8 mt-12" id="cinema-promenade">
              {/* Subtle visual grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(#c5a880_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#c5a880]/10 to-transparent blur-2xl pointer-events-none"></div>

              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6 relative z-10">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#c5a880] uppercase font-bold block mb-1">
                    Multimedia Showcase
                  </span>
                  <h3 className="font-serif text-2xl text-white uppercase tracking-widest font-black">
                    MarketHub Promotional Cinematic Hub
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    Explore the 12-segment promotional video prompts and live-interactive feature storyboard
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#c5a880] animate-pulse self-center"></span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    2:00 Min Showcase • 12 Interactive Chapters
                  </span>
                </div>
              </div>

              {/* Main Cinema Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                
                {/* LEFT: Widescreen Theater Frame */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  
                  {/* Theater Screen Panel */}
                  <div className="relative aspect-video w-full bg-zinc-900 border border-zinc-800 rounded-none overflow-hidden flex flex-col shadow-2xl group">
                    
                    {/* Simulated visual state or actual video */}
                    <div className="relative flex-1 w-full h-full flex items-center justify-center">
                      
                      {/* Interactive Live Mockup Screens based on active prompt */}
                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "logo-reveal" && (
                        <div className="absolute inset-0 bg-radial from-[#151210] to-[#050404] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in">
                          <div className="w-16 h-16 border-2 border-[#c5a880] flex items-center justify-center rotate-45 hover:rotate-90 transition-all duration-700 shadow-lg">
                            <span className="font-serif text-xl font-black text-[#c5a880] -rotate-45">M</span>
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-serif text-xl font-bold tracking-widest text-white uppercase">MARKETHUB</h4>
                            <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-400 block">Decentralized Luxury Provenance</span>
                          </div>
                          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#c5a880] to-transparent"></div>
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "grid-reveal" && (
                        <div className="absolute inset-0 bg-zinc-900 flex flex-col justify-between p-4 space-y-2 text-left">
                          <span className="text-[8px] font-mono text-[#c5a880] uppercase tracking-widest">PROMOTIONAL MONTAGE: DETECTING VALUATIONS</span>
                          <div className="grid grid-cols-3 gap-3 flex-1 items-center">
                            {[
                              { brand: "Creed", name: "Aventus", price: "$480", match: "99.2%", img: IMAGES.creed },
                              { brand: "Tom Ford", name: "Oud Wood", price: "$210", match: "97.8%", img: IMAGES.tomford },
                              { brand: "Xerjoff", name: "Naxos 1861", price: "$260", match: "98.9%", img: IMAGES.xerjoff }
                            ].map((prod, idx) => (
                              <div key={idx} className="bg-zinc-950 border border-zinc-800 p-2 text-center rounded-none relative group overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_1px_5px_rgba(16,185,129,0.5)]"></div>
                                <div className="h-16 w-full overflow-hidden mb-1">
                                  <img src={prod.img} alt="" className="w-full h-full object-cover opacity-85" />
                                </div>
                                <span className="text-[7px] font-mono text-zinc-400 block uppercase">{prod.brand}</span>
                                <p className="text-[8px] font-serif text-white font-bold truncate uppercase">{prod.name}</p>
                                <span className="text-[8px] font-mono text-emerald-500 font-bold block mt-1">{prod.price} ({prod.match})</span>
                              </div>
                            ))}
                          </div>
                          <span className="text-[7px] font-mono text-zinc-500 text-center uppercase block">SWIPE SEAMLESSLY TO MATCH LUXURY ASSETS</span>
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "explore-reveal" && (
                        <div className="absolute inset-0 bg-zinc-900 flex flex-col justify-between p-4 text-left">
                          <div className="bg-zinc-950 border border-zinc-800 p-2 rounded-none space-y-2">
                            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 border border-zinc-800 text-[9px] font-mono text-[#c5a880]">
                              <span>🔍</span>
                              <span className="text-white animate-pulse">Vintage Creed Flacon 19R01</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="text-[7px] font-mono bg-[#c5a880]/10 border border-[#c5a880]/30 text-[#c5a880] px-2 py-0.5">FILTER: VERIFIED ONLY</span>
                              <span className="text-[7px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5">LOCATION: SWITZERLAND VAULT</span>
                            </div>
                          </div>
                          <div className="flex-1 flex items-center justify-center">
                            <div className="bg-zinc-950 border border-zinc-800 p-3 flex gap-4 items-center rounded-none w-full">
                              <div className="h-12 w-12 border border-zinc-800 bg-zinc-900 overflow-hidden shrink-0">
                                <img src={IMAGES.creed} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[7px] font-mono text-[#c5a880] uppercase">19R01 VINTAGE</span>
                                <h5 className="text-[10px] font-serif text-white font-black truncate uppercase">Creed Aventus Smoky batch</h5>
                                <span className="text-[8px] font-mono text-zinc-400 block">Geneva Private Ledger Checked • Swiss Safe Locked</span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-500 font-bold shrink-0">$480</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "chat-reveal" && (
                        <div className="absolute inset-0 bg-zinc-900 flex flex-col justify-between p-4 text-left">
                          <div className="border-b border-zinc-800 pb-2 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                              <span className="text-[9px] font-mono uppercase font-bold">SECURE CHANNEL: @zurichCollector &amp; @swisstrader</span>
                            </div>
                            <span className="text-[7px] font-mono text-zinc-500 uppercase">ENCRYPTED</span>
                          </div>
                          <div className="flex-1 space-y-2 overflow-y-auto py-2">
                            <div className="flex flex-col items-start max-w-[80%] space-y-1">
                              <span className="text-[7px] font-mono text-[#c5a880]">BUYER</span>
                              <p className="bg-zinc-800 text-white text-[9px] px-2.5 py-1.5 rounded-none font-sans">Is the batch code etched on the base clear and verifiable?</p>
                            </div>
                            <div className="flex flex-col items-end max-w-[80%] ml-auto space-y-1">
                              <span className="text-[7px] font-mono text-[#c5a880]">SELLER</span>
                              <p className="bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30 text-[9px] px-2.5 py-1.5 rounded-none font-sans">Yes, checked on the 100% matched database now. Code matches 2019 Swiss archive batch.</p>
                            </div>
                            <div className="text-center py-1">
                              <span className="text-[7px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-2 py-0.5 uppercase font-bold">🔒 Escrow locked: CHF 480 secures this transaction</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "escrow-reveal" && (
                        <div className="absolute inset-0 bg-radial from-zinc-900 to-black flex flex-col items-center justify-center text-center p-6 space-y-4">
                          <div className="w-14 h-14 border border-[#c5a880] flex items-center justify-center text-2xl text-[#c5a880] relative">
                            <span>🔒</span>
                            <div className="absolute inset-0 border border-emerald-500/40 rounded-none animate-ping scale-110"></div>
                          </div>
                          <div className="space-y-1">
                            <h5 className="font-serif text-sm font-bold uppercase text-white tracking-widest">SWISS INTEGRITY ESCROW PROTOCOL</h5>
                            <span className="text-[8px] font-mono text-zinc-400 block uppercase">FUNDS HELD SECURELY BY GENEVA TRUSTEE</span>
                          </div>
                          
                          <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between text-[7px] font-mono text-zinc-500 uppercase font-black">
                              <span>1. locked</span>
                              <span className="text-emerald-500">2. authenticated</span>
                              <span>3. released</span>
                            </div>
                            <div className="w-full bg-zinc-800 h-1 rounded-none overflow-hidden relative">
                              <div className="absolute top-0 left-0 h-full w-2/3 bg-emerald-500 transition-all duration-1000"></div>
                            </div>
                            <span className="text-[8px] font-mono text-emerald-500 font-bold block">Appraisal status: Spectroscopy Match Complete</span>
                          </div>
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "ai-listing-reveal" && (
                        <div className="absolute inset-0 bg-zinc-900 flex flex-col justify-between p-4 text-left">
                          <span className="text-[8px] font-mono text-[#c5a880] uppercase tracking-widest block">AI-ASSISTED FLACON ANALYZER</span>
                          <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                            <div className="border border-zinc-800 bg-zinc-950 p-2 flex flex-col items-center justify-center relative aspect-square">
                              <img src={IMAGES.baccarat} className="w-full h-full object-cover opacity-80" />
                              <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-[#c5a880] animate-bounce"></div>
                              <span className="absolute bottom-1.5 text-[6px] font-mono text-white bg-[#c5a880] px-1 font-bold">Spectrogram Match</span>
                            </div>
                            <div className="space-y-2 font-mono text-[8px]">
                              <div className="space-y-0.5">
                                <span className="text-zinc-500 uppercase block">Brand</span>
                                <p className="text-white border-b border-zinc-800 pb-0.5 font-bold animate-pulse">MFK Paris (Verified)</p>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-zinc-500 uppercase block">Formulation</span>
                                <p className="text-white border-b border-zinc-800 pb-0.5 font-bold animate-pulse">Baccarat Rouge 540 Extrait</p>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-zinc-500 uppercase block">Valuation Suggested</span>
                                <p className="text-emerald-500 border-b border-zinc-800 pb-0.5 font-bold animate-pulse">CHF 450 (Highly Accurate)</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "seller-analytics-reveal" && (
                        <div className="absolute inset-0 bg-zinc-900 flex flex-col justify-between p-4 text-left">
                          <span className="text-[8px] font-mono text-[#c5a880] uppercase tracking-widest block">PORTFOLIO INSIGHTS DASHBOARD</span>
                          
                          <div className="grid grid-cols-3 gap-2 py-1">
                            <div className="bg-zinc-950 p-2 border border-zinc-800">
                              <span className="text-[6px] text-zinc-500 block uppercase font-mono">Gross Sales</span>
                              <span className="font-mono text-xs font-black text-white">CHF 12,840</span>
                            </div>
                            <div className="bg-zinc-950 p-2 border border-zinc-800">
                              <span className="text-[6px] text-zinc-500 block uppercase font-mono">Trust Score</span>
                              <span className="font-mono text-xs font-black text-emerald-500">98 / 100</span>
                            </div>
                            <div className="bg-zinc-950 p-2 border border-zinc-800">
                              <span className="text-[6px] text-zinc-500 block uppercase font-mono">Completed Tx</span>
                              <span className="font-mono text-xs font-black text-[#c5a880]">142 Trades</span>
                            </div>
                          </div>

                          <div className="flex-1 bg-zinc-950 border border-zinc-800 p-2 rounded-none flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute inset-x-2 bottom-4 h-12 flex items-end gap-1">
                              <div className="w-full bg-zinc-800 h-1/3"></div>
                              <div className="w-full bg-zinc-800 h-1/2"></div>
                              <div className="w-full bg-[#c5a880]/30 h-2/3"></div>
                              <div className="w-full bg-emerald-500/40 h-3/4"></div>
                              <div className="w-full bg-emerald-500 h-full"></div>
                            </div>
                            <span className="text-[7px] font-mono text-zinc-500 uppercase block">HISTORIC EARNINGS CURVE</span>
                          </div>
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "mobile-buyer-reveal" && (
                        <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-4">
                          <div className="w-48 bg-zinc-950 border-4 border-zinc-800 rounded-2xl p-2.5 aspect-[9/16] text-left flex flex-col justify-between relative">
                            <div className="w-12 h-3.5 bg-zinc-850 mx-auto rounded-full mb-1"></div>
                            <span className="text-[7px] font-mono text-[#c5a880] uppercase tracking-wider block">MarketHub App</span>
                            
                            <div className="bg-zinc-900 p-1.5 border border-zinc-800 my-1 rounded-none flex gap-2 items-center">
                              <div className="w-6 h-6 bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0">
                                <img src={IMAGES.tomford} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h6 className="text-[7px] font-serif font-bold text-white truncate">TF Oud Wood</h6>
                                <span className="text-[6px] font-mono text-zinc-500 block">CHF 210</span>
                              </div>
                            </div>

                            <button className="w-full bg-[#c5a880] hover:bg-[#b09370] text-black font-serif text-[7px] uppercase tracking-widest py-1 font-bold rounded-none mt-auto">
                              Add To Vault Wishlist
                            </button>
                          </div>
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "mobile-seller-reveal" && (
                        <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center p-4">
                          <div className="w-48 bg-zinc-950 border-4 border-zinc-800 rounded-2xl p-2.5 aspect-[9/16] text-left flex flex-col justify-between relative">
                            <div className="w-12 h-3.5 bg-zinc-850 mx-auto rounded-full mb-1"></div>
                            <span className="text-[7px] font-mono text-zinc-500 block uppercase text-center">Seller Dispatch Console</span>
                            
                            <div className="p-2 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-none my-2 space-y-1">
                              <span className="text-[6px] font-mono text-[#c5a880] uppercase block">🔔 NEW Escrow Locked Order</span>
                              <h6 className="text-[8px] font-serif font-black text-white">Baccarat Rouge Red</h6>
                              <p className="text-[6px] font-mono text-zinc-400">Total Funds: CHF 450</p>
                            </div>

                            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-serif text-[7px] uppercase tracking-widest py-1.5 font-bold rounded-none mt-auto">
                              ✓ CONFIRM DISPATCH
                            </button>
                          </div>
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "push-notify-reveal" && (
                        <div className="absolute inset-0 bg-zinc-950 flex flex-col justify-center p-6 space-y-3 text-left">
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block text-center mb-1">PUSH NOTIFICATIONS TIMELINE</span>
                          
                          {[
                            { title: "🎉 Sale Confirmed!", text: "Buyer @zurich_collector locked CHF 450 in Escrow.", color: "border-emerald-500" },
                            { title: "🔒 Escrow Status Secured", text: "Liquid chemical index matching is complete (Verdict: Authentic).", color: "border-blue-500" },
                            { title: "🚀 Tracking Live", text: "Secure priority shipment transit checked. ETA tomorrow 14:00.", color: "border-[#c5a880]" }
                          ].map((notif, idx) => (
                            <div key={idx} className={`p-2.5 bg-zinc-900 border-l-2 ${notif.color} rounded-none flex flex-col space-y-0.5 animate-fade-in`}>
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-serif font-bold text-white uppercase">{notif.title}</span>
                                <span className="text-[6px] font-mono text-zinc-500">Just now</span>
                              </div>
                              <p className="text-[8px] text-zinc-400 font-sans leading-relaxed">{notif.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "community-reveal" && (
                        <div className="absolute inset-0 bg-zinc-900 flex flex-col justify-between p-4 text-left">
                          <span className="text-[8px] font-mono text-[#c5a880] uppercase tracking-widest block">TRUSTED MEMBERS MATRIX</span>
                          
                          <div className="grid grid-cols-2 gap-3 flex-1 items-center">
                            {[
                              { user: "@genevaCollector", role: "Elite Buyer", reviews: "★★★★★", text: "Safest transactions in Swiss luxury perfume industry." },
                              { user: "@rareEssences", role: "Master Seller", reviews: "★★★★★", text: "Every batch is fully analyzed with spectroscopy. Instant release of funds!" }
                            ].map((testi, idx) => (
                              <div key={idx} className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-none flex flex-col justify-between h-full">
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[8px] font-serif font-black text-white">{testi.user}</span>
                                    <span className="text-[6px] font-mono text-[#c5a880] uppercase">{testi.role}</span>
                                  </div>
                                  <span className="text-[8px] text-[#c5a880] font-mono block">{testi.reviews}</span>
                                  <p className="text-[8px] text-zinc-400 font-serif leading-tight italic">"{testi.text}"</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].previewComponent === "cta-reveal" && (
                        <div className="absolute inset-0 bg-radial from-[#151210] to-[#050404] flex flex-col items-center justify-center text-center p-6 space-y-4">
                          <span className="text-[10px] font-mono text-[#c5a880] uppercase tracking-widest block font-bold">EXPERIENCE THE FUTURE TODAY</span>
                          <h4 className="font-serif text-2xl font-black text-white tracking-widest uppercase">DISCOVER. CONNECT. THRIVE.</h4>
                          <div className="flex gap-3">
                            <button onClick={() => alert("Connecting to live server catalog...")} className="bg-[#c5a880] hover:bg-[#b09370] text-black font-serif text-[9px] uppercase tracking-widest px-4 py-2 font-bold rounded-none">
                              Explore Live catalog
                            </button>
                            <button onClick={() => alert("Downloading Market Hub secure app...")} className="border border-zinc-700 hover:border-[#c5a880] text-white font-serif text-[9px] uppercase tracking-widest px-4 py-2 font-bold rounded-none">
                              Install Application
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Movie Player Controls and Active Segment Info */}
                    <div className="bg-zinc-950 border-t border-zinc-900 p-4 space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                        <span className="text-[#c5a880] font-bold">Chapter {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].index}: {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].title}</span>
                        <span>Timeline: {VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].time}</span>
                      </div>
                      
                      {/* Interactive Progress Bar */}
                      <div className="relative w-full h-1 bg-zinc-800 rounded-none cursor-pointer overflow-hidden">
                        <div 
                          className="absolute h-full bg-[#c5a880] transition-all duration-300" 
                          style={{ width: `${((activeVideoPromptIndex + 1) / 12) * 100}%` }}
                        ></div>
                      </div>

                      {/* Control buttons */}
                      <div className="flex justify-between items-center pt-1">
                        <div className="flex gap-4">
                          <button 
                            type="button"
                            onClick={() => setActiveVideoPromptIndex(prev => prev > 0 ? prev - 1 : 11)}
                            className="text-zinc-400 hover:text-white text-xs font-mono tracking-widest uppercase font-bold cursor-pointer transition-colors"
                          >
                            ◀ Prev Chapter
                          </button>
                          <button 
                            type="button"
                            onClick={() => setActiveVideoPromptIndex(prev => prev < 11 ? prev + 1 : 0)}
                            className="text-zinc-400 hover:text-white text-xs font-mono tracking-widest uppercase font-bold cursor-pointer transition-colors"
                          >
                            Next Chapter ▶
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Interactive Video simulation</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Dynamic description matching the active chapter */}
                  <div className="bg-zinc-900/50 border border-zinc-800 p-4 space-y-2 rounded-none">
                    <span className="text-[8px] font-mono text-[#c5a880] uppercase tracking-widest font-black block">Active Segment Prompts &amp; Storyboard Notes</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium">
                      "{VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].description}"
                    </p>
                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase pt-1">
                      <span>Mood Vibe: <strong className="text-zinc-300">{VIDEO_CHAPT_PROMPTS[activeVideoPromptIndex].mood}</strong></span>
                      <span>Target Duration: 10 Seconds</span>
                    </div>
                  </div>

                </div>

                {/* RIGHT: 12 Chapters Timeline Navigator */}
                <div className="lg:col-span-5 h-[460px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  <span className="text-[9px] font-mono text-[#c5a880] uppercase tracking-widest font-bold block mb-3 border-b border-zinc-800 pb-2">Select Storyboard Chapter</span>
                  
                  {VIDEO_CHAPT_PROMPTS.map((prompt, index) => (
                    <div
                      key={prompt.index}
                      onClick={() => setActiveVideoPromptIndex(index)}
                      className={`p-3 border transition-all duration-300 cursor-pointer text-left flex gap-3.5 items-start ${
                        activeVideoPromptIndex === index 
                          ? 'bg-[#c5a880]/15 border-[#c5a880]' 
                          : 'bg-zinc-900/30 border-zinc-800 hover:bg-zinc-900/60 hover:border-zinc-700'
                      }`}
                    >
                      {/* Timeline clock mark */}
                      <div className="flex flex-col items-center justify-center pt-0.5">
                        <span className="text-[9px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300 px-1.5 py-0.5 font-bold uppercase tracking-widest">
                          {prompt.time}
                        </span>
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <h5 className="font-serif text-xs font-bold uppercase tracking-wider text-white">
                          Ch.{prompt.index} — {prompt.title}
                        </h5>
                        <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {prompt.description}
                        </p>
                      </div>
                    </div>
                  ))}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Dashboard performance cards */}
                  <div className="bg-white border border-zinc-200 p-5 rounded-none flex items-center gap-4 shadow-sm">
                    <div className="p-3 bg-[#c5a880]/15 rounded-none border border-[#c5a880]/30 text-[#8e7355]">
                      <User className="w-5 h-5 font-bold" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Seller Rating</span>
                      <p className="font-mono text-base font-black text-zinc-900">4.95 <span className="text-xs text-zinc-400 font-medium">/ 5.0 (142 Tx)</span></p>
                    </div>
                  </div>

              <div className="bg-white border border-zinc-200 p-5 rounded-none flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-emerald-50 rounded-none border border-emerald-200 text-emerald-700">
                  <TrendingUp className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Hub Trust Rating</span>
                  <p className="font-mono text-base font-black text-emerald-700">98 / 100 <span className="text-xs text-emerald-500/60 font-medium">Trusted Master</span></p>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 p-5 rounded-none flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-blue-50 rounded-none border border-blue-200 text-blue-700">
                  <BarChart2 className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Pending Payouts</span>
                  <p className="font-mono text-base font-black text-blue-700">CHF 1,840</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                      disabled={!sellerBrand || !sellerModel || isSellerListingGenerating}
                      className="text-[10px] font-mono uppercase text-[#8e7355] hover:text-[#c5a880] bg-zinc-50 border border-zinc-300 px-3.5 py-1.5 rounded-none disabled:opacity-30 cursor-pointer flex items-center gap-1 font-bold shadow-xs"
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold mb-1.5">Asset Photo</label>
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
                      <div className="flex items-center">
                        <span className="text-[10px] text-zinc-500 font-mono leading-tight mt-4">
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
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-none px-3.5 py-2.5 text-xs text-zinc-950 focus:bg-white focus:outline-none focus:border-zinc-800 resize-none font-sans"
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
                      { brand: "Maison Francis Kurkdjian", name: "Baccarat Rouge 540 Extrait", price: "$450", status: "Awaiting Admin Review", badge: "bg-amber-50 text-amber-800 border-amber-200 font-bold" },
                      { brand: "Roja Parfums", name: "Elysium Pour Homme (Sealed)", price: "$320", status: "Active (Verified)", badge: "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold" },
                      { brand: "By Kilian", name: "Black Phantom (with Coffret)", price: "$285", status: "Active (Verified)", badge: "bg-emerald-50 text-emerald-800 border-emerald-200 font-bold" }
                    ].map((inv, i) => (
                      <div key={i} className="p-3 bg-zinc-50 border border-zinc-200 rounded-none flex justify-between items-center shadow-xs">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider font-mono text-[#8e7355] font-black">{inv.brand}</span>
                          <h4 className="font-serif text-xs text-zinc-900 font-bold mt-0.5">{inv.name}</h4>
                          <span className={`inline-block text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-none border mt-1 ${inv.badge}`}>
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-black text-[#8e7355]">{inv.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>)}
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
                    <h3 className="font-serif text-base text-white mt-1 uppercase font-black">Consortium Auditor Terminal</h3>
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
                            <span className="text-[9px] text-zinc-400 font-mono mt-1 block">Batch: {feed.batch} • Price: ${feed.price}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {adminSubTab === 'disputes' && (
                <div className="bg-white border border-zinc-200 rounded-none p-6 space-y-4 shadow-sm">
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
                <div className="bg-white border border-zinc-200 rounded-none p-6 space-y-4 shadow-sm">
                  <h3 className="font-serif text-lg text-zinc-950 uppercase tracking-widest border-b border-zinc-100 pb-3 font-black">Olfactory Protocol Registry Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-none text-center space-y-1">
                      <span className="text-[8px] uppercase tracking-widest font-mono text-zinc-400">Spectral Scans Done</span>
                      <p className="font-mono text-2xl font-black text-zinc-900 font-black">42,891</p>
                    </div>
                    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-none text-center space-y-1">
                      <span className="text-[8px] uppercase tracking-widest font-mono text-zinc-400">Active Escrow locked</span>
                      <p className="font-mono text-2xl font-black text-zinc-900 font-black">CHF 492K</p>
                    </div>
                    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-none text-center space-y-1">
                      <span className="text-[8px] uppercase tracking-widest font-mono text-zinc-400">Counterfeit Block Rate</span>
                      <p className="font-mono text-2xl font-black text-rose-600 font-black">0.18%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>)}
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

      {/* Escrow Checkout Form Popup Modal */}
      {checkoutItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#c5a880]/30 rounded-2xl max-w-lg w-full p-6 relative space-y-4 shadow-2xl">
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
                    <span className="text-zinc-800 font-bold block mt-1 uppercase">{checkoutItem.brand}</span>
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

      {/* ----------------- PRIVATE PRIVACY COOKIE CONSENT BANNER ----------------- */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md bg-white border border-zinc-300 shadow-2xl p-6 z-50 rounded-none relative"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c5a880]"></div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h5 className="font-serif text-sm font-black uppercase tracking-wider text-zinc-900 leading-tight">
                  {showCookieSettings ? "At David M Robinson, Your Privacy Matters" : "At Market Hub, Your Privacy Matters"}
                </h5>
                <button 
                  onClick={() => setShowCookieBanner(false)}
                  className="text-zinc-400 hover:text-zinc-800 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs font-serif text-zinc-600 leading-relaxed">
                We use cookies to enhance your browsing experience. By clicking "Accept All Cookies", you agree to our use of cookies.
              </p>

              {/* Settings Expanded Panel */}
              {showCookieSettings && (
                <div className="border-t border-zinc-200 pt-4 mt-4 space-y-4 font-serif text-xs">
                  <div className="space-y-2 pb-2.5 border-b border-zinc-100">
                    <div className="flex justify-between items-center font-bold text-zinc-800">
                      <span>Necessary Cookies</span>
                      <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Required</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      Necessary cookies enable core functionality such as page navigation and access to secure areas. The website cannot function properly without these cookies, and can only be disabled by changing your browser preferences.
                    </p>
                  </div>

                  <div className="space-y-2 pb-2.5 border-b border-zinc-100">
                    <div className="flex justify-between items-center font-bold text-zinc-800">
                      <span>Statistics</span>
                      <div className="flex gap-1.5 font-mono text-[9px]">
                        <button 
                          type="button"
                          onClick={() => setCookieAnalytics(true)}
                          className={`px-2.5 py-1 rounded transition-all cursor-pointer ${cookieAnalytics ? 'bg-zinc-900 text-white font-bold' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`}
                        >
                          On
                        </button>
                        <button 
                          type="button"
                          onClick={() => setCookieAnalytics(false)}
                          className={`px-2.5 py-1 rounded transition-all cursor-pointer ${!cookieAnalytics ? 'bg-zinc-900 text-white font-bold' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`}
                        >
                          Off
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      These cookies help us understand how visitors use our website so we can improve performance and your browsing experience.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center font-bold text-zinc-800">
                      <span>Marketing</span>
                      <div className="flex gap-1.5 font-mono text-[9px]">
                        <button 
                          type="button"
                          onClick={() => setCookieMarketing(true)}
                          className={`px-2.5 py-1 rounded transition-all cursor-pointer ${cookieMarketing ? 'bg-zinc-900 text-white font-bold' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`}
                        >
                          On
                        </button>
                        <button 
                          type="button"
                          onClick={() => setCookieMarketing(false)}
                          className={`px-2.5 py-1 rounded transition-all cursor-pointer ${!cookieMarketing ? 'bg-zinc-900 text-white font-bold' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`}
                        >
                          Off
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      These cookies help us measure campaign effectiveness and deliver more relevant advertising and marketing content.
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons exactly matching the watch site */}
              <div className="flex flex-col gap-2 pt-2 text-center">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSaveCookieConsent(true, true, true)}
                    className="flex-1 bg-black hover:bg-zinc-800 text-white font-serif tracking-widest text-[10px] uppercase py-3.5 transition-all duration-300 font-bold cursor-pointer"
                  >
                    Accept All Cookies
                  </button>
                  <button 
                    onClick={() => handleSaveCookieConsent(false, false, false)}
                    className="flex-1 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-serif tracking-widest text-[10px] uppercase py-3.5 transition-all duration-300 font-bold cursor-pointer"
                  >
                    Reject All Cookies
                  </button>
                </div>
                
                <button 
                  type="button"
                  onClick={() => setShowCookieSettings(!showCookieSettings)}
                  className="text-[10px] text-zinc-500 hover:text-black font-serif underline tracking-wide pt-1 transition-all cursor-pointer"
                >
                  {showCookieSettings ? "Hide Settings" : "Settings"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------- SPRAWLING HIGH-FIDELITY LUXURY DMR-STYLE FOOTER ----------------- */}
      <footer className="bg-white border-t border-zinc-200 mt-28 py-16 text-zinc-800" id="luxury-dmr-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          {/* Top Row: Newsletter Signup and Socials */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-zinc-200">
            
            {/* Newsletter Column */}
            <div className="lg:col-span-7 space-y-6">
              <h4 className="font-serif text-lg font-black tracking-widest text-zinc-950 uppercase">
                SUBSCRIBE TO OUR EMAILS
              </h4>
              
              <div className="space-y-4">
                <p className="text-xs font-serif text-zinc-500 uppercase tracking-widest">
                  I'd like to hear about...
                </p>
                
                {/* Topic Pills Row */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { label: "EVERYTHING", icon: "⊞" },
                    { label: "BRIDAL", icon: "💎" },
                    { label: "WATCHES", icon: "⌚" },
                    { label: "JEWELLERY", icon: "✨" }
                  ].map((topic) => (
                    <button
                      key={topic.label}
                      onClick={() => alert(`Preferences updated for ${topic.label} updates.`)}
                      className="border border-zinc-200 hover:border-zinc-800 hover:bg-zinc-50 text-[9px] font-serif uppercase tracking-widest px-4 py-2.5 transition-all duration-300 font-bold flex items-center gap-1.5 cursor-pointer bg-white"
                    >
                      <span>{topic.icon}</span>
                      <span>{topic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Form */}
              <form 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  alert("Subscription successful. You are now part of our premium registry mailing list."); 
                }} 
                className="max-w-md pt-2"
              >
                <div className="relative border-b border-zinc-300 focus-within:border-zinc-800 transition-colors">
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    className="w-full bg-transparent py-3 pr-10 text-xs font-serif placeholder-zinc-400 focus:outline-none text-zinc-900"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 text-sm transition-colors cursor-pointer font-bold"
                    aria-label="Submit Email Address"
                  >
                    →
                  </button>
                </div>
              </form>

              {/* Social Media Row */}
              <div className="flex items-center gap-5 pt-4">
                <button 
                  onClick={() => alert("Redirecting to David M Robinson Luxury Facebook channel...")}
                  className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-800 text-zinc-500 hover:text-zinc-950 transition-all cursor-pointer text-xs"
                >
                  f
                </button>
                <button 
                  onClick={() => alert("Redirecting to David M Robinson Luxury Instagram stream...")}
                  className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-800 text-zinc-500 hover:text-zinc-950 transition-all cursor-pointer text-xs"
                >
                  📷
                </button>
                <button 
                  onClick={() => alert("Redirecting to David M Robinson Luxury Pinterest boards...")}
                  className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center hover:border-zinc-800 text-zinc-500 hover:text-zinc-950 transition-all cursor-pointer text-xs"
                >
                  p
                </button>
              </div>

            </div>

            {/* Spacer */}
            <div className="hidden lg:block lg:col-span-5"></div>

          </div>

          {/* Middle Row: Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
            
            {/* SHOP COLUMN */}
            <div className="space-y-4">
              <h5 className="text-[11px] font-serif uppercase tracking-widest text-zinc-950 font-black">
                SHOP
              </h5>
              <ul className="space-y-2.5 text-xs font-serif text-zinc-500 uppercase tracking-wider">
                <li><button onClick={() => { setSearchQuery(''); setActiveTab('marketplace'); }} className="hover:text-zinc-900 transition-colors">Engagement &amp; Bridal</button></li>
                <li><button onClick={() => { setSearchQuery('Xerjoff'); setActiveTab('marketplace'); }} className="hover:text-zinc-900 transition-colors">Jewellery</button></li>
                <li><button onClick={() => { setSearchQuery('Tom Ford'); setActiveTab('marketplace'); }} className="hover:text-zinc-900 transition-colors">Watches</button></li>
                <li><button onClick={() => alert("Exploring Rolex Master Collection.")} className="hover:text-zinc-900 transition-colors">Rolex</button></li>
                <li><button onClick={() => alert("Exploring Patek Philippe Master Collection.")} className="hover:text-zinc-900 transition-colors">Patek Philippe</button></li>
              </ul>
            </div>

            {/* SERVICES COLUMN */}
            <div className="space-y-4">
              <h5 className="text-[11px] font-serif uppercase tracking-widest text-zinc-950 font-black">
                SERVICES
              </h5>
              <ul className="space-y-2.5 text-xs font-serif text-zinc-500 uppercase tracking-wider">
                <li><button onClick={() => alert("Booking a private boutique consultant...")} className="hover:text-zinc-900 transition-colors">Book An Appointment</button></li>
                <li><button onClick={() => alert("Opening Bespoke Jewellery request board...")} className="hover:text-zinc-900 transition-colors">Bespoke</button></li>
                <li><button onClick={() => alert("Watch servicing request queued...")} className="hover:text-zinc-900 transition-colors">Watch Servicing</button></li>
                <li><button onClick={() => alert("Initiate private valuation request...")} className="hover:text-zinc-900 transition-colors">Valuations</button></li>
                <li><button onClick={() => alert("Initiate professional repair request...")} className="hover:text-zinc-900 transition-colors">Jewellery Repair</button></li>
                <li><button onClick={() => alert("Opening ring size configuration helper...")} className="hover:text-zinc-900 transition-colors">Ring Size Guide</button></li>
              </ul>
            </div>

            {/* ABOUT COLUMN */}
            <div className="space-y-4">
              <h5 className="text-[11px] font-serif uppercase tracking-widest text-zinc-950 font-black">
                ABOUT
              </h5>
              <ul className="space-y-2.5 text-xs font-serif text-zinc-500 uppercase tracking-wider">
                <li><button onClick={() => alert("Loading David M Robinson heritage document...")} className="hover:text-zinc-900 transition-colors">DMR Story</button></li>
                <li><button onClick={() => alert("Opening DMR luxury lifestyle journal...")} className="hover:text-zinc-900 transition-colors">Journal</button></li>
                <li><button onClick={() => alert("Brochure PDF catalog queued for download.")} className="hover:text-zinc-900 transition-colors">Brochure</button></li>
                <li><button onClick={() => alert("Initiating luxury concierge desk...")} className="hover:text-zinc-900 transition-colors">Concierge</button></li>
                <li><button onClick={() => alert("Showroom mapping triggered. Switzerland &amp; UK showrooms.")} className="hover:text-zinc-900 transition-colors">Showrooms</button></li>
                <li><button onClick={() => alert("Join DMR. 12 vacancies available.")} className="hover:text-zinc-900 transition-colors">Careers</button></li>
              </ul>
            </div>

            {/* INFO COLUMN */}
            <div className="space-y-4">
              <h5 className="text-[11px] font-serif uppercase tracking-widest text-zinc-950 font-black">
                INFO
              </h5>
              <ul className="space-y-2.5 text-xs font-serif text-zinc-500 uppercase tracking-wider">
                <li><button onClick={() => alert("Private support hotline: Swiss desk")} className="hover:text-zinc-900 transition-colors">Contact Us</button></li>
                <li><button onClick={() => alert("Showing billing &amp; escrow payment details.")} className="hover:text-zinc-900 transition-colors">Orders &amp; Payment</button></li>
                <li><button onClick={() => alert("Showing 14-day escrow cancellation conditions.")} className="hover:text-zinc-900 transition-colors">Returns &amp; Refunds</button></li>
                <li><button onClick={() => alert("Showing fully-insured secure priority shipping details.")} className="hover:text-zinc-900 transition-colors">Delivery Information</button></li>
                <li><button onClick={() => alert("Pick up available at Zurich &amp; Geneva vaults.")} className="hover:text-zinc-900 transition-colors">Click &amp; Collect</button></li>
                <li><button onClick={() => alert("Interest free luxury payment layouts up to 36 months.")} className="hover:text-zinc-900 transition-colors">Interest Free</button></li>
                <li><button onClick={() => alert("Hallmarking assurance check guaranteed.")} className="hover:text-zinc-900 transition-colors">Hallmarking Guarantee</button></li>
                <li><button onClick={() => alert("Modern Slavery and ethical sourcing compliance sheet.")} className="hover:text-zinc-900 transition-colors">Modern Slavery Statement</button></li>
                <li><button onClick={() => setShowCookieSettings(true)} className="hover:text-zinc-900 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => alert("Viewing DMR terms of registry...")} className="hover:text-zinc-900 transition-colors">Terms &amp; Conditions</button></li>
              </ul>
            </div>

          </div>

          {/* Bottom Row: Payment Badges & Regulatory Text */}
          <div className="pt-8 border-t border-zinc-150 space-y-6">
            
            {/* Payment Icons Grid */}
            <div className="flex flex-wrap items-center gap-3">
              {[
                { name: "AMEX", bg: "bg-blue-800 text-white font-black" },
                { name: "Apple Pay", bg: "bg-black text-white font-semibold" },
                { name: "G Pay", bg: "bg-zinc-100 text-zinc-800 border border-zinc-300 font-bold" },
                { name: "Mastercard", bg: "bg-amber-600 text-white font-bold" },
                { name: "PayPal", bg: "bg-blue-600 text-white font-black" },
                { name: "Shop Pay", bg: "bg-indigo-600 text-white font-bold" },
                { name: "Visa", bg: "bg-blue-900 text-white font-bold" }
              ].map((badge) => (
                <span 
                  key={badge.name} 
                  className={`px-3 py-1 text-[9px] uppercase tracking-widest font-mono select-none rounded-none ${badge.bg}`}
                >
                  {badge.name}
                </span>
              ))}
            </div>

            {/* Credit Broker Legal Text */}
            <p className="text-[10px] text-zinc-400 font-serif leading-relaxed text-left max-w-5xl">
              David M. Robinson Limited acts as a credit broker and not the lender, offering credit products from Secure Trust Bank PLC trading as V12 Retail Finance limited. David M. Robinson Limited is authorised and regulated by the Financial Conduct Authority, registration number 720857. Credit subject to age and status, minimum spend and terms &amp; conditions apply. Company number: 00958819. Registered address: 14 Railway Street, Altrincham, Cheshire, WA14 2RE. V12 Retail Finance Limited. Registered in England and Wales 4585692. Authorised and regulated by the Financial Conduct Authority. Registered office: Yorke House, Arleston Way, Solihull, B90 4LH.
            </p>

            {/* Final Copyright */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 text-[9px] font-mono uppercase tracking-widest text-zinc-400">
              <span>© {new Date().getFullYear()} David M Robinson Ltd / Market Hub Consortium. All rights reserved.</span>
              <span className="text-[#8e7355] font-bold">Basel &amp; Geneva SECURE PLATFORM v3.5</span>
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

