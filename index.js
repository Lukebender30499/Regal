// server.js
// --------------  dependencies --------------
import express from 'express';
import cors from 'cors';
import axios from 'axios';
//import cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
// --------------  app setup --------------


const PORT = process.env.PORT || 3000;   // Render injects its own PORT
const app  = express();
// --------------  middleware --------------
app.use(cors());          // allow cross-origin calls
app.use(express.json());  // parse incoming JSON bodies

const ARTICLE_PREFIX = 'https://www.lemonade.com/homeowners/explained/';

app.post('/get-article', async (req, res) => {
  const title = req.body.article.title;
  if (!title) return res.status(400).json({ error: 'Missing sentence parameter' });

  const lower_title = title.toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove punctuation
    .replace(/\s+/g, '-')     // spaces to dashes
    .replace(/-+/g, '-');     // collapse multiple dashes

  const url = ARTICLE_PREFIX + lower_title + '/';
    try {
    const response = await axios.get(url);
    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;

    let articleEl = document.querySelector('article');

    // Attempt 2: Fallback to known container classes
    if (!articleEl) {
      articleEl = document.querySelector('.post-body') ||
                  document.querySelector('[class*="post-body"]');
    }
    if (articleEl) {
      // Extract text while trimming empty lines
      const rawText = articleEl.textContent || '';
      const cleanText = rawText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n\n');

      console.log(cleanText); // Or return it
      return res.json({ article: { title: cleanText } });
    } else {
      console.warn('Could not locate main article content.');
      return res.json({ article: { title: null } });
    }

  } catch (err) {
    console.error('Error:', err.message);
    return res.json({ article: { title: null } });


  }
}
)


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


  const payload =
        req.body.call_inbound ??
        req.body.dynamic_variables ??
        req.body;

  if (!payload || typeof payload !== 'object') {
    console.error('No recognizable payload:', req.body);
    return res.status(400).json({ error: 'Unrecognized payload shape.' });
  }

  const {from_number: from, to_number: to, agent_id: id} = payload;
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

app.post('/do_not_personalize', (req, res) => { return "yes";})




app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
