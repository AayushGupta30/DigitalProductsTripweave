const router = require('express').Router();
const Flight = require('../models/Flight');

router.get('/', async (req, res) => {
  try {
    const data = await Flight.find();
    // Return as object keyed by routeCode (same shape as original JSON)
    const result = {};
    data.forEach(f => { result[f.routeCode] = f; });
    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:routeCode', async (req, res) => {
  try {
    const data = await Flight.findOne({ routeCode: req.params.routeCode });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const data = await Flight.create(req.body);
    res.status(201).json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:routeCode', async (req, res) => {
  try {
    const data = await Flight.findOneAndUpdate(
      { routeCode: req.params.routeCode }, req.body, { new: true }
    );
    res.json(data);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:routeCode', async (req, res) => {
  try {
    await Flight.findOneAndDelete({ routeCode: req.params.routeCode });
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;