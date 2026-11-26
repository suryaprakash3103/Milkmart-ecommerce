import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  author: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: String,
  comment: String,
  verifiedBuyer: { type: Boolean, default: true },
  helpfulVotes: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Review = mongoose.model('Review', reviewSchema);
