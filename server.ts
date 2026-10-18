import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data Directory Persistence (works locally & in containers)
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.warn('Could not create data dir:', e);
  }
}

// 10 Standard VIP Packages
const DEFAULT_PACKAGES = [
  {
    id: 'vip-1',
    tier: 1,
    name: 'VIP 1 Starter',
    nameBn: 'ভিআইপি ১ স্টারটার',
    price: 500,
    dailyIncome: 50,
    validityDays: 30,
    isActive: true,
    description: 'Entry package for beginners with high daily ROI',
    badgeColor: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'vip-2',
    tier: 2,
    name: 'VIP 2 Bronze',
    nameBn: 'ভিআইপি ২ ব্রোঞ্জ',
    price: 1000,
    dailyIncome: 110,
    validityDays: 30,
    isActive: true,
    description: 'Double your earning potential with fast return',
    badgeColor: 'from-amber-600 to-orange-600',
  },
  {
    id: 'vip-3',
    tier: 3,
    name: 'VIP 3 Silver',
    nameBn: 'ভিআইপি ৩ সিলভার',
    price: 2000,
    dailyIncome: 230,
    validityDays: 30,
    isActive: true,
    description: 'Most popular package among active community members',
    badgeColor: 'from-slate-400 to-zinc-600',
  },
  {
    id: 'vip-4',
    tier: 4,
    name: 'VIP 4 Gold',
    nameBn: 'ভিআইপি ৪ গোল্ড',
    price: 3000,
    dailyIncome: 360,
    validityDays: 35,
    isActive: true,
    description: 'Enhanced profit tier with extended package validity',
    badgeColor: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'vip-5',
    tier: 5,
    name: 'VIP 5 Platinum',
    nameBn: 'ভিআইপি ৫ প্লাটিনাম',
    price: 5000,
    dailyIncome: 650,
    validityDays: 40,
    isActive: true,
    description: 'High return investment designed for regular earners',
    badgeColor: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'vip-6',
    tier: 6,
    name: 'VIP 6 Diamond',
    nameBn: 'ভিআইপি ৬ ডায়মন্ড',
    price: 10000,
    dailyIncome: 1350,
    validityDays: 45,
    isActive: true,
    description: 'Premium tier with fast bKash & Nagad withdrawal priority',
    badgeColor: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'vip-7',
    tier: 7,
    name: 'VIP 7 Crown',
    nameBn: 'ভিআইপি ৭ ক্রাউন',
    price: 15000,
    dailyIncome: 2100,
    validityDays: 50,
    isActive: true,
    description: 'Elite level investment with guaranteed high daily payouts',
    badgeColor: 'from-purple-500 to-indigo-700',
  },
  {
    id: 'vip-8',
    tier: 8,
    name: 'VIP 8 Master',
    nameBn: 'ভিআইপি ৮ মাস্টার',
    price: 25000,
    dailyIncome: 3700,
    validityDays: 60,
    isActive: true,
    description: 'Masterclass earning bracket with dedicated account priority',
    badgeColor: 'from-rose-500 to-red-700',
  },
  {
    id: 'vip-9',
    tier: 9,
    name: 'VIP 9 Grand Master',
    nameBn: 'ভিআইপি ৯ গ্র্যান্ড মাস্টার',
    price: 50000,
    dailyIncome: 7800,
    validityDays: 65,
    isActive: true,
    description: 'Top enterprise level daily profit generator',
    badgeColor: 'from-fuchsia-600 to-purple-800',
  },
  {
    id: 'vip-10',
    tier: 10,
    name: 'VIP 10 Ultimate Sovereign',
    nameBn: 'ভিআইপি ১০ আলটিমেট সভারেন',
    price: 100000,
    dailyIncome: 16500,
    validityDays: 70,
    isActive: true,
    description: 'The supreme VIP investment package of Earnlance BD',
    badgeColor: 'from-amber-400 via-yellow-300 to-yellow-600',
  },
];

