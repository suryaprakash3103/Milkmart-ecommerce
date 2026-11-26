import mongoose from 'mongoose';

const galleryPhotoSchema = new mongoose.Schema({
  id: String,
  url: { type: String, required: true },
  caption: String,
  category: { type: String, default: 'Farm' }
}, { _id: false });

const farmSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sellerId: { type: String, required: true },
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  description: { type: String, required: true },
  address: String,
  village: String,
  district: String,
  state: String,
  pincode: String,
  phone: String,
  email: String,
  farmType: { type: String, default: 'Organic & Natural' },
  productsProduced: [String],
  verificationStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Verified' 
  },
  rating: { type: Number, default: 5.0 },
  reviewCount: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  coverImage: { type: String, default: '/images/farms/cover-green-valley.jpg' },
  logo: { type: String, default: '/images/milk-bottle.svg' },
  galleryImages: [galleryPhotoSchema],
  fssaiLicense: String,
  cattleCount: { type: Number, default: 30 },
  dailyCapacityLiters: { type: Number, default: 250 }
}, {
  timestamps: true
});

export const Farm = mongoose.model('Farm', farmSchema);
