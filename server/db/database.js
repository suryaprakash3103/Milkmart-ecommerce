import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import seed datasets
import { mockUsers } from '../../src/data/mockUsers.js';
import { initialProducts } from '../../src/data/products.js';
import { initialFarms } from '../../src/data/mockFarms.js';
import { initialOrders } from '../../src/data/mockOrders.js';
import { initialSubscriptions } from '../../src/data/mockSubscriptions.js';
import { dairyCategories } from '../../src/data/categories.js';
import { initialReviews } from '../../src/data/mockReviews.js';
import { initialSellerNotifications } from '../../src/data/mockSellerNotifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

// Initial seeds for Batches, Payouts, Wallet, and Bottle Logs
const initialBatches = [
  {
    id: "BATCH-GIR-9042",
    sellerId: "usr-seller-01",
    farmName: "Gir Amrit Organic Gaushala",
    farmerName: "Devendra Patel",
    productName: "Farm Fresh A2 Gir Cow Raw Milk",
    date: new Date().toISOString().split('T')[0],
    milkingTime: "4:30 AM",
    litersDispatched: 320,
    fatPercentage: 4.8,
    snfPercentage: 8.9,
    chillerTemp: 3.6,
    somaticCellCount: "120,000 cells/ml (Premium Grade A)",
    adulterationTests: {
      urea: "Negative (Passed)",
      detergent: "Negative (Passed)",
      starch: "Negative (Passed)",
      waterAdded: "0% (Nil Added)",
      antibioticResidues: "Nil (100% Free)"
    },
    feedLog: "Free-grazing green Napier grass, Moringa leaves & organic barley fodder",
    cattleVaccinationStatus: "100% Verified Healthy • Bi-weekly Veterinary Inspection",
    labCertNumber: "FSSAI-NABL-KA-2026-9042",
    status: "Verified & Bottled for Sunrise Run"
  },
  {
    id: "BATCH-MURRAH-8810",
    sellerId: "usr-seller-01",
    farmName: "Gir Amrit Organic Gaushala",
    farmerName: "Devendra Patel",
    productName: "Creamy Buffalo Raw Whole Milk",
    date: new Date().toISOString().split('T')[0],
    milkingTime: "4:45 AM",
    litersDispatched: 180,
    fatPercentage: 7.4,
    snfPercentage: 9.3,
    chillerTemp: 3.7,
    somaticCellCount: "140,000 cells/ml (Grade A)",
    adulterationTests: {
      urea: "Negative (Passed)",
      detergent: "Negative (Passed)",
      starch: "Negative (Passed)",
      waterAdded: "0% (Nil Added)",
      antibioticResidues: "Nil"
    },
    feedLog: "Organic cotton seed mash, mineral lick blocks & green sorghum",
    cattleVaccinationStatus: "Verified Healthy",
    labCertNumber: "FSSAI-NABL-KA-2026-8810",
    status: "Verified & Bottled for Sunrise Run"
  }
];

const initialPayouts = [
  {
    id: "pay-501",
    sellerId: "usr-seller-01",
    date: "2026-09-28",
    amount: 18500,
    litersPaid: 272,
    avgFat: 4.8,
    ratePerLiter: 68.0,
    status: "Settled to Bank",
    bankRef: "HDFC-NEFT-99120412"
  },
  {
    id: "pay-502",
    sellerId: "usr-seller-01",
    date: "2026-09-21",
    amount: 21000,
    litersPaid: 310,
    avgFat: 4.75,
    ratePerLiter: 67.7,
    status: "Settled to Bank",
    bankRef: "HDFC-NEFT-88410293"
  }
];

