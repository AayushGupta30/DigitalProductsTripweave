const mongoose = require('mongoose');

const FlightOptionSchema = new mongoose.Schema({
  id:         String,
  airline:    String,
  flightNo:   String,
  departure:  String,
  arrival:    String,
  duration:   String,
  stops:      Number,
  stopAt:     String,
  price:      Number,
  class:      String,
  tag:        String,
  note:       String,
  smartPick:  Boolean,
});

const FlightSchema = new mongoose.Schema({
  routeCode:   { type: String, required: true, unique: true },
  origin:      String,
  destination: String,
  note:        String,
  outbound:    [FlightOptionSchema],
  return:      [FlightOptionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Flight', FlightSchema);