
const https = require('https');

const API_KEY = 'AIzaSyDu8EEyRZOlDQKRhGhzfLqyTId3ILW54OQ';
const SPREADSHEET_ID = '1dU-14dp8sqKb2hZfIgHvCMQo0vXrMgLrYd3WgaWNygI';

const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Products!A2:H?key=${API_KEY}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.error) {
        console.error('Error:', result.error);
        return;
      }
      if (!result.values) {
        console.log('No data found.');
        return;
      }
      console.log('First 5 rows:');
      result.values.slice(0, 5).forEach((row, i) => {
        console.log(`Row ${i + 2}:`);
        console.log(`  Name: ${row[1]}`);
        console.log(`  Category: ${row[3]}`);
        console.log(`  Image: "${row[6]}"`);
      });
    } catch (e) {
      console.error('Parse error:', e);
    }
  });
}).on('error', (e) => {
  console.error('Request error:', e);
});
