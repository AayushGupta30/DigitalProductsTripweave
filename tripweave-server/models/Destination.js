const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  country:     { type: String, required: true },
  region:      { type: String, enum: ['domestic','international'] },
  tagline:     String,
  description: String,
  image:       String,
  tags:        [String],
  travelTypes: [String],
  rating:      Number,
  reviewCount: Number,
  trending:    Boolean,
  featured:    Boolean,
  climate:     String,
  bestMonths:  [String],
  language:    String,
  currency:    String,
  timezone:    String,
  mustVisit:   [String],
  cuisine:     [String],
  tripIds:     [String],
}, { timestamps: true });

module.exports = mongoose.model('Destination', DestinationSchema);