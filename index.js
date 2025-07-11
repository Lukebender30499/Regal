const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const areaCodeMap = {
  // New York
  "212": { city: "New York" }, "315": { city: "New York" }, "332": { city: "New York" },
  "347": { city: "New York" }, "516": { city: "New York" }, "518": { city: "New York" },
  "585": { city: "New York" }, "607": { city: "New York" }, "631": { city: "New York" },
  "646": { city: "New York" }, "680": { city: "New York" }, "716": { city: "New York" },
  "718": { city: "New York" }, "838": { city: "New York" }, "845": { city: "New York" },
  "914": { city: "New York" }, "917": { city: "New York" }, "929": { city: "New York" },

  // California
  "209": { city: "California" }, "213": { city: "California" }, "279": { city: "California" },
  "310": { city: "California" }, "323": { city: "California" }, "341": { city: "California" },
  "408": { city: "California" }, "415": { city: "California" }, "424": { city: "California" },
  "442": { city: "California" }, "510": { city: "California" }, "530": { city: "California" },
  "559": { city: "California" }, "562": { city: "California" }, "619": { city: "California" },
  "626": { city: "California" }, "650": { city: "California" }, "657": { city: "California" },
  "661": { city: "California" }, "669": { city: "California" }, "707": { city: "California" },
  "714": { city: "California" }, "747": { city: "California" }, "752": { city: "California" },
  "760": { city: "California" }, "805": { city: "California" }, "818": { city: "California" },
  "820": { city: "California" }, "831": { city: "California" }, "858": { city: "California" },
  "909": { city: "California" }, "916": { city: "California" }, "925": { city: "California" },
  "949": { city: "California" }, "951": { city: "California" },

  // Connecticut
  "203": { city: "Connecticut" }, "475": { city: "Connecticut" },
  "860": { city: "Connecticut" }, "959": { city: "Connecticut" }
};

app.post('/area-code', (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing phoneNumber' });
  }

  const digits = phoneNumber.replace(/\D/g, '');
  if (digits.length < 10) {
    return res.status(400).json({ error: 'Phone number too short' });
  }

  const areaCode = digits.slice(-10, -7);
  const location = areaCodeMap[areaCode];

  if (!location) {
    return res.json({ city: null });
  }

  res.json({ city: location.city });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
