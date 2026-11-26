import express from 'express';
import { db } from '../db/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews
router.get('/', (req, res) => {
  const { productId } = req.query;
  let reviews = db.get('reviews');
  if (productId) {
    reviews = reviews.filter(r => r.productId === productId);
  }
  return res.json({ success: true, count: reviews.length, reviews });
});

// POST /api/reviews
router.post('/', optionalAuth, (req, res) => {
  try {
    const { productId, rating = 5, comment = "", author = "" } = req.body;
    const user = req.user;

    const newReview = {
      id: `rev-${Date.now()}`,
      productId: productId || 'prod-001',
      author: user?.name || author || 'Verified Customer',
      rating: Number(rating),
      date: new Date().toISOString().split('T')[0],
      comment,
      verifiedBuyer: true,
      helpfulVotes: 0
    };

    db.insert('reviews', newReview);

    // Update product rating and review count
    if (productId) {
      const prod = db.find('products', p => p.id === productId);
      if (prod) {
        const prodReviews = db.filter('reviews', r => r.productId === productId);
        const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        db.update('products', productId, {
          rating: Number(avgRating.toFixed(1)),
          reviewCount: prodReviews.length
        });
      }
    }

    return res.status(201).json({ success: true, review: newReview });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
});

export default router;
