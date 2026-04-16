const router    = require('express').Router();
const Itinerary = require('../models/Itinerary');

router.get('/', async (req, res) => {
  try {
    const data = await Itinerary.find();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await Itinerary.findOne({
      $or: [{ id: req.params.id }, { tripId: req.params.id }]
    });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const data = await Itinerary.create(req.body);
    res.status(201).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await Itinerary.findOneAndUpdate(
      { id: req.params.id }, req.body, { new: true }
    );
    res.json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Itinerary.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;