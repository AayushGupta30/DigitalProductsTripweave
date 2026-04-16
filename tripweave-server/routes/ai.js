const router = require('express').Router();

// ── MOCK LLM RESPONSE GENERATOR ──
// Structured exactly as a real OpenAI/Gemini response would look.
// Swap generateMockResponse() with a real API call when you have a key.

function buildPrompt(payload) {
  const {
    // Trip basics
    travelType, adults, children, duration, departure, destination,
    // Preferences
    interests, budget, accommodation, transport, tripVibe, activityLevel,
    // Advanced inputs
    mustVisit, exclusions, visaConstraints, specialRequirements,
    // User persona
    userPersona,
  } = payload;

  const totalTravelers = (adults || 2) + (children || 0);
  const days           = parseInt((duration || '7 Days').split(' ')[0]);

  return `
You are TripWeave's AI Travel Architect. Generate a complete, personalised travel itinerary.

## TRAVELER PROFILE
- Name: ${userPersona?.name || 'Guest'}
- Age Group: ${userPersona?.ageGroup || 'Not specified'}
- Gender: ${userPersona?.gender || 'Not specified'}
- Nationality / Region: ${userPersona?.country || 'India'}
- Travel Type: ${travelType}
- Group Size: ${adults} adult(s), ${children || 0} child(ren) = ${totalTravelers} total

## TRIP DETAILS
- Destination: ${destination || 'AI to suggest best match'}
- Duration: ${duration} (${days} days)
- Departure City: ${departure}
- Budget: ${budget?.label || 'Mid-range'} per person
- Accommodation: ${accommodation}
- Transport Preference: ${transport}
- Trip Vibe: ${tripVibe}
- Activity Level: ${activityLevel}

## INTERESTS
${(interests || []).length > 0 ? interests.join(', ') : 'No specific interests provided'}

## ADVANCED REQUIREMENTS
- Must-Visit Places: ${mustVisit || 'None specified'}
- Exclusions: ${exclusions || 'None'}
- Visa Constraints: ${visaConstraints || 'No'}
- Special Requirements: ${specialRequirements || 'None'}

## INSTRUCTIONS
Generate a detailed ${days}-day itinerary. Return ONLY valid JSON in this exact structure:
{
  "destination": "string",
  "tripTitle": "string",
  "tripSummary": "string (2-3 sentences)",
  "estimatedBudget": {
    "min": number,
    "max": number,
    "currency": "INR",
    "breakdown": {
      "flights": number,
      "accommodation": number,
      "activities": number,
      "food": number,
      "transport": number
    }
  },
  "days": [
    {
      "dayNumber": 1,
      "title": "string",
      "theme": "string",
      "activities": [
        {
          "time": "09:00",
          "name": "string",
          "type": "sightseeing | food | leisure | adventure | cultural | logistics",
          "duration": "string",
          "cost": number,
          "notes": "string"
        }
      ],
      "accommodation": "string",
      "meals": { "breakfast": "string", "lunch": "string", "dinner": "string" },
      "travelTip": "string"
    }
  ],
  "packingEssentials": ["string"],
  "bestTimeToVisit": "string",
  "localCuisineToTry": ["string"],
  "warnings": ["string"]
}
`.trim();
}

