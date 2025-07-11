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

app.post("/", (req, res) => {
  const areaCode = req.body.areaCode || req.body.parameters?.areaCode;

  if (!areaCode || !/^\d{3}$/.test(areaCode)) {
    return res.status(400).json({ error: "Invalid area code" });
  }

  const city = areaCodeMap[areaCode] || "Unknown";

  // Get current time in EST and convert to military time (e.g., 14.30)
  const now = new Date();
  const estTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hours = estTime.getHours();
  const minutes = estTime.getMinutes();
  const time = parseFloat(`${hours}.${minutes < 10 ? "0" : ""}${minutes}`);

  return res.json({ city, time });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

