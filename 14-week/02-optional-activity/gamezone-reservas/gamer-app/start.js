const { createApp } = require('./backend/app');
const { createFrontend } = require('./frontend/server');

const API_PORT = process.env.API_PORT || 3000;
const WEB_PORT = process.env.WEB_PORT || 5173;
const SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
const API_URL = process.env.API_URL || `http://localhost:${API_PORT}`;
const WEB_ORIGIN = process.env.WEB_ORIGIN || `http://localhost:${WEB_PORT}`;

if (!process.env.JWT_SECRET) console.warn('Aviso: usando JWT_SECRET de desarrollo. Define JWT_SECRET en producción.');

createApp({ secret: SECRET, allowedOrigin: WEB_ORIGIN })
  .listen(API_PORT, '0.0.0.0', () => console.log(`API      -> http://localhost:${API_PORT}`));
createFrontend({ apiUrl: API_URL })
  .listen(WEB_PORT, '0.0.0.0', () => console.log(`Frontend -> http://localhost:${WEB_PORT}`));
