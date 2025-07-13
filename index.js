// server.js
// --------------  dependencies --------------
import express from 'express';
import cors from 'cors';
import axios from 'axios';
// --------------  app setup --------------

const app  = express();
const PORT = process.env.PORT || 3000;   // Render injects its own PORT

// --------------  middleware --------------
app.use(cors());          // allow cross-origin calls
app.use(express.json());  // parse incoming JSON bodies


// --------------  data ---------------------
const areaCodeMap = {
  /* ---------- Alabama ---------- */
  "205": "Birmingham", "251": "Mobile", "256": "Huntsville",
  "334": "Montgomery", "938": "Huntsville",

  /* ---------- Alaska ---------- */
  "907": "Anchorage",

  /* ---------- Arizona ---------- */
  "480": "Mesa", "520": "Tucson", "602": "Phoenix",
  "623": "Glendale", "928": "Flagstaff",

  /* ---------- Arkansas ---------- */
  "479": "Fort Smith", "501": "Little Rock", "870": "Jonesboro",

  /* ---------- California ---------- */
  "209": "Stockton", "213": "Los Angeles", "279": "Sacramento",
  "310": "Santa Monica", "323": "Los Angeles", "408": "San Jose",
  "415": "San Francisco", "424": "Inglewood", "442": "Oceanside",
  "510": "Oakland", "530": "Chico", "559": "Fresno",
  "562": "Long Beach", "619": "San Diego", "626": "Pasadena",
  "650": "San Mateo", "657": "Anaheim", "661": "Bakersfield",
  "669": "San Jose", "707": "Santa Rosa", "714": "Santa Ana",
  "747": "Burbank", "760": "Escondido", "805": "Ventura",
  "818": "Glendale", "820": "Ventura", "831": "Salinas",
  "858": "La Jolla", "909": "San Bernardino", "916": "Sacramento",
  "925": "Concord", "949": "Irvine", "951": "Riverside",

  /* ---------- Colorado ---------- */
  "303": "Denver", "719": "Colorado Springs", "720": "Denver",
  "970": "Fort Collins", "983": "Denver",

  /* ---------- Connecticut ---------- */
  "203": "Bridgeport", "475": "New Haven",
  "860": "Hartford",  "959": "New London",

  /* ---------- Delaware ---------- */
  "302": "Wilmington",

  /* ---------- Florida ---------- */
  "239": "Fort Myers", "305": "Miami",   "321": "Orlando",
  "352": "Gainesville", "386": "Daytona Beach", "407": "Orlando",
  "561": "West Palm Beach", "627": "Orlando",
  "727": "St. Petersburg", "754": "Fort Lauderdale",
  "772": "Port St. Lucie", "786": "Miami", "813": "Tampa",
  "850": "Tallahassee", "863": "Lakeland", "904": "Jacksonville",
  "941": "Sarasota",   "954": "Fort Lauderdale",

  /* ---------- Georgia ---------- */
  "229": "Albany", "404": "Atlanta", "470": "Atlanta",
  "478": "Macon",  "678": "Atlanta", "706": "Augusta",
  "762": "Columbus","770": "Atlanta", "912": "Savannah",

  /* ---------- Hawaii ---------- */
  "808": "Honolulu",

  /* ---------- Idaho ---------- */
  "208": "Boise", "986": "Boise",

  /* ---------- Illinois ---------- */
  "217": "Springfield","224": "Waukegan", "309": "Peoria",
  "312": "Chicago",    "331": "Aurora",   "447": "Springfield",
  "464": "Chicago",    "618": "East St. Louis", "630": "Naperville",
  "708": "Cicero",     "730": "Peoria",  "773": "Chicago",
  "779": "Rockford",   "815": "Rockford","847": "Evanston",
  "872": "Chicago",

  /* ---------- Indiana ---------- */
  "219": "Gary", "260": "Fort Wayne", "317": "Indianapolis",
  "463": "Indianapolis", "574": "South Bend",
  "765": "Muncie", "812": "Evansville", "930": "Evansville",

  /* ---------- Iowa ---------- */
  "319": "Cedar Rapids","515": "Des Moines",
  "563": "Davenport",  "641": "Mason City", "712": "Sioux City",

  /* ---------- Kansas ---------- */
  "316": "Wichita", "620": "Dodge City",
  "785": "Topeka", "913": "Kansas City",

  /* ---------- Kentucky ---------- */
  "270": "Bowling Green", "364": "Bowling Green",
  "502": "Louisville",    "606": "Ashland", "859": "Lexington",

  /* ---------- Louisiana ---------- */
  "225": "Baton Rouge", "318": "Shreveport",
  "337": "Lafayette",  "504": "New Orleans", "985": "Houma",

  /* ---------- Maine ---------- */
  "207": "Portland",

  /* ---------- Maryland ---------- */
  "240": "Silver Spring", "301": "Frederick",
  "410": "Baltimore",     "443": "Baltimore", "667": "Baltimore",

  /* ---------- Massachusetts ---------- */
  "339": "Waltham", "351": "Lowell", "413": "Springfield",
  "508": "Worcester","617": "Boston","774": "Worcester",
  "781": "Lynn",     "857": "Boston", "978": "Lowell",

  /* ---------- Michigan ---------- */
  "231": "Muskegon","248": "Troy","269": "Kalamazoo",
  "313": "Detroit", "517": "Lansing","586": "Warren",
  "616": "Grand Rapids","734": "Ann Arbor","810": "Flint",
  "906": "Marquette","947": "Troy",

  /* ---------- Minnesota ---------- */
  "218": "Duluth", "320": "St. Cloud", "507": "Rochester",
  "612": "Minneapolis","651": "St. Paul","763": "Brooklyn Park",
  "952": "Bloomington",

  /* ---------- Mississippi ---------- */
  "228": "Biloxi","601": "Jackson","662": "Tupelo","769": "Jackson",

  /* ---------- Missouri ---------- */
  "314": "St. Louis","417": "Springfield","573": "Columbia",
  "636": "St. Charles","660": "Sedalia","816": "Kansas City",
  "975": "Kansas City",

  /* ---------- Montana ---------- */
  "406": "Billings",

  /* ---------- Nebraska ---------- */
  "308": "North Platte","402": "Omaha","531": "Omaha",

  /* ---------- Nevada ---------- */
  "702": "Las Vegas","725": "Las Vegas","775": "Reno",

  /* ---------- New Hampshire ---------- */
  "603": "Manchester",

  /* ---------- New Jersey ---------- */
  "201": "Jersey City","551": "Jersey City","609": "Trenton",
  "640": "Trenton","732": "Toms River","848": "New Brunswick",
  "856": "Camden","862": "Newark","908": "Elizabeth","973": "Newark",

  /* ---------- New Mexico ---------- */
  "505": "Albuquerque","575": "Las Cruces",

  /* ---------- New York ---------- */
  "212": "New York","315": "Syracuse","332": "New York","347": "Bronx",
  "516": "Hempstead","518": "Albany","585": "Rochester",
  "607": "Binghamton","631": "Islip","646": "New York",
  "680": "Syracuse","716": "Buffalo","718": "Queens",
  "838": "Albany","845": "Poughkeepsie","914": "Yonkers",
  "917": "New York","929": "Brooklyn","934": "Ronkonkoma",

  /* ---------- North Carolina ---------- */
  "252": "Greenville","336": "Greensboro","704": "Charlotte",
  "743": "Greensboro","828": "Asheville","910": "Wilmington",
  "980": "Charlotte","984": "Raleigh","919": "Raleigh",

  /* ---------- North Dakota ---------- */
  "701": "Fargo",

  /* ---------- Ohio ---------- */
  "216": "Cleveland","220": "Columbus","234": "Akron",
  "283": "Cincinnati","330": "Akron","380": "Columbus",
  "419": "Toledo","440": "Lorain","513": "Cincinnati",
  "567": "Toledo","614": "Columbus","740": "Newark",
  "937": "Dayton",

  /* ---------- Oklahoma ---------- */
  "405": "Oklahoma City","539": "Tulsa","572": "Oklahoma City",
  "580": "Lawton","918": "Tulsa",

  /* ---------- Oregon ---------- */
  "458": "Eugene","503": "Portland","541": "Eugene","971": "Portland",

  /* ---------- Pennsylvania ---------- */
  "215": "Philadelphia","223": "Harrisburg","267": "Philadelphia",
  "272": "Wilkes-Barre","412": "Pittsburgh","445": "Philadelphia",
  "484": "Allentown","570": "Scranton","582": "Erie",
  "610": "Allentown","717": "Harrisburg","724": "Greensburg",
  "878": "Pittsburgh",

  /* ---------- Rhode Island ---------- */
  "401": "Providence",

  /* ---------- South Carolina ---------- */
  "803": "Columbia","839": "Columbia","843": "Charleston",
  "854": "Charleston","864": "Greenville",

  /* ---------- South Dakota ---------- */
  "605": "Sioux Falls",

  /* ---------- Tennessee ---------- */
  "423": "Chattanooga","615": "Nashville","629": "Nashville",
  "731": "Jackson","865": "Knoxville","901": "Memphis",
  "931": "Clarksville",

  /* ---------- Texas ---------- */
  "210": "San Antonio","214": "Dallas","254": "Waco","281": "Houston",
  "325": "Abilene","346": "Houston","361": "Corpus Christi",
  "409": "Beaumont","430": "Tyler","432": "Midland","469": "Dallas",
  "512": "Austin","682": "Fort Worth","713": "Houston","726": "San Antonio",
  "737": "Austin","806": "Amarillo","817": "Fort Worth",
  "830": "New Braunfels","832": "Houston","903": "Tyler",
  "915": "El Paso","936": "Conroe","940": "Wichita Falls",
  "956": "McAllen","972": "Dallas","979": "College Station",

  /* ---------- Utah ---------- */
  "385": "Salt Lake City","435": "St. George","801": "Salt Lake City",

  /* ---------- Vermont ---------- */
  "802": "Burlington",

  /* ---------- Virginia ---------- */
  "276": "Bristol","434": "Lynchburg","540": "Roanoke",
  "571": "Arlington","703": "Arlington","757": "Virginia Beach",
  "804": "Richmond",

  /* ---------- Washington ---------- */
  "206": "Seattle","253": "Tacoma","360": "Vancouver",
  "425": "Everett","509": "Spokane","564": "Bellingham",

  /* ---------- West Virginia ---------- */
  "304": "Charleston","681": "Charleston",

  /* ---------- Wisconsin ---------- */
  "262": "Waukesha","274": "Milwaukee","414": "Milwaukee",
  "534": "Eau Claire","608": "Madison","715": "Eau Claire",
  "920": "Green Bay",

  /* ---------- Wyoming ---------- */
  "307": "Cheyenne",
};