const initialWalletTransactions = [
  {
    id: "tx-101",
    userId: "usr-cust-01",
    date: "2026-09-18 06:45 AM",
    type: "credit",
    amount: 20,
    title: "Empty Glass Bottle Return (2 bottles)",
    description: "Doorstep pickup by Ramesh Kumar • ₹10 per bottle refund",
    balanceAfter: 1250
  },
  {
    id: "tx-102",
    userId: "usr-cust-01",
    date: "2026-09-17 09:15 PM",
    type: "debit",
    amount: 220,
    title: "Order #MM-98241 Paid",
    description: "Farm Fresh A2 Gir Cow Milk (2L) + Set Dahi (500g)",
    balanceAfter: 1230
  },
  {
    id: "tx-103",
    userId: "usr-cust-01",
    date: "2026-09-15 10:00 AM",
    type: "credit",
    amount: 1000,
    title: "MilkMart Wallet Top-Up",
    description: "UPI Auto-load / Added funds",
    balanceAfter: 1450
  }
];

const initialBottleLogs = [
  {
    id: "bot-001",
    date: new Date().toISOString().split('T')[0],
    time: "06:12 AM",
    orderId: "MM-97910",
    partnerName: "Ramesh Kumar",
    partnerId: "usr-del-01",
    customerName: "Surya Prakash",
    customerAddress: "Flat 402, Green Meadows, HSR Layout",
    bottlesDelivered: 2,
    bottlesCollected: 2,
    creditGiven: 20,
    condition: "Rinsed & Intact",
    silentDelivery: true
  },
  {
    id: "bot-002",
    date: new Date().toISOString().split('T')[0],
    time: "06:25 AM",
    orderId: "MM-97880",
    partnerName: "Ramesh Kumar",
    partnerId: "usr-del-01",
    customerName: "Priya Sharma",
    customerAddress: "Flat 402, Green Glen Palms, Bellandur",
    bottlesDelivered: 1,
    bottlesCollected: 1,
    creditGiven: 10,
    condition: "Rinsed & Intact",
    silentDelivery: true
  }
];

const DEFAULT_SEEDS = {
  users: mockUsers,
  products: initialProducts,
  farms: initialFarms,
  orders: initialOrders,
  subscriptions: initialSubscriptions,
  categories: dairyCategories,
  reviews: initialReviews,
  notifications: initialSellerNotifications,
  batches: initialBatches,
  payouts: initialPayouts,
  wallet_tx: initialWalletTransactions,
  bottle_logs: initialBottleLogs
};

class Database {
  constructor() {
    this.memoryStore = {};
    this.ensureDataDirectory();
    this.init();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  getFilePath(collection) {
    return path.join(DATA_DIR, `${collection}.json`);
  }

  init() {
    for (const [collection, seedData] of Object.entries(DEFAULT_SEEDS)) {
      const filePath = this.getFilePath(collection);
      if (!fs.existsSync(filePath)) {
        this.atomicWrite(filePath, seedData);
        this.memoryStore[collection] = seedData;
      } else {
        try {
          const raw = fs.readFileSync(filePath, 'utf-8');
          this.memoryStore[collection] = JSON.parse(raw);
        } catch (e) {
          console.error(`Error loading collection ${collection}, re-seeding:`, e);
          this.atomicWrite(filePath, seedData);
          this.memoryStore[collection] = seedData;
        }
      }
    }
  }

  atomicWrite(filePath, data) {
    const tmpPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, filePath);
  }

  get(collection) {
    if (!this.memoryStore[collection]) {
      this.memoryStore[collection] = [];
    }
    return this.memoryStore[collection];
  }

  set(collection, data) {
    this.memoryStore[collection] = data;
    const filePath = this.getFilePath(collection);
    this.atomicWrite(filePath, data);
    return data;
  }

  find(collection, predicate) {
    const list = this.get(collection);
    return list.find(predicate) || null;
  }

  filter(collection, predicate) {
    const list = this.get(collection);
    return list.filter(predicate);
  }

  insert(collection, item, atBeginning = true) {
    const list = this.get(collection);
    const updated = atBeginning ? [item, ...list] : [...list, item];
    this.set(collection, updated);
    return item;
  }

  update(collection, id, updates) {
    const list = this.get(collection);
    const idx = list.findIndex(item => item.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.set(collection, list);
      return list[idx];
    }
    return null;
  }

  delete(collection, id) {
    const list = this.get(collection);
    const filtered = list.filter(item => item.id !== id);
    this.set(collection, filtered);
    return true;
  }
}

export const db = new Database();
