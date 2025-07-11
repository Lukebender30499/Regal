const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
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
  const areaCode = String(req.body?.areaCode);
/*   let areaCode = req.body?.areaCode;

  // Normalize
 if (!areaCode) {
  areaCode = "";
} else if (typeof areaCode !== "string") {
  areaCode = String(areaCode);
}
//areaCode = areaCode.replace(/[^\d]/g, "");

if (!areaCode || !/^\d{3}$/.test(areaCode) || !areaCodeMap[areaCode]) {
  console.log("Invalid or unrecognized areaCode. Using fallback '000'");
  areaCode = "000";
}
console.log("Normalized areaCode:", areaCode);


  // Validate
  if (!areaCode || !/^\d{3}$/.test(areaCode)) {
    console.log("Invalid areaCode. Using fallback '000'");
    areaCode = "000";
  } */

  const city = areaCodeMap[areaCode] || "Unknown";

  // Time logic
  const now = new Date();
  const estTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hours = estTime.getHours();
  const minutes = estTime.getMinutes();
  const time = parseFloat((hours + minutes / 60).toFixed(2));

  // Add areaCode to the return for debugging
  return res.json({ city, time, areaCode });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

