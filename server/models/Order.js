import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: String,
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  size: String,
  image: String,
  farmId: String,
  farmName: String,
  sellerId: String
}, { _id: false });

const timelineStepSchema = new mongoose.Schema({
  title: String,
  time: String,
  completed: Boolean,
  active: Boolean
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  customerName: String,
  customerEmail: String,
  date: String,
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Confirmed' 
  },
  sellerStatus: { type: String, default: 'Confirmed' },
  estimatedDelivery: String,
  timeSlot: String,
  items: [orderItemSchema],
  deliveryAddress: {
    name: String,
    phone: String,
    house: String,
    street: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
    instructions: String,
    dropInstruction: String
  },
  paymentMethod: { type: String, default: 'Online UPI' },
  paymentStatus: { type: String, default: 'Paid' },
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  bottleDeposit: { type: Number, default: 0 },
  total: { type: Number, required: true },
  deliveryPartner: {
    id: String,
    name: String,
    phone: String,
    route: String,
    vehicle: String
  },
  timeline: [timelineStepSchema],
  bottlesReturned: { type: Number, default: 0 },
  walletCreditPending: { type: Number, default: 0 },
  dropPhoto: String,
  partnerNotes: String,
  silentDeliveryVerified: { type: Boolean, default: true },
  deliveredAt: String,
  cancelledAt: String
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
