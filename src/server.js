const express = require('express');
const { spawn } = require('child_process');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();

app.use(express.json());

app.post('/scrape', (req, res) => {
  const url = req.body.url;
  const pythonProcess = spawn('python', ['scrapingprofile.py', url]);

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      res.status(500).send('Error occurred while scraping profile.');
    } else {
      const data = [];
      fs.createReadStream('output.csv')
        .pipe(csv())
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', () => {
          res.json(data);
        });
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
