const router  = require('express').Router();
const Booking = require('../models/Booking');

router.get('/', async (req, res) => {
  try {
    const data = await Booking.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:bookingId', async (req, res) => {
  try {
    const data = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const data = await Booking.create(req.body);
    res.status(201).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:bookingId', async (req, res) => {
  try {
    const data = await Booking.findOneAndUpdate(
      { bookingId: req.params.bookingId }, req.body, { new: true }
    );
    res.json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;