const DEFAULT_BANNERS = [
  {
    id: 'ban-1',
    title: 'Earnlance BD Investment',
    subtitle: '100% Reliable Daily Income & Quick Payouts',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    linkText: 'Join VIP Now',
    tag: 'Official Launch',
    bgGradient: 'from-blue-900 via-indigo-900 to-slate-900',
    isActive: true,
  },
  {
    id: 'ban-2',
    title: 'Daily 5 Task Watching',
    subtitle: 'Watch simple sponsor videos & get guaranteed profit',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    linkText: 'Start Tasks',
    tag: 'Daily Work',
    bgGradient: 'from-sky-900 via-blue-950 to-slate-900',
    isActive: true,
  },
  {
    id: 'ban-3',
    title: 'Instant bKash & Nagad Cashout',
    subtitle: 'Safe, direct, and automated wallet withdrawals',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80',
    linkText: 'Check Wallet',
    tag: 'Fast Payout',
    bgGradient: 'from-amber-900 via-yellow-950 to-slate-900',
    isActive: true,
  },
  {
    id: 'ban-4',
    title: 'VIP Packages 1 to 10',
    subtitle: 'From 500 TK to 100,000 TK with high daily returns',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
    linkText: 'Upgrade Tier',
    tag: 'High Yield',
    bgGradient: 'from-purple-900 via-indigo-950 to-slate-900',
    isActive: true,
  },
  {
    id: 'ban-5',
    title: 'Earnlance Referral Program',
    subtitle: 'Earn direct commission by inviting your network',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    linkText: 'Invite Friends',
    tag: 'Commission',
    bgGradient: 'from-emerald-900 via-teal-950 to-slate-900',
    isActive: true,
  },
  {
    id: 'ban-6',
    title: 'One-Account Protection',
    subtitle: 'Strict security against duplicate numbers & fraud',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    linkText: 'Security Notice',
    tag: 'Safe & Secure',
    bgGradient: 'from-slate-800 via-slate-900 to-black',
    isActive: true,
  },
  {
    id: 'ban-7',
    title: '24/7 Live Support',
    subtitle: 'Send your query, the system will identify or verify and assist you',
    imageUrl: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=800&auto=format&fit=crop&q=80',
    linkText: 'Get Support',
    tag: 'Live Chat',
    bgGradient: 'from-blue-950 via-slate-900 to-zinc-900',
    isActive: true,
  },
  {
    id: 'ban-8',
    title: 'Lifetime Single Purchase Rule',
    subtitle: 'Fair community policies: 1 package per lifetime per tier',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    linkText: 'Platform Rules',
    tag: 'Fair Play',
    bgGradient: 'from-stone-900 via-neutral-900 to-zinc-950',
    isActive: true,
  },
  {
    id: 'ban-9',
    title: 'Automated 24h Reset Timer',
    subtitle: 'Daily video tasks reset smoothly every 24 hours',
    imageUrl: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&auto=format&fit=crop&q=80',
    linkText: 'View Schedule',
    tag: 'Auto Reset',
    bgGradient: 'from-cyan-950 via-slate-900 to-slate-950',
    isActive: true,
  },
  {
    id: 'ban-10',
    title: 'Smart Investment, Real Profit',
    subtitle: 'Join thousands of satisfied Bangladeshi investors today',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    linkText: 'Get Started',
    tag: 'Earnlance BD',
    bgGradient: 'from-indigo-950 via-blue-900 to-slate-950',
    isActive: true,
  },
];

const DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Digital Marketing & Growth Ad',
    titleBn: 'ডিজিটাল মার্কেটিং ও ব্র্যান্ড গ্রোথ ভিডিও',
    sponsor: 'TechBD Global',
    category: 'Technology',
    durationSeconds: 6,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'task-2',
    title: 'Smart Fintech & Mobile Banking',
    titleBn: 'স্মার্ট ফিনটেক ও মোবাইল ব্যাংকিং স্পন্সর',
    sponsor: 'PayStream Asia',
    category: 'Fintech',
    durationSeconds: 6,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'task-3',
    title: 'E-Commerce Super Brand Promo',
    titleBn: 'ই-কমার্স সুপার ব্র্যান্ড প্রমোশন',
    sponsor: 'ShopBazaar BD',
    category: 'E-Commerce',
    durationSeconds: 6,
    thumbnail: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=500&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'task-4',
    title: 'Cloud Infrastructure & AI Tools',
    titleBn: 'ক্লাউড নেটওয়ার্ক ও এআই টেকনোলজি',
    sponsor: 'Apex Cloud Systems',
    category: 'Artificial Intelligence',
    durationSeconds: 6,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'task-5',
    title: 'Global Trade & Currency Exchange',
    titleBn: 'গ্লোবাল ট্রেড ও কারেন্সি একচেঞ্জ রিভিউ',
    sponsor: 'Prime FX International',
    category: 'Trading',
    durationSeconds: 6,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=80',
    isActive: true,
  },
];

