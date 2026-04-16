const mongoose = require('mongoose');

// Individual user rating entry
const UserRatingSchema = new mongoose.Schema({
  userId:     String,
  travelType: String,   // romantic | solo | family | friends | pilgrim | adventure | luxury
  rating:     { type: Number, min: 1, max: 5 },
  bookingId:  String,
  createdAt:  { type: Date, default: Date.now },
});

// Per-category rating averages (auto-recalculated on each new rating)
const CategoryRatingsSchema = new mongoose.Schema({
  romantic:  { type: Number, default: 4.5 },
  solo:      { type: Number, default: 4.5 },
  family:    { type: Number, default: 4.5 },
  friends:   { type: Number, default: 4.5 },
  pilgrim:   { type: Number, default: 4.5 },
  adventure: { type: Number, default: 4.5 },
  luxury:    { type: Number, default: 4.5 },
}, { _id: false });

const HotelOptionSchema = new mongoose.Schema({
  id:             String,
  name:           String,
  location:       String,
  type:           String,
  rating:         { type: Number, default: 4.5 },  // overall rating
  reviewCount:    { type: Number, default: 0 },
  pricePerNight:  Number,
  currency:       String,
  tier:           { type: String, enum: ['budget', 'midrange', 'luxury'] },
  tag:            String,
  amenities:      [String],
  image:          String,
  checkInTime:    String,
  checkOutTime:   String,
  highlights:     String,

  // ── NEW FIELDS ──
  tags:            { type: [String], default: [] },
  // e.g. ['Romantic', 'Children Friendly', 'Solo Friendly',
  //        'Wellness & Spa', 'Adventure Base', 'Spiritual Retreat',
  //        'Ultra Luxury', 'Workation Friendly', 'Pet Friendly']

  categoryRatings: { type: CategoryRatingsSchema, default: () => ({}) },
  // Stores average rating per travel type

  userRatings:     { type: [UserRatingSchema], default: [] },
  // Individual rating entries from users
});

const HotelSchema = new mongoose.Schema({
  destCode: { type: String, required: true, unique: true },
  hotels:   [HotelOptionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Hotel', HotelSchema);
