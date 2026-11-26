import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  brand: String,
  image: String,
  size: { type: String, default: '1 L' },
  quantity: { type: Number, default: 1 },
  frequency: { 
    type: String, 
    enum: ['Daily', 'Alternate Days', 'Weekdays', 'Custom'],
    default: 'Daily' 
  },
  pricePerDay: Number,
  originalPricePerDay: Number,
  status: { 
    type: String, 
    enum: ['Active', 'Paused', 'Cancelled'],
    default: 'Active' 
  },
  nextDeliveryDate: String,
  timeSlot: String,
  deliveryAddress: String,
  startDate: String,
  totalDeliveriesDone: { type: Number, default: 0 },
  bottlesPendingReturn: { type: Number, default: 0 },
  customSchedule: mongoose.Schema.Types.Mixed,
  doorstepInstructions: String
}, {
  timestamps: true
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
