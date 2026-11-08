// Módulo `catalog` del lado servidor: lee products.json y aplica las reglas de consulta.
// No depende de Express, así que se puede probar con Node solo.
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const SORTS = ['price_asc', 'price_desc'];

// Se lee en cada petición: editar products.json no exige reiniciar el servidor.
function readProducts() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function fail(status, error, message, details) {
  const body = { error, message };
  if (details) body.details = details;
  return { status, body };
}

// Un parámetro repetido (?a=1&a=2) llega como arreglo y se rechaza.
function single(value) {
  return Array.isArray(value) ? undefined : value;
}

function toInt(value, field, fallback, min, max, details) {
  if (value === undefined || value === '') return fallback;
  const n = Number(single(value));
  if (!Number.isInteger(n) || n < min || n > max) {
    details.push({ field, message: `must be an integer between ${min} and ${max}` });
    return fallback;
  }
  return n;
}

// GET /api/v1/products — withImage(product) devuelve el producto con la URL de imagen completa.
function listProducts(query, withImage = (p) => p) {
  const details = [];
  const page = toInt(query.page, 'page', 1, 1, Number.MAX_SAFE_INTEGER, details);
  const limit = toInt(query.limit, 'limit', DEFAULT_LIMIT, 1, MAX_LIMIT, details);
  const sort = single(query.sort);
  if (sort !== undefined && sort !== '' && !SORTS.includes(sort)) {
    details.push({ field: 'sort', message: `must be one of: ${SORTS.join(', ')}` });
  }
  if (details.length > 0) {
    return fail(400, 'VALIDATION_ERROR', 'Invalid query parameters', details);
  }

  let products = readProducts();
  const category = single(query.category);
  const tipo = single(query.tipo);
  const search = single(query.search);
  if (category) products = products.filter((p) => p.category === String(category).toLowerCase());
  if (tipo) products = products.filter((p) => p.tipo.toLowerCase() === String(tipo).toLowerCase());
  if (search) products = products.filter((p) => p.title.toLowerCase().includes(String(search).toLowerCase()));
  if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);

  const total = products.length;
  const start = (page - 1) * limit;
  return {
    status: 200,
    body: {
      data: products.slice(start, start + limit).map(withImage),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  };
}

// GET /api/v1/products/:id
function getProduct(idParam, withImage = (p) => p) {
  if (!/^[1-9]\d*$/.test(String(idParam))) {
    return fail(400, 'VALIDATION_ERROR', 'Invalid path parameter', [
      { field: 'id', message: 'must be a positive integer' },
    ]);
  }
  const id = Number(idParam);
  const product = readProducts().find((p) => p.id === id);
  if (!product) return fail(404, 'NOT_FOUND', `Product ${id} does not exist`);
  return { status: 200, body: withImage(product) };
}

// GET /api/v1/categories
function listCategories() {
  const counts = {};
  readProducts().forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  const data = Object.entries(counts).map(([name, count]) => ({ name, count }));
  return { status: 200, body: { data, meta: { total: data.length } } };
}

module.exports = { listProducts, getProduct, listCategories, fail, DEFAULT_LIMIT, MAX_LIMIT };
