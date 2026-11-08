const crypto = require('node:crypto');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Datos de ejemplo: consolas del local y sus turnos
const CONSOLES = [
  { id: 1, name: 'PlayStation 5 - Estación 1', slots: [
    { time: '14:00', available: true }, { time: '15:00', available: false }, { time: '16:00', available: true } ] },
  { id: 2, name: 'Xbox Series X - Estación 2', slots: [
    { time: '14:00', available: false }, { time: '15:00', available: true }, { time: '16:00', available: true } ] },
  { id: 3, name: 'Nintendo Switch - Estación 3', slots: [
    { time: '14:00', available: true }, { time: '15:00', available: true }, { time: '16:00', available: false } ] },
];

// Usuario de demostración: la clave se guarda como hash, no en texto plano
const hash = (pw) => crypto.scryptSync(pw, 'gamezone-salt', 32);
const USERS = { gamer: hash('1234') };

function createApp({ secret, allowedOrigin = 'http://localhost:5173' }) {
  const app = express();

  // CORS: solo se permite el origen del frontend (responde también el preflight OPTIONS)
  app.use(cors({ origin: allowedOrigin, allowedHeaders: ['Content-Type', 'Authorization'] }));
  app.use(express.json());

  // Middleware que protege rutas: exige "Authorization: Bearer <token>"
  function auth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    try {
      req.user = jwt.verify(token, secret);
      next();
    } catch (e) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.post('/api/login', (req, res) => {
    const { username, password } = req.body || {};
    const stored = USERS[username];
    const ok = stored && typeof password === 'string' &&
      crypto.timingSafeEqual(stored, hash(password));
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: username }, secret, { expiresIn: '1h' });
    res.json({ token });
  });

  // Endpoint protegido
  app.get('/api/consoles', auth, (req, res) => {
    res.json({ user: req.user.sub, consoles: CONSOLES });
  });

  // JSON inválido u otros errores
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: 'Bad request' });
  });

  return app;
}

module.exports = { createApp };
