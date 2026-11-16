const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const authRoutes = require('./routes/auth.routes');
const fincasRoutes = require('./routes/fincas.routes');
const toursRoutes = require('./routes/tours.routes');
const reservasRoutes = require('./routes/reservas.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(helmet());

// CORS: el navegador solo deja que el frontend lea las respuestas si el
// backend declara explícitamente su origen. Lista blanca desde CORS_ORIGINS
// (nunca "*" en producción) y permitimos la cabecera Authorization.
app.use(
  cors({
    origin(origin, callback) {
      // Peticiones sin Origin (curl, Postman, health checks) se permiten.
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(null, false); // sin cabeceras CORS -> el navegador bloquea
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600, // cachea el preflight 10 minutos
  })
);

app.use(express.json({ limit: '100kb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/fincas', fincasRoutes);
app.use('/api/tours', toursRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejador central de errores: errores esperados (HttpError) devuelven su
// código; los inesperados, 500 sin filtrar detalles internos al cliente.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
