const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
  res.send('Hello from Express server!');
});

// Area code extraction endpoint
app.post('/area-code', (req, res) => {
  const phoneNumber = req.body.phoneNumber;

  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing phoneNumber' });
  }

  const digits = phoneNumber.replace(/\D/g, ''); // remove non-digits

  if (digits.length < 10) {
    return res.status(400).json({ error: 'Phone number too short' });
  }

  const areaCode = digits.slice(-10, -7); // Get the area code from the last 10 digits

  res.json({ areaCode });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