const DEFAULT_FEED = [
  'Karim 1,200 TK Withdraw',
  'Rahim 500 TK Deposit',
  'Tanvir VIP 2 Activated',
  'Hasan 2,000 TK Deposit',
  'Sumon 3,500 TK Withdraw',
  'Faruk VIP 3 Activated',
  'Jamil 1,000 TK Deposit',
  'Arif 5,000 TK VIP 5 Activated',
  'Mahmud 1,800 TK Withdraw',
  'Rakib 500 TK Deposit',
  'Shuvo VIP 1 Activated',
  'Kamal 2,200 TK Withdraw',
];

interface DatabaseSchema {
  users: any[];
  packages: any[];
  banners: any[];
  tasks: any[];
  transactions: any[];
  supportMessages: any[];
  feedItems: string[];
  deletedUsers?: Array<{ id: string; phone: string; deletedAt: string }>;
  adminConfig: {
    adminPassword: string;
    bkashNumber: string;
    nagadNumber: string;
    bkashType: string;
    nagadType: string;
    minDeposit: number;
    minWithdraw: number;
    feedActive: boolean;
    customFeedItems: string[];
  };
}

function loadDatabase(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.users)) {
        if (!parsed.deletedUsers) parsed.deletedUsers = [];
        return parsed;
      }
    } catch (e) {
      console.error('Error reading database file:', e);
    }
  }

  const initialDB: DatabaseSchema = {
    users: [],
    packages: DEFAULT_PACKAGES,
    banners: DEFAULT_BANNERS,
    tasks: DEFAULT_TASKS,
    transactions: [],
    supportMessages: [],
    feedItems: DEFAULT_FEED,
    deletedUsers: [],
    adminConfig: {
      adminPassword: 'admin',
      bkashNumber: '01812345678',
      nagadNumber: '01798765432',
      bkashType: 'Send Money (Personal)',
      nagadType: 'Send Money (Personal)',
      minDeposit: 500,
      minWithdraw: 200,
      feedActive: true,
      customFeedItems: [...DEFAULT_FEED],
    },
  };

  saveDatabase(initialDB);
  return initialDB;
}

let db = loadDatabase();

