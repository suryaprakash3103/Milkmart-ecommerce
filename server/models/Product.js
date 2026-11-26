import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, lowercase: true },
  brand: { type: String, default: 'Artisan Farmstead Dairy' },
  sellerId: { type: String, default: 'usr-seller-01' },
  farmId: { type: String, default: 'farm-gir-amrit' },
  farmName: { type: String, default: 'Gir Amrit Organic Gaushala' },
  farmLocation: { type: String, default: 'Coimbatore, Tamil Nadu' },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  size: { type: String, default: '1 L' },
  unit: { type: String, default: 'L' },
  availableSizes: [{
    size: String,
    price: Number,
    originalPrice: Number
  }],
  stock: { type: Number, default: 50 },
  reservedStock: { type: Number, default: 0 },
  availableStock: { type: Number, default: 50 },
  lowStockThreshold: { type: Number, default: 15 },
  minOrderQty: { type: Number, default: 1 },
  maxOrderQty: { type: Number, default: 10 },
  image: { type: String, default: '/images/products/milk-a2.jpg' },
  additionalImages: [String],
  freshness: { type: String, default: 'Fresh Today' },
  shelfLife: { type: String, default: '2-3 Days (Store below 4°C)' },
  storageInstructions: { type: String, default: 'Keep refrigerated at 3°C - 4°C.' },
  ingredients: { type: String, default: '100% Pure Raw Cow Milk' },
  nutritionalInfo: {
    calories: String,
    protein: String,
    fat: String,
    calcium: String
  },
  fatContent: { type: String, default: '4.8% Natural Fat' },
  snf: { type: String, default: '8.9%' },
  hsnCode: { type: String, default: '0401' },
  gstRate: { type: Number, default: 0 },
  coldChain: { type: String, default: 'Chilled at 3.8°C' },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 1 },
  availability: { type: String, default: 'In Stock' },
  approvalStatus: { 
    type: String, 
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'approved' 
  },
  rejectionReason: String,
  isSubscribable: { type: Boolean, default: true },
  tags: [String]
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', productSchema);
