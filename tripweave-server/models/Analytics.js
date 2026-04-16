const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  event:       { type: String, required: true },
  // e.g. 'destination_click', 'planner_start', 'planner_complete',
  //      'trip_view', 'trip_book', 'signup'
  userId:      String,   // null if not logged in
  sessionId:   String,   // browser session ID
  data: {
    destinationId:  String,
    destinationName:String,
    tripId:         String,
    tripName:       String,
    travelType:     String,
    page:           String,
    extra:          mongoose.Schema.Types.Mixed,
  },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: false });

module.exports = mongoose.model('Analytics', AnalyticsSchema);