const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/trips',        require('./routes/trips'));
app.use('/api/flights',      require('./routes/flights'));
app.use('/api/hotels',       require('./routes/hotels'));
app.use('/api/itineraries',  require('./routes/itineraries'));
app.use('/api/bookings',     require('./routes/bookings'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'TripWeave API running', version: '1.0' });
});

// Connect DB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });