const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  time:  String,
  name:  String,
  type:  String,
  duration: String,
  cost:  Number,
  notes: String,
});

const DaySchema = new mongoose.Schema({
  dayNumber:    Number,
  title:        String,
  theme:        String,
  isTopRated:   Boolean,
  activities:   [ActivitySchema],
  totalDayCost: Number,
  travelTime:   String,
  note:         String,
});

const ItinerarySchema = new mongoose.Schema({
  id:          { type: String, required: true, unique: true },
  tripId:      { type: String, required: true },
  destination: String,
  totalDays:   Number,
  summary:     String,
  days:        [DaySchema],
  totalEstimatedCost: {
    activities: Number,
    perPerson:  Boolean,
    excludes:   String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', ItinerarySchema);