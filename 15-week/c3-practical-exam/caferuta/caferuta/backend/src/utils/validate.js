const { HttpError } = require('./errors');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function text(value, field, { min = 1, max = 255 } = {}) {
  const v = typeof value === 'string' ? value.trim() : '';
  if (v.length < min || v.length > max) {
    throw new HttpError(400, `${field} debe tener entre ${min} y ${max} caracteres`);
  }
  return v;
}

function int(value, field, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) {
    throw new HttpError(400, `${field} debe ser un número entero entre ${min} y ${max}`);
  }
  return n;
}

function email(value) {
  const v = text(value, 'El correo', { max: 255 }).toLowerCase();
  if (!EMAIL_RE.test(v)) throw new HttpError(400, 'El correo no es válido');
  return v;
}

function password(value) {
  const v = typeof value === 'string' ? value : '';
  if (v.length < 8 || !/\d/.test(v) || !/[A-Za-z]/.test(v)) {
    throw new HttpError(400, 'La contraseña debe tener al menos 8 caracteres, con letras y números');
  }
  return v;
}

function oneOf(value, field, options) {
  if (!options.includes(value)) {
    throw new HttpError(400, `${field} debe ser uno de: ${options.join(', ')}`);
  }
  return value;
}

// Fecha "YYYY-MM-DD" que no esté en el pasado.
function futureDate(value, field) {
  if (typeof value !== 'string' || !DATE_RE.test(value) || Number.isNaN(Date.parse(value))) {
    throw new HttpError(400, `${field} debe tener el formato AAAA-MM-DD`);
  }
  const today = new Date().toISOString().slice(0, 10);
  if (value < today) throw new HttpError(400, `${field} no puede estar en el pasado`);
  return value;
}

function optionalText(value, field, opts) {
  if (value === undefined || value === null || value === '') return null;
  return text(value, field, opts);
}

module.exports = { text, int, email, password, oneOf, futureDate, optionalText };
