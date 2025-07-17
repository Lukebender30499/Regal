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
  "205": ["Birmingham", "Alabama", "America/Chicago"],
  "251": ["Mobile", "Alabama", "America/Chicago"],
  "256": ["Huntsville", "Alabama", "America/Chicago"],
  "334": ["Montgomery", "Alabama", "America/Chicago"],
  "938": ["Huntsville", "Alabama", "America/Chicago"],

  /* ---------- Alaska ---------- */
  "907": ["Anchorage", "Alaska", "America/Anchorage"],

  /* ---------- Arizona ---------- */
  "480": ["Mesa", "Arizona", "America/Phoenix"],
  "520": ["Tucson", "Arizona", "America/Phoenix"],
  "602": ["Phoenix", "Arizona", "America/Phoenix"],
  "623": ["Glendale", "Arizona", "America/Phoenix"],
  "928": ["Flagstaff", "Arizona", "America/Phoenix"],

  /* ---------- Arkansas ---------- */
  "479": ["Fort Smith", "Arkansas", "America/Chicago"],
  "501": ["Little Rock", "Arkansas", "America/Chicago"],
  "870": ["Jonesboro", "Arkansas", "America/Chicago"],

  /* ---------- California ---------- */
  "209": ["Stockton", "California", "America/Los_Angeles"],
  "213": ["Los Angeles", "California", "America/Los_Angeles"],
  "279": ["Sacramento", "California", "America/Los_Angeles"],
  "310": ["Santa Monica", "California", "America/Los_Angeles"],
  "323": ["Los Angeles", "California", "America/Los_Angeles"],
  "408": ["San Jose", "California", "America/Los_Angeles"],
  "415": ["San Francisco", "California", "America/Los_Angeles"],
  "424": ["Inglewood", "California", "America/Los_Angeles"],
  "442": ["Oceanside", "California", "America/Los_Angeles"],
  "510": ["Oakland", "California", "America/Los_Angeles"],
  "530": ["Chico", "California", "America/Los_Angeles"],
  "559": ["Fresno", "California", "America/Los_Angeles"],
  "562": ["Long Beach", "California", "America/Los_Angeles"],
  "619": ["San Diego", "California", "America/Los_Angeles"],
  "626": ["Pasadena", "California", "America/Los_Angeles"],
  "650": ["San Mateo", "California", "America/Los_Angeles"],
  "657": ["Anaheim", "California", "America/Los_Angeles"],
  "661": ["Bakersfield", "California", "America/Los_Angeles"],
  "669": ["San Jose", "California", "America/Los_Angeles"],
  "707": ["Santa Rosa", "California", "America/Los_Angeles"],
  "714": ["Santa Ana", "California", "America/Los_Angeles"],
  "747": ["Burbank", "California", "America/Los_Angeles"],
  "760": ["Escondido", "California", "America/Los_Angeles"],
  "805": ["Ventura", "California", "America/Los_Angeles"],
  "818": ["Glendale", "California", "America/Los_Angeles"],
  "820": ["Ventura", "California", "America/Los_Angeles"],
  "831": ["Salinas", "California", "America/Los_Angeles"],
  "858": ["La Jolla", "California", "America/Los_Angeles"],
  "909": ["San Bernardino", "California", "America/Los_Angeles"],
  "916": ["Sacramento", "California", "America/Los_Angeles"],
  "925": ["Concord", "California", "America/Los_Angeles"],
  "949": ["Irvine", "California", "America/Los_Angeles"],
  "951": ["Riverside", "California", "America/Los_Angeles"],

  /* ---------- Colorado ---------- */
  "303": ["Denver", "Colorado", "America/Denver"],
  "719": ["Colorado Springs", "Colorado", "America/Denver"],
  "720": ["Denver", "Colorado", "America/Denver"],
  "970": ["Fort Collins", "Colorado", "America/Denver"],
  "983": ["Denver", "Colorado", "America/Denver"],

  /* ---------- Connecticut ---------- */
  "203": ["Bridgeport", "Connecticut", "America/New_York"],
  "475": ["New Haven", "Connecticut", "America/New_York"],
  "860": ["Hartford", "Connecticut", "America/New_York"],
  "959": ["New London", "Connecticut", "America/New_York"],

  /* ---------- Delaware ---------- */
  "302": ["Wilmington", "Delaware", "America/New_York"],

  /* ---------- Florida ---------- */
  "239": ["Fort Myers", "Florida", "America/New_York"],
  "305": ["Miami", "Florida", "America/New_York"],
  "321": ["Orlando", "Florida", "America/New_York"],
  "352": ["Gainesville", "Florida", "America/New_York"],
  "386": ["Daytona Beach", "Florida", "America/New_York"],
  "407": ["Orlando", "Florida", "America/New_York"],
  "561": ["West Palm Beach", "Florida", "America/New_York"],
  "627": ["Orlando", "Florida", "America/New_York"],
  "727": ["St. Petersburg", "Florida", "America/New_York"],
  "754": ["Fort Lauderdale", "Florida", "America/New_York"],
  "772": ["Port St. Lucie", "Florida", "America/New_York"],
  "786": ["Miami", "Florida", "America/New_York"],
  "813": ["Tampa", "Florida", "America/New_York"],
  "850": ["Tallahassee", "Florida", "America/New_York"],
  "863": ["Lakeland", "Florida", "America/New_York"],
  "904": ["Jacksonville", "Florida", "America/New_York"],
  "941": ["Sarasota", "Florida", "America/New_York"],
  "954": ["Fort Lauderdale", "Florida", "America/New_York"],

  /* ---------- Georgia ---------- */
  "229": ["Albany", "Georgia", "America/New_York"],
  "404": ["Atlanta", "Georgia", "America/New_York"],
  "470": ["Atlanta", "Georgia", "America/New_York"],
  "478": ["Macon", "Georgia", "America/New_York"],
  "678": ["Atlanta", "Georgia", "America/New_York"],
  "706": ["Augusta", "Georgia", "America/New_York"],
  "762": ["Columbus", "Georgia", "America/New_York"],
  "770": ["Atlanta", "Georgia", "America/New_York"],
  "912": ["Savannah", "Georgia", "America/New_York"],

  /* ---------- Hawaii ---------- */
  "808": ["Honolulu", "Hawaii", "Pacific/Honolulu"],

  /* ---------- Idaho ---------- */
  "208": ["Boise", "Idaho", "America/Boise"],
  "986": ["Boise", "Idaho", "America/Boise"],

  /* ---------- Illinois ---------- */
  "217": ["Springfield", "Illinois", "America/Chicago"],
  "224": ["Waukegan", "Illinois", "America/Chicago"],
  "309": ["Peoria", "Illinois", "America/Chicago"],
  "312": ["Chicago", "Illinois", "America/Chicago"],
  "331": ["Aurora", "Illinois", "America/Chicago"],
  "447": ["Springfield", "Illinois", "America/Chicago"],
  "464": ["Chicago", "Illinois", "America/Chicago"],
  "618": ["East St. Louis", "Illinois", "America/Chicago"],
  "630": ["Naperville", "Illinois", "America/Chicago"],
  "708": ["Cicero", "Illinois", "America/Chicago"],
  "730": ["Peoria", "Illinois", "America/Chicago"],
  "773": ["Chicago", "Illinois", "America/Chicago"],
  "779": ["Rockford", "Illinois", "America/Chicago"],
  "815": ["Rockford", "Illinois", "America/Chicago"],
  "847": ["Evanston", "Illinois", "America/Chicago"],
  "872": ["Chicago", "Illinois", "America/Chicago"],

  /* ---------- Indiana ---------- */
  "219": ["Gary", "Indiana", "America/Chicago"],
  "260": ["Fort Wayne", "Indiana", "America/New_York"],
  "317": ["Indianapolis", "Indiana", "America/New_York"],
  "463": ["Indianapolis", "Indiana", "America/New_York"],
  "574": ["South Bend", "Indiana", "America/New_York"],
  "765": ["Muncie", "Indiana", "America/New_York"],
  "812": ["Evansville", "Indiana", "America/Chicago"],
  "930": ["Evansville", "Indiana", "America/Chicago"],

  /* ---------- Iowa ---------- */
  "319": ["Cedar Rapids", "Iowa", "America/Chicago"],
  "515": ["Des Moines", "Iowa", "America/Chicago"],
  "563": ["Davenport", "Iowa", "America/Chicago"],
  "641": ["Mason City", "Iowa", "America/Chicago"],
  "712": ["Sioux City", "Iowa", "America/Chicago"],

  /* ---------- Kansas ---------- */
  "316": ["Wichita", "Kansas", "America/Chicago"],
  "620": ["Dodge City", "Kansas", "America/Chicago"],
  "785": ["Topeka", "Kansas", "America/Chicago"],
  "913": ["Kansas City", "Kansas", "America/Chicago"],

  /* ---------- Kentucky ---------- */
  "270": ["Bowling Green", "Kentucky", "America/Chicago"],
  "364": ["Bowling Green", "Kentucky", "America/Chicago"],
  "502": ["Louisville", "Kentucky", "America/New_York"],
  "606": ["Ashland", "Kentucky", "America/New_York"],
  "859": ["Lexington", "Kentucky", "America/New_York"],

  /* ---------- Louisiana ---------- */
  "225": ["Baton Rouge", "Louisiana", "America/Chicago"],
  "318": ["Shreveport", "Louisiana", "America/Chicago"],
  "337": ["Lafayette", "Louisiana", "America/Chicago"],
  "504": ["New Orleans", "Louisiana", "America/Chicago"],
  "985": ["Houma", "Louisiana", "America/Chicago"],

  /* ---------- Maine ---------- */
  "207": ["Portland", "Maine", "America/New_York"],

  /* ---------- Maryland ---------- */
  "240": ["Silver Spring", "Maryland", "America/New_York"],
  "301": ["Frederick", "Maryland", "America/New_York"],
  "410": ["Baltimore", "Maryland", "America/New_York"],
  "443": ["Baltimore", "Maryland", "America/New_York"],
  "667": ["Baltimore", "Maryland", "America/New_York"],

  /* ---------- Massachusetts ---------- */
  "339": ["Waltham", "Massachusetts", "America/New_York"],
  "351": ["Lowell", "Massachusetts", "America/New_York"],
  "413": ["Springfield", "Massachusetts", "America/New_York"],
  "508": ["Worcester", "Massachusetts", "America/New_York"],
  "617": ["Boston", "Massachusetts", "America/New_York"],
  "774": ["Worcester", "Massachusetts", "America/New_York"],
  "781": ["Lynn", "Massachusetts", "America/New_York"],
  "857": ["Boston", "Massachusetts", "America/New_York"],
  "978": ["Lowell", "Massachusetts", "America/New_York"],

  /* ---------- Michigan ---------- */
  "231": ["Muskegon", "Michigan", "America/New_York"],
  "248": ["Troy", "Michigan", "America/New_York"],
  "269": ["Kalamazoo", "Michigan", "America/New_York"],
  "313": ["Detroit", "Michigan", "America/New_York"],
  "517": ["Lansing", "Michigan", "America/New_York"],
  "586": ["Warren", "Michigan", "America/New_York"],
  "616": ["Grand Rapids", "Michigan", "America/New_York"],
  "734": ["Ann Arbor", "Michigan", "America/New_York"],
  "810": ["Flint", "Michigan", "America/New_York"],
  "906": ["Marquette", "Michigan", "America/Chicago"],
  "947": ["Troy", "Michigan", "America/New_York"],

  /* ---------- Minnesota ---------- */
  "218": ["Duluth", "Minnesota", "America/Chicago"],
  "320": ["St. Cloud", "Minnesota", "America/Chicago"],
  "507": ["Rochester", "Minnesota", "America/Chicago"],
  "612": ["Minneapolis", "Minnesota", "America/Chicago"],
  "651": ["St. Paul", "Minnesota", "America/Chicago"],
  "763": ["Brooklyn Park", "Minnesota", "America/Chicago"],
  "952": ["Bloomington", "Minnesota", "America/Chicago"],

  /* ---------- Mississippi ---------- */
  "228": ["Biloxi", "Mississippi", "America/Chicago"],
  "601": ["Jackson", "Mississippi", "America/Chicago"],
  "662": ["Tupelo", "Mississippi", "America/Chicago"],
  "769": ["Jackson", "Mississippi", "America/Chicago"],

  /* ---------- Missouri ---------- */
  "314": ["St. Louis", "Missouri", "America/Chicago"],
  "417": ["Springfield", "Missouri", "America/Chicago"],
  "573": ["Columbia", "Missouri", "America/Chicago"],
  "636": ["St. Charles", "Missouri", "America/Chicago"],
  "660": ["Sedalia", "Missouri", "America/Chicago"],
  "816": ["Kansas City", "Missouri", "America/Chicago"],
  "975": ["Kansas City", "Missouri", "America/Chicago"],

  /* ---------- Montana ---------- */
  "406": ["Billings", "Montana", "America/Denver"],

  /* ---------- Nebraska ---------- */
  "308": ["North Platte", "Nebraska", "America/Chicago"],
  "402": ["Omaha", "Nebraska", "America/Chicago"],
  "531": ["Omaha", "Nebraska", "America/Chicago"],

  /* ---------- Nevada ---------- */
  "702": ["Las Vegas", "Nevada", "America/Los_Angeles"],
  "725": ["Las Vegas", "Nevada", "America/Los_Angeles"],
  "775": ["Reno", "Nevada", "America/Los_Angeles"],

  /* ---------- New Hampshire ---------- */
  "603": ["Manchester", "New Hampshire", "America/New_York"],

  /* ---------- New Jersey ---------- */
  "201": ["Jersey City", "New Jersey", "America/New_York"],
  "551": ["Jersey City", "New Jersey", "America/New_York"],
  "609": ["Trenton", "New Jersey", "America/New_York"],
  "640": ["Trenton", "New Jersey", "America/New_York"],
  "732": ["Toms River", "New Jersey", "America/New_York"],
  "848": ["New Brunswick", "New Jersey", "America/New_York"],
  "856": ["Camden", "New Jersey", "America/New_York"],
  "862": ["Newark", "New Jersey", "America/New_York"],
  "908": ["Elizabeth", "New Jersey", "America/New_York"],
  "973": ["Newark", "New Jersey", "America/New_York"],

  /* ---------- New Mexico ---------- */
  "505": ["Albuquerque", "New Mexico", "America/Denver"],
  "575": ["Las Cruces", "New Mexico", "America/Denver"],

  /* ---------- New York ---------- */
  "212": ["New York", "New York", "America/New_York"],
  "315": ["Syracuse", "New York", "America/New_York"],
  "332": ["New York", "New York", "America/New_York"],
  "347": ["Bronx", "New York", "America/New_York"],
  "516": ["Hempstead", "New York", "America/New_York"],
  "518": ["Albany", "New York", "America/New_York"],
  "585": ["Rochester", "New York", "America/New_York"],
  "607": ["Binghamton", "New York", "America/New_York"],
  "631": ["Islip", "New York", "America/New_York"],
  "646": ["New York", "New York", "America/New_York"],
  "680": ["Syracuse", "New York", "America/New_York"],
  "716": ["Buffalo", "New York", "America/New_York"],
  "718": ["Queens", "New York", "America/New_York"],
  "838": ["Albany", "New York", "America/New_York"],
  "845": ["Poughkeepsie", "New York", "America/New_York"],
  "914": ["Yonkers", "New York", "America/New_York"],
  "917": ["New York", "New York", "America/New_York"],
  "929": ["Brooklyn", "New York", "America/New_York"],
  "934": ["Ronkonkoma", "New York", "America/New_York"],

  /* ---------- North Carolina ---------- */
  "252": ["Greenville", "North Carolina", "America/New_York"],
  "336": ["Greensboro", "North Carolina", "America/New_York"],
  "704": ["Charlotte", "North Carolina", "America/New_York"],
  "743": ["Greensboro", "North Carolina", "America/New_York"],
  "828": ["Asheville", "North Carolina", "America/New_York"],
  "910": ["Wilmington", "North Carolina", "America/New_York"],
  "980": ["Charlotte", "North Carolina", "America/New_York"],
  "984": ["Raleigh", "North Carolina", "America/New_York"],
  "919": ["Raleigh", "North Carolina", "America/New_York"],

  /* ---------- North Dakota ---------- */
  "701": ["Fargo", "North Dakota", "America/Chicago"],

  /* ---------- Ohio ---------- */
  "216": ["Cleveland", "Ohio", "America/New_York"],
  "220": ["Columbus", "Ohio", "America/New_York"],
  "234": ["Akron", "Ohio", "America/New_York"],
  "283": ["Cincinnati", "Ohio", "America/New_York"],
  "330": ["Akron", "Ohio", "America/New_York"],
  "380": ["Columbus", "Ohio", "America/New_York"],
  "419": ["Toledo", "Ohio", "America/New_York"],
  "440": ["Lorain", "Ohio", "America/New_York"],
  "513": ["Cincinnati", "Ohio", "America/New_York"],
  "567": ["Toledo", "Ohio", "America/New_York"],
  "614": ["Columbus", "Ohio", "America/New_York"],
  "740": ["Newark", "Ohio", "America/New_York"],
  "937": ["Dayton", "Ohio", "America/New_York"],

  /* ---------- Oklahoma ---------- */
  "405": ["Oklahoma City", "Oklahoma", "America/Chicago"],
  "539": ["Tulsa", "Oklahoma", "America/Chicago"],
  "572": ["Oklahoma City", "Oklahoma", "America/Chicago"],
  "580": ["Lawton", "Oklahoma", "America/Chicago"],
  "918": ["Tulsa", "Oklahoma", "America/Chicago"],

  /* ---------- Oregon ---------- */
  "458": ["Eugene", "Oregon", "America/Los_Angeles"],
  "503": ["Portland", "Oregon", "America/Los_Angeles"],
  "541": ["Eugene", "Oregon", "America/Los_Angeles"],
  "971": ["Portland", "Oregon", "America/Los_Angeles"],

  /* ---------- Pennsylvania ---------- */
  "215": ["Philadelphia", "Pennsylvania", "America/New_York"],
  "223": ["Harrisburg", "Pennsylvania", "America/New_York"],
  "267": ["Philadelphia", "Pennsylvania", "America/New_York"],
  "272": ["Wilkes-Barre", "Pennsylvania", "America/New_York"],
  "412": ["Pittsburgh", "Pennsylvania", "America/New_York"],
  "445": ["Philadelphia", "Pennsylvania", "America/New_York"],
  "484": ["Allentown", "Pennsylvania", "America/New_York"],
  "570": ["Scranton", "Pennsylvania", "America/New_York"],
  "582": ["Erie", "Pennsylvania", "America/New_York"],
  "610": ["Allentown", "Pennsylvania", "America/New_York"],
  "717": ["Harrisburg", "Pennsylvania", "America/New_York"],
  "724": ["Greensburg", "Pennsylvania", "America/New_York"],
  "878": ["Pittsburgh", "Pennsylvania", "America/New_York"],

  /* ---------- Rhode Island ---------- */
  "401": ["Providence", "Rhode Island", "America/New_York"],

  /* ---------- South Carolina ---------- */
  "803": ["Columbia", "South Carolina", "America/New_York"],
  "839": ["Columbia", "South Carolina", "America/New_York"],
  "843": ["Charleston", "South Carolina", "America/New_York"],
  "854": ["Charleston", "South Carolina", "America/New_York"],
  "864": ["Greenville", "South Carolina", "America/New_York"],

  /* ---------- South Dakota ---------- */
  "605": ["Sioux Falls", "South Dakota", "America/Chicago"],

  /* ---------- Tennessee ---------- */
  "423": ["Chattanooga", "Tennessee", "America/New_York"],
  "615": ["Nashville", "Tennessee", "America/Chicago"],
  "629": ["Nashville", "Tennessee", "America/Chicago"],
  "731": ["Jackson", "Tennessee", "America/Chicago"],
  "865": ["Knoxville", "Tennessee", "America/New_York"],
  "901": ["Memphis", "Tennessee", "America/Chicago"],
  "931": ["Clarksville", "Tennessee", "America/Chicago"],

  /* ---------- Texas ---------- */
  "210": ["San Antonio", "Texas", "America/Chicago"],
  "214": ["Dallas", "Texas", "America/Chicago"],
  "254": ["Waco", "Texas", "America/Chicago"],
  "281": ["Houston", "Texas", "America/Chicago"],
  "325": ["Abilene", "Texas", "America/Chicago"],
  "346": ["Houston", "Texas", "America/Chicago"],
  "361": ["Corpus Christi", "Texas", "America/Chicago"],
  "409": ["Beaumont", "Texas", "America/Chicago"],
  "430": ["Tyler", "Texas", "America/Chicago"],
  "432": ["Midland", "Texas", "America/Chicago"],
  "469": ["Dallas", "Texas", "America/Chicago"],
  "512": ["Austin", "Texas", "America/Chicago"],
  "682": ["Fort Worth", "Texas", "America/Chicago"],
  "713": ["Houston", "Texas", "America/Chicago"],
  "726": ["San Antonio", "Texas", "America/Chicago"],
  "737": ["Austin", "Texas", "America/Chicago"],
  "806": ["Amarillo", "Texas", "America/Chicago"],
  "817": ["Fort Worth", "Texas", "America/Chicago"],
  "830": ["New Braunfels", "Texas", "America/Chicago"],
  "832": ["Houston", "Texas", "America/Chicago"],
  "903": ["Tyler", "Texas", "America/Chicago"],
  "915": ["El Paso", "Texas", "America/Denver"],
  "936": ["Conroe", "Texas", "America/Chicago"],
  "940": ["Wichita Falls", "Texas", "America/Chicago"],
  "956": ["McAllen", "Texas", "America/Chicago"],
  "972": ["Dallas", "Texas", "America/Chicago"],
  "979": ["College Station", "Texas", "America/Chicago"],

  /* ---------- Utah ---------- */
  "385": ["Salt Lake City", "Utah", "America/Denver"],
  "435": ["St. George", "Utah", "America/Denver"],
  "801": ["Salt Lake City", "Utah", "America/Denver"],

  /* ---------- Vermont ---------- */
  "802": ["Burlington", "Vermont", "America/New_York"],

  /* ---------- Virginia ---------- */
  "276": ["Bristol", "Virginia", "America/New_York"],
  "434": ["Lynchburg", "Virginia", "America/New_York"],
  "540": ["Roanoke", "Virginia", "America/New_York"],
  "571": ["Arlington", "Virginia", "America/New_York"],
  "703": ["Arlington", "Virginia", "America/New_York"],
  "757": ["Virginia Beach", "Virginia", "America/New_York"],
  "804": ["Richmond", "Virginia", "America/New_York"],

  /* ---------- Washington ---------- */
  "206": ["Seattle", "Washington", "America/Los_Angeles"],
  "253": ["Tacoma", "Washington", "America/Los_Angeles"],
  "360": ["Vancouver", "Washington", "America/Los_Angeles"],
  "425": ["Everett", "Washington", "America/Los_Angeles"],
  "509": ["Spokane", "Washington", "America/Los_Angeles"],
  "564": ["Bellingham", "Washington", "America/Los_Angeles"],

  /* ---------- West Virginia ---------- */
  "304": ["Charleston", "West Virginia", "America/New_York"],
  "681": ["Charleston", "West Virginia", "America/New_York"],

  /* ---------- Wisconsin ---------- */
  "262": ["Waukesha", "Wisconsin", "America/Chicago"],
  "274": ["Milwaukee", "Wisconsin", "America/Chicago"],
  "414": ["Milwaukee", "Wisconsin", "America/Chicago"],
  "534": ["Eau Claire", "Wisconsin", "America/Chicago"],
  "608": ["Madison", "Wisconsin", "America/Chicago"],
  "715": ["Eau Claire", "Wisconsin", "America/Chicago"],
  "920": ["Green Bay", "Wisconsin", "America/Chicago"],

  /* ---------- Wyoming ---------- */
  "307": ["Cheyenne", "Wyoming", "America/Denver"],
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

  const localString = new Date().toLocaleString("en-US", { timeZone: hostZone });
  const areaCode  = from.slice(2, 5);
  const [city, state, hostZone] = areaCodeMap[areaCode] ?? 'Unknown';
  const now = new Date();
  const day = now.getDay();  

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
  const isOpen = (hour >= 9 && hour <= 20) && isWeekday;
  console.log('🔍 debug inbound-call vars →', { from, to, id, city, state, hour, hostZone, isOpen, isEarly, isLate, isWeekday });
  const customer_number = "4";
  return res.json({
    dynamic_variables: {      id,
                              areaCode,
                              local_hour,
                              customer_number: String(customer_number),
                              to,
                              city,
                              state,
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
  const [city, state, hostZone] = areaCodeMap[areaCode] ?? 'Unknown';

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
  const day = now.getDay();
  const isWeekday = day >= 1 && day <= 5;
  const isOpen = (hour >= 9 && hour <= 20) && isWeekday;

  // 👀 see what you got
  console.table({ from, to, id, city, state, hour, isOpen, isEarly, isLate, isWeekday });

  const dynamic_variables = { id,
                              from,
                              to,
                              city,
                              state,
                              isOpen: isOpen ? 'yes' : 'no',
                              isEarly: isEarly ? 'yes' : 'no',
                              isLate: isLate ? 'yes' : 'no',
                              isWeekday: isWeekday ? 'yes' : 'no' };

  // In dev, send the debug data back too
  if (process.env.NODE_ENV !== 'production') {
    return res.json({ dynamic_variables, debug: { from, areaCode, city, state, hour, isOpen, isEarly, isLate, isWeekday } });
  }
  return res.json({ dynamic_variables });
});});

app.post('/do_not_personalize', (req, res) => { return "yes";})




app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});