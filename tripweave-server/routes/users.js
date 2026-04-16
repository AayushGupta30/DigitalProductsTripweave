const router  = require('express').Router();
const User    = require('../models/User');


// Google / Firebase login — called after Firebase auth on frontend
router.post('/firebase-auth', async (req, res) => {
  try {
    const { firebaseUid, email, name, photoURL, authProvider } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ error: 'firebaseUid and email are required' });
    }

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ firebaseUid }, { email }]
    });

    if (user) {
      // Existing user — update Firebase fields in case they changed
      user.firebaseUid = firebaseUid;
      user.googleName  = name;
      user.googlePhoto = photoURL;
      await user.save();

      return res.json({
        _id:          user._id,
        name:         user.name,
        email:        user.email,
        googlePhoto:  user.googlePhoto,
        gender:       user.gender,
        ageGroup:     user.ageGroup,
        country:      user.country,
        isNewUser:    false,
        personaComplete: !!(user.gender && user.ageGroup && user.country),
      });
    }

    // New user — create with Google data, persona to be filled
    user = await User.create({
      firebaseUid,
      email,
      name:         name || email.split('@')[0],
      googleName:   name,
      googlePhoto:  photoURL,
      authProvider: authProvider || 'google',
      country:      'India', // default
    });

    return res.status(201).json({
      _id:          user._id,
      name:         user.name,
      email:        user.email,
      googlePhoto:  user.googlePhoto,
      gender:       user.gender,
      ageGroup:     user.ageGroup,
      country:      user.country,
      isNewUser:    true,
      personaComplete: false,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update persona details
router.put('/:id/persona', async (req, res) => {
  try {
    const { gender, ageGroup, country, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { gender, ageGroup, country, phone },
      { new: true }
    );
    res.json({
      _id:      user._id,
      name:     user.name,
      email:    user.email,
      googlePhoto: user.googlePhoto,
      gender:   user.gender,
      ageGroup: user.ageGroup,
      country:  user.country,
      phone:    user.phone,
      personaComplete: !!(user.gender && user.ageGroup && user.country),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Register
router.post('/register', async (req, res) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create(req.body);
    res.status(201).json({
      _id:    user._id,
      name:   user.name,
      email:  user.email,
      phone:  user.phone,
      gender: user.gender,
      ageGroup: user.ageGroup,
      country:  user.country,
    });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Login (simple — no JWT for demo, just email match)
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      _id:    user._id,
      name:   user.name,
      email:  user.email,
      phone:  user.phone,
      gender: user.gender,
      ageGroup: user.ageGroup,
      country:  user.country,
      travelPersona: user.travelPersona,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get all users (admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update user persona
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Save a trip
router.post('/:id/save-trip', async (req, res) => {
  try {
    const { tripId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { savedTrips: tripId } },
      { new: true }
    );
    res.json({ savedTrips: user.savedTrips });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Unsave a trip
router.delete('/:id/save-trip/:tripId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { savedTrips: req.params.tripId } },
      { new: true }
    );
    res.json({ savedTrips: user.savedTrips });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Get saved trips for a user
router.get('/:id/saved-trips', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ savedTrips: user?.savedTrips || [] });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;