import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sellerId: String,
  userId: String,
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['order', 'warning', 'info', 'success', 'verified'],
    default: 'info' 
  },
  link: String,
  timestamp: String,
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);
