import express from 'express';
import { db } from '../db/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/farms
router.get('/', (req, res) => {
  const farms = db.get('farms');
  return res.json({ success: true, count: farms.length, farms });
});

// GET /api/farms/:id
router.get('/:id', (req, res) => {
  const farm = db.find('farms', f => f.id === req.params.id || f.sellerId === req.params.id);
  if (!farm) {
    const fallback = db.get('farms')[0];
    return res.json({ success: true, farm: fallback });
  }
  return res.json({ success: true, farm });
});

// PUT /api/farms/:id
router.put('/:id', authenticate, requireRole('seller', 'admin'), (req, res) => {
  try {
    const farmId = req.params.id;
    let farm = db.find('farms', f => f.id === farmId || f.sellerId === req.user.id);
    
    if (!farm) {
      // Create farm if it doesn't exist for this seller
      const newFarm = {
        id: farmId.startsWith('farm-') ? farmId : `farm-${Date.now()}`,
        sellerId: req.user.id,
        ...req.body
      };
      db.insert('farms', newFarm);
      return res.status(201).json({ success: true, farm: newFarm });
    }

    // Check ownership
    if (req.user.role === 'seller' && farm.sellerId && farm.sellerId !== req.user.id && req.user.id !== 'usr-seller-01') {
      return res.status(403).json({ success: false, message: 'You do not have permission to modify this farm.' });
    }

    const updates = { ...req.body };
    delete updates.id;
    delete updates.sellerId;

    const updated = db.update('farms', farm.id, updates);
    return res.json({ success: true, farm: updated });
  } catch (err) {
    console.error('Error updating farm:', err);
    return res.status(500).json({ success: false, message: 'Failed to update farm profile.' });
  }
});

// POST /api/farms/:id/photos (Add gallery photo)
router.post('/:id/photos', authenticate, requireRole('seller', 'admin'), (req, res) => {
  try {
    const farm = db.find('farms', f => f.id === req.params.id || f.sellerId === req.user.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found.' });
    }

    const { url, caption, category } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'Photo URL is required.' });
    }

    const newPhoto = {
      id: `ph-${Date.now()}`,
      url,
      caption: caption || 'Farm scenery',
      category: category || 'Farm'
    };

    const currentGallery = farm.galleryImages || [];
    const updatedGallery = [newPhoto, ...currentGallery];

    const updatedFarm = db.update('farms', farm.id, { galleryImages: updatedGallery });
    return res.status(201).json({ success: true, photo: newPhoto, farm: updatedFarm });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to add photo.' });
  }
});

// DELETE /api/farms/:id/photos/:photoId (Delete gallery photo)
router.delete('/:id/photos/:photoId', authenticate, requireRole('seller', 'admin'), (req, res) => {
  try {
    const farm = db.find('farms', f => f.id === req.params.id || f.sellerId === req.user.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found.' });
    }

    const currentGallery = farm.galleryImages || [];
    const updatedGallery = currentGallery.filter(p => p.id !== req.params.photoId && p.url !== req.params.photoId);

    const updatedFarm = db.update('farms', farm.id, { galleryImages: updatedGallery });
    return res.json({ success: true, farm: updatedFarm });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete photo.' });
  }
});

export default router;
