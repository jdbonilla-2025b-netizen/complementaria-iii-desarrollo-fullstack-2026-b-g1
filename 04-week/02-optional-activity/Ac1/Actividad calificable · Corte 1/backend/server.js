const express = require('express');
const path = require('path');
const catalog = require('./catalog');

const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

const app = express();

/* ---------- CORS (el portal en Live Server, puerto 5500, llama a esta API) ---------- */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/* ---------- Utilidades ---------- */

// "/images/camisa.png" -> "http://localhost:3000/images/camisa.png"
function absoluteImage(req) {
  return (product) =>
    /^https?:\/\//.test(product.image)
      ? product
      : { ...product, image: `${req.protocol}://${req.get('host')}${product.image}` };
}

function send(res, result) {
  res.status(result.status).json(result.body);
}

function notFound(req, res) {
  send(res, catalog.fail(404, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} does not exist`));
}

/* ---------- Salud e imágenes ---------- */

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// /images/camisa.png -> frontend/img/camisa.png
app.use('/images', express.static(path.join(FRONTEND_DIR, 'img')));

/* ---------- API v1 (solo lectura) ---------- */

app.get('/api/v1/products', (req, res) => {
  send(res, catalog.listProducts(req.query, absoluteImage(req)));
});

app.get('/api/v1/products/:id', (req, res) => {
  send(res, catalog.getProduct(req.params.id, absoluteImage(req)));
});

app.get('/api/v1/categories', (req, res) => {
  send(res, catalog.listCategories());
});

app.use('/api', notFound);

/* ---------- Opcional: servir también el portal en http://localhost:3000 ---------- */
app.use(express.static(FRONTEND_DIR));

/* ---------- 404 y errores ---------- */
app.use(notFound);

app.use((err, req, res, next) => {
  console.error(new Date().toISOString(), err);
  send(res, catalog.fail(500, 'INTERNAL_ERROR', 'Unexpected server error'));
});

app.listen(PORT, () => {
  console.log(`UrbanStyle API lista en http://localhost:${PORT}`);
});
