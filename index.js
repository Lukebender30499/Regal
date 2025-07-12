const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());   

// area code → city map
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
  "203": "Bridgeport", "475": "New Haven", "860": "Hartford", "959": "New London", "000": "Unknown",
};

app.post("/inbound-call", express.json(), (req, res) => {
  const from      = req.body.call_inbound?.from_number || "";
  const areaCode  = from.slice(2, 5) || "000";
  const city      = areaCodeMap[areaCode] || "Unknown";

  const est       = new Date(new Date()
                     .toLocaleString("en-US",
                       { timeZone: "America/New_York" }));
  const time      = +(
                     est.getHours() + est.getMinutes() / 60
                   ).toFixed(2);   // → 18.78

  // ── correct response shape ──
  res.json({
    dynamic_variables: {
      city,
      areaCode,
      time: time.toString()   // all values MUST be strings
    }
    // override_agent_id or metadata here if you need them
  });
});

/*app.post("/telnyx", express.json(), (req, res) => {
  const ev = req.body;

  if (ev?.data?.event_type !== "call.answered") return res.sendStatus(200);

 const retellId = ev.data.payload.headers["X-Retell-Call-Id"]; // "call_abc123"
 const phone    = ev.data.payload.from;                        // "+12035550123"
 if (typeof retellId === "string" && typeof phone === "string") {
    callerCache.set(retellId, phone);
    res.sendStatus(200);
  } else {
    res.status(400).json({ error: "Missing call ID or phone number" });
  }

  res.sendStatus(200);
});*/



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

