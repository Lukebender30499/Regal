const express = require('express');
const app = express();
app.use(express.json());

const areaMap = {
  "212": "New York",
  "213": "Los Angeles",
  "305": "Miami",
  "312": "Chicago",
  "415": "San Francisco",
  "617": "Boston"
};

app.post('/', (req, res) => {
  const phone = req.body?.phoneNumber || "";
  const areaCode = phone.slice(2, 5);
  const city = areaMap[areaCode] || "your area";
  res.json({ city });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
