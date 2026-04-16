const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Firebase fields
  firebaseUid:  { type: String, unique: true, sparse: true },
  googleEmail:  String,
  googleName:   String,
  googlePhoto:  String,
  authProvider: { type: String, default: 'google' }, // 'google' | 'email'

  // Core fields
  name:    { type: String, required: true },
  email:   { type: String, required: true, unique: true },
  phone:   String,

  // Persona fields (collected after Google login)
  gender:        { type: String, enum: ['Male','Female','Non-binary','Prefer not to say'] },
  ageGroup:      { type: String, enum: ['18-24','25-34','35-44','45-54','55+'] },
  country:       { type: String, default: 'India' },
  travelPersona: String,

  // App data
  savedTrips:       [String],
  plannerStarted:   { type: Number, default: 0 },
  plannerCompleted: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);