function generateMockResponse(payload) {
  const days     = parseInt((payload.duration || '7 Days').split(' ')[0]);
  const dest     = payload.destination || 'Goa, India';
  const budget   = payload.budget?.min || 30000;
  const isLuxury = payload.accommodation === 'Luxury' || payload.accommodation === 'Ultra Luxury';

  const activityTemplates = {
    sightseeing: ['Heritage walking tour', 'Local monument visit', 'Viewpoint exploration', 'Sunset point'],
    food:        ['Local breakfast', 'Street food trail', 'Fine dining experience', 'Food market walk'],
    leisure:     ['Beach time', 'Hotel pool relaxation', 'Spa session', 'Sunset cruise'],
    adventure:   ['Water sports', 'Trek to viewpoint', 'Kayaking', 'Zip-lining'],
    cultural:    ['Temple visit', 'Local craft workshop', 'Cultural show', 'Museum tour'],
    logistics:   ['Airport transfer', 'Check-in', 'Hotel transfer', 'Departure'],
  };

  const dayTitles = [
    'Arrival & First Impressions',
    'Deep Dive into Local Culture',
    'Adventure & Exploration',
    'Hidden Gems & Local Life',
    'Relaxation & Rejuvenation',
    'Off the Beaten Path',
    'Farewell & Last Memories',
  ];

  const generatedDays = Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    const isFirst = dayNum === 1;
    const isLast  = dayNum === days;

    const activities = isFirst
      ? [
          { time:'11:00', name:`Arrive in ${dest}`, type:'logistics', duration:'1h', cost:0, notes:'Check in and freshen up' },
          { time:'13:00', name:'Welcome lunch — local restaurant', type:'food', duration:'1.5h', cost:800, notes:'Try the local speciality' },
          { time:'15:30', name:'Orientation walk', type:'sightseeing', duration:'2h', cost:0, notes:'Get your bearings, explore nearby area' },
          { time:'19:30', name:'Welcome dinner', type:'food', duration:'2h', cost:isLuxury ? 3000 : 1200, notes:'Celebrate the start of your trip' },
        ]
      : isLast
      ? [
          { time:'08:00', name:'Final breakfast', type:'food', duration:'1h', cost:0, notes:'Included' },
          { time:'09:30', name:'Last-minute souvenir shopping', type:'leisure', duration:'2h', cost:1000, notes:'Pick up local specialities' },
          { time:'12:00', name:'Check-out & airport transfer', type:'logistics', duration:'1h', cost:500, notes:'Allow extra time for traffic' },
        ]
      : [
          { time:'08:00', name:'Breakfast', type:'food', duration:'45min', cost:0, notes:'Included at hotel' },
          { time:'09:30', name:`${activityTemplates.sightseeing[dayNum % 4]}`, type:'sightseeing', duration:'2h', cost:500, notes:`Day ${dayNum} highlight` },
          { time:'13:00', name:'Lunch', type:'food', duration:'1h', cost:700, notes:'Local restaurant recommendation' },
          { time:'15:00', name:`${activityTemplates[Object.keys(activityTemplates)[dayNum % 5]][dayNum % 4]}`, type:Object.keys(activityTemplates)[dayNum % 5], duration:'2.5h', cost:isLuxury ? 2500 : 800, notes:null },
          { time:'19:30', name:'Dinner', type:'food', duration:'1.5h', cost:isLuxury ? 2500 : 1000, notes:null },
        ];

    return {
      dayNumber:     dayNum,
      title:         dayTitles[i % dayTitles.length],
      theme:         isFirst ? 'Arrive and soak it all in' : isLast ? 'Last moments, lasting memories' : 'Explore and discover',
      activities,
      accommodation: isLuxury ? `5-star luxury hotel in ${dest}` : `Comfortable mid-range hotel in ${dest}`,
      meals: {
        breakfast: 'Hotel buffet',
        lunch:     'Local restaurant',
        dinner:    isLuxury ? 'Fine dining' : 'Restaurant recommended by concierge',
      },
      travelTip: [
        'Carry cash for local markets',
        'Book attractions in advance on weekends',
        'Best photo spots are early morning',
        'Try the local street food — it\'s safe and delicious',
        'Bargain at local markets — 30% off is standard',
      ][dayNum % 5],
    };
  });

  const flightCost  = Math.round(budget * 0.35 * 2);
  const hotelCost   = Math.round(budget * 0.40);
  const actCost     = Math.round(budget * 0.15);
  const foodCost    = Math.round(budget * 0.07);
  const transCost   = Math.round(budget * 0.03);

  return {
    destination:   dest,
    tripTitle:     `${payload.travelType?.charAt(0).toUpperCase()}${payload.travelType?.slice(1)} Escape to ${dest}`,
    tripSummary:   `A perfectly crafted ${days}-day ${payload.travelType} journey to ${dest}, tailored for ${payload.adults || 2} traveller(s). Balancing ${(payload.interests || ['exploration', 'culture']).slice(0,2).join(' and ')}, this itinerary is designed for a ${payload.tripVibe?.toLowerCase() || 'balanced'} pace with ${payload.activityLevel?.toLowerCase() || 'moderate'} activity levels.`,
    estimatedBudget: {
      min:      budget * (payload.adults || 2),
      max:      Math.round(budget * 1.3) * (payload.adults || 2),
      currency: 'INR',
      breakdown: {
        flights:       flightCost,
        accommodation: hotelCost,
        activities:    actCost,
        food:          foodCost,
        transport:     transCost,
      },
    },
    days: generatedDays,
    packingEssentials: [
      'Valid ID/Passport',
      'Comfortable walking shoes',
      'Sunscreen and hat',
      payload.activityLevel === 'Active' ? 'Trekking gear' : 'Light layers',
      'Power bank',
      'Travel insurance documents',
    ],
    bestTimeToVisit: 'October to March for ideal weather conditions',
    localCuisineToTry: ['Local fish curry', 'Street snacks', 'Regional sweets', 'Fresh coconut water'],
    warnings: [
      payload.visaConstraints === 'Yes' ? 'Check visa requirements before booking' : null,
      payload.exclusions ? `Note: Excluded from itinerary — ${payload.exclusions}` : null,
      'Always keep emergency contact numbers handy',
    ].filter(Boolean),
  };
}