// --------------  routes -------------------

// sanity-check root
app.get('/', (_, res) => res.json({ message: 'Webhook server is running!' }));

axios.post('http://localhost:3000/inbound-call', {
  call_inbound: {
    from_number: '+12025550123',
    to_number:   '+14155550123',
    agent_id:    'agent_42'
  }
})
.then(res => console.log('✅  Server response:', res.data))
.catch(err => console.error('❌  Error:', err.response?.data || err.message));

// generic webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('Inbound payload:', req.body);
  res.sendStatus(200);
});

// provider’s production webhook
app.post('/inbound-call', async (req, res) => {
  console.log('📥 FULL WEBHOOK BODY:', JSON.stringify(req.body, null, 2));
  const payload = req.body.call_inbound || req.body.call;

  // bail out immediately if we didn’t even get a payload
  if (!payload) {
    console.error('No payload at either call_inbound or call!', req.body)
    return res.status(400).json({ error: 'Malformed request: no payload.' })
  }
  const { from_number: from, to_number: to, agent_id: id } = payload;
  
  const hostZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localString = new Date().toLocaleString("en-US", { timeZone: hostZone });
  const areaCode  = from_number.slice(2, 5);
  const city      = areaCodeMap[areaCode] ?? 'Unknown';
  const now       = new Date();
  const day       = now.getDay();  
  
  const est   = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  );
  const hostDate   = new Date(
    new Date().toLocaleString('en-US', { timeZone: hostZone })
  );
  const hour  = est.getHours();
  const local_hour = hostDate.getHours();
  const isEarly = local_hour <= 9;
  const isLate = local_hour >= 20;
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = (hour >= 9 && hour < 18) && isWeekday;
  console.log('🔍 debug inbound-call vars →', { from, to, id, city, hour, isOpen, isEarly, isLate, isWeekday });

  return res.json({
    dynamic_variables: {      id,
                              from,
                              to,
                              city,
                              isOpen: isOpen ? 'yes' : 'no',
                              isEarly: isEarly ? 'yes' : 'no',
                              isLate: isLate ? 'yes' : 'no',
                              isWeekday: isWeekday ? 'yes' : 'no' }
  });
});

