import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 12000;
const GRAPHQL_ENDPOINT = 'https://api.mensa-ka.de/';
const TIMETABLE_ENDPOINT = 'https://api.dhbw.app/rapla/lectures/KA-TINF25B3/events';
const ERZBERGER_UUID = '0a53351a-62f8-4ac4-a860-099817e5cf91';

// Enable CORS for all origins and handle OPTIONS preflight requests
app.use(cors());
app.use(express.json());

app.get('/events', async (req, res) => {
  try {
    const response = await fetch(TIMETABLE_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Timetable API returned HTTP ${response.status}`);
    }

    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new Error('Timetable API returned an invalid event list');
    }

    res.json(events);
  } catch (err) {
    console.error('Error fetching timetable:', err.message);
    res.status(502).json({ error: 'Could not fetch the timetable' });
  }
});

// Simple in-memory cache (10 minutes)
let cache = { date: null, timestamp: 0, payload: null };
const CACHE_TTL_MS = 10 * 60 * 1000;

async function fetchGraphQL(query, variables = {}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Upstream API returned HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

app.get('/today', async (req, res) => {
  try {
    // Today's date in Karlsruhe (YYYY-MM-DD)
    const today = new Date().toLocaleDateString('en-CA', {
      timeZone: 'Europe/Berlin',
    });

    // Serve from cache if fresh and still the same day
    if (
      cache.payload &&
      cache.date === today &&
      Date.now() - cache.timestamp < CACHE_TTL_MS
    ) {
      return res.json({ ...cache.payload, cached: true });
    }

    const query = `
      query GetErzbergerToday($canteenId: UUID!, $date: NaiveDate!) {
        getCanteen(canteenId: $canteenId) {
          id
          name
          lines {
            id
            name
            meals(date: $date) {
              id
              name
              mealType
              price {
                student
                employee
                pupil
                guest
              }
              ratings {
                averageRating
                ratingsCount
              }
              allergens
              additives
              sides {
                id
                name
                mealType
                price {
                  student
                  employee
                  pupil
                  guest
                }
              }
              images {
                id
                url
                rank
              }
            }
          }
        }
      }
    `;

    const data = await fetchGraphQL(query, {
      canteenId: ERZBERGER_UUID,
      date: today,
    });

    const canteen = data.getCanteen;
    const lines = (canteen?.lines || []).map((line) => ({
      id: line.id,
      name: line.name,
      meals: line.meals || [],
    }));

    const hasMeals = lines.some((line) => line.meals.length > 0);

    const payload = {
      date: today,
      canteen: canteen?.name || 'Menseria Erzbergerstraße',
      canteenId: ERZBERGER_UUID,
      closed: !hasMeals,
      lines,
    };

    cache = { date: today, timestamp: Date.now(), payload };
    res.json({ ...payload, cached: false });
  } catch (err) {
    console.error('Error fetching meals:', err.message);
    res.status(502).json({ error: err.message });
  }
});

// Optional: Direct GraphQL proxy with CORS headers if you ever want custom queries
app.post('/graphql', async (req, res) => {
  try {
    const data = await fetchGraphQL(req.body.query, req.body.variables);
    res.json({ data });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mensa Erzbergerstraße CORS API running on http://0.0.0.0:${PORT}/today`);
});