const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  id:            { type: String, required: true, unique: true },
  destinationId: { type: String, required: true },
  name:          { type: String, required: true },
  subtitle:      String,
  duration: {
    days:   Number,
    nights: Number,
  },
  travelType:  String,
  budgetRange: {
    min:      Number,
    max:      Number,
    currency: String,
    perPerson: Boolean,
  },
  highlights:     [String],
  itineraryId:    String,
  flightRouteCode:String,
  hotelDestCode:  String,
  tags:           [String],
  rating:         Number,
  badge:          String,
  image:          String,
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);