app.post('/inbound-call', (req, res) => {
  app.post('/inbound-call', (req, res) => {
  console.log('[DEBUG] raw body:', JSON.stringify(req.body, null, 2));


  const payload =
        req.body.call_inbound ??
        req.body.dynamic_variables ??
        req.body;

  if (!payload || typeof payload !== 'object') {
    console.error('No recognizable payload:', req.body);
    return res.status(400).json({ error: 'Unrecognized payload shape.' });
  }

  const { from_number: from = '', to_number: to = '', agent_id: id = '' } = payload;
  const areaCode = from.slice(2, 5);
  const city     = areaCodeMap[areaCode] ?? 'Unknown';
  const hostZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localString = new Date().toLocaleString("en-US", { timeZone: hostZone });
  console.log(`Local time in ${hostZone}:`, localString);
  const est      = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  );
  const local_hour = hostZone.getHours();
  const isEarly = local_hour <= 9;
  isLate = local_hour >= 20;
  const hour  = est.getHours();
  const day = now.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = (hour >= 9 && hour < 18) && isWeekday;

  // 👀 see what you got
  console.table({ from, to, id, city, hour, isOpen, isEarly, isLate, isWeekday });

  const dynamic_variables = { id,
                              from,
                              to,
                              city,
                              isOpen: isOpen ? 'yes' : 'no',
                              isEarly: isEarly ? 'yes' : 'no',
                              isLate: isLate ? 'yes' : 'no',
                              isWeekday: isWeekday ? 'yes' : 'no' };

  // In dev, send the debug data back too
  if (process.env.NODE_ENV !== 'production') {
    return res.json({ dynamic_variables, debug: { from, areaCode, city, hour, isOpen, isEarly, isLate, isWeekday } });
  }
  return res.json({ dynamic_variables });
});});

//-------------- SMS Service-----------


 

