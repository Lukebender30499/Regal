// server.js
// --------------  dependencies --------------
const express = require('express');
const cors    = require('cors');

// --------------  app setup --------------
const app  = express();
const PORT = process.env.PORT || 3000;   // Render injects its own PORT

// --------------  middleware --------------
app.use(cors());          // allow cross-origin calls
app.use(express.json());  // parse incoming JSON bodies

// --------------  data ---------------------
const areaCodeMap = {
  // New York
  "212": "New York", "315": "Syracuse", "332": "New York", "347": "Bronx",
  "516": "Hempstead", "518": "Albany", "585": "Rochester", "607": "Binghamton",
  "631": "Islip", "646": "New York", "716": "Buffalo", "718": "Queens",
  "845": "Poughkeepsie", "914": "Yonkers", "917": "New York", "929": "Brooklyn",
  // California
  "209": "Stockton", "213": "Los Angeles", "310": "Santa Monica", "323": "Los Angeles",
  "408": "San Jose", "415": "San Francisco", "424": "Inglewood", "510": "Oakland",
  "530": "Chico", "559": "Fresno", "562": "Long Beach", "619": "San Diego",
  "626": "Pasadena", "650": "San Mateo", "657": "Anaheim", "707": "Santa Rosa",
  "714": "Santa Ana", "747": "Burbank", "760": "Escondido", "805": "Ventura",
  "818": "Glendale", "831": "Salinas", "858": "La Jolla", "909": "San Bernardino",
  "916": "Sacramento", "925": "Concord", "949": "Irvine",
  // Connecticut
  "203": "Bridgeport", "475": "New Haven", "860": "Hartford",
  "959": "New London", "000": "Unknown",
};

// --------------  routes -------------------

// sanity-check root
app.get('/', (_, res) => res.json({ message: 'Webhook server is running!' }));

// generic webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('Inbound payload:', req.body);
  res.sendStatus(200);
});

// provider’s production webhook
app.post('/inbound-call', async (req, res) => {
  const payload = req.body.call_inbound;

  // bail out immediately if we didn’t even get a payload
  if (!payload) {
    console.error('No payload in request', req.body);
    return res.status(400).json({ error: 'Malformed request: no payload.' });
  }
  
  
  const from      = from_number;
  const areaCode  = from.slice(2, 5);
  const city      = areaCodeMap[areaCode] ?? 'Unknown';
  const id        = agent_id;
  const to        = to_number;

  const est   = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  );
  const hour  = est.getHours();
  const isOpen = hour >= 9 && hour < 18;
  
  return res.json({
    dynamic_variables: {
      id,
      from,
      to,
      city,
      isOpen: isOpen ? 'yes' : 'no',
      currentHour: hour.toString()
    }
  });
});

// --------------  start server -------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
