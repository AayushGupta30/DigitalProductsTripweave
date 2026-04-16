const router      = require('express').Router();
const Destination = require('../models/Destination');

// GET all
router.get('/', async (req, res) => {
  try {
    const { region, travelType, trending, featured } = req.query;
    const filter = {};
    if (region)     filter.region     = region;
    if (travelType) filter.travelTypes = travelType;
    if (trending)   filter.trending   = trending === 'true';
    if (featured)   filter.featured   = featured === 'true';
    const data = await Destination.find(filter);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET one
router.get('/:id', async (req, res) => {
  try {
    const data = await Destination.findOne({ id: req.params.id });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const data = await Destination.create(req.body);
    res.status(201).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const data = await Destination.findOneAndUpdate(
      { id: req.params.id }, req.body, { new: true }
    );
    res.json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Destination.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;