// ── MAIN ROUTE: POST /api/ai/generate-itinerary ──
router.post('/generate-itinerary', async (req, res) => {
  try {
    const {
      // Trip basics
      travelType, adults, children, duration, departure, destination,
      // Preferences
      interests, budget, accommodation, transport, tripVibe, activityLevel,
      // Advanced inputs (the ones previously ignored)
      mustVisit, exclusions, visaConstraints, specialRequirements,
      // User persona from localStorage/DB
      userPersona,
    } = req.body;

    // ── VALIDATION ──
    if (!travelType) {
      return res.status(400).json({
        error: 'travelType is required',
        example: 'romantic | friends | solo | family | adventure | pilgrim | luxury',
      });
    }

    // ── BUILD PROMPT ──
    const prompt = buildPrompt(req.body);

    // ── MOCK vs REAL AI ──
    // To use a real LLM, replace the block below with:
    //
    // const { OpenAI } = require('openai');
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const completion = await openai.chat.completions.create({
    //   model: 'gpt-4o-mini',
    //   messages: [{ role: 'user', content: prompt }],
    //   response_format: { type: 'json_object' },
    // });
    // const itinerary = JSON.parse(completion.choices[0].message.content);
    //
    // OR for Gemini:
    // const { GoogleGenerativeAI } = require('@google/generative-ai');
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    // const result = await model.generateContent(prompt);
    // const itinerary = JSON.parse(result.response.text());

    const itinerary = generateMockResponse(req.body);

    // ── RESPONSE ──
    res.json({
      success:   true,
      source:    'mock',   // change to 'openai' | 'gemini' when using real AI
      model:     'TripWeave-MockAI-v1',
      prompt:    prompt,   // include prompt so prof can see what would be sent to AI
      request: {
        travelType,
        adults:    adults    || 2,
        children:  children  || 0,
        duration:  duration  || '7 Days / 6 Nights',
        departure: departure || 'Mumbai (BOM)',
        destination,
        interests:           interests          || [],
        budget,
        accommodation:       accommodation      || 'Mid-range',
        transport:           transport          || 'Private cabs',
        tripVibe:            tripVibe           || 'Balanced',
        activityLevel:       activityLevel      || 'Moderate',
        mustVisit:           mustVisit          || null,
        exclusions:          exclusions         || null,
        visaConstraints:     visaConstraints    || null,
        specialRequirements: specialRequirements|| null,
        userPersona:         userPersona        || null,
      },
      itinerary,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── HEALTH CHECK ──
router.get('/status', (req, res) => {
  res.json({
    status:      'TripWeave AI API is live',
    version:     '1.0.0',
    mode:        'mock',
    description: 'Replace generateMockResponse() with real LLM call when API key available',
    endpoints: {
      generate: 'POST /api/ai/generate-itinerary',
      status:   'GET  /api/ai/status',
    },
    supportedLLMs: ['OpenAI GPT-4o-mini', 'Google Gemini Pro', 'Anthropic Claude', 'Grok'],
  });
});

module.exports = router;