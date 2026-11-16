const jwt = require('jsonwebtoken');
const config = require('../config');

// Emite un token firmado con HS256. El payload solo lleva lo necesario
// para autorizar (id, rol y nombre para mostrar): nunca contraseñas,
// porque el payload de un JWT se puede leer (está en Base64, no cifrado).
function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role, name: user.name },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn, issuer: config.jwt.issuer, algorithm: 'HS256' }
  );
}

// Verifica firma, expiración y emisor. Lanza un error si algo falla.
function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret, {
    issuer: config.jwt.issuer,
    algorithms: ['HS256'], // evita el ataque de cambiar el algoritmo a "none"
  });
}

module.exports = { signAccessToken, verifyAccessToken };
