require('dotenv').config();
const mongoose    = require('mongoose');
const Destination = require('./models/Destination');
const Trip        = require('./models/Trip');
const Flight      = require('./models/Flight');
const Hotel       = require('./models/Hotel');
const Itinerary   = require('./models/Itinerary');
const Booking     = require('./models/Booking');

const destinations = require('./data/destinations.json');
const trips        = require('./data/trips.json');
const flightsRaw   = require('./data/flights.json');
const hotelsRaw    = require('./data/hotels.json');
const itineraries  = require('./data/itineraries.json');
const bookingsRaw  = require('./data/bookings.json');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Destination.deleteMany({}),
      Trip.deleteMany({}),
      Flight.deleteMany({}),
      Hotel.deleteMany({}),
      Itinerary.deleteMany({}),
      Booking.deleteMany({}),
    ]);
    console.log('🗑  Cleared existing collections');

    // Seed Destinations
    await Destination.insertMany(destinations);
    console.log(`✅ Seeded ${destinations.length} destinations`);

    // Seed Trips
    await Trip.insertMany(trips);
    console.log(`✅ Seeded ${trips.length} trips`);

    // Seed Flights — convert object to array with routeCode
    const flightsArray = Object.entries(flightsRaw)
      .filter(([key]) => !key.startsWith('_'))
      .map(([routeCode, value]) => ({ routeCode, ...value }));
    await Flight.insertMany(flightsArray);
    console.log(`✅ Seeded ${flightsArray.length} flight routes`);

    // Seed Hotels — convert object to array with destCode
    const hotelsArray = Object.entries(hotelsRaw)
      .map(([destCode, hotels]) => ({ destCode, hotels }));
    await Hotel.insertMany(hotelsArray);
    console.log(`✅ Seeded ${hotelsArray.length} hotel destinations`);

    // Seed Itineraries
    await Itinerary.insertMany(itineraries);
    console.log(`✅ Seeded ${itineraries.length} itineraries`);

    // Seed Bookings — use the bookings array from bookings.json
    const bookings = (bookingsRaw.bookings || []).map(b => ({
      ...b,
      travelerCount: Array.isArray(b.travelers) ? b.travelers.length : (b.travelers || 0),
    }));
    if (bookings.length > 0) {
      await Booking.insertMany(bookings);
      console.log(`✅ Seeded ${bookings.length} bookings`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('You can now run: npm run dev');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();