app.post('/sendLink', (req, res) => {
  const {title} = req.body;
  if (!title) {
      return res.status(400).json({ error: 'Missing title' });
    }

  


  const entry = mapping.find(item => item.title === title);
  if (!entry) {
      return res.status(404).json({ error: 'Article not found' });
    }
  res.json({ url: entry.url, found: true });
});


  // --------------  start server -------------
 const mapping = [
  {
    "title": "Theft",
    "url": "https://www.lemonade.com/homeowners/explained/theft"
  },
  {
    "title": "Escrow",
    "url": "https://www.lemonade.com/homeowners/explained/escrow"
  },
  {
    "title": "Hoa Fees",
    "url": "https://www.lemonade.com/homeowners/explained/hoa-fees"
  },
  {
    "title": "Vandalism",
    "url": "https://www.lemonade.com/homeowners/explained/vandalism"
  },
  {
    "title": "Windstorm",
    "url": "https://www.lemonade.com/homeowners/explained/windstorm"
  },
  {
    "title": "Home Loan",
    "url": "https://www.lemonade.com/homeowners/explained/home-loan"
  },
  {
    "title": "Occurrence",
    "url": "https://www.lemonade.com/homeowners/explained/occurrence"
  },
  {
    "title": "Ho3 Policy",
    "url": "https://www.lemonade.com/homeowners/explained/ho3-policy"
  },
  {
    "title": "Negligence",
    "url": "https://www.lemonade.com/homeowners/explained/negligence"
  },
  {
    "title": "Open Perils",
    "url": "https://www.lemonade.com/homeowners/explained/open-perils"
  },
  {
    "title": "Subrogation",
    "url": "https://www.lemonade.com/homeowners/explained/subrogation"
  },
  {
    "title": "Fire Damage",
    "url": "https://www.lemonade.com/homeowners/explained/fire-damage"
  },
  {
    "title": "Sitemap.xml",
    "url": "https://www.lemonade.com/homeowners/explained/sitemap.xml"
  },
  {
    "title": "Named Perils",
    "url": "https://www.lemonade.com/homeowners/explained/named-perils"
  },
  {
    "title": "Moral Hazard",
    "url": "https://www.lemonade.com/homeowners/explained/moral-hazard"
  },
  {
    "title": "Bodily Injury",
    "url": "https://www.lemonade.com/homeowners/explained/bodily-injury"
  },
  {
    "title": "Ho6 Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/ho6-insurance"
  },
  {
    "title": "Real Property",
    "url": "https://www.lemonade.com/homeowners/explained/real-property"
  },
  {
    "title": "Closing Costs",
    "url": "https://www.lemonade.com/homeowners/explained/closing-costs"
  },
  {
    "title": "Named Insured",
    "url": "https://www.lemonade.com/homeowners/explained/named-insured"
  },
  {
    "title": "Mortgage Lock",
    "url": "https://www.lemonade.com/homeowners/explained/mortgage-lock"
  },
  {
    "title": "Deed Of Trust",
    "url": "https://www.lemonade.com/homeowners/explained/deed-of-trust"
  },
  {
    "title": "Art Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/art-insurance"
  },
  {
    "title": "Date Of Issue",
    "url": "https://www.lemonade.com/homeowners/explained/date-of-issue"
  },
  {
    "title": "Loan Estimate",
    "url": "https://www.lemonade.com/homeowners/explained/loan-estimate"
  },
  {
    "title": "Coop Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/coop-insurance"
  },
  {
    "title": "Loan Principal",
    "url": "https://www.lemonade.com/homeowners/explained/loan-principal"
  },
  {
    "title": "Buying A Condo",
    "url": "https://www.lemonade.com/homeowners/explained/buying-a-condo"
  },
  {
    "title": "Closed Mortgage",
    "url": "https://www.lemonade.com/homeowners/explained/closed-mortgage"
  },
  {
    "title": "Home Appraisals",
    "url": "https://www.lemonade.com/homeowners/explained/home-appraisals"
  },
  {
    "title": "Drone Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/drone-insurance"
  },
  {
    "title": "Title Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/title-insurance"
  },
  {
    "title": "Types Of Houses",
    "url": "https://www.lemonade.com/homeowners/explained/types-of-houses"
  },
  {
    "title": "Discount Points",
    "url": "https://www.lemonade.com/homeowners/explained/discount-points"
  },
  {
    "title": "Flood Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/flood-insurance"
  },
  {
    "title": "Replacement Cost",
    "url": "https://www.lemonade.com/homeowners/explained/replacement-cost"
  },
  {
    "title": "Balloon Payments",
    "url": "https://www.lemonade.com/homeowners/explained/balloon-payments"
  },
  {
    "title": "Other Structures",
    "url": "https://www.lemonade.com/homeowners/explained/other-structures"
  },
  {
    "title": "Hazard Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/hazard-insurance"
  },
  {
    "title": "Conversation Pits",
    "url": "https://www.lemonade.com/homeowners/explained/conversation-pits"
  },
  {
    "title": "Uninsurable Peril",
    "url": "https://www.lemonade.com/homeowners/explained/uninsurable-peril"
  },
  {
    "title": "Blanket Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/blanket-insurance"
  },
  {
    "title": "Personal Property",
    "url": "https://www.lemonade.com/homeowners/explained/personal-property"
  },
  {
    "title": "Tornado Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/tornado-insurance"
  },
  {
    "title": "Dwelling Coverage",
    "url": "https://www.lemonade.com/homeowners/explained/dwelling-coverage"
  },
  {
    "title": "Declarations Page",
    "url": "https://www.lemonade.com/homeowners/explained/declarations-page"
  },
  {
    "title": "Insurance Adjuster",
    "url": "https://www.lemonade.com/homeowners/explained/insurance-adjuster"
  },
  {
    "title": "Personal Liability",
    "url": "https://www.lemonade.com/homeowners/explained/personal-liability"
  },
  {
    "title": "New Home Checklist",
    "url": "https://www.lemonade.com/homeowners/explained/new-home-checklist"
  },
  {
    "title": "Condo Vs Apartment",
    "url": "https://www.lemonade.com/homeowners/explained/condo-vs-apartment"
  },
  {
    "title": "Proof Of Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/proof-of-insurance"
  },
  {
    "title": "Mortgage Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/mortgage-insurance"
  },
  {
    "title": "Due On Sale Clause",
    "url": "https://www.lemonade.com/homeowners/explained/due-on-sale-clause"
  },
  {
    "title": "Insurable Interest",
    "url": "https://www.lemonade.com/homeowners/explained/insurable-interest"
  },
  {
    "title": "Loan To Value Ratio",
    "url": "https://www.lemonade.com/homeowners/explained/loan-to-value-ratio"
  },
  {
    "title": "Burglary Statistics",
    "url": "https://www.lemonade.com/homeowners/explained/burglary-statistics"
  },
  {
    "title": "Space Storage Hacks",
    "url": "https://www.lemonade.com/homeowners/explained/space-storage-hacks"
  },
  {
    "title": "Smart Home Benefits",
    "url": "https://www.lemonade.com/homeowners/explained/smart-home-benefits"
  },
  {
    "title": "Cost Renovate House",
    "url": "https://www.lemonade.com/homeowners/explained/cost-renovate-house"
  },
  {
    "title": "Ho5 Insurance Policy",
    "url": "https://www.lemonade.com/homeowners/explained/ho5-insurance-policy"
  },
  {
    "title": "Category/local Intel",
    "url": "https://www.lemonade.com/homeowners/explained/category/local-intel"
  },
  {
    "title": "Securing Home Easily",
    "url": "https://www.lemonade.com/homeowners/explained/securing-home-easily"
  },
  {
    "title": "Earthquake Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/earthquake-insurance"
  },
  {
    "title": "What Is A Deductible",
    "url": "https://www.lemonade.com/homeowners/explained/what-is-a-deductible"
  },
  {
    "title": "Insurance Endorsement",
    "url": "https://www.lemonade.com/homeowners/explained/insurance-endorsement"
  },
  {
    "title": "Category/the Backyard",
    "url": "https://www.lemonade.com/homeowners/explained/category/the-backyard"
  },
  {
    "title": "Landlord Vs Homeowners",
    "url": "https://www.lemonade.com/homeowners/explained/landlord-vs-homeowners"
  },
  {
    "title": "How To Get Rid Of Ants",
    "url": "https://www.lemonade.com/homeowners/explained/how-to-get-rid-of-ants"
  },
  {
    "title": "Homeowners Association",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-association"
  },
  {
    "title": "Swimming Pool Coverage",
    "url": "https://www.lemonade.com/homeowners/explained/swimming-pool-coverage"
  },
  {
    "title": "Reduce Your Water Bill",
    "url": "https://www.lemonade.com/homeowners/explained/reduce-your-water-bill"
  },
  {
    "title": "Annual Percentage Rate",
    "url": "https://www.lemonade.com/homeowners/explained/annual-percentage-rate"
  },
  {
    "title": "Buying Your First Home",
    "url": "https://www.lemonade.com/homeowners/explained/buying-your-first-home"
  },
  {
    "title": "Noisy Neighbors Survey",
    "url": "https://www.lemonade.com/homeowners/explained/noisy-neighbors-survey"
  },
  {
    "title": "Small Living Room Hacks",
    "url": "https://www.lemonade.com/homeowners/explained/small-living-room-hacks"
  },
  {
    "title": "Buried Utility Coverage",
    "url": "https://www.lemonade.com/homeowners/explained/buried-utility-coverage"
  },
  {
    "title": "How To Move With Plants",
    "url": "https://www.lemonade.com/homeowners/explained/how-to-move-with-plants"
  },
  {
    "title": "Hail Insurance Coverage",
    "url": "https://www.lemonade.com/homeowners/explained/hail-insurance-coverage"
  },
  {
    "title": "Category/extra Coverage",
    "url": "https://www.lemonade.com/homeowners/explained/category/extra-coverage"
  },
  {
    "title": "Loss Assessment Coverage",
    "url": "https://www.lemonade.com/homeowners/explained/loss-assessment-coverage"
  },
  {
    "title": "Eco Friendly Renovations",
    "url": "https://www.lemonade.com/homeowners/explained/eco-friendly-renovations"
  },
  {
    "title": "Saving Money For A House",
    "url": "https://www.lemonade.com/homeowners/explained/saving-money-for-a-house"
  },
  {
    "title": "Millennials Buying Homes",
    "url": "https://www.lemonade.com/homeowners/explained/millennials-buying-homes"
  },
  {
    "title": "Mortgage Rates Explained",
    "url": "https://www.lemonade.com/homeowners/explained/mortgage-rates-explained"
  },
  {
    "title": "Home Appliance Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/home-appliance-insurance"
  },
  {
    "title": "Recoverable Depreciation",
    "url": "https://www.lemonade.com/homeowners/explained/recoverable-depreciation"
  },
  {
    "title": "Homeowners Insurance Cost",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-cost"
  },
  {
    "title": "Collecting Affordable Art",
    "url": "https://www.lemonade.com/homeowners/explained/collecting-affordable-art"
  },
  {
    "title": "What Is Landlord Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/what-is-landlord-insurance"
  },
  {
    "title": "Home Inspections Explained",
    "url": "https://www.lemonade.com/homeowners/explained/home-inspections-explained"
  },
  {
    "title": "How We Got Here Angela Jon",
    "url": "https://www.lemonade.com/homeowners/explained/how-we-got-here-angela-jon"
  },
  {
    "title": "Tenant Screening Questions",
    "url": "https://www.lemonade.com/homeowners/explained/tenant-screening-questions"
  },
  {
    "title": "Natural Disaster Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/natural-disaster-insurance"
  },
  {
    "title": "Private Mortgage Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/private-mortgage-insurance"
  },
  {
    "title": "Texas Homeowners Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/texas-homeowners-insurance"
  },
  {
    "title": "How To Babyproof Your Home",
    "url": "https://www.lemonade.com/homeowners/explained/how-to-babyproof-your-home"
  },
  {
    "title": "Homeowner Insurance Binder",
    "url": "https://www.lemonade.com/homeowners/explained/homeowner-insurance-binder"
  },
  {
    "title": "Homeowners Insurance Airbnb",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-airbnb"
  },
  {
    "title": "Tools Every Homeowner Needs",
    "url": "https://www.lemonade.com/homeowners/explained/tools-every-homeowner-needs"
  },
  {
    "title": "Paying Homeowners Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/paying-homeowners-insurance"
  },
  {
    "title": "Homeowners Insurance Fences",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-fences"
  },
  {
    "title": "Homeowners Insurance Oregon",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-oregon"
  },
  {
    "title": "Reconstruction Costs Rising",
    "url": "https://www.lemonade.com/homeowners/explained/reconstruction-costs-rising"
  },
  {
    "title": "What Is Homeowners Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/what-is-homeowners-insurance"
  },
  {
    "title": "Homeowners Insurance Georgia",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-georgia"
  },
  {
    "title": "Homeowners Insurance Indiana",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-indiana"
  },
  {
    "title": "Insurance For Valentines Day",
    "url": "https://www.lemonade.com/homeowners/explained/insurance-for-valentines-day"
  },
  {
    "title": "Reconstruction Cost Estimate",
    "url": "https://www.lemonade.com/homeowners/explained/reconstruction-cost-estimate"
  },
  {
    "title": "Homeowners Association Rules",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-association-rules"
  },
  {
    "title": "Category/unpacking The Costs",
    "url": "https://www.lemonade.com/homeowners/explained/category/unpacking-the-costs"
  },
  {
    "title": "Homeowners Insurance Arizona",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-arizona"
  },
  {
    "title": "Equipment Breakdown Coverage",
    "url": "https://www.lemonade.com/homeowners/explained/equipment-breakdown-coverage"
  },
  {
    "title": "Types Of Homeowners Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/types-of-homeowners-insurance"
  },
  {
    "title": "Homeowners Insurance Flooding",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-flooding"
  },
  {
    "title": "Dog Bite Homeowners Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/dog-bite-homeowners-insurance"
  },
  {
    "title": "How We Got Here Steven Morgan",
    "url": "https://www.lemonade.com/homeowners/explained/how-we-got-here-steven-morgan"
  },
  {
    "title": "Pros And Cons Of Buying Condo",
    "url": "https://www.lemonade.com/homeowners/explained/pros-and-cons-of-buying-condo"
  },
  {
    "title": "Virginia Homeowners Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/virginia-homeowners-insurance"
  },
  {
    "title": "Homeowners Insurance New York",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-new-york"
  },
  {
    "title": "Compare Home Insurance Quotes",
    "url": "https://www.lemonade.com/homeowners/explained/compare-home-insurance-quotes"
  },
  {
    "title": "Category/homebuying Made Easy",
    "url": "https://www.lemonade.com/homeowners/explained/category/homebuying-made-easy"
  },
  {
    "title": "Homeowners Insurance Colorado",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-colorado"
  },
  {
    "title": "Category/home Design Lifehacks",
    "url": "https://www.lemonade.com/homeowners/explained/category/home-design-lifehacks"
  },
  {
    "title": "Trampoline Insurance Explained",
    "url": "https://www.lemonade.com/homeowners/explained/trampoline-insurance-explained"
  },
  {
    "title": "Switching Homeowners Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/switching-homeowners-insurance"
  },
  {
    "title": "Homeowners Insurance Cost/#save",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-cost/#save"
  },
  {
    "title": "What Does Condo Insurance Cover",
    "url": "https://www.lemonade.com/homeowners/explained/what-does-condo-insurance-cover"
  },
  {
    "title": "Homeowners Vs Renters Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-vs-renters-insurance"
  },
  {
    "title": "Inflation Reduction Act Savings",
    "url": "https://www.lemonade.com/homeowners/explained/inflation-reduction-act-savings"
  },
  {
    "title": "Homeowners Insurance Cost/#cost",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-cost/#cost"
  },
  {
    "title": "Property And Casualty Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/property-and-casualty-insurance"
  },
  {
    "title": "Iowa Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/iowa-homeowners-insurance-guide"
  },
  {
    "title": "First Time Home Buyer Checklist",
    "url": "https://www.lemonade.com/homeowners/explained/first-time-home-buyer-checklist"
  },
  {
    "title": "Mortage Pre Approvals Explained",
    "url": "https://www.lemonade.com/homeowners/explained/mortage-pre-approvals-explained"
  },
  {
    "title": "How We Got Here Panar And Pablo",
    "url": "https://www.lemonade.com/homeowners/explained/how-we-got-here-panar-and-pablo"
  },
  {
    "title": "Homeowners Insurance Cost/#state",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-cost/#state"
  },
  {
    "title": "What Homeowners Insurance Covers",
    "url": "https://www.lemonade.com/homeowners/explained/what-homeowners-insurance-covers"
  },
  {
    "title": "Is Homeowners Insurance Required",
    "url": "https://www.lemonade.com/homeowners/explained/is-homeowners-insurance-required"
  },
  {
    "title": "Mortgage Vs Homeowners Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/mortgage-vs-homeowners-insurance"
  },
  {
    "title": "Homeowners Insurance Cost/#impact",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-cost/#impact"
  },
  {
    "title": "Termites And Homeowners Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/termites-and-homeowners-insurance"
  },
  {
    "title": "Denver Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/denver-homeowners-insurance-guide"
  },
  {
    "title": "Nevada Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/nevada-homeowners-insurance-guide"
  },
  {
    "title": "Homeowners Insurance Winter Storm",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-winter-storm"
  },
  {
    "title": "Dallas Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/dallas-homeowners-insurance-guide"
  },
  {
    "title": "Boston Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/boston-homeowners-insurance-guide"
  },
  {
    "title": "Austin Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/austin-homeowners-insurance-guide"
  },
  {
    "title": "Homeowners Insurance Pennsylvania",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-pennsylvania"
  },
  {
    "title": "How We Got Here Dan And Charishma",
    "url": "https://www.lemonade.com/homeowners/explained/how-we-got-here-dan-and-charishma"
  },
  {
    "title": "Category/homeowners Insurance 101",
    "url": "https://www.lemonade.com/homeowners/explained/category/homeowners-insurance-101"
  },
  {
    "title": "Your Hurricane Questions Answered",
    "url": "https://www.lemonade.com/homeowners/explained/your-hurricane-questions-answered"
  },
  {
    "title": "Halloween Mischief Night Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/halloween-mischief-night-insurance"
  },
  {
    "title": "Boulder Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/boulder-homeowners-insurance-guide"
  },
  {
    "title": "Detroit Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/detroit-homeowners-insurance-guide"
  },
  {
    "title": "Houston Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/houston-homeowners-insurance-guide"
  },
  {
    "title": "Homeowners And Car Insurance Bundle",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-and-car-insurance-bundle"
  },
  {
    "title": "Missouri Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/missouri-homeowners-insurance-guide"
  },
  {
    "title": "Category/home Maintenance Explained",
    "url": "https://www.lemonade.com/homeowners/explained/category/home-maintenance-explained"
  },
  {
    "title": "Homeowners Insurance Broken Windows",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-broken-windows"
  },
  {
    "title": "Illinois Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/illinois-homeowners-insurance-guide"
  },
  {
    "title": "Oklahoma Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/oklahoma-homeowners-insurance-guide"
  },
  {
    "title": "Michigan Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/michigan-homeowners-insurance-guide"
  },
  {
    "title": "St Louis Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/st-louis-homeowners-insurance-guide"
  },
  {
    "title": "Misconceptions Homeowners Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/misconceptions-homeowners-insurance"
  },
  {
    "title": "Mortgage Guide First Time Homebuyer",
    "url": "https://www.lemonade.com/homeowners/explained/mortgage-guide-first-time-homebuyer"
  },
  {
    "title": "Maryland Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/maryland-homeowners-insurance-guide"
  },
  {
    "title": "Ann Arbor Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/ann-arbor-homeowners-insurance-guide"
  },
  {
    "title": "Nashville Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/nashville-homeowners-insurance-guide"
  },
  {
    "title": "Scheduled Personal Property Coverage",
    "url": "https://www.lemonade.com/homeowners/explained/scheduled-personal-property-coverage"
  },
  {
    "title": "9 Step Checklist To Buying Your Home",
    "url": "https://www.lemonade.com/homeowners/explained/9-step-checklist-to-buying-your-home"
  },
  {
    "title": "Why Home Insurance Premiums Going Up",
    "url": "https://www.lemonade.com/homeowners/explained/why-home-insurance-premiums-going-up"
  },
  {
    "title": "Tennessee Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/tennessee-homeowners-insurance-guide"
  },
  {
    "title": "Wisconsin Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/wisconsin-homeowners-insurance-guide"
  },
  {
    "title": "Heres How To Stop Pipes From Freezing",
    "url": "https://www.lemonade.com/homeowners/explained/heres-how-to-stop-pipes-from-freezing"
  },
  {
    "title": "New Jersey Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/new-jersey-homeowners-insurance-guide"
  },
  {
    "title": "Pittsburgh Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/pittsburgh-homeowners-insurance-guide"
  },
  {
    "title": "How To Buy Cheap Home Insurance Online",
    "url": "https://www.lemonade.com/homeowners/explained/how-to-buy-cheap-home-insurance-online"
  },
  {
    "title": "San Antonio Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/san-antonio-homeowners-insurance-guide"
  },
  {
    "title": "Insurance For Your Road Bike Explained",
    "url": "https://www.lemonade.com/homeowners/explained/insurance-for-your-road-bike-explained"
  },
  {
    "title": "What Homeowners Insurance Doesnt Cover",
    "url": "https://www.lemonade.com/homeowners/explained/what-homeowners-insurance-doesnt-cover"
  },
  {
    "title": "Kansas City Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/kansas-city-homeowners-insurance-guide"
  },
  {
    "title": "Scheduled Property Receipts Appraisals",
    "url": "https://www.lemonade.com/homeowners/explained/scheduled-property-receipts-appraisals"
  },
  {
    "title": "Connecticut Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/connecticut-homeowners-insurance-guide"
  },
  {
    "title": "Indianapolis Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/indianapolis-homeowners-insurance-guide"
  },
  {
    "title": "Philadelphia Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/philadelphia-homeowners-insurance-guide"
  },
  {
    "title": "Category/extreme Weather Your Insurance",
    "url": "https://www.lemonade.com/homeowners/explained/category/extreme-weather-your-insurance"
  },
  {
    "title": "What Condo Association Insurance Covers",
    "url": "https://www.lemonade.com/homeowners/explained/what-condo-association-insurance-covers"
  },
  {
    "title": "Homeowners Insurance Cover Water Damage",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-cover-water-damage"
  },
  {
    "title": "How Much Homeowners Insurance Do I Need",
    "url": "https://www.lemonade.com/homeowners/explained/how-much-homeowners-insurance-do-i-need"
  },
  {
    "title": "Oklahoma City Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/oklahoma-city-homeowners-insurance-guide"
  },
  {
    "title": "Washington Dc Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/washington-dc-homeowners-insurance-guide"
  },
  {
    "title": "Does Homeowners Insurance Cover Ice Dams",
    "url": "https://www.lemonade.com/homeowners/explained/does-homeowners-insurance-cover-ice-dams"
  },
  {
    "title": "Your Complete Home Maintenance Checklist",
    "url": "https://www.lemonade.com/homeowners/explained/your-complete-home-maintenance-checklist"
  },
  {
    "title": "How To Stay Safe By The Pool This Summer",
    "url": "https://www.lemonade.com/homeowners/explained/how-to-stay-safe-by-the-pool-this-summer"
  },
  {
    "title": "Massachusetts Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/massachusetts-homeowners-insurance-guide"
  },
  {
    "title": "Does Homeowners Insurance Cover Furnaces",
    "url": "https://www.lemonade.com/homeowners/explained/does-homeowners-insurance-cover-furnaces"
  },
  {
    "title": "Refinancing Your Home Things To Consider",
    "url": "https://www.lemonade.com/homeowners/explained/refinancing-your-home-things-to-consider"
  },
  {
    "title": "Virginia Beach Homeowners Insurance Guide",
    "url": "https://www.lemonade.com/homeowners/explained/virginia-beach-homeowners-insurance-guide"
  },
  {
    "title": "Does Homeowners Insurance Cover Roof Leaks",
    "url": "https://www.lemonade.com/homeowners/explained/does-homeowners-insurance-cover-roof-leaks"
  },
  {
    "title": "The Ultimate Pre Vacation Travel Checklist",
    "url": "https://www.lemonade.com/homeowners/explained/the-ultimate-pre-vacation-travel-checklist"
  },
  {
    "title": "How To Prepare Your Home For Power Outages",
    "url": "https://www.lemonade.com/homeowners/explained/how-to-prepare-your-home-for-power-outages"
  },
  {
    "title": "Does Homeowners Insurance Cover Electronics",
    "url": "https://www.lemonade.com/homeowners/explained/does-homeowners-insurance-cover-electronics"
  },
  {
    "title": "Does Homeowners Insurance Cover Sewer Lines",
    "url": "https://www.lemonade.com/homeowners/explained/does-homeowners-insurance-cover-sewer-lines"
  },
  {
    "title": "How To Keep Your Property Safe From Tree Damage",
    "url": "https://www.lemonade.com/homeowners/explained/how-to-keep-your-property-safe-from-tree-damage"
  },
  {
    "title": "4 Things You Should Know About Your Down Payment",
    "url": "https://www.lemonade.com/homeowners/explained/4-things-you-should-know-about-your-down-payment"
  },
  {
    "title": "Does Homeowners Insurance Cover Foundation Issues",
    "url": "https://www.lemonade.com/homeowners/explained/does-homeowners-insurance-cover-foundation-issues"
  },
  {
    "title": "Roof Replacement The Ultimate Guide For Homeowners",
    "url": "https://www.lemonade.com/homeowners/explained/roof-replacement-the-ultimate-guide-for-homeowners"
  },
  {
    "title": "Homeowners Insurance Add Ons You Should Know About",
    "url": "https://www.lemonade.com/homeowners/explained/homeowners-insurance-add-ons-you-should-know-about"
  },
  {
    "title": "Decor To Live For Whats Trending In Interior Design",
    "url": "https://www.lemonade.com/homeowners/explained/decor-to-live-for-whats-trending-in-interior-design"
  },
  {
    "title": "Home Improvements To Keep Your Homeowners Insurance Premiums Low",
    "url": "https://www.lemonade.com/homeowners/explained/home-improvements-to-keep-your-homeowners-insurance-premiums-low"
  },
  {
    "title": "Everything You Should Know Before Starting Your Home Renovation Project",
    "url": "https://www.lemonade.com/homeowners/explained/everything-you-should-know-before-starting-your-home-renovation-project"
  }
]

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

