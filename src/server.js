const express = require('express');
const cors = require('cors');
const scrapeProfile = require('./scraper');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/scrape', async (req, res) => {
  try {
    const url = req.query.url;
    const data = await scrapeProfile(url);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