function saveDatabase(data?: DatabaseSchema) {
  try {
    const toSave = data || db;
    fs.writeFileSync(DB_FILE, JSON.stringify(toSave, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to database file:', err);
  }
}

// Automatic Live Feed Helper (Per user request: auto updates on deposit, withdraw, VIP, task, register)
function pushAutoLiveFeed(text: string) {
  if (!db.feedItems) db.feedItems = [];
  db.feedItems.unshift(text);
  if (db.feedItems.length > 60) {
    db.feedItems = db.feedItems.slice(0, 60);
  }
  saveDatabase();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. GET full state
  app.get('/api/state', (_req: Request, res: Response) => {
    res.json(db);
  });

  // 2. Register User
  app.post('/api/users/register', (req: Request, res: Response) => {
    const { phone, password, referralCode } = req.body;
    if (!phone || !password || !referralCode) {
      return res.status(400).json({ error: 'Missing required registration fields' });
    }

    const cleanPhone = phone.trim();
    const cleanRef = referralCode.trim().toUpperCase();

    // Check duplicate phone
    const existing = db.users.find((u) => u.phone === cleanPhone);
    if (existing) {
      return res.status(400).json({ error: 'এই নাম্বারে ইতিমধ্যে একাউন্ট রয়েছে!' });
    }

    // Check if phone was deleted by admin
    const isDeletedPhone = db.deletedUsers?.some(
      (d) => d.phone && d.phone.toLowerCase() === cleanPhone.toLowerCase()
    );
    if (isDeletedPhone) {
      return res.status(403).json({
        error: 'এই মোবাইল নাম্বারটি পূর্বে অ্যাডমিন কর্তৃক ডিলিট করা হয়েছে! এটি দিয়ে আর অ্যাকাউন্ট খোলা যাবে না।',
      });
    }

    // Check referrer: allow existing user by referral code, phone number, or user ID, or secret master code
    const isMasterCode = ['EARNLANCE', 'OFFICIAL', 'VIP100', 'ADMIN01'].includes(cleanRef);
    const referrer = db.users.find(
      (u) =>
        (u.referralCode && u.referralCode.toUpperCase() === cleanRef) ||
        (u.phone && u.phone.toUpperCase() === cleanRef) ||
        (u.id && u.id.toUpperCase() === cleanRef)
    );

    if (!referrer && !isMasterCode && db.users.length > 0) {
      return res.status(400).json({ error: 'ভুল রেফার কোড! সঠিক রেফার কোড দিন।' });
    }

    const newReferralCode = 'EL' + Math.floor(100000 + Math.random() * 900000);
    const newUser = {
      id: `user_${Date.now()}`,
      phone: cleanPhone,
      password,
      balance: 0,
      totalDeposit: 0,
      totalWithdraw: 0,
      totalEarned: 0,
      referralCode: newReferralCode,
      referredBy: referrer ? referrer.referralCode : cleanRef,
      activePackageId: null,
      purchasedPackageIds: [],
      packageActivatedAt: null,
      bkashNagadNumber: null,
      withdrawPassword: null,
      paymentMethod: null,
      paymentDetailsSet: false,
      tasksCompletedToday: 0,
      lastTaskTimestamp: null,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };

    db.users.unshift(newUser);

    // Auto Live Feed Event
    const masked = `${cleanPhone.slice(0, 3)}****${cleanPhone.slice(-3)}`;
    pushAutoLiveFeed(`${masked} New Member Joined`);
    saveDatabase();

    res.json({ success: true, user: newUser });
  });

  // 3. Login (Supports Phone, User ID, or Referral Code)
  app.post('/api/users/login', (req: Request, res: Response) => {
    const { phone, password } = req.body;
    const cleanIdentifier = (phone || '').trim();

    // Check if account was deleted by admin
    const isDeleted = db.deletedUsers?.some(
      (d) =>
        (d.phone && d.phone.toLowerCase() === cleanIdentifier.toLowerCase()) ||
        (d.id && d.id.toLowerCase() === cleanIdentifier.toLowerCase())
    );
    if (isDeleted) {
      return res.status(403).json({
        error: 'আপনার এই একাউন্টটি অ্যাডমিন কর্তৃক ডিলিট/মুছে ফেলা হয়েছে! আপনি আর লগইন করতে পারবেন না।',
      });
    }

    const user = db.users.find(
      (u) =>
        ((u.phone && u.phone.toLowerCase() === cleanIdentifier.toLowerCase()) ||
          (u.id && u.id.toLowerCase() === cleanIdentifier.toLowerCase()) ||
          (u.referralCode && u.referralCode.toLowerCase() === cleanIdentifier.toLowerCase())) &&
        u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: 'ভুল মোবাইল নাম্বার / ইউজার আইডি বা পাসওয়ার্ড।' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: 'আপনার একাউন্টটি সাময়িকভাবে ব্লক করা হয়েছে।' });
    }

    res.json({ success: true, user });
  });

  // 4. Update User
  app.put('/api/users/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    db.users[index] = { ...db.users[index], ...req.body };
    saveDatabase();
    res.json({ success: true, user: db.users[index] });
  });

  // 5. Block / Unblock User
  app.post('/api/users/toggle-block', (req: Request, res: Response) => {
    const { userId } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.isBlocked = !user.isBlocked;
    saveDatabase();
    res.json({ success: true, isBlocked: user.isBlocked, user });
  });

  // 6. Delete User
  app.post('/api/admin/delete-user', (req: Request, res: Response) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    const targetUser = db.users.find((u) => u.id === userId || u.phone === userId);
    if (targetUser) {
      if (!db.deletedUsers) db.deletedUsers = [];
      if (!db.deletedUsers.some((d) => d.id === targetUser.id || d.phone === targetUser.phone)) {
        db.deletedUsers.push({
          id: targetUser.id,
          phone: targetUser.phone,
          deletedAt: new Date().toISOString(),
        });
      }
      db.users = db.users.filter((u) => u.id !== targetUser.id && u.phone !== targetUser.phone);
      const masked = targetUser.phone.length > 6 ? `${targetUser.phone.slice(0, 3)}****${targetUser.phone.slice(-3)}` : targetUser.phone;
      pushAutoLiveFeed(`${masked} Account Deleted by Admin`);
    } else {
      db.users = db.users.filter((u) => u.id !== userId);
    }

    saveDatabase();
    res.json({ success: true, users: db.users, deletedUsers: db.deletedUsers });
  });

  // 6b. Admin Create User (No referral code required; automatically assigns unique referral code for user)
  app.post('/api/admin/create-user', (req: Request, res: Response) => {
    const { phone, password, balance, packageId } = req.body;
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, error: 'মোবাইল নাম্বার বা ইউজার আইডি লিখুন।' });
    }
    const cleanPhone = phone.trim();
    const cleanPassword = (password || '123456').trim();

    // Check duplicate phone or user ID safely
    const existing = db.users.find(
      (u) =>
        (u.phone && u.phone.toLowerCase() === cleanPhone.toLowerCase()) ||
        (u.id && u.id.toLowerCase() === cleanPhone.toLowerCase())
    );
    if (existing) {
      return res.status(400).json({ success: false, error: 'এই নাম্বার বা আইডিতে ইতিমধ্যে একাউন্ট রয়েছে!' });
    }

    // If this phone/id was previously deleted, remove it from deletedUsers list so the new account can log in smoothly
    if (db.deletedUsers && db.deletedUsers.length > 0) {
      db.deletedUsers = db.deletedUsers.filter(
        (d) =>
          d.phone?.toLowerCase() !== cleanPhone.toLowerCase() &&
          d.id?.toLowerCase() !== cleanPhone.toLowerCase()
      );
    }

    // Generate unique referral code for this user automatically
    let newReferralCode = 'EL' + Math.floor(100000 + Math.random() * 900000);
    while (db.users.some((u) => u.referralCode === newReferralCode)) {
      newReferralCode = 'EL' + Math.floor(100000 + Math.random() * 900000);
    }

    const initialBal = Math.max(0, Number(balance) || 0);

    // Selected package if any
    let activePkgId: string | null = null;
    let purchasedPkgs: string[] = [];
    let activatedAt: string | null = null;

    if (packageId) {
      const pkg = db.packages.find((p) => p.id === packageId);
      if (pkg) {
        activePkgId = pkg.id;
        purchasedPkgs = [pkg.id];
        activatedAt = new Date().toISOString();
      }
    }

    const newUser = {
      id: `user_${Date.now()}`,
      phone: cleanPhone,
      password: cleanPassword,
      balance: initialBal,
      totalDeposit: initialBal,
      totalWithdraw: 0,
      totalEarned: 0,
      referralCode: newReferralCode,
      referredBy: null, // Admin-created user: No referral code required!
      activePackageId: activePkgId,
      purchasedPackageIds: purchasedPkgs,
      packageActivatedAt: activatedAt,
      bkashNagadNumber: null,
      withdrawPassword: null,
      paymentMethod: null,
      paymentDetailsSet: false,
      tasksCompletedToday: 0,
      lastTaskTimestamp: null,
      isBlocked: false,
      createdAt: new Date().toISOString(),
    };

    db.users.unshift(newUser);

    // If initial balance was given, add a transaction record
    if (initialBal > 0) {
      db.transactions.unshift({
        id: `tx-init-${Date.now()}`,
        userId: newUser.id,
        userPhone: newUser.phone,
        type: 'deposit' as const,
        amount: initialBal,
        status: 'approved' as const,
        method: 'অ্যাডমিন প্রারম্ভিক ব্যালেন্স',
        accountNumber: 'Admin Panel',
        trxId: `ADMIN-INIT-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      });
    }

    // If package was assigned, add a package transaction record
    if (activePkgId) {
      const pkg = db.packages.find((p) => p.id === activePkgId);
      if (pkg) {
        db.transactions.unshift({
          id: `pkg-${Date.now()}`,
          userId: newUser.id,
          userPhone: newUser.phone,
          type: 'package_purchase' as const,
          amount: pkg.price,
          status: 'approved' as const,
          method: 'Wallet' as const,
          packageName: pkg.name,
          createdAt: new Date().toISOString(),
          note: 'অ্যাডমিন কর্তৃক ভিআইপি সক্রিয় করা হয়েছে',
        });
      }
    }

    // Auto Live Feed
    const masked = cleanPhone.length > 6 ? `${cleanPhone.slice(0, 3)}****${cleanPhone.slice(-3)}` : cleanPhone;
    pushAutoLiveFeed(`${masked} Account Created by Admin`);
    saveDatabase();

    res.json({
      success: true,
      user: newUser,
      users: db.users,
      transactions: db.transactions,
      deletedUsers: db.deletedUsers || [],
    });
  });

  // 7. Buy / Upgrade VIP Package
  app.post('/api/packages/purchase', (req: Request, res: Response) => {
    const { userId, packageId } = req.body;
    const user = db.users.find((u) => u.id === userId);
    const pkg = db.packages.find((p) => p.id === packageId);

    if (!user || !pkg) {
      return res.status(404).json({ error: 'User or package not found' });
    }

    if (!pkg.isActive) {
      return res.status(400).json({ error: 'এখনো চালু হয়নি, খুব শীঘ্রই এটা চালু করা হবে' });
    }

    // Already active package
    if (user.activePackageId === pkg.id) {
      return res.status(400).json({ error: 'এই প্যাকেজটি ইতিমধ্যে আপনার সক্রিয় রয়েছে।' });
    }

    const currentPkg = user.activePackageId
      ? db.packages.find((p) => p.id === user.activePackageId)
      : null;

    // Rule: Cannot downgrade from bigger package to smaller package
    if (currentPkg && pkg.price <= currentPkg.price) {
      return res.status(400).json({
        error: 'বড় প্যাকেজ থেকে ছোট প্যাকেজ কেনা সম্ভব নয়। আপনি শুধুমাত্র উচ্চতর (বড়) প্যাকেজে আপগ্রেড করতে পারবেন।',
      });
    }

    // Rule: When buying another package with an active package, old package is auto stopped and its price is refunded to balance
    const refundAmount = currentPkg ? currentPkg.price : 0;
    const availableBalance = user.balance + refundAmount;

    if (availableBalance < pkg.price) {
      const shortage = pkg.price - availableBalance;
      return res.status(400).json({
        error: `পর্যাপ্ত ব্যালেন্স নেই! আরও ৳${shortage} রিচার্জ বা ডিপোজিট করুন।`,
      });
    }

    // Terminate old package and refund its price into user balance
    if (currentPkg && refundAmount > 0) {
      user.balance += refundAmount;
      const refundTx = {
        id: `ref-${Date.now()}`,
        userId: user.id,
        userPhone: user.phone,
        type: 'package_refund' as const,
        amount: refundAmount,
        status: 'approved' as const,
        method: 'Wallet' as const,
        packageName: currentPkg.name,
        createdAt: new Date().toISOString(),
        note: `পূর্বের প্যাকেজ (${currentPkg.name}) বাতিল: ৳${refundAmount} মূল্যের সম্পূর্ণ রিফান্ড ব্যালেন্সে যোগ হয়েছে।`,
      };
      db.transactions.unshift(refundTx);
    }

    // Deduct new package price
    user.balance -= pkg.price;
    user.activePackageId = pkg.id;
    if (!user.purchasedPackageIds) user.purchasedPackageIds = [];
    if (!user.purchasedPackageIds.includes(pkg.id)) {
      user.purchasedPackageIds.push(pkg.id);
    }
    user.packageActivatedAt = new Date().toISOString();
    user.tasksCompletedToday = 0;

    const purchaseTx = {
      id: `pkg-${Date.now()}`,
      userId: user.id,
      userPhone: user.phone,
      type: 'package_purchase' as const,
      amount: pkg.price,
      status: 'approved' as const,
      method: 'Wallet' as const,
      packageName: pkg.name,
      createdAt: new Date().toISOString(),
      note: currentPkg
        ? `${currentPkg.name} থেকে ${pkg.name}-এ আপগ্রেড করা হয়েছে।`
        : undefined,
    };
    db.transactions.unshift(purchaseTx);

    // Auto Live Feed Event
    const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
    pushAutoLiveFeed(`${masked} ${pkg.name} Activated`);
    saveDatabase();

    res.json({
      success: true,
      user,
      refundedAmount: refundAmount,
      previousPackageName: currentPkg?.name,
    });
  });

  // 8. Complete Task / Daily Earning
  app.post('/api/tasks/complete', (req: Request, res: Response) => {
    const { userId } = req.body;
    const user = db.users.find((u) => u.id === userId);

    if (!user || !user.activePackageId) {
      return res.status(400).json({ error: 'Active package required' });
    }

    const pkg = db.packages.find((p) => p.id === user.activePackageId);
    if (!pkg) {
      return res.status(400).json({ error: 'Package details not found' });
    }

    const nextTasks = (user.tasksCompletedToday || 0) + 1;
    if (nextTasks >= 5) {
      user.tasksCompletedToday = 5;
      user.lastTaskTimestamp = Date.now();
      user.balance += pkg.dailyIncome;
      user.totalEarned += pkg.dailyIncome;

      const tx = {
        id: `inc-${Date.now()}`,
        userId: user.id,
        userPhone: user.phone,
        type: 'task_income',
        amount: pkg.dailyIncome,
        status: 'approved',
        method: 'Wallet',
        createdAt: new Date().toISOString(),
      };
      db.transactions.unshift(tx);

      // Auto Live Feed Event
      const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
      pushAutoLiveFeed(`${masked} Daily Task Income ৳${pkg.dailyIncome} Credited`);
    } else {
      user.tasksCompletedToday = nextTasks;
    }

    saveDatabase();
    res.json({ success: true, user });
  });

  // 9. Deposit Request
  app.post('/api/transactions/deposit', (req: Request, res: Response) => {
    const { userId, amount, method, senderNumber, trxId } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tx = {
      id: `dep-${Date.now()}`,
      userId: user.id,
      userPhone: user.phone,
      type: 'deposit',
      amount: Number(amount),
      status: 'pending',
      method,
      accountNumber: senderNumber,
      trxId,
      createdAt: new Date().toISOString(),
    };

    db.transactions.unshift(tx);

    const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
    pushAutoLiveFeed(`${masked} ${Number(amount).toLocaleString()} TK Deposit`);
    saveDatabase();

    res.json({ success: true, transaction: tx });
  });

  // 10. Withdraw Request
  app.post('/api/transactions/withdraw', (req: Request, res: Response) => {
    const { userId, amount, withdrawPassword } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.withdrawPassword !== withdrawPassword) {
      return res.status(400).json({ error: 'ভুল উইথড্র পাসওয়ার্ড!' });
    }

    const numAmount = Number(amount);
    if (user.balance < numAmount) {
      return res.status(400).json({ error: 'অপর্যাপ্ত ব্যালেন্স!' });
    }

    user.balance -= numAmount;

    const tx = {
      id: `wth-${Date.now()}`,
      userId: user.id,
      userPhone: user.phone,
      type: 'withdraw',
      amount: numAmount,
      status: 'pending',
      method: user.paymentMethod || 'bKash',
      accountNumber: user.bkashNagadNumber || user.phone,
      createdAt: new Date().toISOString(),
    };

    db.transactions.unshift(tx);

    const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
    pushAutoLiveFeed(`${masked} ${numAmount.toLocaleString()} TK Withdraw`);
    saveDatabase();

    res.json({ success: true, transaction: tx, user });
  });

  // 11. Approve / Reject Transaction
  app.post('/api/transactions/status', (req: Request, res: Response) => {
    const { txId, status } = req.body;
    const tx = db.transactions.find((t) => t.id === txId);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    if (tx.status === status) {
      return res.json({ success: true, transaction: tx, users: db.users });
    }

    const prevStatus = tx.status;
    tx.status = status;
    const user = db.users.find((u) => u.id === tx.userId);

    if (user) {
      if (tx.type === 'deposit') {
        if (status === 'approved' && prevStatus !== 'approved') {
          user.balance += tx.amount;
          user.totalDeposit += tx.amount;
          const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
          pushAutoLiveFeed(`${masked} ${tx.amount.toLocaleString()} TK Deposit Approved`);
        } else if (status === 'rejected' && prevStatus === 'approved') {
          user.balance = Math.max(0, user.balance - tx.amount);
          user.totalDeposit = Math.max(0, user.totalDeposit - tx.amount);
        }
      } else if (tx.type === 'withdraw') {
        if (status === 'approved' && prevStatus !== 'approved') {
          user.totalWithdraw += tx.amount;
          const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
          pushAutoLiveFeed(`${masked} ${tx.amount.toLocaleString()} TK Withdraw Sent`);
        } else if (status === 'rejected' && prevStatus !== 'rejected') {
          // Refund user balance if withdrawal was rejected
          user.balance += tx.amount;
          if (prevStatus === 'approved') {
            user.totalWithdraw = Math.max(0, user.totalWithdraw - tx.amount);
          }
        }
      }
    }

    saveDatabase();
    res.json({ success: true, transaction: tx, users: db.users, user });
  });

  // Admin Manual Balance Adjust (Add or Deduct money from any user account)
  app.post('/api/admin/user/balance', (req: Request, res: Response) => {
    const { userId, amount, action, note } = req.body;
    const user = db.users.find((u) => u.id === userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const numAmount = Math.abs(Number(amount));
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'সঠিক টাকার পরিমাণ দিন' });
    }

    if (action === 'add') {
      user.balance += numAmount;
      user.totalDeposit += numAmount;

      const tx = {
        id: `tx-adm-${Date.now()}`,
        userId: user.id,
        userPhone: user.phone,
        type: 'deposit' as const,
        amount: numAmount,
        status: 'approved' as const,
        method: 'অ্যাডমিন ব্যালেন্স ক্রেডিট',
        accountNumber: 'Admin Panel',
        trxId: note ? `ADMIN: ${note}` : `ADMIN-ADD-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      };
      db.transactions.unshift(tx);

      const masked = `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}`;
      pushAutoLiveFeed(`${masked} ${numAmount.toLocaleString()} TK Balance Added`);
    } else if (action === 'deduct') {
      user.balance = Math.max(0, user.balance - numAmount);

      const tx = {
        id: `tx-adm-${Date.now()}`,
        userId: user.id,
        userPhone: user.phone,
        type: 'withdraw' as const,
        amount: numAmount,
        status: 'approved' as const,
        method: 'অ্যাডমিন ব্যালেন্স কর্তন',
        accountNumber: 'Admin Panel',
        trxId: note ? `ADMIN: ${note}` : `ADMIN-DEDUCT-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
      };
      db.transactions.unshift(tx);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    saveDatabase();
    res.json({ success: true, user, users: db.users, transactions: db.transactions });
  });

  // 12. Admin Config Update
  app.post('/api/admin/config', (req: Request, res: Response) => {
    db.adminConfig = { ...db.adminConfig, ...req.body };
    saveDatabase();
    res.json({ success: true, adminConfig: db.adminConfig });
  });

  // 13. Admin Packages Update
  app.post('/api/admin/packages', (req: Request, res: Response) => {
    db.packages = req.body.packages;
    saveDatabase();
    res.json({ success: true, packages: db.packages });
  });

  // 14. Admin Banners Update
  app.post('/api/admin/banners', (req: Request, res: Response) => {
    db.banners = req.body.banners;
    saveDatabase();
    res.json({ success: true, banners: db.banners });
  });

  // 15. Admin Tasks Update
  app.post('/api/admin/tasks', (req: Request, res: Response) => {
    db.tasks = req.body.tasks;
    saveDatabase();
    res.json({ success: true, tasks: db.tasks });
  });

  // 16. Admin Users Update
  app.post('/api/admin/users', (req: Request, res: Response) => {
    db.users = req.body.users;
    saveDatabase();
    res.json({ success: true, users: db.users });
  });

  // 17. Support Messages
  app.post('/api/support/message', (req: Request, res: Response) => {
    const { userId, text, sender } = req.body;
    const msg = {
      id: `msg-${Date.now()}`,
      userId,
      text,
      sender: sender || 'user',
      createdAt: new Date().toISOString(),
      read: false,
    };
    db.supportMessages.push(msg);
    saveDatabase();
    res.json({ success: true, message: msg });
  });

  // Vite Integration for Dev and Production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Earnlance BD Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
