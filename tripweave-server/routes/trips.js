const router = require('express').Router();
const Trip   = require('../models/Trip');

router.get('/', async (req, res) => {
  try {
    const { travelType, destinationId } = req.query;
    const filter = {};
    if (travelType)    filter.travelType    = travelType;
    if (destinationId) filter.destinationId = destinationId;
    const data = await Trip.find(filter);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await Trip.findOne({ id: req.params.id });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const data = await Trip.create(req.body);
    res.status(201).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await Trip.findOneAndUpdate(
      { id: req.params.id }, req.body, { new: true }
    );
    res.json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Trip.findOneAndDelete({ id: req.params.id });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;