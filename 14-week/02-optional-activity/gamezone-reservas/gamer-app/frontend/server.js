// Sirve el frontend en su propio puerto (origen distinto a la API => CORS real).
const path = require('node:path');
const express = require('express');

function createFrontend({ apiUrl }) {
  const app = express();
  app.get('/config.js', (req, res) => {
    res.type('js').send(`window.API_URL = ${JSON.stringify(apiUrl)};`);
  });
  app.use(express.static(__dirname, { index: 'index.html', extensions: ['html'] }));
  return app;
}

module.exports = { createFrontend };
