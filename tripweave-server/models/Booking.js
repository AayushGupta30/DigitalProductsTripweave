const mongoose = require('mongoose');

const TravelerSchema = new mongoose.Schema({
  type:     String,
  name:     String,
  age:      Number,
  passport: String,
});

const BookingSchema = new mongoose.Schema({
  bookingId:   { type: String, required: true, unique: true },
  status:      { type: String, enum: ['Confirmed','Pending','Cancelled'], default: 'Pending' },
  tripId:      String,
  destination: String,
  user: {
    name:  String,
    email: String,
    phone: String,
    userId: String, 
  },
  travelers:    mongoose.Schema.Types.Mixed,  // accepts both number AND array
travelerCount: Number,
  dates: {
    departure: String,
    return:    String,
    nights:    Number,
  },
  flight: {
    outbound: mongoose.Schema.Types.Mixed,
    return:   mongoose.Schema.Types.Mixed,
  },
  hotel:    mongoose.Schema.Types.Mixed,
  payment: {
    method:        String,
    totalCharged:  Number,
    currency:      { type: String, default: 'INR' },
    transactionId: String,
    last4:         String,
    upiId:         String,
  },
  rewards: {
    program:      String,
    pointsEarned: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);