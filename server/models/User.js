import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  id: String,
  tag: { type: String, default: 'Home' },
  isDefault: { type: Boolean, default: false },
  name: String,
  phone: String,
  house: String,
  street: String,
  area: String,
  city: { type: String, default: 'Bengaluru' },
  state: { type: String, default: 'Karnataka' },
  pincode: String,
  instructions: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['customer', 'seller', 'admin', 'delivery'],
    default: 'customer' 
  },
  name: { type: String, required: true },
  phone: { type: String, default: '+91 98000 00000' },
  avatar: { type: String, default: '/images/users/avatar.jpg' },
  walletBalance: { type: Number, default: 0 },
  bottlesReturnedTotal: { type: Number, default: 0 },
  savedAddresses: [addressSchema],
  
  // Seller / Farmer attributes
  farmId: String,
  farmName: String,
  location: String,
  district: String,
  state: String,
  pincode: String,
  sellerType: String,
  fssaiLicense: String,
  cattleCount: Number,
  dailyCapacityLiters: Number,
  
  // Delivery Partner attributes
  vehicleType: String,
  route: String,
  shift: String,
  completedDeliveries: { type: Number, default: 0 },
  bottlesCollectedCount: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  
  // Admin attributes
  department: String,
  assignedHub: String
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
