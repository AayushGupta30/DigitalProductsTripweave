const router    = require('express').Router();
const Analytics = require('../models/Analytics');

// Log an event
router.post('/', async (req, res) => {
  try {
    const event = await Analytics.create(req.body);
    res.status(201).json(event);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Get all events (admin)
router.get('/', async (req, res) => {
  try {
    const events = await Analytics.find().sort({ timestamp: -1 }).limit(500);
    res.json(events);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Aggregated stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalEvents,
      destinationClicks,
      plannerStarts,
      plannerCompletes,
      tripViews,
      tripBooks,
      signups,
    ] = await Promise.all([
      Analytics.countDocuments(),
      Analytics.countDocuments({ event: 'destination_click' }),
      Analytics.countDocuments({ event: 'planner_start' }),
      Analytics.countDocuments({ event: 'planner_complete' }),
      Analytics.countDocuments({ event: 'trip_view' }),
      Analytics.countDocuments({ event: 'trip_book' }),
      Analytics.countDocuments({ event: 'signup' }),
    ]);

    // Top destinations
    const topDests = await Analytics.aggregate([
      { $match: { event: 'destination_click' } },
      { $group: { _id: '$data.destinationName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Top trips viewed
    const topTrips = await Analytics.aggregate([
      { $match: { event: 'trip_view' } },
      { $group: { _id: '$data.tripName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Drop-off rate
    const dropOffRate = plannerStarts > 0
      ? Math.round(((plannerStarts - plannerCompletes) / plannerStarts) * 100)
      : 0;

    // Travel type breakdown
    const travelTypes = await Analytics.aggregate([
      { $match: { event: 'planner_complete' } },
      { $group: { _id: '$data.travelType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalEvents,
      destinationClicks,
      plannerStarts,
      plannerCompletes,
      tripViews,
      tripBooks,
      signups,
      dropOffRate,
      topDestinations: topDests,
      topTrips,
      travelTypes,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;