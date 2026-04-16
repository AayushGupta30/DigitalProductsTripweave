const router = require('express').Router();
const Hotel  = require('../models/Hotel');

// ── GET ALL — keyed by destCode ──
router.get('/', async (req, res) => {
  try {
    const data = await Hotel.find();
    const result = {};
    data.forEach(h => { result[h.destCode] = h.hotels; });
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET ONE DESTINATION ──
router.get('/:destCode', async (req, res) => {
  try {
    // Skip the /rate sub-route being caught here
    if (req.params.destCode === 'rate') return res.status(400).json({ error: 'Invalid destCode' });
    const data = await Hotel.findOne({ destCode: req.params.destCode.toUpperCase() });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data.hotels);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST CREATE ──
router.post('/', async (req, res) => {
  try {
    const data = await Hotel.create(req.body);
    res.status(201).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── PUT UPDATE ──
router.put('/:destCode', async (req, res) => {
  try {
    const data = await Hotel.findOneAndUpdate(
      { destCode: req.params.destCode.toUpperCase() },
      req.body,
      { new: true }
    );
    res.json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── DELETE ──
router.delete('/:destCode', async (req, res) => {
  try {
    await Hotel.findOneAndDelete({ destCode: req.params.destCode.toUpperCase() });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST RATE A HOTEL ──
// POST /api/hotels/:destCode/:hotelId/rate
// Body: { userId, travelType, rating (1-5), bookingId }
router.post('/:destCode/:hotelId/rate', async (req, res) => {
  try {
    const { destCode, hotelId } = req.params;
    const { userId, travelType, rating, bookingId } = req.body;

    // Validate
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    if (!travelType) {
      return res.status(400).json({ error: 'travelType is required' });
    }

    const dest = await Hotel.findOne({ destCode: destCode.toUpperCase() });
    if (!dest) return res.status(404).json({ error: 'Destination not found' });

    // Find the specific hotel in the hotels array
    const hotel = dest.hotels.id(hotelId) ||
                  dest.hotels.find(h => h.id === hotelId);

    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

    // Check if this user already rated this hotel for this booking
    const existingIdx = hotel.userRatings.findIndex(
      r => r.bookingId === bookingId && r.userId === userId
    );

    if (existingIdx !== -1) {
      // Update existing rating
      hotel.userRatings[existingIdx].rating     = rating;
      hotel.userRatings[existingIdx].travelType = travelType;
    } else {
      // Add new rating
      hotel.userRatings.push({ userId, travelType, rating, bookingId });
    }

    // Recalculate categoryRatings for this travelType
    const typeRatings = hotel.userRatings
      .filter(r => r.travelType === travelType)
      .map(r => r.rating);

    if (typeRatings.length > 0) {
      const avg = typeRatings.reduce((s, v) => s + v, 0) / typeRatings.length;
      hotel.categoryRatings[travelType] = Math.round(avg * 10) / 10;
    }

    // Also recalculate overall rating across all userRatings
    if (hotel.userRatings.length > 0) {
      const allRatings = hotel.userRatings.map(r => r.rating);
      hotel.rating = Math.round(
        (allRatings.reduce((s, v) => s + v, 0) / allRatings.length) * 10
      ) / 10;
      hotel.reviewCount = hotel.userRatings.length + (hotel.reviewCount || 0);
    }

    await dest.save();

    res.json({
      success:         true,
      hotelId,
      travelType,
      yourRating:      rating,
      categoryRating:  hotel.categoryRatings[travelType],
      overallRating:   hotel.rating,
      totalRatings:    hotel.userRatings.length,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET RATINGS FOR A HOTEL ──
// GET /api/hotels/:destCode/:hotelId/ratings
router.get('/:destCode/:hotelId/ratings', async (req, res) => {
  try {
    const { destCode, hotelId } = req.params;
    const dest = await Hotel.findOne({ destCode: destCode.toUpperCase() });
    if (!dest) return res.status(404).json({ error: 'Destination not found' });

    const hotel = dest.hotels.find(h => h.id === hotelId);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });

    res.json({
      hotelId,
      hotelName:       hotel.name,
      overallRating:   hotel.rating,
      categoryRatings: hotel.categoryRatings,
      totalUserRatings:hotel.userRatings.length,
      tags:            hotel.tags,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
